/* eslint-disable no-await-in-loop */
import { dirname } from 'node:path';

import { transformFileAsync } from '@babel/core';
import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';

import {
  ProjectMetaAttribute,
  findProjectFiles,
  getProjectMetadata
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
import { run } from 'multiverse/run';

export type CustomCliArguments = GlobalCliArguments & {
  // TODO
};

export default function command({
  log,
  debug_,
  state,
  hush: isHushed,
  quiet: isQuieted
}: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'link-cli-into-bin': {
      boolean: true,
      description: 'Soft-link "bin" entries in package.json into node_modules/.bin',
      default: true
    }
  });

  return {
    aliases: ['dist'],
    builder,
    description: 'Transpile source and assets into production-ready distributables',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      const debugImportLister = debug.extend('import-lister');

      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Building project distributables...');

      const [
        { attributes },
        {
          tsFiles: { src: tsSrcFiles, lib: tsLibraryFiles },
          pkgFiles: { root: rootPkgFile, lib: libraryPkgFiles }
        },
        { default: createImportsListerPlugin }
      ] = await Promise.all([
        getProjectMetadata(),
        findProjectFiles(),
        import('babel-plugin-list-imports')
      ]);

      // TODO: replace with listr2

      genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Generating types');

      // await run(
      //   'npx',
      //   ['tsc', '--project', 'tsconfig.types.json', '--incremental', 'false'],
      //   {
      //     env: { NODE_ENV: 'production' },
      //     stdout: isHushed ? 'ignore' : 'inherit',
      //     stderr: isQuieted ? 'ignore' : 'inherit'
      //   }
      // );

      // await run('npx', ['tsconfig-replace-paths', '--project', 'tsconfig.types.json'], {
      //   stdout: isHushed ? 'ignore' : 'inherit',
      //   stderr: isQuieted ? 'ignore' : 'inherit'
      // });

      //attributes.includes(ProjectMetaAttribute.Cli)
      void ProjectMetaAttribute, attributes, isHushed, isQuieted, run;

      genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Organizing types');
      genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Refactoring types');
      genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Building distributables');

      // ? This does NOT end in a slash and this must be taken into account!
      const rootDir = dirname(rootPkgFile);
      const libraryDirPrefix = `${rootDir}/lib/`;
      const productionLibraryImports = new Set<string>();

      debug('rootDir: %O', rootDir);
      debug('libDirPrefix: %O', rootDir);

      const libraryDirectories = Array.from(
        new Set(
          libraryPkgFiles.map((path) => dirname(path).slice(libraryDirPrefix.length))
        )
      );

      debug('libDirs: %O', libraryDirectories);

      // ? Results are stored into prodLibImports
      await discoverProductionLibraryImports(tsSrcFiles);

      // ? Iteratively check each newly added prod lib import for potentially
      // ? more prod lib imports to be added. Keep checking until we don't add
      // ? anymore.
      for (
        let previousProductionLibraryImportsSize = 0, iteration = 1;
        previousProductionLibraryImportsSize !== productionLibraryImports.size;
        previousProductionLibraryImportsSize = productionLibraryImports.size, iteration++
      ) {
        debugImportLister(
          'prevProdLibImportsSize (%O) !== prodLibImports.size (%O), iterating again...',
          previousProductionLibraryImportsSize,
          productionLibraryImports.size
        );

        // ? Thankfully TC39 had the foresight to make sets enumerable  in
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

      // await run(
      //   'npx',
      //   ['babel', '--project', 'tsconfig.types.json', '--incremental', 'false'],
      //   {
      //     env: { NODE_ENV: 'production-cjs' },
      //     stdout: isHushed ? 'ignore' : 'inherit',
      //     stderr: isQuieted ? 'ignore' : 'inherit'
      //   }
      // );

      genericLogger(
        [LogTag.IF_NOT_QUIETED],
        '⮞ Adding executable entry to node_modules/.bin'
      );

      // TODO (build command for next projects needs to use NODE_ENV=production)
      //
      // TODO (differentiate between lib and lib-dev automatically depending on
      // TODO which lib packages are imported in /src/* files and which are not.
      // TODO This also has implications for babel/build config too)

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
            const libraryDir = libraryDirectories.find((dir) =>
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
