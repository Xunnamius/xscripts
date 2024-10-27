import { relative as toRelativePath, resolve as toAbsolutePath } from 'node:path';

import { glob as globAsync, sync as globSync } from 'glob-gitignore';

import {
  _internalProjectFilesCache,
  cacheDebug,
  deriveCacheKeyFromPackageAndData
} from '#project-utils src/analyze/cache.ts';

import {
  assignResultTo,
  debug as debug_,
  type Package,
  type ProjectFiles,
  type ProjectMetadata
} from '#project-utils src/analyze/common.ts';

import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';

import {
  deriveVirtualPrettierignoreLines,
  type AbsolutePath
} from '#project-utils src/fs.ts';

import { type ParametersNoFirst } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

const packageJsonGlob = '**/package.json';
const markdownGlob = '**/*.md';
const typescriptGlob = 'src/**/*.{ts,tsx,mts,cts}';

/**
 * @see {@link gatherProjectFiles}
 */
export type GatherProjectFilesOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `gatherProjectFiles` will be cached regardless of
   * `useCached`. `useCached` determines if the cached result will be returned
   * or recomputed on subsequent calls.
   *
   * @default true
   */
  useCached?: boolean;
  /**
   * Will not error if an interesting `package.json` file uses unsupported
   * features.
   */
  ignoreUnsupportedFeatures?: boolean;
} & (
  | {
      /**
       * If `true`, use the project root's `.prettierignore` file exclusively to
       * filter out returned project files.
       *
       * Note that _`.gitignore`_ is never used to filter the result of
       * `gatherProjectFiles`.
       *
       * @default true
       */
      skipPrettierIgnored: false;
      /**
       * If `true`, completely ignore (never consider or return) files unknown
       * to git.
       *
       * Meaningless without `skipPrettierIgnored` also being `true`.
       *
       * @default false
       */
      skipUnknown?: false;
    }
  | {
      skipPrettierIgnored?: true;
      skipUnknown?: boolean;
    }
);

