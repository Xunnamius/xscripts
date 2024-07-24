import { CliError, FrameworkExitCode } from '@black-flag/core';
import mergeWith from 'lodash.mergewith';

import { globalDebuggerNamespace } from 'universe/constant';
import { ErrorMessage } from 'universe/error';
import { isNonEmptyString } from 'universe/util';

import { createDebugLogger } from 'multiverse/rejoinder';

import type { EmptyObject, Promisable } from 'type-fest';

/**
 * The `MergeWithCustomizer` type from lodash's {@link mergeWith}.
 */
export type MergeWithCustomizer = Parameters<typeof mergeWith<unknown, unknown>>[2];

/**
 * A collection of key-value pairs that will always be available via a
 * transformer's context.
 */
export type RequiredTransformerContext = {
  /**
   * The value of the `name` parameter passed to {@link retrieveAsset}.
   */
  name: string;
};

export const requiredTransformerContextKeys = ['name'];

/**
 * A union of well-known context keys. You should extract common
 * {@link TransformerContext} keys from this option, e.g.
 * `Pick<StandardTransformerContext, 'packageName' | 'repoUrl'>;`
 */
export type StandardTransformerContext = {
  /**
   * From `package.json`
   */
  packageName: string;
  /**
   * From `package.json`
   */
  packageDescription: string;
  packageBuildDetailsShort: string;
  packageBuildDetailsLong: string;
  /**
   * The contents of a potential top-level heading
   */
  prettyName: string;
  repoName: string;
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
};

/**
 * The xscripts project init-time (or renovate-time) context object passed
 * directly to each transformer. Will be wrapped with {@link Partial}.
 */
export type TransformerContext = Record<string, string>;

/**
 * Options to tweak the runtime of {@link makeTransformer} at xscripts project
 * init-time (or renovate-time).
 */
export type TransformerOptions = EmptyObject;

/**
 * A mapping between relative file paths and the contents of said files. These
 * files will be created and/or overwritten at xscripts project init-time (or
 * renovate-time).
 */
export type TransformerResult = Promisable<{
  [fileRelativePath: string]: string;
}>;

/**
 * Retrieve an asset via its filename. For example, to retrieve an
 * `eslint.config.js` file (the transformer source for which exists in
 * `./config/_eslint.config.js.ts`), pass `"eslint.config.js"` as the `name`
 * parameter.
 *
 * Throws if no corresponding transformer for `name` can be found.
 *
 * Expects an xscripts project init-time (or renovate-time) context object (i.e.
 * {@link TransformerContext} + {@link RequiredTransformerContext}).
 */
export async function retrieveAsset({
  name,
  context,
  options = {}
}: {
  name: string;
  context: TransformerContext & RequiredTransformerContext;
  options?: TransformerOptions;
}): Promise<TransformerResult> {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:retrieveAsset`
  });

  const transformerPath = `./config/_${name}.js`;

  debug('retrieving asset');
  debug('transformerPath: %O', transformerPath);

  try {
    const { transformer } = (await import(transformerPath)) as Awaited<
      ReturnType<typeof makeTransformer>
    >;

    debug('transformer import succeeded. Executing transformer...');

    return await transformer(context, options);
  } catch (error) {
    throw new CliError(ErrorMessage.RetrievalFailed(transformerPath), {
      cause: error
    });
  }
}

/**
 * Create a transformer function that takes a custom {@link TransformerContext}
 * instance, and an optional {@link TransformerOptions}, and returns a
 * {@link TransformerResult}.
 */
export function makeTransformer<
  CustomTransformContext extends TransformerContext = TransformerContext
>({
  transform
}: {
  transform: (
    context: Partial<CustomTransformContext> &
      RequiredTransformerContext &
      TransformerOptions
  ) => TransformerResult;
}) {
  return {
    transformer(
      this: void,
      context: Partial<CustomTransformContext> & RequiredTransformerContext,
      options: TransformerOptions = {}
    ) {
      return transform({ ...context, ...options });
    }
  };
}

/**
 * Asserts `record` (a `Record<string, unknown>`) is actually a `Record<string,
 * string> & RequiredTransformerContext` that contains each string in
 * `expectedKeys` as a property with a non-empty string value.
 */
export function assertIsExpectedTransformerContext<
  T extends Record<string, unknown>,
  const U extends string[] = never[]
>(record: T, expectedKeys?: U) {
  [...(expectedKeys ?? []), ...requiredTransformerContextKeys].forEach((key) => {
    const value = record[key];
    if (!isNonEmptyString(value)) {
      throw new CliError(ErrorMessage.BadAssetContextKey(key), {
        suggestedExitCode: FrameworkExitCode.AssertionFailed
      });
    }
  });

  return record as unknown as Record<U[number], string> & RequiredTransformerContext;
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
