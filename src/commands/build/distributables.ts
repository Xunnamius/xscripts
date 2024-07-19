/* eslint-disable no-await-in-loop */
import { chmod, rename, stat, symlink } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import { rimraf as forceDeletePaths } from 'rimraf';
import uniqueFilename from 'unique-filename';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { standardNodeShebang } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import {
  ProjectMetaAttribute,
  findMainBinFile,
  findProjectFiles,
  getImportSpecifierEntriesFromFiles,
  getProjectMetadata,
  globalPreChecks,
  readFile,
  writeFile
} from 'universe/util';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { softAssert } from 'multiverse/@-xun/cli-utils/error';
import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { SHORT_TAB } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';

/**
 * Possible intermediate transpilation targets (non-production
 * non-distributables). See this command's options configuration for details.
 */
export enum IntermediateTranspilationEnvironment {
  Development = 'development',
  Test = 'test'
}

/**
 * @see {@link IntermediateTranspilationEnvironment}
 */
export const intermediateTranspilationEnvironment = Object.values(
  IntermediateTranspilationEnvironment
);

export type CustomCliArguments = GlobalCliArguments & {
  generateTypes: boolean;
  linkCliIntoBin: boolean;
  prependShebang: boolean;
  moduleSystem: 'cjs' | 'esm';
  cleanOutputDir: boolean;
  generateIntermediatesFor?: IntermediateTranspilationEnvironment;
  outputExtension?: string;
};

