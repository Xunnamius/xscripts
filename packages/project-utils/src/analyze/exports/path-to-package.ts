import {
  type RootPackage,
  type WorkspacePackage,
  type ProjectMetadata
} from 'multiverse#project-utils analyze/common.ts';

import { ProjectError, ErrorMessage } from '#project-utils src/error.ts';
import { type AbsolutePath, ensurePathIsAbsolute } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

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
): Promise<RootPackage | WorkspacePackage>;
function pathToPackage_(
  shouldRunSynchronously: true,
  { projectMetadata, path }: PathToPackageOptions
): RootPackage | WorkspacePackage;
function pathToPackage_(
  shouldRunSynchronously: boolean,
  { path, projectMetadata }: PathToPackageOptions
): Promisable<RootPackage | WorkspacePackage> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path });
    return toPackage();
  } else {
    return ensurePathIsAbsolute({ path }).then(() => toPackage());
  }

  function toPackage() {
    const { project: rootPkg } = projectMetadata;
    const { packages } = rootPkg;

    if (packages) {
      const pkg = packages.all.find(({ root: pkgRoot }) => path.startsWith(pkgRoot));

      if (pkg) {
        return pkg;
      }
    }

    if (path.startsWith(rootPkg.root)) {
      return rootPkg;
    }

    throw new ProjectError(ErrorMessage.PathOutsideRoot(path));
  }
}

/**
 * Asynchronously resolve path` to the first sub-root package that contains that
 * path. If no sub-root packages contain `path` but the root package does, it
 * will be returned instead. If `path` points to a location outside of the
 * repository, an error is thrown.
 */
export function pathToPackage(...args: ParametersNoFirst<typeof pathToPackage_>) {
  return pathToPackage_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace pathToPackage {
  /**
   * Synchronously resolve path` to the first sub-root package that contains
   * that path. If no sub-root packages contain `path` but the root package
   * does, it will be returned instead. If `path` points to a location outside
   * of the repository, an error is thrown.
   */
  export const sync = function (...args) {
    return pathToPackage_(true, ...args);
  } as SyncVersionOf<typeof pathToPackage>;
}
