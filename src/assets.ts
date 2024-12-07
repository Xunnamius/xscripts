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
   *
   * Note that it's usually better to specify a string literal rather than reuse
   * `asset` when defining a {@link TransformerResult}.
   */
  asset: string;
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
   * @see {@link ProjectMetadata}.
   */
  projectMetadata: ProjectMetadata;
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
 * Takes an object of name-path pairs, each representing the name of a template
 * and the path to its contents (relative to the template asset directory), and
 * returns that same object with each path value replaced by the result of
 * calling {@link compileTemplate} with said path as an argument.
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
) {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:config-template`
  });

  debug('rawTemplate: %O', rawTemplate);

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

  debug('compiledTemplate: %O', compiledTemplate);
  return compiledTemplate;
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
