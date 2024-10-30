import {
  type Package,
  type ProjectMetadata
} from 'rootverse+project-utils:src/analyze/common.ts';

import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import {
  ensurePathIsAbsolute,
  type AbsolutePath
} from 'rootverse+project-utils:src/fs.ts';
import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link pathToPackage}
 */
export type PathToPackageOptions = {
  /**
   * The absolute path from which this function performs its upward search for a
   * package root.
   */
  path: AbsolutePath;
  /**
   * The project within which the returned package exists.
   */
  projectMetadata: ProjectMetadata;
};

function pathToPackage_(
  shouldRunSynchronously: false,
  { projectMetadata, path }: PathToPackageOptions
): Promise<Package>;
function pathToPackage_(
  shouldRunSynchronously: true,
  { projectMetadata, path }: PathToPackageOptions
): Package;
function pathToPackage_(
  shouldRunSynchronously: boolean,
  { path, projectMetadata }: PathToPackageOptions
): Promisable<Package> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path });
    return toPackage();
  } else {
    return ensurePathIsAbsolute({ path }).then(() => toPackage());
  }

  function toPackage() {
    const { rootPackage, subRootPackages } = projectMetadata;

    if (subRootPackages) {
      const subrootPackage = subRootPackages.all.find(({ root: packageRoot }) => {
        return path.startsWith(packageRoot);
      });

      if (subrootPackage) {
        return subrootPackage;
      }
    }

    if (path.startsWith(rootPackage.root)) {
      return rootPackage;
    }

    throw new ProjectError(ErrorMessage.PathOutsideRoot(path));
  }
}

/**
 * Asynchronously resolve `path` to the first package that contains that path.
 * If `path` points to a location outside of the project, an error is thrown.
 */
export function pathToPackage(...args: ParametersNoFirst<typeof pathToPackage_>) {
  return pathToPackage_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace pathToPackage {
  /**
   * Synchronously resolve `path` to the first package that contains that path.
   * If `path` points to a location outside of the project, an error is thrown.
   */
  export const sync = function (...args) {
    return pathToPackage_(true, ...args);
  } as SyncVersionOf<typeof pathToPackage>;
}
