import { PackageJsonNotParsableError } from '#project-utils src/error.ts';
import { readJson } from '#project-utils src/fs/exports/read-json.ts';
import { type AbsolutePath } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { PackageJson, Promisable } from 'type-fest';

/**
 * @see {@link readPackageJsonAtRoot}
 */
export type ReadPackageJsonAtRootOptions = {
  /**
   * The absolute path to the root directory of a package:
   * `${root}/package.json` must exist.
   */
  root: AbsolutePath;
};

function readPackageJsonAtRoot_(
  shouldRunSynchronously: false,
  options: ReadPackageJsonAtRootOptions
): Promise<PackageJson>;
function readPackageJsonAtRoot_(
  shouldRunSynchronously: true,
  options: ReadPackageJsonAtRootOptions
): PackageJson;
function readPackageJsonAtRoot_(
  shouldRunSynchronously: boolean,
  { root }: ReadPackageJsonAtRootOptions
): Promisable<PackageJson> {
  // ? readJson will check if the path is absolute for us
  const packageJsonPath = `${root}/package.json` as AbsolutePath;

  try {
    return (shouldRunSynchronously ? readJson.sync : readJson)({
      path: packageJsonPath
    }) as ReturnType<typeof readPackageJsonAtRoot_>;
  } catch (error) {
    throw new PackageJsonNotParsableError(packageJsonPath, error);
  }
}

/**
 * Asynchronously read in and parse the contents of a package.json file.
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
   */
  export const sync = function (...args) {
    return readPackageJsonAtRoot_(true, ...args);
  } as SyncVersionOf<typeof readPackageJsonAtRoot>;
}
