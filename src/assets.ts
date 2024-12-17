/* eslint-disable unicorn/prevent-abbreviations */
import { readdir } from 'node:fs/promises';

import { CliError } from '@black-flag/core';
import getInObject from 'lodash.get';
import mergeWith from 'lodash.mergewith';

import { type ExtendedDebugger } from 'multiverse+debug';
import { type ProjectMetadata } from 'multiverse+project-utils';
import { type RawAliasMapping } from 'multiverse+project-utils:alias.ts';

import {
  toAbsolutePath,
  toPath,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger, type ExtendedLogger } from 'multiverse+rejoinder';

import { type DefaultGlobalScope } from 'universe:configure.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';
import { readFile } from 'universe:util.ts';

import type { EmptyObject, Entry, Promisable } from 'type-fest';

const debug_ = createDebugLogger({ namespace: globalDebuggerNamespace });

/**
 * The Symbol represents an asset to be deleted and can be returned as the
 * result of an {@link Asset.generate} function instead of normal string
 * content.
 */
export const $delete = Symbol.for('xscripts-delete-file-at-path');

/**
 * The directory containing files exporting functions that transform
 * {@link TransformerContext} instances into reified asset strings.
 *
 * @see {@link TransformerContext}
 */
export const directoryAssetTransformers = toAbsolutePath(
  __dirname,
  'assets',
  'transformers'
);

/**
 * The directory containing asset templates.
 *
 * @see {@link TransformerContext}
 */
export const directoryAssetTemplates = toAbsolutePath(__dirname, 'assets', 'templates');

// TODO: ensure no usage of hardAssert, softAssert, or CliError in src/assets/*
// TODO: (use eslint esquery for this)

/**
 * These presets determine which assets will be returned by which transformers
 * when they're invoked. By specifying a preset, only the assets it represents
 * will be generated. All others will be ignored.
 *
 * See the xscripts wiki for details.
 */
export enum AssetPreset {
  /**
   * Represents the most basic assets necessary for xscripts to be fully
   * functional.
   *
   * This preset is the basis for all others and can be used on any
   * xscripts-compliant project when returning only a subset of files are
   * desired.
   *
   * See the xscripts wiki for details.
   */
  Basic = 'basic',
  /**
   * Represents the standard assets for an xscripts-compliant command-line
   * interface project (such as `@black-flag/core`-powered tools like `xscripts`
   * itself).
   *
   * See the xscripts wiki for details.
   */
  Cli = 'cli',
  /**
   * Represents the standard assets for an xscripts-compliant library project
   * built for both CJS and ESM consumers (such as the case with
   * `@black-flag/core`) and potentially also browser and other consumers as
   * well.
   *
   * See the xscripts wiki for details.
   */
  Lib = 'lib',
  /**
   * Represents the standard assets for an xscripts-compliant library project
   * built exclusively for ESM and ESM-compatible consumers (such as the case
   * with the `unified-utils` monorepo).
   *
   * See the xscripts wiki for details.
   */
  LibEsm = 'lib-esm',
  /**
   * Represents the standard assets for an xscripts-compliant library project
   * built exclusively for ESM consumers operating in a browser-like runtime
   * (such as the case with the `next-utils` monorepo).
   *
   * See the xscripts wiki for details.
   */
  LibWeb = 'lib-web',
  /**
   * Represents the standard assets for an xscripts-compliant React project.
   *
   * See the xscripts wiki for details.
   */
  React = 'react',
  /**
   * Represents the standard assets for an xscripts-compliant Next.js + React
   * project.
   *
   * See the xscripts wiki for details.
   */
  Nextjs = 'nextjs'
}

/**
 * @see {@link AssetPreset}
 */
export const assetPresets = Object.values(AssetPreset);

/**
 * The presets for libraries and library-like projects (such as
 * {@link AssetPreset.Cli}). Also includes `undefined`, signifying a lack of
 * preset.
 */
export const libAssetPresets = [
  undefined,
  AssetPreset.Cli,
  AssetPreset.Lib,
  AssetPreset.LibEsm,
  AssetPreset.LibWeb
];

/**
 * The presets for react and react-based projects (such as
 * {@link AssetPreset.Cli}). Also includes `undefined`, signifying a lack of
 * preset.
 */
export const reactAssetPresets = [undefined, AssetPreset.React, AssetPreset.Nextjs];

/**
 * An _asset_ maps an absolute output path and a function that generates output.
 */
export type Asset = {
  path: AbsolutePath;
  generate: () => Promisable<string | typeof $delete>;
};

/**
 * An input function that accepts a {@link TransformerContext} and returns one
 * or more {@link Asset}s.
 */
