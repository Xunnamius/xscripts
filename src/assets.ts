import { CliError } from '@black-flag/core';
import mergeWith from 'lodash.mergewith';

import { type ProjectAttribute, type ProjectMetadata } from 'multiverse+project-utils';

import {
  toAbsolutePath,
  toPath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger } from 'multiverse+rejoinder';

import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';
import { readFile } from 'universe:util.ts';

import type { EmptyObject, Promisable } from 'type-fest';

/**
 * @see {@link TransformerContext}
 */
export const assetConfigDirectory = toAbsolutePath(__dirname, 'assets', 'config');

/**
 * @see {@link TransformerContext}
 */
export const assetTemplateDirectory = toAbsolutePath(__dirname, 'assets', 'template');

// TODO: ensure no usage of hardAssert, softAssert, or CliError in asset configs (use
// TODO: eslint esquery for this)

/**
 * The `MergeWithCustomizer` type from lodash's {@link mergeWith}.
 */
export type MergeWithCustomizer = Parameters<typeof mergeWith<unknown, unknown>>[2];

/**
 * A union of well-known context keys passed directly to each transformer (which
 * are returned by {@link makeTransformer}).
 */
export type TransformerContext = {
  /**
   * The value of the `asset` parameter passed to {@link retrieveConfigAsset}.
   */
  asset: string;
  /**
   * From `package.json`
   */
  packageName: string;
  /**
   * From `package.json`
   */
  packageVersion: string;
  /**
   * From `package.json`
   */
  packageDescription: string;
  packageBuildDetailsShort: string;
  packageBuildDetailsLong: string;
  projectMetadata: ProjectMetadata;
  /**
   * The contents of a potential top-level heading
   */
  prettyName: string;
  repoName: string;
  repoType:
    | ProjectAttribute.Polyrepo
    | ProjectAttribute.Monorepo
    | ProjectAttribute.Hybridrepo;
  repoUrl: string;
  repoSnykUrl: string;
  repoReferenceDocs: string;
  repoReferenceLicense: string;
  repoReferenceNewIssue: string;
  repoReferencePrCompare: string;
  repoReferenceSelf: string;
  repoReferenceSponsor: string;
  repoReferenceContributing: string;
  repoReferenceSupport: string;
  repoReferenceAllContributors: string;
  repoReferenceAllContributorsEmojis: string;
  repoReferenceDefinitionsBadge: string;
  repoReferenceDefinitionsPackage: string;
  repoReferenceDefinitionsRepo: string;
  /**
   * Whether or not to derive aliases and inject them into the configuration.
   */
  shouldDeriveAliases: boolean;
};

/**
 * Options to tweak the runtime of {@link makeTransformer}.
 */
export type TransformerOptions = {
  /**
   * Whether the resulting file contents should be trimmed and how.
   *
   * @default 'both-then-append-newline'
   */
  trimContents?: 'start' | 'end' | 'both' | 'both-then-append-newline' | false;
};

/**
 * Options to tweak the runtime of {@link retrieveConfigAsset}.
 */
export type RetrievalOptions = {
  /**
   * Whether an attempt should be made to retrieve an asset ending in `.js`
   * versus `.ts`.
   *
   * This is primarily useful in testing contexts where we do not have access to
   * the transpiled `.js` versions of the source `.ts` files.
   *
   * @default 'js'
   */
  assetContainerFiletype?: 'js' | 'ts';
};

/**
 * A mapping between file paths relative _to the project root_ and the contents
 * of said files.
 */
export type TransformerResult = Promisable<{
  [projectRootRelativePath: string]: string;
}>;

/**
 * Retrieve an asset via its identifier (typically a filename). For example, to
 * retrieve an `eslint.config.mjs` file, the transformer source for which exists
 * in `./config/_eslint.config.mjs.ts`, pass `"eslint.config.mjs"` as the
 * `asset` parameter.
 *
 * Throws if no corresponding transformer for `asset` can be found.
 *
 * Expects a full context object (i.e. {@link TransformerContext}).
 */
