import {
  type Package,
  type ProjectMetadata
} from 'rootverse+project-utils:src/analyze/common.ts';

import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';

/**
 * Synchronously resolve `path` to the first package that contains that path.
 * If `path` points to a location outside of the project, an error is thrown.
 */
export function pathToPackage(
  path: AbsolutePath,
  projectMetadata: ProjectMetadata
): Package {
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