export type Transform = (this: void, context: TransformerContext) => Promisable<Asset[]>;

/**
 * An object comprised of `path`-`generate` entries from one or more
 * {@link Asset}s.
 */
export type ReifiedAssets = { [assetPath: Asset['path']]: Asset['generate'] };

/**
 * A function that accepts a {@link TransformerContext} and returns one or more
 * {@link Asset}s.
 */
export type Transformer = (
  this: void,
  context: TransformerContext,
  options?: MakeTransformerOptions
) => Promise<ReifiedAssets>;

/**
 * An object containing a {@link Transformer} and related context/helpers.
 *
 * Rather than tediously construct such an object manually, consider using
 * {@link makeTransformer}.
 */
export type TransformerContainer = {
  transformer: Transformer;
};

/**
 * A union of well-known context keys passed directly to each transformer
 * {@link Transformer}.
 *
 * **INSTANCES OF `TransformerContext` MUST NOT CONTAIN ANY SENSITIVE
 * INFORMATION!**
 */
export type TransformerContext = {
  /**
   * The value of the `asset` parameter passed to
   * {@link gatherAssetsFromTransformer} and related functions.
   *
   * For transformers returning a single asset, this can be used to construct
   * the asset path.
   */
  asset: string;

  /**
   * Global logging function.
   */
  log: ExtendedLogger;
  /**
   * Global debugging function.
   */
  debug: ExtendedDebugger;

  /**
   * Takes a {@link RelativePath}-like object and joins it to `rootPackage.root`
   * from {@link ProjectMetadata}.
   */
  toProjectAbsolutePath: (...pathsLike: (RelativePath | string)[]) => AbsolutePath;
  /**
   * Takes a {@link RelativePath}-like object and joins it to `cwdPackage.root`
   * from {@link ProjectMetadata}.
   */
  toPackageAbsolutePath: (...pathsLike: (RelativePath | string)[]) => AbsolutePath;

  /**
   * Whether or not to derive aliases and inject them into the configuration.
   */
  shouldDeriveAliases: boolean;
  /**
   * The scope to consider when determining which assets to return.
   */
  scope: DefaultGlobalScope;
  /**
   * Whether or not to overwrite certain files (such as .env) in a potentially
   * destructive way.
   */
  forceOverwritePotentiallyDestructive: boolean;
  /**
   * A relevant {@link AssetPreset} or `undefined` when generic versions of
   * assets should be generated.
   */
  assetPreset: AssetPreset | undefined;
  /**
   * @see {@link ProjectMetadata}
   */
  projectMetadata: ProjectMetadata;
  /**
   * An array of {@link RawAliasMapping}s that will be included when deriving
   * aliases during content generation.
   */
  additionalRawAliasMappings: RawAliasMapping[];

  /**
   * The owner of the repository on GitHub or other service.
   *
   * This string is always a URL-safe and valid GitHub repository owner.
   */
  repoOwner: string;
  /**
   * The name of the repository on GitHub or other service.
   *
   * This string is always a URL-safe and valid GitHub repository name.
   */
  repoName: string;
  /**
   * The year as shown in various generated documents like `LICENSE.md`.
   */
  year: string;
};

/**
 * Options to tweak the runtime of {@link makeTransformer}.
 */
export type MakeTransformerOptions = {
  /**
   * Whether the generated asset contents should be trimmed and how.
   *
   * @default 'both-then-append-newline'
   */
  trimContents?: 'start' | 'end' | 'both' | 'both-then-append-newline' | false;
};

/**
 * Options to tweak the runtime of {@link gatherAssetsFromTransformer} and
 * related functions.
 */
export type GatherAssetsFromTransformerOptions = {
  /**
   * Whether an attempt should be made to retrieve a transformer file ending in
   * `.js` versus `.ts`.
   *
   * This is primarily useful in situations where we do not have access to the
   * transpiled `.js` versions of the source `.ts` files.
   *
   * @default 'js'
   */
  transformerFiletype?: 'js' | 'ts';
};

/**
 * A looser version of {@link TransformerContext} used when constructing custom
 * transformer contexts.
 *
 * **INSTANCES OF `IncomingTransformerContext` MUST NOT CONTAIN ANY SENSITIVE
 * INFORMATION!**
 *
 * @see {@link TransformerContext}
 */
export type IncomingTransformerContext = Omit<TransformerContext, 'asset'>;

