import { PackageJsonNotParsableError } from 'rootverse+project-utils:src/error.ts';
import { readJson } from 'rootverse+project-utils:src/fs/read-json.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { PackageJson, Promisable } from 'type-fest';

/**
 * @see {@link readPackageJsonAtRoot}
 */
export type ReadPackageJsonAtRootOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The caching behavior of this function is identical to that of
   * {@link readJson}.
   */
  useCached: boolean;
};

function readPackageJsonAtRoot_(
  shouldRunSynchronously: false,
  packageRoot: AbsolutePath,
  options: ReadPackageJsonAtRootOptions
): Promise<PackageJson>;
function readPackageJsonAtRoot_(
  shouldRunSynchronously: true,
  packageRoot: AbsolutePath,
  options: ReadPackageJsonAtRootOptions
): PackageJson;
function readPackageJsonAtRoot_(
  shouldRunSynchronously: boolean,
  packageRoot: AbsolutePath,
  { useCached }: ReadPackageJsonAtRootOptions
): Promisable<PackageJson> {
  // ? readJson will check if the path is absolute for us
  const packageJsonPath = `${packageRoot}/package.json` as AbsolutePath;

  try {
    return (shouldRunSynchronously ? readJson.sync : readJson)(packageJsonPath, {
      useCached
    }) as ReturnType<typeof readPackageJsonAtRoot_>;
  } catch (error) {
    throw new PackageJsonNotParsableError(packageJsonPath, error);
  }
}

/**
 * Asynchronously read in and parse the contents of a package.json file.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_ mean results will strictly equal each other. See `useCached` in this specific function's options for details.** To fetch fresh results,
 * set the `useCached` option to `false` or clear the internal cache with
 * {@link cache.clear}.
 *
 * @see {@link readJson} (the function that actually does the reading/caching)
 */
export function readPackageJsonAtRoot(
  ...args: ParametersNoFirst<typeof readPackageJsonAtRoot_>
) {
  return readPackageJsonAtRoot_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readPackageJsonAtRoot {
  /**
   * Synchronously read in and parse the contents of a package.json file.
   *
   * **NOTE: the result of this function is memoized! This does NOT _necessarily_ mean results will strictly equal each other. See `useCached` in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   *
   * @see {@link readJson} (the function that actually does the reading/caching)
   */
  export const sync = function (...args) {
    return readPackageJsonAtRoot_(true, ...args);
  } as SyncVersionOf<typeof readPackageJsonAtRoot>;
}
