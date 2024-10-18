import { join as joinPath, relative as toRelativePath } from 'node:path';

import { glob as globAsync, sync as globSync } from 'glob-gitignore';

import {
  _internalPackageSrcFilesCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

import {
  debug as debug_,
  type RootPackage,
  type WorkspacePackage
} from '#project-utils src/analyze/common.ts';

import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { type AbsolutePath, type RelativePath } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link gatherPackageSrcFiles}
 */
export type GatherPackageSrcFilesOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `gatherPackageSrcFiles` will be cached regardless of
   * `useCached`. `useCached` determines if the cached result will be returned
   * or recomputed on subsequent calls.
   *
   * @default true
   */
  useCached?: boolean;
  /**
   * Exclude paths from the result with respect to the patterns in `ignore`,
   * which are interpreted according to gitignore rules.
   *
   * These .gitignore rules are interpreted relative to the _project root_.
   */
  ignore?: (string | RelativePath)[];
};

function gatherPackageSrcFiles_(
  shouldRunSynchronously: false,
  pkg: RootPackage | WorkspacePackage,
  options?: GatherPackageSrcFilesOptions
): Promise<AbsolutePath[]>;
function gatherPackageSrcFiles_(
  shouldRunSynchronously: true,
  pkg: RootPackage | WorkspacePackage,
  options?: GatherPackageSrcFilesOptions
): AbsolutePath[];
function gatherPackageSrcFiles_(
  shouldRunSynchronously: boolean,
  pkg: RootPackage | WorkspacePackage,
  { useCached = true, ignore = [] }: GatherPackageSrcFilesOptions = {}
): Promisable<AbsolutePath[]> {
  const debug = debug_.extend('gatherPackageSrcFiles');

  debug('pkg: %O', pkg);

  if (useCached && _internalPackageSrcFilesCache.has(pkg)) {
    cacheDebug('cache hit!');
    const cachedResult = _internalPackageSrcFilesCache.get(pkg)!;
    debug('reusing cached resources: %O', cachedResult);
    return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
  } else {
    cacheDebug('cache miss');
  }

  const srcFiles: AbsolutePath[] = [];
  const { root: pkgRoot } = pkg;

  const projectRoot =
    'projectMetadata' in pkg ? pkg.projectMetadata.project.root : pkg.root;

  const sourceGlob = toRelativePath(projectRoot, joinPath(pkgRoot, 'src/**/*'));

  debug('project root: %O', projectRoot);
  debug('src glob: %O', sourceGlob);

  if (shouldRunSynchronously) {
    runSynchronously();
    return srcFiles;
  } else {
    return runAsynchronously().then(() => srcFiles);
  }

  async function runAsynchronously() {
    srcFiles.push(
      ...((await globAsync(sourceGlob, {
        ignore,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      })) as AbsolutePath[])
    );

    finalize();
  }

  function runSynchronously() {
    srcFiles.push(
      ...(globSync(sourceGlob, {
        ignore,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as AbsolutePath[])
    );

    finalize();
  }

  function finalize() {
    debug('src files: %O', srcFiles);

    if (!srcFiles.length) {
      throw new ProjectError(ErrorMessage.EmptyOrMissingSrcDir(pkgRoot));
    }

    if (useCached || !_internalPackageSrcFilesCache.has(pkg)) {
      _internalPackageSrcFilesCache.set(pkg, srcFiles);
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }
}

/**
 * Asynchronously constructs and returns an array of {@link AbsolutePath}s, one
 * for each file under the provided package's `src/` directory.
 *
 * @see {@link clearInternalCache}
 */
export function gatherPackageSrcFiles(
  ...args: ParametersNoFirst<typeof gatherPackageSrcFiles_>
) {
  return gatherPackageSrcFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPackageSrcFiles {
  /**
   * Synchronously constructs and returns an array of {@link AbsolutePath}s, one
   * for each file under the provided package's `src/` directory.
   *
   * @see {@link clearInternalCache}
   */
  export const sync = function (...args) {
    return gatherPackageSrcFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageSrcFiles>;
}
