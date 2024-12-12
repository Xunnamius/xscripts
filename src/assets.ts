import { readdir } from 'node:fs/promises';

import { CliError } from '@black-flag/core';
import mergeWith from 'lodash.mergewith';

import { type ExtendedDebugger } from 'multiverse+debug';
import { type ProjectAttribute, type ProjectMetadata } from 'multiverse+project-utils';

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
import type { RenovationPreset } from 'universe:commands/project/renovate.ts';

const debug_ = createDebugLogger({ namespace: globalDebuggerNamespace });

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
 * An asset maps an absolute output path and the function that generates content
 * to output.
 */
export type Asset = { path: AbsolutePath; generate: () => Promisable<string> };

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
 */
export type TransformerContext = {
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
   * The value of the `asset` parameter passed to
   * {@link gatherAssetsFromTransformer} and related functions.
   *
   * For transformers returning a single asset, this can be used to construct
   * the asset path.
   */
  asset: string;
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
   * A relevant {@link RenovationPreset} or `undefined` when generic versions of
   * assets should be generated.
   */
  targetAssetsPreset: RenovationPreset | undefined;
  /**
   * @see {@link ProjectMetadata}
   */
  projectMetadata: ProjectMetadata;

  /**
   * The markdown badge references that are standard for every xscripts-powered
   * project.
   *
   * GFM and GitHub-supported HTML is allowed.
   */
  badges: string;
  /**
   * `package.json::name`.
   */
  packageName: string;
  /**
   * `package.json::version`.
   */
  packageVersion: string;
  /**
   * `package.json::description`.
   */
  packageDescription: string;
  /**
   * A short description of distributables.
   *
   * **This context variable can be defined as a string array which will offer
   * the user several choices that they must narrow down manually.** To avoid
   * noisy diffs during renovation, the user's choice should correspond with
   * their choice in {@link TransformerContext.packageBuildDetailsLong}.
   */
  packageBuildDetailsShort: string | string[];
  /**
   * A technical description of distributables.
   *
   * **This context variable can be defined as a string array which will offer
   * the user several choices that they must narrow down manually.** To avoid
   * noisy diffs during renovation, the user's choice should correspond with
   * their choice in {@link TransformerContext.packageBuildDetailsShort}.
   */
  packageBuildDetailsLong: string | string[];
  /**
   * The value of the singular H1 heading at the top of a package's `README.md`
   * file.
   *
   * Do not rely on this string being a valid package name as it may contain any
   * manner of symbol or punctuation.
   */
  titleName: string;
  /**
   * The name of the repository on GitHub or other service.
   *
   * This string is always a URL-safe and valid GitHub repository name.
   */
  repoName: string;
  /**
   * The repository type.
   *
   * @see {@link ProjectAttribute}
   */
  repoType:
    | ProjectAttribute.Polyrepo
    | ProjectAttribute.Monorepo
    | ProjectAttribute.Hybridrepo;
  /**
   * The url of the repository on GitHub or other service.
   */
  repoUrl: string;
  /**
   * The url of the repository on Snyk.
   */
  repoSnykUrl: string;
  /**
   * The entry point (url) of the repository's documentation.
   */
  repoReferenceDocs: string;
  /**
   * The url of the repository's license.
   */
  repoReferenceLicense: string;
  /**
   * The url to create a new issue against the repository.
   */
  repoReferenceNewIssue: string;
  /**
   * The url to create a new PR against the repository.
   */
  repoReferencePrCompare: string;
  /**
   * The url of the repository's `README.md` file.
   */
  repoReferenceSelf: string;
  /**
   * The url of a donation/sponsorship service associated with the repository.
   */
  repoReferenceSponsor: string;
  /**
   * The url of the repository's `CONTRIBUTING.md` file.
   */
  repoReferenceContributing: string;
  /**
   * The url of the repository's `SUPPORT.md` file.
   */
  repoReferenceSupport: string;
  /**
   * The url of the all-contributors repository
   */
  repoReferenceAllContributors: string;
  /**
   * The url of the all-contributors emoji key
   */
  repoReferenceAllContributorsEmojis: string;
  /**
   * The well-known badge-specific reference definitions used in `{{badges}}`.
   */
  repoReferenceDefinitionsBadge: string;
  /**
   * The well-known package-specific reference definitions used throughout this
   * context object.
   *
   * **During renovation, the string value of this context key depends on the
   * version of
   * {@link TransformerContext.packageBuildDetailsLong}/{@link TransformerContext.packageBuildDetailsShort}
   * found in the existing document.**
   */
  repoReferenceDefinitionsPackage: string;
  /**
   * The well-known repo-specific reference definitions throughout this context
   * object.
   */
  repoReferenceDefinitionsRepo: string;
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
 * (and their lazily-generated contents) conditioned on the current context;
 * e.g.: when running `npx xscripts project renovate --regenerate-assets
 * --assets-preset=lib`.
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

              let contents = (await wrappedGenerate())[
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
 *
 * Some template variables accept an optional `linkText` parameter which, if
 * given, will be replaced by a link of the form `[linkText](contextual-value)`;
 * e.g. `{{variableName:link text}}` will be replaced with `[link
 * text](variableName's-contextual-value)`.
 *
 * Other template variables (defined as arrays) return multiple choices that the
 * user must manually narrow, similar to a merge conflict in git. See
 * {@link TransformerContext} for which template variables are affected.
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
 *
 * Some template variables accept an optional `linkText` parameter which, if
 * given, will be replaced by a link of the form `[linkText](contextual-value)`;
 * e.g. `{{variableName:link text}}` will be replaced with `[link
 * text](variableName's-contextual-value)`.
 *
 * Other template variables (defined as arrays) return multiple choices that the
 * user must manually narrow, similar to a merge conflict in git. See
 * {@link TransformerContext} for which template variables are affected.
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
 * Takes a string and returns that string with all handlebars-style template
 * variables (e.g. `{{variableName}}`) with matching keys in `TemplateContext`
 * replaced with their contextual values.
 *
 * Some template variables accept an optional `linkText` parameter which, if
 * given, will be replaced by a link of the form `[linkText](contextual-value)`;
 * e.g. `{{variableName:link text}}` will be replaced with `[link
 * text](variableName's-contextual-value)`.
 *
 * Other template variables (defined as arrays) return multiple choices that the
 * user must manually narrow, similar to a merge conflict in git. See
 * {@link TransformerContext} for which template variables are affected.
 */
export function compileTemplateInMemory(
  rawTemplate: string,
  context: TransformerContext
): string {
  const debug = debug_.extend('config-template');

  debug(
    'raw template from transformer %O (~%O bytes): %O',
    context.asset,
    rawTemplate.length,
    rawTemplate
  );

  // eslint-disable-next-line unicorn/no-array-reduce
  const compiledTemplate = Object.entries(context).reduce((result, [key, value]) => {
    if (typeof value === 'string') {
      return result.replaceAll(
        new RegExp(`{{${key}(?:|:|:(.+?(?=}})))}}`, 'g'),
        (_matchText, linkText: string | undefined) => {
          return linkText ? `[${linkText}](${value})` : value;
        }
      );
    } else if (Array.isArray(value)) {
      return result.replaceAll(
        `{{${key}}}`,
        `
<!-- TODO: Choose one of the following and ✄ delete ✄ the others: -->

${value.join('\n\n---✄---\n\n')}
`.trim()
      );
    }

    return result;
  }, rawTemplate);

  debug(
    'compiled template size for transformer %O: ~%O bytes',
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
      { ...transformerContext, asset: transformerId },
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
