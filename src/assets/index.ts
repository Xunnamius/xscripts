import { CliError } from '@black-flag/core';

import { globalDebuggerNamespace } from 'universe/constant';
import { ErrorMessage } from 'universe/error';
import { isNonEmptyString } from 'universe/util';

import { createDebugLogger } from 'multiverse/rejoinder';

import type { Promisable } from 'type-fest';

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
 * The context object passed directly to each transformer. Will be wrapped with
 * {@link Partial}.
 */
export type TransformerContext = Record<string, string>;

/**
 * Options to tweak the runtime of {@link makeTransformer}.
 */
export type TransformerOptions = {
  //
};

/**
 * A mapping between relative file paths and the contents of said files. These
 * files can then be created and/or overwritten at the discretion of the caller.
 */
export type TransformerResult = Promisable<{
  [fileRelativePath: string]: string;
}>;

/**
 * Retrieve an asset via its filename. For example, to retrieve an
 * `.eslintrc.js` file (the transformer source for which exists in
 * `./configs/_.eslintrc.js.ts`), pass `".eslintrc.js"` as the `name` parameter.
 *
 * Throws if no corresponding transformer for `name` can be found.
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

  const transformerPath = `./configs/_${name}.js`;

  debug('retrieving asset');
  debug('transformerPath: %O', transformerPath);

  try {
    const { transformer } = (await import(transformerPath)) as Awaited<
      ReturnType<typeof makeTransformer>
    >;

    debug('transformer import succeeded. Executing transformer...');

    return await transformer(context, options);
  } catch (error) {
    throw new CliError(ErrorMessage.AssertRetrievalFailed(transformerPath), {
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
      context: Partial<CustomTransformContext> & RequiredTransformerContext,
      options: TransformerOptions = {}
    ) {
      return transform({ ...context, ...options });
    }
  };
}

/**
 * Asserts `record` (a `Record<string, unknown>`) is actually a `Record<string,
 * string>`.
 */
export function assertIsNonEmptyStrings<T extends Record<string, unknown>>(
  record: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
  Object.entries(record).forEach(([key, value]) => {
    if (!isNonEmptyString(value)) {
      throw new CliError(ErrorMessage.AssertionFailureIsEmptyString(key));
    }
  });

  return record as ReturnType<typeof assertIsNonEmptyStrings<T>>;
}
