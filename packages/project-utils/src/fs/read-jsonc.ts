/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import * as JSONC from 'jsonc-parser';

import { cache, CacheScope } from 'rootverse+project-utils:src/cache.ts';
import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { JsonValue, Promisable } from 'type-fest';

export { JSONC };

/**
 * @see {@link readJsonc}
 */
export type ReadJsoncOptions = {
  /**
   * If `true`, so long as the `parse` function does not throw, this function
   * will return the result. Note that this could result in an incomplete or
   * corrupted (but syntactically sound) object.
   *
   * @default false
   */
  ignoreNonExceptionErrors?: boolean;
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * Unless `useCached` is `false`, the results returned by this function will
   * always strictly equal (`===`) each other with respect to call signature.
   *
   * @see {@link cache}
   */
  useCached: boolean;
  /**
   * @see {@link JSONC.parse}
   */
  parseOptions?: Parameters<typeof JSONC.parse>[2];
};

function readJsonc_<T>(
  shouldRunSynchronously: false,
  path: AbsolutePath,
  options: ReadJsoncOptions
): Promise<T>;
function readJsonc_<T>(
  shouldRunSynchronously: true,
  path: AbsolutePath,
  options: ReadJsoncOptions
): T;
function readJsonc_<T>(
  shouldRunSynchronously: boolean,
  path: AbsolutePath,
  { useCached, ...cacheIdComponentsObject }: ReadJsoncOptions
): Promisable<T> {
  const { ignoreNonExceptionErrors, parseOptions } = cacheIdComponentsObject;

  if (useCached) {
    const cachedResult = cache.get(CacheScope.ReadJsonc, [
      path,
      cacheIdComponentsObject
    ]) as T;

    if (cachedResult) {
      return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
    }
  }

  if (shouldRunSynchronously) {
    const rawJson = (() => {
      try {
        return readFileSync(path, 'utf8');
      } catch (error) {
        throw new ProjectError(ErrorMessage.NotReadable(path), { cause: error });
      }
    })();

    return parse(rawJson);
  } else {
    return readFileAsync(path, 'utf8').then(
      (rawJson) => {
        return parse(rawJson);
      },
      (error: unknown) => {
        throw new ProjectError(ErrorMessage.NotReadable(path), { cause: error });
      }
    );
  }

  function parse(rawJson: string): T {
    try {
      const errors: JSONC.ParseError[] = [];
      const result = JSONC.parse(rawJson, errors, parseOptions);

      if (!ignoreNonExceptionErrors && errors.length) {
        throw new Error('JSONC.parse returned with errors: ' + errors.join('; '));
      }

      cache.set(CacheScope.ReadJsonc, [path, cacheIdComponentsObject], result);
      return result;
    } catch (error) {
      throw new ProjectError(ErrorMessage.NotParsable(path, 'jsonc'), { cause: error });
    }
  }
}

/**
 * Asynchronously read in and parse the contents of an arbitrary JSONC file.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_ mean results will strictly equal each other. See `useCached` in this specific function's options for details.** To fetch fresh results,
 * set the `useCached` option to `false` or clear the internal cache with
 * {@link cache.clear}.
 */
export function readJsonc<T = JsonValue>(...args: ParametersNoFirst<typeof readJsonc_>) {
  return readJsonc_<T>(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readJsonc {
  /**
   * Synchronously read in and parse the contents of an arbitrary JSONC file.
   *
   * **NOTE: the result of this function is memoized! This does NOT _necessarily_ mean results will strictly equal each other. See `useCached` in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function <T = JsonValue>(
    ...args: ParametersNoFirst<typeof readJsonc_>
  ) {
    return readJsonc_<T>(true, ...args);
  } as SyncVersionOf<typeof readJsonc>;
}