/**
 * Retrieve one or more assets, conditioned on `transformerContext`, by invoking
 * a single transformer. For example, to retrieve the `eslint.config.mjs` asset
 * file and its generated contents, the transformer source for which exists in
 * `${directoryAssetTransformers}/_eslint.config.mjs.ts`, pass
 * `"eslint.config.mjs"` as `transformerId`.
 *
 * Note that it cannot be assumed that the `transformerId` and the filename of
 * the returned asset will always be the same, nor can it be assumed that a
 * transformer returns only a single asset.
 *
 * This function returns a {@link ReifiedAssets} instance or throws if no
 * corresponding transformer for `transformerId` can be found.
 *
 * @see {@link gatherAssetsFromAllTransformers}
 */
export async function gatherAssetsFromTransformer({
  transformerId,
  transformerContext,
  options: _options = {}
}: {
  transformerId: string;
  transformerContext: IncomingTransformerContext;
  options?: MakeTransformerOptions & GatherAssetsFromTransformerOptions;
}): Promise<ReifiedAssets> {
  const debug = debug_.extend('gather-asset');
  const { transformerFiletype: assetContainerFiletype = 'js', ...options } = _options;

  debug('assetContainerFiletype: %O', assetContainerFiletype);
  debug('transformerId: %O', transformerId);

  const transformerPath = toPath(
    directoryAssetTransformers,
    `_${transformerId}.${assetContainerFiletype}`
  );

  return invokeTransformerAndReifyAssets({
    debug,
    options,
    transformerContext,
    transformerId,
    transformerPath
  });
}

/**
 * Retrieve all available assets conditioned on `transformerContext`. Since
 * computing asset file contents are deferred until the generator function is
 * called, calling this function is **quick and safe** and will _not_
 * immediately load a bunch of assets into memory.
 *
 * @see {@link gatherAssetsFromTransformer}
 */
export async function gatherAssetsFromAllTransformers({
  transformerContext,
  options = {}
}: {
  transformerContext: IncomingTransformerContext;
  options?: MakeTransformerOptions;
}): Promise<ReifiedAssets> {
  const debug = debug_.extend('gather-assets');
  const reifiedAssetPromises = [] as Promise<ReifiedAssets>[];

  for (const transformerBasename of await readdir(directoryAssetTransformers)) {
    if (
      transformerBasename.endsWith('.d.ts') ||
      (!transformerBasename.endsWith('.js') && !transformerBasename.endsWith('.ts'))
    ) {
      debug('ignored potential transformer file (basename): %O', transformerBasename);
      continue;
    }

    const transformerPath = toPath(directoryAssetTransformers, transformerBasename);
    const transformerId = transformerBasename.slice(1, -3);

    debug('transformerBasename: %O', transformerBasename);
    debug('transformerId: %O', transformerId);

    reifiedAssetPromises.push(
      invokeTransformerAndReifyAssets({
        debug,
        options,
        transformerContext,
        transformerId,
        transformerPath
      })
    );
  }

  return Object.assign({}, ...(await Promise.all(reifiedAssetPromises)));
}

/**
 * Accepts a {@link Transform} function and returns a
 * {@link TransformerContainer} containing a single {@link Transformer}.
 *
 * {@link Transformer}s are responsible for returning only relevant asset paths
 * (and their lazily-generated contents) conditioned on the current context.
 */
export function makeTransformer(transform: Transform): TransformerContainer {
  return {
    async transformer(context, { trimContents } = {}) {
      const debug = debug_.extend('make-transformer');

      return Object.fromEntries(
        (await transform(context)).map(({ path, generate: wrappedGenerate }) => {
          return [
            path,
            async function generate() {
              debug.message('generating contents of asset: %O', path);
              let contents = await wrappedGenerate();

              if (typeof contents === 'string') {
                contents =
                  contents[
                    trimContents === 'start'
                      ? 'trimStart'
                      : trimContents === 'end'
                        ? 'trimEnd'
                        : trimContents === false
                          ? 'toString'
                          : 'trim'
                  ]();

                if (
                  trimContents === 'both-then-append-newline' ||
                  trimContents === undefined
                ) {
                  contents += '\n';
                }
              }

              return contents;
            }
          ];
        })
      );
    }
  };
}

/**
 * This function takes an object of absolute path keys with relative path
 * values; each pair represents an output path and an input path relative to the
 * template asset directory. This function returns a {@link ReifiedAssets}
 * instance with values that lazily invoke {@link compileTemplate}.
 */
export async function compileTemplates(
  templates: Record<AbsolutePath, RelativePath>,
  context: TransformerContext
): Promise<Asset[]> {
  const debug = debug_.extend('compile-templates');

  const templatesEntries = Object.entries(templates) as Entry<typeof templates>[];
  debug('templatesEntries: %O', templatesEntries);

  return templatesEntries.map(([outputPath, inputPath]) => ({
    path: outputPath,
    generate: () => compileTemplate(inputPath, context)
  }));
}

