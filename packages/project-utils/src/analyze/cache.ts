import {
  debug as debug_,
  type Package,
  type PackageBuildTargets,
  type PackageFiles,
  type ProjectFiles,
  type ProjectMetadata
} from '#project-utils src/analyze/common.ts';

import { type AbsolutePath } from '#project-utils src/fs/index.ts';

export const cacheDebug = debug_.extend('cache');

/**
 * A mapping between project root paths and {@link ProjectMetadata} instances.
 */
export const _internalProjectMetadataCache = new Map<AbsolutePath, ProjectMetadata>();

/**
 * A mapping between {@link ProjectMetadata} instances and {@link ProjectFiles}
 * instances.
 */
export const _internalProjectFilesCache = new Map<ProjectMetadata, ProjectFiles>();

/**
 * A mapping between {@link Package} instances and {@link PackageBuildTargets}
 * instances.
 */
export const _internalPackageBuildTargetsCache = new Map<Package, PackageBuildTargets>();

/**
 * A mapping between {@link Package} instances and {@link AbsolutePath} array
 * instances.
 */
export const _internalPackageFilesCache = new Map<Package, PackageFiles>();

/**
 * Clear one or more internal caches. Mostly useful in a testing context.
 */
export function clearInternalCache({
  gatherProjectFiles = true,
  gatherPackageFiles = true,
  gatherPackageBuildTargets = true,
  analyzeProjectStructure = true
}: {
  gatherProjectFiles?: boolean;
  gatherPackageFiles?: boolean;
  gatherPackageBuildTargets?: boolean;
  analyzeProjectStructure?: boolean;
} = {}) {
  if (gatherProjectFiles) {
    cacheDebug('internal gatherProjectFiles cache cleared');
    _internalProjectFilesCache.clear();
  }

  if (gatherPackageFiles) {
    cacheDebug('internal gatherPackageFiles cache cleared');
    _internalPackageFilesCache.clear();
  }

  if (gatherPackageBuildTargets) {
    cacheDebug('internal gatherPackageBuildTargets cache cleared');
    _internalPackageBuildTargetsCache.clear();
  }

  if (analyzeProjectStructure) {
    cacheDebug('internal analyzeProjectStructure cache cleared');
    _internalProjectMetadataCache.clear();
  }
}
