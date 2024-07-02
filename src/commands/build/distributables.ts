/* eslint-disable no-await-in-loop */
import assert from 'node:assert';
import { chmod, rename, stat, symlink } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

import { transformFileAsync } from '@babel/core';
import { type ChildConfiguration } from '@black-flag/core';
import uniqueFilename from 'unique-filename';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { standardNodeShebang } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import {
  ProjectMetaAttribute,
  findMainBinFile,
  findProjectFiles,
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

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { SHORT_TAB } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';

export type CustomCliArguments = GlobalCliArguments & {
  generateTypes: boolean;
  linkCliIntoBin: boolean;
  prependShebang: boolean;
  moduleSystem: 'cjs' | 'esm';
};

export default function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
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
    }
  });

  return {
    aliases: ['dist'],
    builder,
    description: 'Transpile source and assets into production-ready distributables',
    usage: withStandardUsage(
      '$1.\n\nNext.js projects will defer entirely to `next build`.\n\nBy default, CLI projects will have their entry points chmod-ed to be executable, shebangs added if they do not already exist, and "bin" entries soft-linked into node_modules/.bin.\n\nIn a monorepo context, only a single root/sub-root package will be built conditioned on the current working directory. Use Npm\'s workspace features, or Turbo\'s, if your goal is to build distributables from multiple sub-roots.'
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      generateTypes,
      linkCliIntoBin,
      prependShebang,
      moduleSystem,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      const debugImportLister = debug.extend('import-lister');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });

      debug('generateTypes: %O', generateTypes);
      debug('linkCliIntoBin: %O', linkCliIntoBin);
      debug('prependShebang: %O', prependShebang);

      genericLogger([LogTag.IF_NOT_QUIETED], 'Building project distributables...');

      debug('calculating metadata');

      const {
        context,
        project: {
          // ? This does NOT end in a slash and this must be taken into account!
          root: rootDir,
          json: rootPkg
        }
      } = runtimeContext;

      const inputExtension = '.ts';
      const outputExtension = moduleSystem === 'cjs' ? '.js' : '.esm';
      const isInMonorepo = context === 'monorepo';

      debug('moduleSystem: %O', moduleSystem);
      debug('inputExtension: %O', inputExtension);
      debug('outputExtension: %O', outputExtension);
      debug('rootDir: %O', rootDir);
      debug('rootPkg: %O', rootPkg);
      debug('isInMonorepo: %O', isInMonorepo);

      const [
        { attributes },
        {
          tsFiles: { src: tsSrcFiles, lib: tsLibraryFiles },
          pkgFiles: { lib: libraryPkgFiles }
        },
        { default: createImportsListerPlugin }
      ] = await Promise.all([
        getProjectMetadata(runtimeContext),
        findProjectFiles(runtimeContext),
        import('babel-plugin-list-imports')
      ]);

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
        debug('running next build');
        await run('npx', ['next', 'build'], {
          env: { NODE_ENV: 'production' },
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        });
      } else {
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
          debugImportLister(
            'prevProdLibImportsSize (%O) !== prodLibImports.size (%O), iterating again...',
            previousProductionLibraryImportsSize,
            productionLibraryImports.size
          );

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
        genericLogger.newline([LogTag.IF_NOT_QUIETED]);

        debug('building root ./lib and relative ./dist');
        await Promise.all([
          run(
            'npx',
            [
              'babel',
              'lib',
              '--extensions',
              inputExtension,
              '--out-dir',
              './dist/lib',
              '--out-file-extension',
              outputExtension,
              ...(isInMonorepo ? ['--root-mode', 'upward'] : []),
              '--ignore',
              `lib/**/*.test${inputExtension}`,
              '--ignore',
              `lib/**/test`,
              '--ignore',
              'lib/**/README.md',
              ...Array.from(developmentLibraryImportsArray).flatMap((name) => [
                '--ignore',
                `lib/${name}`
              ])
            ],
            {
              env: { NODE_ENV: `production-${moduleSystem}` },
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
              inputExtension,
              '--out-dir',
              './dist/src',
              '--out-file-extension',
              outputExtension,
              ...(isInMonorepo ? ['--root-mode', 'upward'] : [])
            ],
            {
              env: { NODE_ENV: `production-${moduleSystem}` },
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          )
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

          const mainBinFile = findMainBinFile(runtimeContext);
          assert(mainBinFile, ErrorMessage.GuruMeditation());

          const binFiles = Object.values(binConfig);
          const binFileInodes = await Promise.all(
            binFiles.map(async (path) => {
              assert(path, ErrorMessage.GuruMeditation());
              return stat(path).then(({ ino }) => ino);
            })
          );

          await Promise.all([
            ...(prependShebang
              ? Array.from(new Set(binFileInodes)).map(async (inode) => {
                  // ? We go through all this to avoid race conditions where we
                  // ? might end up writing to the same file
                  const path = binFiles.at(binFileInodes.indexOf(inode));
                  assert(path, ErrorMessage.GuruMeditation());
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
              assert(path, ErrorMessage.GuruMeditation());

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

      async function discoverProductionLibraryImports(files: string[], iteration = 0) {
        const debugImportLister_ = debugImportLister.extend(`iter-${iteration}`);

        debugImportLister_('evaluating files: %O', files);

        const libraryImports = await Promise.all(
          files.map(async (path, index) => {
            const debugImportLister__ = debugImportLister_.extend(`file-${index}`);
            const importLister = createImportsListerPlugin();

            debugImportLister__('evaluating file: %O', path);

            await transformFileAsync(path, {
              configFile: false,
              plugins: [importLister.plugin],
              presets: [
                [
                  '@babel/preset-typescript',
                  {
                    allowDeclareFields: true,
                    // ? This needs to be here or unused imports are elided
                    onlyRemoveTypeImports: true
                  }
                ]
              ]
            });

            debugImportLister__(
              'imports seen (%O): %O',
              importLister.state.size,
              importLister.state
            );

            const result = Array.from(importLister.state)
              .filter((path) => path.startsWith('multiverse'))
              .map((path) => path.slice('multiverse/'.length));

            debugImportLister__(
              'sliced lib imports seen (%O): %O',
              result.length,
              result
            );

            return result;
          })
        );

        debug('libImports: %O', libraryImports);

        for (const importPaths of libraryImports) {
          importPaths.forEach((importPath) => {
            const libraryDir = libraryDirectoriesArray.find((dir) =>
              importPath.startsWith(dir)
            );

            if (libraryDir) {
              productionLibraryImports.add(libraryDir);
            }
          });
        }

        debug(`end-of-iteration prodLibImports: %O`, productionLibraryImports);
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