/**
 * Takes a path relative to the `src/assets/templates` directory and returns the
 * template at that path with all handlebars-style template variables (e.g.
 * `{{variableName}}`) with matching keys in `TemplateContext` replaced with
 * their contextual values.
 */
export async function compileTemplate(
  templatePath: RelativePath,
  context: TransformerContext
): Promise<string> {
  const debug = debug_.extend('compile-template');

  const templatePathActual = toPath(directoryAssetTemplates, templatePath);

  debug('retrieving template asset');
  debug('templatePath: %O', templatePath);
  debug('templatePathActual: %O', templatePathActual);

  return compileTemplateInMemory(await readFile(templatePathActual), context);
}

/**
 * Takes a string and returns that string with all handlebars-style "template
 * variables" (e.g. `{{variableName}}`) with matching keys in `TemplateContext`
 * replaced with their contextual values. All such values are stringified using
 * `String(value)`. Object-valued variables can have their properties referenced
 * using dot notation, i.e.: `{{variableName.prop.sub-prop.length}}`.
 *
 * Template variables accept an optional `linkText` parameter which, if given,
 * will be replaced by a link of the form `[linkText](contextual-value)`. The
 * parameter is separated from the key by a colon, e.g. `{{variableName:link
 * text}}` will be replaced with `[link text](variableName's-contextual-value)`.
 */
export function compileTemplateInMemory(
  rawTemplate: string,
  context: TransformerContext
): string {
  const debug = debug_.extend('config-template');

  debug(
    'compiling raw template from transformer %O (~%O bytes): %O',
    context.asset,
    rawTemplate.length,
    rawTemplate
  );

  // eslint-disable-next-line unicorn/no-array-reduce
  const compiledTemplate = Object.entries(context).reduce((result, [key, value]) => {
    return result
      .replaceAll(
        new RegExp(`{{${key}(\\.[^:|}]+)?(?:|:|:(.+?(?=}})))}}`, 'g'),
        (_matchText, query: string | undefined, linkText: string | undefined) => {
          const actualValue = String(query ? getInObject(value, query.slice(1)) : value);
          // ! `value` may be sensitive, so do not output it in logs
          debug('found and replaced %O template variable', key + (query || ''));
          return linkText ? `[${linkText}](${actualValue})` : actualValue;
        }
      )
      .replaceAll(
        new RegExp(`{{${key}(\\.[^:|}]+)?(?:\\|(.+?(?=}})))}}`, 'g'),
        (_matchText, query: string | undefined, defaultText: string) => {
          const actualValue = query ? getInObject(value, query.slice(1)) : value;
          // ! `value` may be sensitive, so do not output it in logs
          debug(
            'found and replaced %O conditional template variable',
            key + (query || '')
          );
          return actualValue ? String(actualValue) : defaultText;
        }
      );
  }, rawTemplate);

  debug(
    'final compiled template size for transformer %O: ~%O bytes',
    context.asset,
    compiledTemplate.length
  );

  return compiledTemplate;
}

/**
 * The `MergeWithCustomizer` type from lodash's {@link mergeWith}.
 */
export type MergeWithCustomizer = Parameters<typeof mergeWith<unknown, unknown>>[2];

/**
 * A thin wrapper around lodash's {@link mergeWith} that does not mutate
 * `originalConfiguration`.
 */
export function deepMergeConfig<ConfigurationType>(
  originalConfiguration: ConfigurationType,
  overwrites: ConfigurationType | EmptyObject = {},
  customReplacer?: MergeWithCustomizer
): ConfigurationType {
  return mergeWith({}, originalConfiguration, overwrites, customReplacer);
}

async function invokeTransformerAndReifyAssets({
  debug,
  transformerPath,
  transformerContext,
  transformerId,
  options
}: {
  debug: ExtendedDebugger;
  transformerPath: AbsolutePath;
  transformerContext: IncomingTransformerContext;
  transformerId: string;
  options: MakeTransformerOptions & GatherAssetsFromTransformerOptions;
}) {
  try {
    debug('importing transformer from: %O', transformerPath);
    const { transformer } = (await import(transformerPath)) as Awaited<
      ReturnType<typeof makeTransformer>
    >;

    debug('invoking transformer from: %O', transformerPath);
    const reifiedAssets = await transformer(
      {
        ...transformerContext,
        asset: transformerId
      },
      options
    );

    debug('transformer %O returned assets: %O', transformerPath, reifiedAssets);
    return reifiedAssets;
  } catch (error) {
    throw new CliError(ErrorMessage.AssetRetrievalFailed(transformerPath), {
      cause: error
    });
  }
}
