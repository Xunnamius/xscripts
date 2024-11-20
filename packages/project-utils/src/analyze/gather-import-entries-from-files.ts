import assert from 'node:assert';

import { hasExtensionAcceptedByBabel } from '@-xun/scripts/assets/config/babel.config.cjs';
import { type PluginObj, type TransformOptions } from '@babel/core';

import {
  createMetadataAccumulatorPlugin,
  type Options as AccumulatorOptions,
  type PluginAndAccumulator
} from 'multiverse+babel-plugin-metadata-accumulator';

import { debug as debug_ } from 'rootverse+project-utils:src/analyze/common.ts';
import { cache, CacheScope } from 'rootverse+project-utils:src/cache.ts';
import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { Promisable } from 'type-fest';

const debug = debug_.extend('gatherImportEntriesFromFiles');

/**
 * An entry mapping an absolute file path to a single import/require
 * specifier present in said file.
 */
export type ImportSpecifier = [filepath: AbsolutePath, specifier: string];

/**
 * An entry mapping an absolute file path to an array of import/require
 * specifiers present in said file.
 *
 * @see {@link gatherImportEntriesFromFiles}
 */
export type ImportSpecifiersEntry = [filepath: AbsolutePath, specifiers: Set<string>];

/**
 * @see {@link gatherImportEntriesFromFiles}
 */
export type GatherImportEntriesFromFilesOptions = AccumulatorOptions & {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * **WARNING: the results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal (`===`) each other.**
   * However, each {@link ImportSpecifiersEntry} tuple within the returned
   * results _will_ strictly equal each other, respectively.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: false,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): Promise<ImportSpecifiersEntry[]>;
function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: true,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): ImportSpecifiersEntry[];
function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: boolean,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): Promisable<ImportSpecifiersEntry[]> {
  const { useCached, ...cacheIdComponentsObject } = options;
  debug('evaluating files: %O', files);

  let babel: ReturnType<typeof getBabel>;
  let plugin: PluginAndAccumulator['plugin'];
  let accumulator: PluginAndAccumulator['accumulator'];

  if (shouldRunSynchronously) {
    const importSpecifiersEntries = files.map((path, index) => {
      const dbg = debug.extend(`file-${index}`);
      dbg('evaluating file: %O', path);

      if (hasExtensionAcceptedByBabel(path)) {
        if (useCached) {
          const cachedEntry = cache.get(CacheScope.GatherImportEntriesFromFiles, [
            path,
            cacheIdComponentsObject
          ]);

          if (cachedEntry) {
            dbg('reusing cached resources: %O', cachedEntry);
            return cachedEntry;
          }
        }

        dbg('using babel to evaluate source file imports');

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!babel) {
          babel = getBabel();
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!plugin || !accumulator) {
          ({ plugin, accumulator } = createMetadataAccumulatorPlugin());
        }

        babel.transformFileSync(path, makeMinimalBabelConfigObject(plugin, options));

        const { imports } = accumulator.get(path) || {};
        assert(imports, ErrorMessage.GuruMeditation());

        dbg('imports seen (%O): %O', imports.size, imports);

        const entry: ImportSpecifiersEntry = [path, imports];

        cache.set(
          CacheScope.GatherImportEntriesFromFiles,
          [path, cacheIdComponentsObject],
          entry
        );

        return entry;
      } else {
        dbg('skipped using babel to evaluate asset');
        return [path, new Set()] satisfies ImportSpecifiersEntry;
      }
    });

    debug('import specifiers: %O', importSpecifiersEntries);
    return importSpecifiersEntries;
  } else {
    return Promise.resolve().then(async () => {
      const importSpecifiersEntries = await Promise.all(
        files.map(async (path, index) => {
          const dbg = debug.extend(`file-${index}`);
          dbg('evaluating file: %O', path);

          if (hasExtensionAcceptedByBabel(path)) {
            if (useCached) {
              const cachedEntry = cache.get(CacheScope.GatherImportEntriesFromFiles, [
                path,
                cacheIdComponentsObject
              ]);

              if (cachedEntry) {
                dbg('reusing cached resources: %O', cachedEntry);
                return cachedEntry;
              }
            }

            dbg('using babel to evaluate source file imports');

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!babel) {
              babel = getBabel();
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!plugin || !accumulator) {
              ({ plugin, accumulator } = createMetadataAccumulatorPlugin());
            }

            await babel.transformFileAsync(
              path,
              makeMinimalBabelConfigObject(plugin, options)
            );

            const { imports } = accumulator.get(path) || {};
            assert(imports, ErrorMessage.GuruMeditation());

            dbg('imports seen (%O): %O', imports.size, imports);

            const entry: ImportSpecifiersEntry = [path, imports];

            cache.set(
              CacheScope.GatherImportEntriesFromFiles,
              [path, cacheIdComponentsObject],
              entry
            );

            return entry;
          } else {
            dbg('skipped using babel to evaluate asset');
            return [path, new Set()] satisfies ImportSpecifiersEntry;
          }
        })
      );

      debug('import specifiers: %O', importSpecifiersEntries);
      return importSpecifiersEntries;
    });
  }
}

/**
 * Accepts zero or more file paths and asynchronously returns an array of
 * {@link ImportSpecifiersEntry}s each mapping a given file path to an array of
 * import/require specifiers present in said file.
 *
 * This function relies on Babel internally and ignores all configuration files.
 * All paths passed to this function that cannot be parsed as TSX/TS/JS (via
 * extension check) will be treated as if they have 0 imports.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherImportEntriesFromFiles(
  ...args: ParametersNoFirst<typeof gatherImportEntriesFromFiles_>
) {
  return gatherImportEntriesFromFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherImportEntriesFromFiles {
  /**
   * Accepts zero or more file paths and synchronously returns an array of
   * {@link ImportSpecifiersEntry}s each mapping a given file path to an array
   * of import/require specifiers present in said file.
   *
   * This function relies on Babel internally and ignores all configuration
   * files. All paths passed to this function that cannot be parsed as TSX/TS/JS
   * (via extension check) will be treated as if they have 0 imports.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherImportEntriesFromFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherImportEntriesFromFiles>;
}

function getBabel() {
  try {
    // ? Ensure these are importable
    //void require('@babel/plugin-syntax-import-attributes');
    void require('@babel/plugin-syntax-typescript');
    // ? Return what we're really interested in
    return require('@babel/core') as typeof import('@babel/core');
  } catch (error) {
    debug('failed to import @babel/core: %O', error);
    throw new ProjectError(
      ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
    );
  }
}

function makeMinimalBabelConfigObject(
  plugin: PluginObj,
  pluginOptions: AccumulatorOptions
): TransformOptions {
  return {
    configFile: false,
    generatorOpts: { importAttributesKeyword: 'with' },
    plugins: [
      //'@babel/plugin-syntax-import-attributes',
      [
        '@babel/plugin-syntax-typescript',
        { disallowAmbiguousJSXLike: false, isTSX: true }
      ],
      [plugin, pluginOptions]
    ]
  };
}
