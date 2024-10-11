import { type AbsolutePath } from '#project-utils src/fs/index.ts';

import {
  debug as debug_,
  type WorkspacePackage,
  type MonorepoMetadata,
  type PolyrepoMetadata,
  type ProjectFiles,
  type PackageBuildTargets,
  type ProjectMetadata,
  type RootPackage
} from '#project-utils src/analyze/common.ts';

export const cacheDebug = debug_.extend('cache');

/**
 * A mapping between project root paths and {@link ProjectMetadata} instances.
 */
export const _internalProjectMetadataCache = new Map<
  AbsolutePath,
  MonorepoMetadata | PolyrepoMetadata
>();

/**
 * A mapping between {@link ProjectMetadata} instances and {@link ProjectFiles}
 * instances.
 */
export const _internalProjectFilesCache = new Map<ProjectMetadata, ProjectFiles>();

/**
 * A mapping between {@link WorkspacePackage} instances and
 * {@link PackageBuildTargets} instances.
 */
export const _internalPackageBuildTargetsCache = new Map<
  WorkspacePackage | RootPackage,
  PackageBuildTargets
>();

/**
 * A mapping between {@link ProjectMetadata} instances and {@link AbsolutePath}
 * array instances.
 */
export const _internalPackageSrcFilesCache = new Map<
  WorkspacePackage | RootPackage,
  AbsolutePath[]
>();

/**
 * Clear one or more internal caches. Mostly useful in a testing context.
 */
export function clearInternalCache({
  analyzeProjectStructure = true,
  gatherProjectFiles = true,
  gatherPackageBuildTargets = true,
  gatherPackageSrcFiles = true
}: {
  analyzeProjectStructure?: boolean;
  gatherProjectFiles?: boolean;
  gatherPackageBuildTargets?: boolean;
  gatherPackageSrcFiles?: boolean;
} = {}) {
  if (analyzeProjectStructure) {
    cacheDebug('internal analyzeProjectStructure cache cleared');
    _internalProjectMetadataCache.clear();
  }

  if (gatherProjectFiles) {
    cacheDebug('internal gatherProjectFiles cache cleared');
    _internalProjectFilesCache.clear();
  }

  if (gatherPackageBuildTargets) {
    cacheDebug('internal gatherPackageBuildTargets cache cleared');
    _internalPackageBuildTargetsCache.clear();
  }

  if (gatherPackageSrcFiles) {
    cacheDebug('internal gatherPackageSrcFiles cache cleared');
    _internalPackageSrcFilesCache.clear();
  }
}
