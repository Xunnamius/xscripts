/* eslint-disable unicorn/no-array-reduce */
import {
  dirname,
  relative as toRelativePath,
  resolve as toAbsolutePath,
  join as joinPath
} from 'node:path';

import { chmod, rename, stat, symlink } from 'node:fs/promises';

import {
  transformFileAsync as babelTransformAsync,
  loadOptions as loadBabelOptions
} from '@babel/core';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import { rimraf as forceDeletePaths } from 'rimraf';
import uniqueFilename from 'unique-filename';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import {
  type AbsolutePath,
  type RelativePath,
  Tsconfig
} from 'multiverse#project-utils fs/index.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { hardAssert, softAssert } from 'multiverse#cli-utils error.ts';
import { ProjectAttribute, WorkspaceAttribute } from 'multiverse#project-utils';
import { type BfeBuilderObject, type AsStrictExecutionContext } from 'multiverse#bfe';
import { SHORT_TAB } from 'multiverse#rejoinder';
import { run } from 'multiverse#run';
import {
  assetPrefix,
  gatherPackageBuildTargets
} from 'multiverse#project-utils analyze/exports/gather-package-build-targets.ts';

import {
  LimitedGlobalScope as DistributablesBuilderScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import {
  withGlobalBuilder,
  withGlobalUsage,
  checkIsNotNil,
  runGlobalPreChecks,
  readFile,
  writeFile,
  copyFile,
  makeDirectory
} from 'universe util.ts';

import { ErrorMessage } from 'universe error.ts';
// ? Used in usage string generation
import { TesterScope } from 'universe commands/test.ts';
import {
  extensionsTypescript,
  hasTypescriptExtension
} from 'universe assets/config/_babel.config.js.ts';
import { setTimeout as delay } from 'node:timers/promises';

const standardNodeShebang = '#!/usr/bin/env node\n';
const nodeModulesRelativeBinDir = `node_modules/.bin`;
const transpiledDirBase = '.transpiled';
const distDirBase = 'dist';

const collator = new Intl.Collator(undefined, { numeric: true });

/**
 * Possible intermediate transpilation targets (non-production
 * non-distributables). See this command's options configuration for details.
 */
export enum IntermediateTranspilationEnvironment {
  Development = 'development',
  Test = 'test'
}

/**
 * Which module system to use for transpiled output.
 */
export enum ModuleSystem {
  Esm = 'esm',
  Cjs = 'cjs'
}

/**
 * @see {@link IntermediateTranspilationEnvironment}
 */
export const intermediateTranspilationEnvironment = Object.values(
  IntermediateTranspilationEnvironment
);

const moduleSystems = Object.values(ModuleSystem);
const distributablesBuilderScopes = Object.values(DistributablesBuilderScope);

export type CustomCliArguments = Omit<GlobalCliArguments, 'scope'> & {
  scope: DistributablesBuilderScope;
  cleanOutputDir: boolean;
  // ? The remaining args might be undefined if we're building a NextJs package
  generateTypes?: boolean;
  linkCliIntoBin?: boolean;
  prependShebang?: boolean;
  moduleSystem?: ModuleSystem;
  generateIntermediatesFor?: IntermediateTranspilationEnvironment;
  outputExtension?: string;
  includeExternalFiles?: (AbsolutePath | RelativePath)[];
  excludeInternalFiles?: (AbsolutePath | RelativePath)[];
};

export default async function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const { attributes: projectAttributes = {} } = projectMetadata_?.project || {};
  const isCwdTheProjectRoot = projectMetadata_ && projectMetadata_.package === undefined;
  const isCwdANextJsPackage =
    isCwdTheProjectRoot && !!projectAttributes[ProjectAttribute.Next];

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    function (_blackFlag, _helpOrVersionSet, argv) {
      const baseParameters: BfeBuilderObject<CustomCliArguments, GlobalExecutionContext> =
        {
          scope: {
            string: true,
            choices: distributablesBuilderScopes,
            description: 'Which files to consider as potential sources/assets',
            default: DistributablesBuilderScope.ThisPackage
          },
          'clean-output-dir': {
            boolean: true,
            description: 'Force-delete the output directory before transpilation',
            default: projectMetadata_
              ? !projectAttributes[ProjectAttribute.Next]
              : '(project-dependent)'
          }
        };

      const additionalParameters: BfeBuilderObject<
        CustomCliArguments,
        GlobalExecutionContext
      > = {
        'generate-types': {
          boolean: true,
          description: 'Output TypeScript declaration files alongside distributables',
          default: true
        },
        'link-cli-into-bin': {
          boolean: true,
          description: 'Soft-link "bin" entries in package.json into node_modules/.bin',
          default: true
        },
        'prepend-shebang': {
          boolean: true,
          description: 'Prepend a shebang to each "bin" distributable in package.json',
          default: true
        },
        'module-system': {
          string: true,
          choices: moduleSystems,
          description: 'Which module system to transpile into',
          default: ModuleSystem.Cjs
        },
        'output-extension': {
          string: true,
          description: 'Override automatic extension selection for transpiled output',
          check: checkIsNotNil,
          defaultDescription: 'derived from other arguments',
          coerce(argument: string) {
            argument = String(argument);
            return argument.startsWith('.') ? argument : `.${argument}`;
          }
        },
        'include-external-files': {
          alias: 'include-external-file',
          string: true,
          array: true,
          default: [],
          description: 'Add one or more files to external build targets'
        },
        'exclude-internal-files': {
          alias: 'exclude-internal-file',
          string: true,
          array: true,
          default: [],
          description: 'Remove one or more files from internal build targets'
        },
        // TODO: consider an option that can reclassify a source as an asset
        // 'reclassify-as-asset': { ... }
        'generate-intermediates-for': {
          string: true,
          choices: intermediateTranspilationEnvironment,
          description: 'Transpile into non-production-ready non-distributables',
          conflicts: ['generate-types', 'link-cli-into-bin', 'prepend-shebang'],
          implies: {
            'generate-types': false,
            'link-cli-into-bin': false,
            'prepend-shebang': false
          }
        }
      };

      // TODO: consider support for NextJs projects as sub-roots
      if (isCwdANextJsPackage) {
        Object.entries(additionalParameters).forEach(([name, parameter]) => {
          parameter.defaultDescription = '❌ disabled in Next.js packages';
          parameter.check = () => {
            const isDefaulted = !(name in argv);
            const errorMessage = `--${name} cannot be used when building a Next.js package`;

            return isDefaulted || errorMessage;
          };
        });
      }

      return Object.assign(baseParameters, additionalParameters);
    }
  );

  return {
    aliases: ['dist'],
    builder,
    description: 'Transpile sources and assets into production-ready distributables',
    usage: withGlobalUsage(
      `$1. Also performs lightweight validation of import specifiers to ensure well-formedness.

${isCwdANextJsPackage ? "Note that the current working directory points to a Next.js package! When attempting to build such a package, this command will defer entirely to `next build`, which disables several of this command's options.\n\n" : ''}"Source," "sources," or "source files" describe all the build targets that will be transpiled while "assets" or "asset files" describe the remaining targets that are copied-through to the output directory without modification.

Currently, only TypeScript files (specifically, files ending in one of: ${extensionsTypescript.join(', ')}) are considered source files. Every other file is considered an asset.

All source and asset files are further classified as either "internal" or "external". Internal files or "internals" are all of the files within a package's source directory, i.e. \`\${packageRoot}/src\`. One or more of these files can be excluded from transpilation with \`--exclude-internal-files\`. External files or "externals," on the other hand, are all of the files included in transpilation that are outside of the package's source directory, such as files from other packages in the project. One or more files can be added to the list of externals with \`--include-external-files\`.

\`--include-external-files\` accepts one or more pattern strings that are interpreted according to normal glob rules, while \`--exclude-internal-files\` accepts one or more pattern strings that are interpreted according to gitignore glob rules. Both are relative to the project (NOT package!) root. This means seemingly absolute pattern strings like "/home/me/project/src/something.ts" are actually relative to the project (NOT filesystem!) root, and seemingly relative pattern strings like "*.mjs" may exclude files at any depth below the project root. See \`man gitignore\` for more details.

After targets are built, CLI projects will have their entry points chmod-ed to be executable, shebangs added if they do not already exist, and "bin" entries soft-linked into the node_modules/.bin directory.

The only available scope is "${DistributablesBuilderScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be built. Use Npm's workspace features, or Turbo's, if your goal is to build distributables from multiple packages.

When you need to access the intermediate babel transpilation result for non-production non-Next.js build outputs, which can be extremely useful when debugging strange problems in development and testing environments, see the --generate-intermediates-for option and the corresponding \`xscripts test --scope=${TesterScope.ThisPackageIntermediates}\` command.

Note that, when attempting to build a Next.js package, this command will defer entirely to \`next build\`. This means most of the options made available by this command are not available when building a Next.js package.`
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      cleanOutputDir,
      hush: isHushed,
      quiet: isQuieted,
      generateIntermediatesFor,
      outputExtension,
      // ? We need to make sure these aren't undefined...
      includeExternalFiles: includeExternalFiles_,
      excludeInternalFiles: excludeInternalFiles_,
      generateTypes: generateTypes_,
      linkCliIntoBin: linkCliIntoBin_,
      prependShebang: prependShebang_,
      moduleSystem: moduleSystem_
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });

      debug('scope (unused): %O', scope);
      debug('cleanOutputDir: %O', cleanOutputDir);
      debug('isCwdANextJsPackage: %O', isCwdANextJsPackage);

      // TODO: replace relevant tasks with listr2

      if (isCwdANextJsPackage) {
        if (cleanOutputDir) {
          debug('forcefully deleting build output directory: ./build');
          await forceDeletePaths('./build');
        }

        debug('running next build');
        await run('npx', ['next', 'build'], {
          env: { NODE_ENV: 'production' },
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        });
      } else {
        debug('includeExternalFiles: %O', includeExternalFiles_);
        debug('excludeInternalFiles: %O', excludeInternalFiles_);
        debug('generateTypes: %O', generateTypes_);
        debug('linkCliIntoBin: %O', linkCliIntoBin_);
        debug('prependShebang: %O', prependShebang_);
        debug('moduleSystem: %O', moduleSystem_);
        debug('outputExtension (original): %O', outputExtension);

        if (generateIntermediatesFor) {
          genericLogger.warn(
            [LogTag.IF_NOT_QUIETED],
            'Building intermediate non-production non-distributables...'
          );
        } else {
          genericLogger([LogTag.IF_NOT_QUIETED], 'Building production distributables...');
        }

        const includeExternalFiles = includeExternalFiles_;
        const excludeInternalFiles = excludeInternalFiles_;
        const generateTypes = generateTypes_;
        const linkCliIntoBin = linkCliIntoBin_;
        const prependShebang = prependShebang_;
        const moduleSystem = moduleSystem_;

        hardAssert(includeExternalFiles, ErrorMessage.GuruMeditation());
        hardAssert(excludeInternalFiles, ErrorMessage.GuruMeditation());
        hardAssert(generateTypes, ErrorMessage.GuruMeditation());
        hardAssert(linkCliIntoBin, ErrorMessage.GuruMeditation());
        hardAssert(prependShebang, ErrorMessage.GuruMeditation());
        hardAssert(moduleSystem, ErrorMessage.GuruMeditation());

        outputExtension ??=
          moduleSystem === ModuleSystem.Cjs ||
          generateIntermediatesFor === IntermediateTranspilationEnvironment.Test
            ? '.js'
            : '.mjs';

        debug('outputExtension (final): %O', outputExtension);

        const outputDirName = generateIntermediatesFor ? transpiledDirBase : distDirBase;
        const absoluteOutputDirPath = toAbsolutePath(outputDirName);

        debug('outputDirName: %O', outputDirName);
        debug('absoluteOutputDirPath: %O', absoluteOutputDirPath);

        if (cleanOutputDir) {
          debug(`forcefully deleting build output directory: ${absoluteOutputDirPath}`);
          await forceDeletePaths(absoluteOutputDirPath);
        }

        const { project: rootPackage, package: workspacePackage } = projectMetadata;
        const projectRoot = rootPackage.root;
        const targetPackage = workspacePackage ?? rootPackage;
        const targetPackageRoot = targetPackage.root;
        const targetPackageAttributes = targetPackage.attributes;
        // ? Must be undefined if target package is the root package
        const targetPackageName = workspacePackage?.json.name;

        debug('project root: %O', projectRoot);
        debug('target package: %O', targetPackage);
        debug('target package root: %O', targetPackageRoot);
        debug('target package name: %O', targetPackageName);

        const { targets: buildTargets, metadata: buildMetadata } =
          await gatherPackageBuildTargets({
            projectMetadata,
            targetPackageName,
            excludeInternalsPatterns: excludeInternalFiles,
            includeExternalsPatterns: includeExternalFiles
          });

        debug('initial build targets: %O', buildTargets);
        debug('build metadata: %O', buildMetadata);

        const allBuildTargets = Array.from(buildTargets.internal).concat(
          Array.from(buildTargets.external)
        );

        const allBuildAssetTargets: RelativePath[] = [];
        const allBuildSourceTargets: RelativePath[] = [];

        for (const target of allBuildTargets) {
          (hasTypescriptExtension(target)
            ? allBuildSourceTargets
            : allBuildAssetTargets
          ).push(target);
        }

        debug('all build asset targets: %O', allBuildAssetTargets);
        debug('all build source targets: %O', allBuildSourceTargets);

        const aliasCountsEntries = toNaturalSorted(
          Object.entries(buildMetadata.imports.aliasCounts)
        );

        const dependencyCountsEntries = toNaturalSorted(
          Object.entries(buildMetadata.imports.dependencyCounts)
        );

        genericLogger.newline([LogTag.IF_NOT_HUSHED]);
        genericLogger.message(
          [LogTag.IF_NOT_HUSHED],
          `Build manifest
==============

Metadata
--------
name      : ${targetPackage.json.name || '(unnamed)'}
package-id: ${workspacePackage?.id || 'N/A (root package has no id)'}
type      : ${projectMetadata.type} ${
            projectAttributes[ProjectAttribute.Hybridrepo] ? '(hybridrepo) ' : ''
          }${isCwdTheProjectRoot ? 'root package' : 'workspace package (sub-root)'}
attributes: ${Object.keys(targetPackage.attributes).join(', ')}

build targets: ${allBuildTargets.length} file${allBuildTargets.length !== 1 ? 's' : ''}
${SHORT_TAB}   internal: ${buildTargets.internal.size} file${
            buildTargets.internal.size !== 1 ? 's' : ''
          }
${SHORT_TAB}   external: ${buildTargets.external.size} file${
            buildTargets.external.size !== 1 ? 's' : ''
          }

aliases imported: ${aliasCountsEntries.length}
${aliasCountsEntries
  .map(
    ([dep, count]) => `${SHORT_TAB}${dep} (from ${count} file${count !== 1 ? 's' : ''})`
  )
  .join('\n')}

packages imported: ${dependencyCountsEntries.length}
${dependencyCountsEntries
  .reduce<[string[], string[]]>(
    (strings, [alias, count]) => {
      const [fromSources, fromAssets] = strings;

      (alias.startsWith(assetPrefix) ? fromAssets : fromSources).push(
        `${SHORT_TAB}${alias} (from ${count} file${count !== 1 ? 's' : ''})`
      );

      return strings;
    },
    [[], []]
  )
  .map((strings) => strings.join('\n'))
  .filter((strings) => strings.length)
  .join('\n\n')}

Paths
-----
project root: ${projectRoot}
package root: ${targetPackageRoot}
distrib root: ${absoluteOutputDirPath}
`
        );

        // * Generate types and initial dir structure under ./dist
        if (generateTypes) {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
          genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Generating types');
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);

          debug('running tsc');
          await run(
            'npx',
            [
              'tsc',
              '--project',
              Tsconfig.PackageTypes,
              '--incremental',
              'false',
              '--noCheck'
            ],
            {
              cwd: targetPackageRoot,
              env: { NODE_ENV: 'production' },
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );

          debug('running tsconfig-replace-paths');
          await run(
            'npx',
            ['tsconfig-replace-paths', '--project', Tsconfig.PackageTypes],
            {
              cwd: targetPackageRoot,
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );
        } else {
          debug('skipped type generation');
        }

        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
        genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Building distributables');

        const babelNodeEnvironment: Record<string, string> = {
          NODE_ENV: generateIntermediatesFor ?? `production-${moduleSystem}`
        };

        if (generateIntermediatesFor) {
          babelNodeEnvironment.XSCRIPTS_TEST_JEST_TRANSPILED = 'true';
        }

        genericLogger.newline([LogTag.IF_NOT_HUSHED]);

        // * Mirror relevant bits of the project's structure at ./dist that
        // * might not have been mirrored by tsc above
        await Promise.all(
          allBuildTargets.map((target) => {
            const path = joinPath(absoluteOutputDirPath, dirname(target));
            debug('make directory deep structure: %O', path);

            return makeDirectory(path);
          })
        );

        // * Modify environment variables for the duration of this promise
        const originalEnv = Object.fromEntries(
          Object.entries(babelNodeEnvironment).map(([k, v]) => {
            const original = process.env[k];
            process.env[k] = v;
            return [k, original];
          })
        );

        debug('original env: %O', originalEnv);
        debug('new env: %O', babelNodeEnvironment);

        // * Grab and cache babel's config so that all transformations reuse the
        // * same plugins
        const babelOptions =
          loadBabelOptions({ filename: '[xscripts-internal].tsx' }) || undefined;
        debug('babel options: %O', babelOptions);

        // * Transpile internal/external build targets into their ./dist dirs
        await Promise.all([
          // * Copy through all assets as-is
          ...allBuildAssetTargets.map((target) => {
            const from = joinPath(projectRoot, target);
            const to = joinPath(absoluteOutputDirPath, target);

            debug('copy-through asset: %O => %O', from, to);
            return copyFile(from, to);
          }),

          // * Transpile internals: ./* => ./dist/*
          ...allBuildSourceTargets.map(async (target) => {
            const sourcePath = joinPath(projectRoot, target);
            const outputPath = joinPath(
              absoluteOutputDirPath,
              target.replace(/(?<=[^/])\.[^.]+$/, outputExtension!)
            );

            debug('transpile source: %O => %O', sourcePath, outputPath);

            const { code } = (await babelTransformAsync(sourcePath, babelOptions)) || {};

            if (code) {
              debug('write-out transpilation result: %O => %O', sourcePath, outputPath);
              await writeFile(outputPath, code);
            } else {
              debug.error('transpilation returned an empty result: %O', outputPath);
              throw new CliError(
                ErrorMessage.TranspilationReturnedNothing(sourcePath, outputPath)
              );
            }
          })
        ]);

        if (generateIntermediatesFor === IntermediateTranspilationEnvironment.Test) {
          const sourcePath = 'test';
          const outputPath = `${absoluteOutputDirPath}/test`;
          debug('transpile tests (using slower cli)', sourcePath, outputPath);

          // * Transpile tests: ./test => ./.transpiled/test
          await run(
            'npx',
            [
              'babel',
              sourcePath,
              '--extensions',
              '.ts,.tsx',
              '--out-dir',
              outputPath,
              '--out-file-extension',
              outputExtension,
              '--root-mode',
              'upward'
            ],
            {
              env: babelNodeEnvironment,
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );
        }

        // * Restore environment variables
        Object.entries(originalEnv).map(([k, v]) => {
          if (v === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete process.env[k];
          } else {
            process.env[k] = v;
          }
        });

        debug('original env restored');

        // TODO: This is waiting for my babel plugin to spit out some metadata.
        // TODO: There is probably a more clever way to do that without
        // TODO: suffering this delay. Once that way is found, delete this:
        await delay(100);

        if (
          (targetPackageAttributes[ProjectAttribute.Cli] ||
            targetPackageAttributes[WorkspaceAttribute.Cli]) &&
          linkCliIntoBin
        ) {
          const { bin, name } = targetPackage.json;

          if (bin && name) {
            genericLogger.newline([LogTag.IF_NOT_QUIETED]);
            genericLogger(
              [LogTag.IF_NOT_QUIETED],
              '⮞ Adding executables to node_modules/.bin'
            );
            genericLogger.newline([LogTag.IF_NOT_QUIETED]);

            debug('symlinking and chmod-ing main bin file into node_modules');

            const targetPackageBin = typeof bin === 'string' ? { [name]: bin } : bin;

            const binFiles = Object.values(targetPackageBin);
            const binFileInodes = await Promise.all(
              binFiles.map(async (path) => {
                softAssert(path, ErrorMessage.CliProjectHasBadBinConfig());
                return stat(path).then(({ ino }) => ino);
              })
            );

            await Promise.all([
              ...(prependShebang
                ? Array.from(new Set(binFileInodes)).map(async (inode) => {
                    // ? We go through all this to avoid race conditions where we
                    // ? might end up writing to the same file
                    const path = binFiles.at(binFileInodes.indexOf(inode));
                    softAssert(path, ErrorMessage.CliProjectHasBadBinConfig());
                    const contents = await readFile(path);

                    if (contents.startsWith('#!')) {
                      debug(
                        `skipped prepending shebang, path (${inode}) already has shebang: %O`,
                        path
                      );
                    } else {
                      debug(`prepending shebang to file at path (${inode}): %O`, path);

                      await writeFile(path, `${standardNodeShebang}${contents}`);

                      genericLogger(
                        [LogTag.IF_NOT_QUIETED],
                        `${SHORT_TAB}Prepended shebang to ${path}`
                      );
                    }
                  })
                : []),
              ...Object.entries(targetPackageBin).map(async ([binName, binPath]) => {
                softAssert(binName, ErrorMessage.CliProjectHasBadBinConfig());
                softAssert(binPath, ErrorMessage.CliProjectHasBadBinConfig());

                const nodeModulesBinDir = `${projectRoot}/${nodeModulesRelativeBinDir}`;
                const symlinkTargetPath = toRelativePath(
                  nodeModulesBinDir,
                  toAbsolutePath(projectRoot, binPath)
                );
                const symlinkTemporaryPath = uniqueFilename(nodeModulesBinDir);
                const symlinkRealPath = `${nodeModulesBinDir}/${binName}`;

                debug('symlink target path: %O', symlinkTargetPath);
                debug('symlink temporary path: %O', symlinkTemporaryPath);
                debug('symlink real path: %O', symlinkRealPath);

                await symlink(symlinkTargetPath, symlinkTemporaryPath);
                await rename(symlinkTemporaryPath, symlinkRealPath);

                genericLogger(
                  [LogTag.IF_NOT_QUIETED],
                  `${SHORT_TAB}${symlinkRealPath} ⮕ ${symlinkTargetPath}`
                );

                await chmod(symlinkRealPath, 0o775);

                genericLogger(
                  [LogTag.IF_NOT_QUIETED],
                  `${SHORT_TAB}chmod 0775 ${symlinkRealPath}`
                );
              })
            ]);
          } else {
            debug(
              'skipped symlinking and chmod-ing main bin file: package.json missing "bin" and/or "name"'
            );
          }
        } else {
          debug('skipped cli tasks: not a cli package');
        }
      }

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      if (!isCwdANextJsPackage && generateIntermediatesFor) {
        genericLogger.warn(
          [LogTag.IF_NOT_QUIETED],
          '(build output consists of intermediate files NOT SUITABLE FOR DISTRIBUTION OR PRODUCTION!)'
        );
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}

function toNaturalSorted<T>(array: [key: string, value: T][]) {
  return array.toSorted(([keyA], [keyB]) => {
    // ? Natural sort using latest ES6/7 features!
    return collator.compare(keyA, keyB);
  });
}
