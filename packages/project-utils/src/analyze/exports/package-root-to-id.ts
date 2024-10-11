import { basename } from 'node:path';

import { type AbsolutePath, ensurePathIsAbsolute } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link packageRootToId}
 */
export type PackageRootToIdOptions = {
  /**
   * The absolute path to the root directory of a package in a monorepo.
   */
  packageRoot: AbsolutePath;
};

function packageRootToId_(
  shouldRunSynchronously: false,
  { packageRoot }: PackageRootToIdOptions
): Promise<string>;
function packageRootToId_(
  shouldRunSynchronously: true,
  { packageRoot }: PackageRootToIdOptions
): string;
function packageRootToId_(
  shouldRunSynchronously: boolean,
  { packageRoot }: PackageRootToIdOptions
): Promisable<string> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path: packageRoot });
    return toId();
  } else {
    return ensurePathIsAbsolute({ path: packageRoot }).then(() => toId());
  }

  function toId() {
    const rootBasename = basename(packageRoot);

    return (
      rootBasename.endsWith('/') || rootBasename.endsWith('\\')
        ? rootBasename.slice(0, -1)
        : rootBasename
    ).replaceAll(/[^\da-z-]/gi, '-');
  }
}

/**
 * Asynchronously determine the package-id of a package in a monorepo from the
 * path to the package's root directory.
 *
 * Any character that is not alphanumeric will be replaced with a hyphen (-) in
 * the resulting package-id. If `packageRoot` ends in a path separator
 * character, it is trimmed off.
 */
export function packageRootToId(...args: ParametersNoFirst<typeof packageRootToId_>) {
  return packageRootToId_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace packageRootToId {
  /**
   * Synchronously determine the package-id of a package in a monorepo from the
   * path to the package's root directory.
   *
   * Any character that is not alphanumeric will be replaced with a hyphen (-) in
   * the resulting package-id. If `packageRoot` ends in a path separator
   * character, it is trimmed off.
   */
  export const sync = function (...args) {
    return packageRootToId_(true, ...args);
  } as SyncVersionOf<typeof packageRootToId>;
}
