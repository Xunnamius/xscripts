/* eslint-disable no-await-in-loop */
import assert from 'node:assert';
import { chmod, rename, symlink } from 'node:fs/promises';
import { dirname } from 'node:path';

import { transformFileAsync } from '@babel/core';
import { type ChildConfiguration } from '@black-flag/core';
import uniqueFilename from 'unique-filename';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { wellKnownCliDistPath } from 'universe/constant';

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

import { getRunContext } from '@projector-js/core/project';
import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { SHORT_TAB } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';
import { ErrorMessage } from 'universe/error';

export type CustomCliArguments = GlobalCliArguments & {
  generateTypes: boolean;
  linkCliIntoBin: boolean;
};

export default function command({ log, debug_, state }: GlobalExecutionContext) {
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
    }
  });

  return {
    aliases: ['dist'],
    builder,
    description: 'Transpile source and assets into production-ready distributables',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      generateTypes,
      linkCliIntoBin,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      const debugImportLister = debug.extend('import-lister');

      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });

      debug('generateTypes: %O', generateTypes);
      debug('linkCliIntoBin: %O', linkCliIntoBin);

      genericLogger([LogTag.IF_NOT_QUIETED], 'Building project distributables...');

      debug('calculating metadata');

      const {
        context,
        project: {
          // ? This does NOT end in a slash and this must be taken into account!
          root: rootDir,
          json: rootPkg
        }
      } = getRunContext();

      debug('rootDir: %O', rootDir);
      debug('rootPkg: %O', rootPkg);

      const [
        { attributes },
        {
          tsFiles: { src: tsSrcFiles, lib: tsLibraryFiles },
          pkgFiles: { lib: libraryPkgFiles }
        },
        { default: createImportsListerPlugin }
      ] = await Promise.all([
        getProjectMetadata(),
        findProjectFiles(),
        import('babel-plugin-list-imports')
      ]);

      // TODO: replace relevant tasks with listr2

      const libraryDirPrefix = `${rootDir}/lib/`;
      const productionLibraryImports = new Set<string>();

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

      if (generateTypes) {
        genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Generating types');

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
        await run('npx', ['tsconfig-replace-paths', '--project', 'tsconfig.types.json'], {
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        });

        if (context === 'monorepo') {
          // TODO
          genericLogger([LogTag.IF_NOT_QUIETED], `${SHORT_TAB}Organizing types`);
          genericLogger([LogTag.IF_NOT_QUIETED], `${SHORT_TAB}Refactoring types`);
        }
      } else {
        debug('skipped type generation');
      }

      genericLogger([LogTag.IF_NOT_QUIETED], '⮞ Building distributables');

      debug('building root lib');
      await run(
        'npx',
        [
          'babel',
          ...Array.from(productionLibraryImports).map((name) => `${rootDir}/lib/${name}`),
          '--extensions',
          '.ts',
          '--out-dir',
          './dist/lib',
          '--out-file-extension',
          '.js',
          '--ignore',
          'lib/**/*.test.ts',
          '--ignore',
          'lib/**/README.md'
        ],
        {
          env: { NODE_ENV: 'production-cjs' },
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }
      );

      debug('building root dist');
      await run(
        'npx',
        [
          'babel',
          'src',
          '--extensions',
          '.ts',
          '--out-dir',
          './dist/src',
          '--out-file-extension',
          '.js'
        ],
        {
          env: { NODE_ENV: 'production-cjs' },
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }
      );

      if (
        attributes.includes(ProjectMetaAttribute.Cli) &&
        linkCliIntoBin &&
        rootPkg.bin &&
        rootPkg.name
      ) {
        genericLogger(
          [LogTag.IF_NOT_QUIETED],
          '⮞ Adding executable entry to node_modules/.bin'
        );

        debug('symlinking and chmod-ing cli.js into node_modules based on bin config');

        const binConfig =
          typeof rootPkg.bin === 'string' ? { [rootPkg.name]: rootPkg.bin } : rootPkg.bin;

        await Promise.all([
          ...Object.entries(binConfig).map(async ([name, path]) => {
            assert(path, ErrorMessage.GuruMeditation());

            const temporaryPath = uniqueFilename(`${rootDir}/node_modules/.bin`);
            const realPath = `${rootDir}/node_modules/.bin/${name}`;

            debug('intermediate symlink path: %O', temporaryPath);

            await symlink(path, temporaryPath);
            await rename(temporaryPath, realPath);

            genericLogger([LogTag.IF_NOT_QUIETED], `${SHORT_TAB}${path} ⮕ ${realPath}`);
          }),
          chmod(wellKnownCliDistPath, 0o775).then(() =>
            genericLogger(
              [LogTag.IF_NOT_QUIETED],
              `${SHORT_TAB}chmod 0775 ${wellKnownCliDistPath}`
            )
          )
        ]);
      } else {
        debug('skipped symlinking and chmod-ing cli.js');
      }

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