export default async function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const { attributes } = await getProjectMetadata(runtimeContext);

  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
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
      choices: ['cjs', 'esm'],
      description: 'Which JavaScript module system to transpile into',
      default: 'cjs'
    },
    'clean-output-dir': {
      boolean: true,
      description: 'Force-delete the output directory before transpilation',
      default: !attributes.includes(ProjectMetaAttribute.Next)
    },
    'generate-intermediates-for': {
      choices: intermediateTranspilationEnvironment,
      description: 'Transpile into intermediate non-production-ready non-distributables',
      conflicts: ['generate-types', 'link-cli-into-bin', 'prepend-shebang'],
      implies: {
        'generate-types': false,
        'link-cli-into-bin': false,
        'prepend-shebang': false
      }
    },
    'output-extension': {
      string: true,
      description:
        'Override automatic extension selection for transpiled JavaScript output',
      coerce(argument: string) {
        argument = String(argument);
        return argument.startsWith('.') ? argument : `.${argument}`;
      }
    }
  });

  return {
    aliases: ['dist'],
    builder,
    description: 'Transpile source and assets into production-ready distributables',
    usage: withStandardUsage(
      '$1.\n\nNext.js projects will defer entirely to `next build`.\n\nBy default, CLI projects will have their entry points chmod-ed to be executable, shebangs added if they do not already exist, and "bin" entries soft-linked into node_modules/.bin.\n\nIn a monorepo context, only a single root/sub-root package will be built conditioned on the current working directory. Use Npm\'s workspace features, or Turbo\'s, if your goal is to build distributables from multiple sub-roots.\n\nWhen you need to access the intermediate babel transpilation result for non-production build outputs, which can be extremely useful when debugging strange problems in development and testing environments, see the --generate-intermediates-for option.'
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      generateTypes,
      linkCliIntoBin,
      prependShebang,
      moduleSystem,
      cleanOutputDir,
      generateIntermediatesFor,
      outputExtension,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });

      debug('generateTypes: %O', generateTypes);
      debug('linkCliIntoBin: %O', linkCliIntoBin);
      debug('prependShebang: %O', prependShebang);
      debug('cleanOutputDir: %O', cleanOutputDir);
      debug('outputExtension (original): %O', outputExtension);

      if (generateIntermediatesFor) {
        genericLogger.warn(
          [LogTag.IF_NOT_QUIETED],
          'Building intermediate non-production non-distributables...'
        );
      } else {
        genericLogger([LogTag.IF_NOT_QUIETED], 'Building production distributables...');
      }

      debug('calculating metadata');

      const {
        context,
        project: {
          // ? This does NOT end in a slash and this must be taken into account!
          root: rootDir,
          json: rootPkg
        }
      } = runtimeContext;

      debug('rootDir: %O', rootDir);
      debug('rootPkg.name: %O', rootPkg.name);

      outputExtension ??=
        moduleSystem === 'cjs' ||
        generateIntermediatesFor === IntermediateTranspilationEnvironment.Test
          ? '.js'
          : '.mjs';

      debug('moduleSystem: %O', moduleSystem);
      debug('outputExtension: %O', outputExtension);

      const inputExtension = '.ts';
      const isInMonorepo = context === 'monorepo';

      debug('inputExtension: %O', inputExtension);
      debug('isInMonorepo: %O', isInMonorepo);

      const {
        tsFiles: { src: tsSrcFiles, lib: tsLibraryFiles },
        pkgFiles: { lib: libraryPkgFiles }
      } = await findProjectFiles(runtimeContext);

      // TODO: replace relevant tasks with listr2

      const libraryDirPrefix = `${rootDir}/lib/`;
      const nodeModulesBinDir = `${rootDir}/node_modules/.bin`;
      const productionLibraryImports = new Set<string>();

      debug('libraryDirPrefix: %O', libraryDirPrefix);
      debug('nodeModulesBinDir: %O', nodeModulesBinDir);

      const libraryDirectories = new Set(
        libraryPkgFiles.map((path) => dirname(path).slice(libraryDirPrefix.length))
      );

      const libraryDirectoriesArray = Array.from(libraryDirectories);
      debug('libraryDirectories: %O', libraryDirectories);

      if (attributes.includes(ProjectMetaAttribute.Next)) {
        if (generateIntermediatesFor) {
          throw new CliError(ErrorMessage.CannotBuildIntermediatesForNextJs());
        }

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
        const outputDirName = generateIntermediatesFor ? '.transpiled' : 'dist';
        const outputDirPath = `./${outputDirName}`;

        debug('outputDirName: %O', outputDirName);
        debug('outputDirPath: %O', outputDirPath);

        if (cleanOutputDir) {
          debug(`forcefully deleting build output directory: ${outputDirPath}`);
          await forceDeletePaths(outputDirPath);
        }

        // ? Results are stored into prodLibImports
        await discoverProductionLibraryImports(tsSrcFiles);

        // ? Iteratively check each newly added prod lib import for potentially
        // ? more prod lib imports to be added. Keep checking until we don't add
        // ? anymore
        for (
          let previousProductionLibraryImportsSize = 0, iteration = 1;
          previousProductionLibraryImportsSize !== productionLibraryImports.size;
          previousProductionLibraryImportsSize = productionLibraryImports.size,
            iteration++
        ) {
          // ? Thankfully TC39 had the foresight to make sets enumerable in
          // ? insertion order!
          await discoverProductionLibraryImports(
            Array.from(productionLibraryImports)
              .slice(previousProductionLibraryImportsSize)
              .flatMap((libraryImport) =>
                tsLibraryFiles.filter((tsLibraryFile) =>
                  tsLibraryFile.startsWith(`${libraryDirPrefix}${libraryImport}`)
                )
              ),
            iteration
          );
        }

        const developmentLibraryImportsArray = libraryDirectories.difference(
          productionLibraryImports
        );

        debug(
          'developmentLibraryImportsArray (will not be built): %O',
          developmentLibraryImportsArray
        );

        // TODO: with listr2, build types and source simultaneously
        if (generateTypes) {
          genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Generating types');
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);

          debug('running tsc');
          await run(
            'npx',
            ['tsc', '--project', 'tsconfig.types.json', '--incremental', 'false'],
            {
              env: { NODE_ENV: 'production' },
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );

          debug('running tsconfig-replace-paths');
          await run(
            'npx',
            ['tsconfig-replace-paths', '--project', 'tsconfig.types.json'],
            {
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );

          if (isInMonorepo) {
            // TODO: monorepo stuff
            genericLogger([LogTag.IF_NOT_QUIETED], `${SHORT_TAB}Organizing types...`);
            genericLogger([LogTag.IF_NOT_QUIETED], `${SHORT_TAB}Refactoring types...`);
          }
        } else {
          debug('skipped type generation');
        }

        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
        genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Building distributables');

        const absoluteOutputDirPath = `${process.cwd()}/${outputDirPath}`;

        const babelNodeEnvironment: Record<string, string> = {
          NODE_ENV: generateIntermediatesFor ?? `production-${moduleSystem}`
        };

        if (generateIntermediatesFor) {
          babelNodeEnvironment.JEST_TRANSPILED = 'true';
        }

        debug('absoluteOutputDirPath: %O', absoluteOutputDirPath);
        debug('babelNodeEnvironment: %O', babelNodeEnvironment);
        debug(`building ${libraryDirPrefix.slice(0, -1)} and ${absoluteOutputDirPath}`);

        genericLogger.newline([LogTag.IF_NOT_QUIETED]);

        await Promise.all([
          run(
            'npx',
            [
              'babel',
              'lib',
              '--extensions',
              `${inputExtension},.tsx`,
              '--out-dir',
              `${absoluteOutputDirPath}/lib`,
              '--out-file-extension',
              outputExtension,
              ...(generateIntermediatesFor === IntermediateTranspilationEnvironment.Test
                ? []
                : [
                    '--ignore',
                    `lib/**/*.test${inputExtension}`,
                    '--ignore',
                    `lib/**/test`
                  ]),
              '--ignore',
              'lib/**/README.md',
              ...Array.from(developmentLibraryImportsArray).flatMap((name) => [
                '--ignore',
                `lib/${name}`
              ])
            ],
            {
              env: babelNodeEnvironment,
              cwd: rootDir,
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          ),
          run(
            'npx',
            [
              'babel',
              'src',
              '--extensions',
              `${inputExtension},.tsx`,
              '--out-dir',
              `${outputDirPath}/src`,
              '--out-file-extension',
              outputExtension,
              '--copy-files',
              ...(isInMonorepo ? ['--root-mode', 'upward'] : [])
            ],
            {
              env: babelNodeEnvironment,
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          ),
          ...(generateIntermediatesFor === IntermediateTranspilationEnvironment.Test
            ? [
                run(
                  'npx',
                  [
                    'babel',
                    'test',
                    '--extensions',
                    `${inputExtension},.tsx`,
                    '--out-dir',
                    `${outputDirPath}/test`,
                    '--out-file-extension',
                    outputExtension,
                    ...(isInMonorepo ? ['--root-mode', 'upward'] : [])
                  ],
                  {
                    env: babelNodeEnvironment,
                    stdout: isHushed ? 'ignore' : 'inherit',
                    stderr: isQuieted ? 'ignore' : 'inherit'
                  }
                )
              ]
            : [])
        ]);

        if (
          attributes.includes(ProjectMetaAttribute.Cli) &&
          linkCliIntoBin &&
          rootPkg.bin &&
          rootPkg.name
        ) {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            '⮞ Adding executable entry to node_modules/.bin'
          );
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);

          debug('symlinking and chmod-ing cli.js into node_modules based on bin config');

          const binConfig =
            typeof rootPkg.bin === 'string'
              ? { [rootPkg.name]: rootPkg.bin }
              : rootPkg.bin;

          const mainBinFile =
            findMainBinFile(runtimeContext) ||
            softAssert(ErrorMessage.CliProjectHasBadBinConfig());

          const binFiles = Object.values(binConfig);
          const binFileInodes = await Promise.all(
            binFiles.map(async (path) => {
              softAssert(path, ErrorMessage.GuruMeditation());
              return stat(path).then(({ ino }) => ino);
            })
          );

          await Promise.all([
            ...(prependShebang
              ? Array.from(new Set(binFileInodes)).map(async (inode) => {
                  // ? We go through all this to avoid race conditions where we
                  // ? might end up writing to the same file
                  const path = binFiles.at(binFileInodes.indexOf(inode));
                  softAssert(path, ErrorMessage.GuruMeditation());
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
            ...Object.entries(binConfig).map(async ([name, path]) => {
              softAssert(path, ErrorMessage.GuruMeditation());

              const symlinkTargetPath = relative(
                nodeModulesBinDir,
                resolve(rootDir, path)
              );
              const symlinkTemporaryPath = uniqueFilename(nodeModulesBinDir);
              const symlinkRealPath = `${nodeModulesBinDir}/${name}`;

              debug('symlink target path: %O', symlinkTargetPath);
              debug('symlink temporary path: %O', symlinkTemporaryPath);
              debug('symlink real path: %O', symlinkRealPath);

              await symlink(symlinkTargetPath, symlinkTemporaryPath);
              await rename(symlinkTemporaryPath, symlinkRealPath);

              genericLogger(
                [LogTag.IF_NOT_QUIETED],
                `${SHORT_TAB}${symlinkRealPath} ⮕ ${symlinkTargetPath}`
              );
            }),
            chmod(mainBinFile, 0o775).then(() =>
              genericLogger(
                [LogTag.IF_NOT_QUIETED],
                `${SHORT_TAB}chmod 0775 ${mainBinFile}`
              )
            )
          ]);
        } else {
          debug('skipped symlinking and chmod-ing cli.js');
        }
      }

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      if (generateIntermediatesFor) {
        genericLogger.warn(
          [LogTag.IF_NOT_QUIETED],
          '(build output consists of intermediate files NOT SUITABLE FOR DISTRIBUTION OR PRODUCTION!)'
        );
      }

      // TODO: stuff like this should be co-located in @-xun/project-utils
      // TODO: alongside the @projector-js/core redux
      async function discoverProductionLibraryImports(files: string[], iteration = 0) {
        const debugImportLister = debug.extend(
          `discoverProdLibImports:iter-${iteration}`
        );

        const libraryImportEntries = await getImportSpecifierEntriesFromFiles(files);

        for (const [, importPaths] of libraryImportEntries) {
          importPaths.forEach((importPath) => {
            if (importPath.startsWith('multiverse/')) {
              const strippedImportPath = importPath.slice('multiverse/'.length);

              const libraryDir = libraryDirectoriesArray.find((dir) =>
                strippedImportPath.startsWith(dir)
              );

              if (libraryDir) {
                productionLibraryImports.add(libraryDir);
              }
            }
          });
        }

        debugImportLister(
          `end-of-iteration prodLibImports: %O`,
          productionLibraryImports
        );
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
