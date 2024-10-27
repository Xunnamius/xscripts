/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/no-array-reduce */
import { chmod, rename, stat, symlink } from 'node:fs/promises';
import { builtinModules } from 'node:module';

import {
  dirname,
  extname,
  isAbsolute,
  join as joinPath,
  relative as toRelativePath,
  resolve as toAbsolutePath
} from 'node:path';

import { setTimeout as delay } from 'node:timers/promises';
import { isNativeError } from 'node:util/types';

import {
  loadOptions as loadBabelOptions,
  transformFileAsync as babelTransformAsync
} from '@babel/core';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import { glob } from 'glob';
import { rimraf as forceDeletePaths } from 'rimraf';
import uniqueFilename from 'unique-filename';

import { type AsStrictExecutionContext, type BfeBuilderObject } from 'multiverse#bfe';
import { hardAssert, softAssert } from 'multiverse#cli-utils error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';

import {
  gatherImportEntriesFromFiles,
  gatherPseudodecoratorsEntriesFromFiles,
  isWorkspacePackage,
  ProjectAttribute,
  PseudodecoratorTag,
  WorkspaceAttribute,
  type ImportSpecifier
} from 'multiverse#project-utils';

import {
  generateRawAliasMap,
  mapRawSpecifierToPath,
  mapRawSpecifierToRawAliasMapping
} from 'multiverse#project-utils alias.ts';
import {
  assetPrefix,
  gatherPackageBuildTargets,
  specifierToPackageName
} from 'multiverse#project-utils analyze/gather-package-build-targets.ts';

import { gatherPackageFiles } from 'multiverse#project-utils analyze/gather-package-files.ts';

import {
  isAccessible,
  Tsconfig,
  type AbsolutePath,
  type RelativePath
} from 'multiverse#project-utils fs.ts';

import {
  flattenPackageJsonSubpathMap,
  resolveExportsTargetsFromEntryPoint
} from 'multiverse#project-utils resolver.ts';

import { SHORT_TAB, TAB } from 'multiverse#rejoinder';
import { run, runNoRejectOnBadExit } from 'multiverse#run';

import {
  extensionsTypescript,
  hasTypescriptExtension
} from 'universe assets/config/_babel.config.js.ts';

import { TesterScope } from 'universe commands/test.ts';