function gatherProjectFiles_(
  shouldRunSynchronously: false,
  projectMetadata: ProjectMetadata,
  options?: GatherProjectFilesOptions
): Promise<ProjectFiles>;
function gatherProjectFiles_(
  shouldRunSynchronously: true,
  projectMetadata: ProjectMetadata,
  options?: GatherProjectFilesOptions
): ProjectFiles;
function gatherProjectFiles_(
  shouldRunSynchronously: boolean,
  projectMetadata: ProjectMetadata,
  {
    useCached = true,
    skipPrettierIgnored = true,
    skipUnknown = false,
    ignoreUnsupportedFeatures = false
  }: GatherProjectFilesOptions = {}
): Promisable<ProjectFiles> {
  const debug = debug_.extend('gatherProjectFiles');
  const cacheKey = deriveCacheKeyFromPackageAndData(projectMetadata.rootPackage, {
    skipPrettierIgnored,
    skipUnknown,
    ignoreUnsupportedFeatures
  });

  if (shouldRunSynchronously && skipUnknown) {
    throw new ProjectError(ErrorMessage.DeriverAsyncConfigurationConflict());
  }

  const { rootPackage, subRootPackages: subRootPackagesMap } = projectMetadata;
  const subRootPackagesArray = Array.from(subRootPackagesMap?.values() || []);
  const projectRoot = rootPackage.root;

  if (useCached && _internalProjectFilesCache.has(cacheKey)) {
    cacheDebug('cache hit for %O', cacheKey);
    const cachedResult = _internalProjectFilesCache.get(cacheKey)!;
    debug('reusing cached resources: %O', cachedResult);
    return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
  } else {
    cacheDebug('cache miss for %O', cacheKey);
  }

  const projectFiles: ProjectFiles = {
    packageJsonFiles: {
      atProjectRoot: '/dev/null' as AbsolutePath,
      atWorkspaceRoot: new Map(),
      atAnyRoot: [],
      elsewhere: []
    },
    mainBinFiles: {
      atProjectRoot: '/dev/null' as AbsolutePath,
      atWorkspaceRoot: new Map(),
      atAnyRoot: []
    },
    markdownFiles: {
      inRoot: [],
      inWorkspace: new Map(),
      all: []
    },
    typescriptFiles: {
      inRootSrc: [],
      inWorkspaceSrc: new Map(),
      all: []
    }
  };

  const {
    packageJsonFiles,
    mainBinFiles: binFiles,
    markdownFiles,
    typescriptFiles
  } = projectFiles;

  if (shouldRunSynchronously) {
    runSynchronously();
    return projectFiles;
  } else {
    return runAsynchronously().then(() => projectFiles);
  }

  async function runAsynchronously() {
    initialize();

    const ignore = skipPrettierIgnored
      ? await deriveVirtualPrettierignoreLines({
          projectRoot,
          includeUnknownPaths: skipUnknown
        })
      : [];

    const ignoreAndPackages = appendWorkspacesToIgnore(ignore);

    debug('virtual .prettierignore lines (+ appended): %O', ignoreAndPackages);

    await Promise.all([
      globAsync(packageJsonGlob, {
        // ? Ignore "packages" and the relative path for every known
        // ? package.json file when populating packageJsonFiles.elsewhere
        ignore: appendPackageJsonFilesToIgnore(ignore),
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(packageJsonFiles, 'elsewhere')),

      globAsync(markdownGlob, {
        ignore: ignoreAndPackages,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(markdownFiles, 'inRoot')),

      Promise.all(
        subRootPackagesArray.map(async (package_) => {
          const paths = await globAsync(markdownGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: package_.root
          });

          return [package_.id, paths] as [string, string[]];
        })
      )
        .then((entries) => new Map(entries))
        .then(assignResultTo(markdownFiles, 'inWorkspace')),

      globAsync(typescriptGlob, {
        ignore: ignoreAndPackages,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(typescriptFiles, 'inRootSrc')),

      Promise.all(
        subRootPackagesArray.map(async (package_) => {
          const paths = await globAsync(typescriptGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: package_.root
          });

          return [package_.id, paths] as [string, string[]];
        })
      )
        .then((entries) => new Map(entries))
        .then(assignResultTo(typescriptFiles, 'inWorkspaceSrc'))
    ]);

    finalize();
  }

  function runSynchronously() {
    if (skipUnknown) {
      throw new ProjectError(ErrorMessage.DeriverAsyncConfigurationConflict());
    }

    initialize();

    const ignore = skipPrettierIgnored
      ? deriveVirtualPrettierignoreLines.sync({ projectRoot })
      : [];

    const ignoreAndPackages = appendWorkspacesToIgnore(ignore);

    debug('virtual .prettierignore lines (+ appended): %O', ignoreAndPackages);

    packageJsonFiles.elsewhere = globSync(packageJsonGlob, {
      // ? Ignore "packages" and the relative path for every known package.json
      // ? file when populating packageJsonFiles.elsewhere
      ignore: appendPackageJsonFilesToIgnore(ignore),
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    markdownFiles.inRoot = globSync(markdownGlob, {
      ignore: ignoreAndPackages,
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    markdownFiles.inWorkspace = new Map(
      subRootPackagesArray.map((package_) => {
        const paths = globSync(markdownGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: package_.root
        });

        return [package_.id, paths] as [string, AbsolutePath[]];
      })
    );

    typescriptFiles.inRootSrc = globSync(typescriptGlob, {
      ignore: ignoreAndPackages,
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    typescriptFiles.inWorkspaceSrc = new Map(
      subRootPackagesArray.map((package_) => {
        const paths = globSync(typescriptGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: package_.root
        });

        return [package_.id, paths] as [string, AbsolutePath[]];
      })
    );

    finalize();
  }

  function initialize() {
    if (
      !ignoreUnsupportedFeatures &&
      (rootPackage.json.directories ||
        subRootPackagesArray.some(({ json: { directories } }) => directories))
    ) {
      throw new ProjectError(
        ErrorMessage.UnsupportedFeature('the package.json "directories" field')
      );
    }

    packageJsonFiles.atProjectRoot = `${projectRoot}/package.json` as AbsolutePath;

    packageJsonFiles.atWorkspaceRoot = new Map(
      subRootPackagesArray.map((package_) => [
        package_.id,
        `${package_.root}/package.json` as AbsolutePath
      ])
    );

    packageJsonFiles.atAnyRoot = [packageJsonFiles.atProjectRoot].concat(
      Array.from(packageJsonFiles.atWorkspaceRoot.values())
    );
  }

  function finalize() {
    binFiles.atProjectRoot = resolveMainBinFile(rootPackage);

    binFiles.atWorkspaceRoot = new Map(
      subRootPackagesArray.map((package_) => [package_.id, resolveMainBinFile(package_)])
    );

    binFiles.atAnyRoot = [binFiles.atProjectRoot]
      .concat(Array.from(binFiles.atWorkspaceRoot.values()))
      .filter((v): v is NonNullable<typeof v> => !!v);

    markdownFiles.all = markdownFiles.inRoot.concat(
      Array.from(markdownFiles.inWorkspace.values()).flat()
    );

    typescriptFiles.all = typescriptFiles.inRootSrc.concat(
      Array.from(typescriptFiles.inWorkspaceSrc.values()).flat()
    );

    debug('project files: %O', projectFiles);

    if (useCached || !_internalProjectFilesCache.has(cacheKey)) {
      _internalProjectFilesCache.set(cacheKey, projectFiles);
      cacheDebug('cache entry %O updated', cacheKey);
    } else {
      cacheDebug('skipped updating cache entry %O', cacheKey);
    }
  }

  function resolveMainBinFile(package_: Package) {
    const { bin } = package_.json;
    const mainBin =
      typeof bin === 'string' ? bin : Object.values(bin ?? {}).find((path) => !!path);

    return mainBin ? (toAbsolutePath(package_.root, mainBin) as AbsolutePath) : undefined;
  }

  function appendWorkspacesToIgnore(ignore: string[]) {
    // ? Absolute paths in .git/.prettierignore are relative to project root
    return ignore.concat('/packages');
  }

  function appendPackageJsonFilesToIgnore(ignore: string[]) {
    // ? Absolute paths in .git/.prettierignore are relative to project root
    return ignore.concat(
      packageJsonFiles.atAnyRoot.map((path) => '/' + toRelativePath(projectRoot, path))
    );
  }
}

/**
 * Asynchronously construct a {@link ProjectFiles} instance containing absolute
 * file paths ({@link AbsolutePath}s) derived from `projectMetadata`.
 *
 * Note that **only named packages** are considered "packages" in monorepos.
 * Unnamed and broken packages/workspaces are ignored except when constructing
 * `packageJsonFiles.elsewhere`.
 *
 * @see {@link clearInternalCache}
 */
export function gatherProjectFiles(
  ...args: ParametersNoFirst<typeof gatherProjectFiles_>
) {
  return gatherProjectFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherProjectFiles {
  /**
   * Synchronously construct a {@link ProjectFiles} instance containing absolute
   * file paths ({@link AbsolutePath}s) derived from `projectMetadata`.
   *
   * Note that **only named packages** are considered "packages" in monorepos.
   * Unnamed and broken packages/workspaces are ignored except when constructing
   * `packageJsonFiles.elsewhere`.
   *
   * @see {@link clearInternalCache}
   */
  export const sync = function (
    projectMetadata: ProjectMetadata,
    options?: Omit<GatherProjectFilesOptions, 'skipUnknown'>
  ): Awaited<ReturnType<typeof gatherProjectFiles>> {
    return gatherProjectFiles_(true, projectMetadata, options);
  };
}