export async function retrieveConfigAsset({
  asset,
  context,
  options: _options = {}
}: {
  asset: string;
  context: Omit<TransformerContext, 'asset'>;
  options?: TransformerOptions & RetrievalOptions;
}): Promise<TransformerResult> {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:config-asset`
  });

  const { assetContainerFiletype = 'js', ...options } = _options;

  const transformerPath = toPath(
    assetConfigDirectory,
    `_${asset}.${assetContainerFiletype}`
  );

  debug('retrieving config asset');
  debug('transformerPath: %O', transformerPath);

  try {
    const { transformer } = (await import(transformerPath)) as Awaited<
      ReturnType<typeof makeTransformer>
    >;

    debug('transformer import succeeded. Executing transformer...');

    return await transformer({ ...context, asset }, options);
  } catch (error) {
    throw new CliError(ErrorMessage.AssetRetrievalFailed(transformerPath, error), {
      cause: error
    });
  }
}

/**
 * Takes a path relative to the `src/assets/template` directory and returns the
 * asset at that path with all handlebars-style template variables (e.g.
 * `{{variableName}}`) with matching keys in `TemplateContext` replaced with
 * their contextual values.
 */
export async function compileTemplate(
  templatePath: RelativePath,
  context: TransformerContext
) {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:config-template`
  });

  const templatePathActual = toPath(assetTemplateDirectory, templatePath);

  debug('retrieving template asset');
  debug('templatePath: %O', templatePath);
  debug('templatePathActual: %O', templatePathActual);

  return compileTemplateInMemory(await readFile(templatePathActual), context);
}

/**
 * Takes a string and returns that string with all handlebars-style template
 * variables (e.g. `{{variableName}}`) with matching keys in `TemplateContext`
 * replaced with their contextual values.
 */
export function compileTemplateInMemory(
  rawTemplate: string,
  context: TransformerContext
) {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:config-template`
  });

  debug('rawTemplate: %O', rawTemplate);

  // eslint-disable-next-line unicorn/no-array-reduce
  const compiledTemplate = Object.entries(context).reduce((result, [key, value]) => {
    // ? If caller wants to replace {{projectMetadata}} with [object Object],
    // ? that's their business.
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return result.replaceAll(`{{${key}}}`, String(value));
  }, rawTemplate);

  debug('compiledTemplate: %O', compiledTemplate);
  return compiledTemplate;
}

/**
 * Takes an object of name-path pairs, each representing the name of a template
 * and the path to its contents (relative to the template asset directory), and
 * returns that same object with each path value replaced by the result of
 * calling {@link compileTemplate} with said path as an argument.
 */
export async function compileTemplates(
  templates: Record<string, RelativePath>,
  context: TransformerContext
) {
  const finalTemplates = templates as Record<string, string>;

  await Promise.all(
    Object.entries(templates).map(async function ([name, path]) {
      const compiledTemplate = await compileTemplate(path, context);
      finalTemplates[name] = compiledTemplate;
    })
  );

  return finalTemplates;
}

/**
 * Create a transformer function that takes a custom {@link TransformerContext}
 * instance, and an optional {@link TransformerOptions}, and returns a
 * {@link TransformerResult}.
 */
export function makeTransformer({
  transform
}: {
  transform: (context: TransformerContext) => TransformerResult;
}) {
  return {
    async transformer(
      this: void,
      context: TransformerContext,
      { trimContents }: TransformerOptions = {}
    ) {
      const transformed = await transform(context);

      Object.entries(transformed).forEach(([file, fileContents]) => {
        transformed[file] =
          fileContents[
            trimContents === 'start'
              ? 'trimStart'
              : trimContents === 'end'
                ? 'trimEnd'
                : trimContents === false
                  ? 'toString'
                  : 'trim'
          ]();

        if (trimContents === 'both-then-append-newline' || trimContents === undefined) {
          transformed[file] += '\n';
        }
      });

      return transformed;
    }
  };
}

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