import {
  ThisPackageGlobalScope as DistributablesBuilderScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { ErrorMessage } from 'universe error.ts';

import {
  checkIsNotNil,
  copyFile,
  makeDirectory,
  readFile,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage,
  writeFile
} from 'universe util.ts';

const standardNodeShebang = '#!/usr/bin/env node\n';
const nodeModulesRelativeBinDir = `node_modules/.bin`;
const transpiledDirBase = '.transpiled';
const distDirBase = 'dist';

const collator = new Intl.Collator(undefined, { numeric: true });

// TODO: move to util/constant
const isRelativePathRegExp = /^\.\.?(\/|$)/;

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

/**
 * @see {@link ModuleSystem}
 */
export const moduleSystems = Object.values(ModuleSystem);

/**
 * @see {@link DistributablesBuilderScope}
 */
export const distributablesBuilderScopes = Object.values(DistributablesBuilderScope);

export type CustomCliArguments = GlobalCliArguments<DistributablesBuilderScope> & {
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
  skipOutputChecks?: boolean;
  skipOutputValidityCheckFor?: (string | RegExp)[];
  skipOutputExtraneityCheckFor?: (string | RegExp)[];
};

export default async function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const { attributes: projectAttributes = {} } = projectMetadata_?.rootPackage || {};
  const isCwdTheProjectRoot =
    projectMetadata_ && projectMetadata_.rootPackage === projectMetadata_.cwdPackage;
  const isCwdANextJsPackage =
    // TODO: consider allowing Next.js projects as sub-roots / workspace packages
    isCwdTheProjectRoot && !!projectAttributes[ProjectAttribute.Next];

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    function (_blackFlag, _helpOrVersionSet, argv) {
      const baseParameters: BfeBuilderObject<CustomCliArguments, GlobalExecutionContext> =
        {
          scope: { choices: distributablesBuilderScopes },
          'clean-output-dir': {
            alias: 'clean-dist',
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
        'exclude-internal-files': {
          alias: 'exclude-internal-file',
          string: true,
          array: true,
          default: [],
          description: 'Remove one or more files from internal build targets'
        },
        'generate-intermediates-for': {
          string: true,
          choices: intermediateTranspilationEnvironment,
          description: 'Transpile into non-production-ready non-distributables',
          conflicts: [
            'generate-types',
            'link-cli-into-bin',
            'prepend-shebang',
            'skip-output-checks',
            'skip-output-validity-checks-for',
            'skip-output-extraneity-checks-for'
          ],
          implies: {
            'generate-types': false,
            'link-cli-into-bin': false,
            'prepend-shebang': false
          }
        },
        'generate-types': {
          boolean: true,
          description: 'Output TypeScript declaration files alongside distributables',
          default: true,
          conflicts: [
            'skip-output-checks',
            'skip-output-validity-checks-for',
            'skip-output-extraneity-checks-for'
          ],
          implies: { 'skip-output-checks': true },
          vacuousImplications: true
        },
        'include-external-files': {
          alias: 'include-external-file',
          string: true,
          array: true,
          default: [],
          description: 'Add one or more files to external build targets'
        },
        'link-cli-into-bin': {
          boolean: true,
          description: 'Soft-link "bin" entries in package.json into node_modules/.bin',
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
        'prepend-shebang': {
          boolean: true,
          description: 'Prepend a shebang to each "bin" distributable in package.json',
          default: true
        },
        // TODO: consider an option that can reclassify a source as an asset
        // 'reclassify-as-asset': { ... }
        'skip-output-checks': {
          alias: 'skip-output-check',
          boolean: true,
          description: 'Do not run consistency and integrity checks on build output',
          default: false
        },
        'skip-output-validity-checks-for': {
          alias: ['skip-output-validity-check-for', 'skip-invalid'],
          string: true,
          array: true,
          description:
            'Do not warn when a matching package/dependency fails a build output validity check',
          default: [],
          conflicts: ['generate-types'],
          implies: { 'skip-output-checks': false },
          coerce(argument: string[]) {
            return argument.map((a) => {
              return a.startsWith('^') || a.endsWith('$') ? new RegExp(a) : a;
            });
          }
        },
        'skip-output-extraneity-checks-for': {
          alias: ['skip-output-extraneity-check-for', 'skip-extra'],
          string: true,
          array: true,
          description:
            'Do not warn when a matching package/dependency fails a build output extraneity check',
          default: [],
          conflicts: ['generate-types'],
          implies: { 'skip-output-checks': false },
          coerce(argument: string[]) {
            return argument.map((a) => {
              return a.startsWith('^') || a.endsWith('$') ? new RegExp(a) : a;
            });
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
      `$1.

${isCwdANextJsPackage ? "Note that the current working directory points to a Next.js package! When attempting to build such a package, this command will defer entirely to `next build`, which disables several of this command's options.\n\n" : ''}This command also performs lightweight validation of import specifiers and package entry points where appropriate to ensure baseline consistency, integrity, and well-formedness of build output.

This validation can be tweaked with \`--skip-output-validity-checks-for\` and  \`--skip-output-extraneity-checks-for\`, which suppresses errors and warnings for matching import specifiers and/or package names when performing final build output checks. Both parameters accept strings _and regular expressions_, the latter being strings that start with "^" or end with "$". Note that some specifiers are always skipped during extraneity checks, such as Node builtins. Also note that it is unnecessary to escape forward slashes (/) in regular expressions provided via these parameters.

All package build targets are classified as either "source" ("sources," "source files") or "asset" ("assets," "asset files"). "Source" targets describe all the files to be transpiled while "assets" describe the remaining targets that are copied-through to the output directory without any modification. Currently, only TypeScript files (specifically, files ending in one of: ${extensionsTypescript.join(', ')}) are considered source files. Every other file is considered an asset.

All source and asset files are further classified as either "internal" or "external". Internal files or "internals" are all of the files within a package's source directory, i.e. \`\${packageRoot}/src\`. One or more of these files can be excluded from transpilation with \`--exclude-internal-files\`. External files or "externals," on the other hand, are all of the files included in transpilation that are outside of the package's source directory, such as files from other packages in the project. One or more files can be added to the list of externals with \`--include-external-files\`.

\`--include-external-files\` accepts one or more pattern strings that are interpreted according to normal glob rules, while \`--exclude-internal-files\` accepts one or more pattern strings that are interpreted according to gitignore glob rules. Both are relative to the project (NOT package!) root. For \`--exclude-internal-files\` specifically, this all means that seemingly absolute pattern strings like "/home/me/project/src/something.ts" are actually relative to the project (NOT filesystem!) root, and seemingly relative pattern strings like "*.mjs" may exclude files at any depth below the project root. See \`man gitignore\` for more details.

After targets are built, CLI projects will have their entry points chmod-ed to be executable, shebangs added if they do not already exist, and "bin" entries soft-linked into the node_modules/.bin directory.

The only available scope is "${DistributablesBuilderScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be built. Use Npm's workspace features, or Turbo's, if your goal is to build distributables from multiple packages.

When you need to access the intermediate babel transpilation result for non-production non-Next.js build outputs, which can be extremely useful when debugging strange problems in development and testing environments, see the --generate-intermediates-for option and the corresponding \`xscripts test --scope=${TesterScope.ThisPackageIntermediates}\` command.

Finally, note that, when attempting to build a Next.js package, this command will defer entirely to \`next build\`. This means most of the options made available by this command are not available when building a Next.js package.`
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      cleanOutputDir,
      hush: isHushed,
      quiet: isQuieted,
      generateIntermediatesFor,
      outputExtension,
      // TODO: could probably make this easier by using a discriminated union
      // ? We need to make sure these aren't undefined...
      includeExternalFiles: includeExternalFiles_,
      excludeInternalFiles: excludeInternalFiles_,
      generateTypes: generateTypes_,
      linkCliIntoBin: linkCliIntoBin_,
      prependShebang: prependShebang_,
      moduleSystem: moduleSystem_,
      skipOutputChecks: skipOutputChecks_,
      skipOutputValidityCheckFor: skipOutputValidityCheckFor_,
      skipOutputExtraneityCheckFor: skipOutputExtraneityCheckFor_
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
        debug('skipOutputChecks: %O', skipOutputChecks_);
        debug('skipOutputValidityCheckFor (original): %O', skipOutputValidityCheckFor_);
        debug(
          'skipOutputExtraneityCheckFor (original): %O',
          skipOutputExtraneityCheckFor_
        );
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
        const skipOutputChecks = skipOutputChecks_;
        const skipOutputValidityCheckFor = new Set(skipOutputValidityCheckFor_);
        const skipOutputExtraneityCheckFor = new Set(skipOutputExtraneityCheckFor_);

        hardAssert(includeExternalFiles !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(excludeInternalFiles !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(generateTypes !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(linkCliIntoBin !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(prependShebang !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(moduleSystem !== undefined, ErrorMessage.GuruMeditation());
        hardAssert(skipOutputChecks !== undefined, ErrorMessage.GuruMeditation());

        outputExtension ??=
          moduleSystem === ModuleSystem.Cjs ||
          generateIntermediatesFor === IntermediateTranspilationEnvironment.Test
            ? '.js'
            : '.mjs';

        debug('outputExtension (final): %O', outputExtension);

        const outputDirName = generateIntermediatesFor ? transpiledDirBase : distDirBase;
        const absoluteOutputDirPath = toAbsolutePath(outputDirName);
        const absoluteNodeModulesDirPath = toAbsolutePath('node_modules');
        const absoluteRootPackageJsonDirPath = toAbsolutePath('package.json');

        debug('outputDirName: %O', outputDirName);
        debug('absoluteOutputDirPath: %O', absoluteOutputDirPath);

        if (cleanOutputDir) {
          debug(`forcefully deleting build output directory: ${absoluteOutputDirPath}`);
          await forceDeletePaths(absoluteOutputDirPath);
        }

        const { rootPackage, cwdPackage } = projectMetadata;
        const projectRoot = rootPackage.root;
        const packageRoot = cwdPackage.root;
        const packageAttributes = cwdPackage.attributes;
        const packageName = cwdPackage.json.name;

        debug('project root: %O', projectRoot);
        debug('target package: %O', cwdPackage);
        debug('target package root: %O', packageRoot);
        debug('target package name: %O', packageName);

        // * Skip checking Node builtins with "node:" prefix
        skipOutputValidityCheckFor.add(/^node:/);

        // * Skip checking Node builtins
        for (const builtin of builtinModules) {
          skipOutputValidityCheckFor.add(builtin);
        }

        if (packageName) {
          // * Skip self-referential imports since they'll always work
          skipOutputValidityCheckFor.add(packageName);
        }

        debug(
          'skipOutputValidityCheckFor (intermediate): %O',
          skipOutputValidityCheckFor
        );

        debug(
          'skipOutputExtraneityCheckFor (intermediate): %O',
          skipOutputExtraneityCheckFor
        );

        const { targets: buildTargets, metadata: buildMetadata } =
          await gatherPackageBuildTargets(cwdPackage, {
            excludeInternalsPatterns: excludeInternalFiles,
            includeExternalsPatterns: includeExternalFiles
          });

        debug('initial build targets: %O', buildTargets);
        debug('build metadata: %O', buildMetadata);

        const allBuildTargets = Array.from(buildTargets.internal).concat(
          Array.from(buildTargets.external)
        );

        if (generateIntermediatesFor === IntermediateTranspilationEnvironment.Test) {
          const { test: testFiles } = await gatherPackageFiles(cwdPackage, {
            skipGitIgnored: false
          });

          for (const filepath of testFiles) {
            allBuildTargets.push(toRelativePath(projectRoot, filepath) as RelativePath);
          }
        }

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
name      : ${packageName || '(unnamed)'}
package-id: ${isWorkspacePackage(cwdPackage) ? cwdPackage.id : 'N/A (root package has no id)'}
type      : ${projectMetadata.type} ${
            projectAttributes[ProjectAttribute.Hybridrepo] ? '(hybridrepo) ' : ''
          }${isCwdTheProjectRoot ? 'root package' : 'workspace package (sub-root)'}
attributes: ${Object.keys(cwdPackage.attributes).join(', ')}
prod ready: ${generateIntermediatesFor ? `NO! (${generateIntermediatesFor})` : 'yes'}

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
package root: ${packageRoot}
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
              cwd: packageRoot,
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
              cwd: packageRoot,
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
            const path = joinPath(absoluteOutputDirPath, dirname(target)) as AbsolutePath;
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
            const from = joinPath(projectRoot, target) as AbsolutePath;
            const to = joinPath(absoluteOutputDirPath, target) as AbsolutePath;

            debug('copy-through asset: %O => %O', from, to);
            return copyFile(from, to);
          }),

          // * Transpile internals: ./* => ./dist/* or ./.transpiled/*
          ...allBuildSourceTargets.map(async (target) => {
            const sourcePath = joinPath(projectRoot, target) as AbsolutePath;
            const outputPath = joinPath(
              absoluteOutputDirPath,
              target.replace(/(?<=[^/])\.[^.]+$/, outputExtension!)
            ) as AbsolutePath;

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
          (packageAttributes[ProjectAttribute.Cli] ||
            packageAttributes[WorkspaceAttribute.Cli]) &&
          linkCliIntoBin
        ) {
          const { bin, name } = cwdPackage.json;

          if (bin && name) {
            genericLogger.newline([LogTag.IF_NOT_QUIETED]);
            genericLogger(
              [LogTag.IF_NOT_QUIETED],
              '⮞ Adding executables to node_modules/.bin'
            );
            genericLogger.newline([LogTag.IF_NOT_QUIETED]);

            debug('symlinking and chmod-ing main bin file into node_modules');

            const cwdPackageBin = typeof bin === 'string' ? { [name]: bin } : bin;

            const binFiles = Object.values(cwdPackageBin);
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
              ...Object.entries(cwdPackageBin).map(async ([binName, binPath]) => {
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

        if (skipOutputChecks) {
          debug('skipped consistency and integrity checks on build output');
        } else {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);

          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            '⮞ Running lightweight consistency and integrity checks on build output'
          );

          const { dependencies, devDependencies, peerDependencies } = cwdPackage.json;

          // eslint-disable-next-line unicorn/prevent-abbreviations
          const prodDeps = new Set(
            Object.keys(Object.assign({}, dependencies, peerDependencies))
          );

          // eslint-disable-next-line unicorn/prevent-abbreviations
          const devDeps = new Set(Object.keys(devDependencies || {}));
          const allDeps = prodDeps.union(devDeps);

          // ! Note that skipOutputValidityCheckFor and
          // ! skipOutputExtraneityCheckFor are incomplete and are only
          // ! finalized in the body of checkImportsDependenciesValidBijection()

          // ? This code block should only be reached when generateTypes is true
          // ? due to our Black Flag checks
          const [attwResult, bijectionResult, entryResult] = await Promise.allSettled([
            checkDistAreTheTypesWrong(),
            checkImportsDependenciesValidBijection(),
            checkDistEntryPoints()
          ]);

          hardAssert(attwResult.status === 'fulfilled', ErrorMessage.GuruMeditation());
          const { all: attwOutput, exitCode: attwExitCode } = attwResult.value;

          const errored: boolean | Error =
            attwExitCode !== 0 ||
            (bijectionResult.status === 'rejected' && bijectionResult.reason) ||
            (entryResult.status === 'rejected' && entryResult.reason) ||
            false;

          // TODO: replace all this with rejoinder and listr

          genericLogger.newline([LogTag.IF_NOT_SILENCED]);

          if (attwExitCode !== 0) {
            genericLogger.error(
              [LogTag.IF_NOT_SILENCED],
              attwOutput
                ? [attwOutput].flat().join('\n')
                : '%O returned exit code %O but generated no output',
              '@arethetypeswrong/cli',
              attwExitCode
            );
          } else {
            genericLogger([LogTag.IF_NOT_SILENCED], `${TAB}@attw/cli test succeeded`);
          }

          if (bijectionResult.status === 'fulfilled') {
            genericLogger(
              [LogTag.IF_NOT_SILENCED],
              `${TAB}dependency bijection tests succeeded`
            );
          }

          if (entryResult.status === 'fulfilled') {
            genericLogger(
              [LogTag.IF_NOT_SILENCED],
              `${TAB}package.json::exports entry point tests succeeded`
            );
          }

          if (errored) {
            genericLogger.newline([LogTag.IF_NOT_SILENCED]);
            throw isNativeError(errored)
              ? errored
              : new CliError(ErrorMessage.BuildOutputChecksFailed());
          }

          /**
           * Check dist type definitions for correctness using attw.
           */
          async function checkDistAreTheTypesWrong() {
            // {@xscripts/notExtraneous @arethetypeswrong/cli}
            return runNoRejectOnBadExit('npx', ['attw', '--pack', '.'], {
              env: { FORCE_COLOR: '1' },
              all: true
            });
          }

          /**
           * Check dist files to ensure:
           *
           * - All relative required/imported paths point to existing files
           *   within `./dist`.
           *
           * - Required/imported NPM dependencies exist in `package.json`
           *   `dependencies` object.
           *
           * Also checks all of the package's TypeScript files to ensure all
           * required/imported NPM dependencies exist in `package.json`
           * somewhere. Extraneous dependencies (dependencies in `package.json`
           * that aren't required/imported by any TypeScript files nor exist in
           * `nonExtraneousDependencies`) and missing dependencies (dependencies
           * in `package.json` that aren't required/imported by any TypeScript
           * files or in `nonExtraneousDependencies`) are reported.
           *
           * TODO: move some or most of this to project lint command later
           */
          async function checkImportsDependenciesValidBijection() {
            const dbg = debug.extend('checkDistRequiredPaths');

            const {
              dist: distFiles,
              other: otherFiles,
              src: srcFiles,
              test: testFiles
            } = await gatherPackageFiles(cwdPackage, {
              // ? Must explicitly recompute since above steps changed things
              useCached: false
            });

            const allOtherFiles = otherFiles.concat(srcFiles, testFiles);
            const allOtherFilesPlusBuildTargets = Array.from(
              new Set(
                allOtherFiles.concat(
                  allBuildTargets.map(
                    (target) => joinPath(projectRoot, target) as AbsolutePath
                  )
                )
              )
            );

            const [distImportEntries, otherImportEntries, pseudodecoratorEntries] =
              await Promise.all([
                gatherImportEntriesFromFiles(distFiles, { excludeTypeImports: false }),
                gatherImportEntriesFromFiles(allOtherFiles, {
                  excludeTypeImports: false
                }),
                gatherPseudodecoratorsEntriesFromFiles(allOtherFilesPlusBuildTargets)
              ]);

            for (const [, pseudodecorators] of pseudodecoratorEntries) {
              for (const { tag, items } of pseudodecorators) {
                const targetSet =
                  tag === PseudodecoratorTag.NotInvalid
                    ? skipOutputValidityCheckFor
                    : skipOutputExtraneityCheckFor;

                for (const item of items) {
                  targetSet.add(item);
                }
              }
            }

            debug('skipOutputValidityCheckFor (final): %O', skipOutputValidityCheckFor);

            debug(
              'skipOutputExtraneityCheckFor (final): %O',
              skipOutputExtraneityCheckFor
            );

            const distImportPackages = new Set<string>();
            const otherImportPackages = new Set<string>();

            const distInaccessibleLocalImports: ImportSpecifier[] = [];
            const distLocalImportsOutsideDist: ImportSpecifier[] = [];
            const distExtraneousDependencies: [name: string, type: string][] = [];
            const distMissingDependencies = [] as [
              ...ImportSpecifier,
              packageName: string
            ][];

            const otherExtraneousDependencies: [name: string, type: string][] = [];
            const otherMissingDependencies = [] as [
              ...ImportSpecifier,
              packageName: string
            ][];

            const wellKnownAliases = generateRawAliasMap(projectMetadata);

            dbg('prodDeps: %O', prodDeps);
            dbg('devDeps: %O', devDeps);
            dbg('allDeps: prodDeps + devDeps');

            dbg.message(
              'checking %O "dist" and %O "other" import specifier entries against project metadata',
              distImportEntries.length,
              otherImportEntries.length
            );

            for (const [filepath, specifiers] of distImportEntries) {
              const dbg1 = dbg.extend('1-prod');
              const isTypescriptDefinitionFile = filepath.endsWith('.d.ts');

              dbg1('checking %O import specifiers in %O', specifiers.size, filepath);
              dbg1('isTypescriptDefinitionFile: %O', isTypescriptDefinitionFile);

              for (const specifier of specifiers) {
                if (shouldSkipCheckForSpecifier(specifier, 'invalid')) {
                  dbg1.warn('ignored (skipped) specifier: %O', specifier);
                  continue;
                }

                // ? Is the specifier erroneously an absolute import?
                if (isAbsolute(specifier)) {
                  dbg1.error('absolute specifier: %O', specifier);
                  distLocalImportsOutsideDist.push([filepath, specifier]);
                }
                // ? Is the specifier a relative import?
                else if (isRelativePathRegExp.test(specifier)) {
                  const absoluteSpecifier = toAbsolutePath(
                    dirname(filepath),
                    specifier
                  ) as AbsolutePath;

                  dbg1('relative specifier (+ root): %O', absoluteSpecifier);

                  if (isTypescriptDefinitionFile && !specifier.endsWith('.js')) {
                    genericLogger.warn(
                      'specifier "%O" has an unexpected extension (expected ".js") in definition file %O',
                      specifier,
                      filepath
                    );
                  }

                  // ? Is it erroneously outside of ./dist?
                  if (
                    !absoluteSpecifier.startsWith(absoluteOutputDirPath) &&
                    !absoluteSpecifier.startsWith(absoluteNodeModulesDirPath) &&
                    !absoluteSpecifier.startsWith(absoluteRootPackageJsonDirPath)
                  ) {
                    dbg1.error('outsider specifier: %O', specifier);
                    distLocalImportsOutsideDist.push([filepath, specifier]);
                  } else {
                    if (absoluteSpecifier.startsWith(absoluteNodeModulesDirPath)) {
                      genericLogger.warn(
                        'specifier "%O" precariously imports from node_modules in %O',
                        specifier,
                        filepath
                      );
                    }

                    // ? Is it erroneously inaccessible to the current process, or
                    // ? is it missing an extension (so probably not a file)?
                    if (
                      (isTypescriptDefinitionFile &&
                        // ? tsc likes .d.ts files w/ extensionless imports,
                        // ? and, to it, .js et al and .d.ts are synonymous
                        (
                          await glob(absoluteSpecifier.replace(/\.js$/, '.') + '*', {
                            dot: true,
                            nodir: true
                          })
                        ).length === 0) ||
                      (!isTypescriptDefinitionFile &&
                        (!(await isAccessible({ path: absoluteSpecifier })) ||
                          !extname(absoluteSpecifier)))
                    ) {
                      dbg1.error('inaccessible specifier: %O', specifier);
                      distInaccessibleLocalImports.push([filepath, specifier]);
                    }
                  }
                }
                // ? Must be an external NPM dependency
                else {
                  const packageName = specifierToPackageName(specifier);
                  distImportPackages.add(packageName);

                  dbg1('package specifier: %O <== %O', packageName, specifier);

                  // ? Is it erroneously missing in package.json production
                  // ? dependencies?
                  if (!prodDeps.has(packageName)) {
                    if (shouldSkipCheckForSpecifier(packageName, 'invalid')) {
                      dbg1.warn(
                        'ignored (skipped) missing package specifier: %O <== %O',
                        packageName,
                        specifier
                      );

                      continue;
                    } else {
                      dbg1.error(
                        'missing package specifier: %O <== %O',
                        packageName,
                        specifier
                      );

                      distMissingDependencies.push([filepath, specifier, packageName]);
                    }
                  }
                }
              }
            }

            for (const [filepath, specifiers] of otherImportEntries) {
              const dbg2 = dbg.extend('2-dev');
              dbg2('checking %O import specifiers in %O', specifiers.size, filepath);

              for (const specifier_ of specifiers) {
                const rawAliasMapping = mapRawSpecifierToRawAliasMapping(
                  wellKnownAliases,
                  specifier_
                );

                const mappedPath = rawAliasMapping
                  ? mapRawSpecifierToPath(rawAliasMapping, specifier_)
                  : undefined;

                // ? Since we're looking at TypeScript now, we need to handle
                // ? aliases
                const specifier =
                  (mappedPath ? './' + mappedPath : undefined) ?? specifier_;

                if (
                  isAbsolute(specifier) ||
                  isRelativePathRegExp.test(specifier) ||
                  shouldSkipCheckForSpecifier(specifier, 'invalid')
                ) {
                  dbg2.warn('ignored (skipped) specifier: %O', specifier);
                  continue;
                }

                const packageName = specifierToPackageName(specifier);
                otherImportPackages.add(packageName);

                dbg2('package specifier: %O <== %O', packageName, specifier);

                // ? Is it erroneously missing in package.json dependencies?
                if (!allDeps.has(packageName)) {
                  if (shouldSkipCheckForSpecifier(packageName, 'invalid')) {
                    dbg2.warn(
                      'ignored (skipped) missing package specifier: %O <== %O',
                      packageName,
                      specifier
                    );

                    continue;
                  } else {
                    dbg2.warn(
                      'missing package specifier: %O <== %O',
                      packageName,
                      specifier
                    );

                    otherMissingDependencies.push([filepath, specifier, packageName]);
                  }
                }
              }
            }

            // ? For prod dependencies in package.json, error if any are
            // ? extraneous with respect to dist files
            for (const packageName of prodDeps) {
              const dbg3 = dbg.extend('3-prod');

              if (shouldSkipCheckForSpecifier(packageName, 'extraneous')) {
                dbg3.warn('ignored (skipped) dependency: %O', packageName);
                continue;
              }

              if (
                !distImportPackages.has(packageName) &&
                !isRelevantDefinitelyTypedPackage(distImportPackages, packageName)
              ) {
                dbg3.error('extraneous production dependency: %O', packageName);
                distExtraneousDependencies.push([
                  packageName,
                  dependencies?.[packageName] ? 'deps' : 'peerDeps'
                ]);
              } else {
                dbg3('production dependency: %O', packageName);
              }
            }

            const allImportPackages = distImportPackages.union(otherImportPackages);

            // ? For dev dependencies in package.json, error if any are
            // ? extraneous with respect to non-dist files
            for (const packageName of devDeps) {
              const dbg4 = dbg.extend('4-dev');

              if (shouldSkipCheckForSpecifier(packageName, 'extraneous')) {
                dbg4.warn('ignored (skipped) dependency: %O', packageName);
                continue;
              }

              if (
                !otherImportPackages.has(packageName) &&
                !isRelevantDefinitelyTypedPackage(allImportPackages, packageName)
              ) {
                dbg4.warn('extraneous development dependency: %O', packageName);
                otherExtraneousDependencies.push([packageName, 'devDeps']);
              } else {
                dbg4('development dependency: %O', packageName);
              }
            }

            function isRelevantDefinitelyTypedPackage(
              packages: Set<string>,
              packageName: string
            ) {
              if (packageName.startsWith('@types/')) {
                const isScoped = packageName.includes('__');
                const typedPackageName =
                  (isScoped ? '@' : '') + packageName.slice(7).replace('__', '/');

                dbg(
                  `saw "${packageName}"; looking for corresponding package "${typedPackageName}"`
                );

                return packages.has(typedPackageName);
              }

              return false;
            }

            // * Errors

            const hasErrors =
              distInaccessibleLocalImports.length +
              distLocalImportsOutsideDist.length +
              distMissingDependencies.length +
              distExtraneousDependencies.length;

            if (hasErrors) {
              if (distInaccessibleLocalImports.length) {
                genericLogger.newline([LogTag.IF_NOT_SILENCED]);
                genericLogger.error(
                  [LogTag.IF_NOT_SILENCED],
                  ErrorMessage.DistributablesSpecifiersPointToInaccessible(
                    distInaccessibleLocalImports
                  )
                );
              }

              if (distLocalImportsOutsideDist.length) {
                genericLogger.newline([LogTag.IF_NOT_SILENCED]);
                genericLogger.error(
                  [LogTag.IF_NOT_SILENCED],
                  ErrorMessage.DistributablesSpecifiersPointOutsideDist(
                    distLocalImportsOutsideDist
                  )
                );
              }

              if (distMissingDependencies.length) {
                genericLogger.newline([LogTag.IF_NOT_SILENCED]);
                genericLogger.error(
                  [LogTag.IF_NOT_SILENCED],
                  ErrorMessage.DistributablesSpecifiersDependenciesMissing(
                    distMissingDependencies
                  )
                );
              }

              if (distExtraneousDependencies.length) {
                genericLogger.newline([LogTag.IF_NOT_SILENCED]);
                genericLogger.error(
                  [LogTag.IF_NOT_SILENCED],
                  ErrorMessage.DependenciesExtraneous(distExtraneousDependencies)
                );
              }

              throw new CliError(ErrorMessage.BuildOutputChecksFailed());
            }

            // * Warnings

            if (otherMissingDependencies.length) {
              genericLogger.newline([LogTag.IF_NOT_SILENCED]);
              genericLogger.warn(
                [LogTag.IF_NOT_SILENCED],
                ErrorMessage.OthersSpecifiersDependenciesMissing(otherMissingDependencies)
              );
            }

            if (otherExtraneousDependencies.length) {
              genericLogger.newline([LogTag.IF_NOT_SILENCED]);
              genericLogger.warn(
                [LogTag.IF_NOT_SILENCED],
                ErrorMessage.DependenciesExtraneous(otherExtraneousDependencies)
              );
            }
          }

          /**
           * Check `package.json` `exports` entries against dist files for
           * existence.
           */
          async function checkDistEntryPoints() {
            const dbg = debug.extend('checkDistEntryPoints');

            const {
              json: { exports: cwdPackageExports }
            } = cwdPackage;

            dbg('cwdPackageExports: %O', cwdPackageExports);

            if (cwdPackageExports) {
              const flattenedExports = flattenPackageJsonSubpathMap({
                map: cwdPackageExports
              });

              const badExports: [subpath: string, target: string][] = [];

              dbg('flattenedExports: %O', flattenedExports);

              for (const { subpath, conditions } of flattenedExports) {
                dbg('resolving subpath: %O %O', subpath, conditions);

                const targets = resolveExportsTargetsFromEntryPoint({
                  flattenedExports,
                  entryPoint: subpath,
                  conditions
                });

                dbg('saw targets: %O', targets);

                for (const target of targets) {
                  if (target.includes('*')) {
                    const realTarget = target
                      .replaceAll(/\/\*(?!\*)/g, '/**/*')
                      .replaceAll(/(?<!\*)\*\//g, '*/**/');

                    const realTargets = await glob(realTarget, {
                      dot: true,
                      nodir: true
                    });

                    dbg('checking real wildcard target: %O', realTarget);

                    if (!realTargets.length) {
                      dbg.error(
                        'entry point with wildcard target leads to no accessible files: %O',
                        target
                      );

                      badExports.push([subpath, target]);
                    }
                  } else {
                    dbg('checking target: %O', target);

                    if (!(await isAccessible({ path: target }))) {
                      dbg.error('entry point leads to inaccessible file: %O', target);
                      badExports.push([subpath, target]);
                    }
                  }
                }
              }

              if (badExports.length) {
                genericLogger.newline([LogTag.IF_NOT_SILENCED]);
                genericLogger.error(
                  [LogTag.IF_NOT_SILENCED],
                  ErrorMessage.ExportSubpathsPointsToInaccessible(badExports)
                );

                throw new CliError(ErrorMessage.BuildOutputChecksFailed());
              }
            } else {
              throw new CliError(ErrorMessage.BadPackageExportsInPackageJson());
            }
          }

          /**
           * **Note that `skipOutputValidityCheckFor` and
           * `skipOutputExtraneityCheckFor` (on which this function relies) are
           * incomplete and are only finalized in the body of
           * `checkImportsDependenciesValidBijection`!**
           */
          function shouldSkipCheckForSpecifier(
            specifier: string,
            filter: 'invalid' | 'extraneous'
          ) {
            const targetSet =
              filter === 'invalid'
                ? skipOutputValidityCheckFor
                : skipOutputExtraneityCheckFor;

            return targetSet
              .values()
              .some((matcher) =>
                typeof matcher === 'string'
                  ? matcher === specifier
                  : !!specifier.match(matcher)
              );
          }
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
