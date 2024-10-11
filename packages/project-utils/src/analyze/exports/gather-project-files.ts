import { relative as toRelativePath, resolve as toAbsolutePath } from 'node:path';

import { sync as globSync, glob as globAsync } from 'glob-gitignore';

import { type ParametersNoFirst } from '#project-utils src/util.ts';
import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';

import {
  deriveVirtualPrettierignoreLines,
  type AbsolutePath
} from '#project-utils src/fs/index.ts';

import {
  debug as debug_,
  assignResultTo,
  type RootPackage,
  type WorkspacePackage,
  type ProjectFiles,
  type ProjectMetadata
} from '#project-utils src/analyze/common.ts';

import {
  _internalProjectFilesCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

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
       * If `true`, use `.prettierignore` to filter out returned project files.
       *
       * @default true
       */
      skipIgnored: false;
      /**
       * If `true`, completely ignore (never consider or return) files unknown
       * to git.
       *
       * Meaningless without `skipIgnored` also being `true`.
       *
       * @default false
       */
      skipUnknown?: false;
    }
  | {
      skipIgnored?: true;
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
    skipIgnored = true,
    skipUnknown = false,
    ignoreUnsupportedFeatures = false
  }: GatherProjectFilesOptions = {}
): Promisable<ProjectFiles> {
  const debug = debug_.extend('gatherProjectFiles');

  if (shouldRunSynchronously && skipUnknown) {
    throw new ProjectError(ErrorMessage.DeriverAsyncConfigurationConflict());
  }

  const { root: projectRoot, packages: projectPackages_ } = projectMetadata.project;
  const projectPackages = Array.from(projectPackages_?.values() || []);

  if (useCached && _internalProjectFilesCache.has(projectMetadata)) {
    cacheDebug('cache hit!');
    const cachedResult = _internalProjectFilesCache.get(projectMetadata)!;
    debug('reusing cached resources: %O', cachedResult);
    return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
  } else {
    cacheDebug('cache miss');
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

    const ignore = skipIgnored
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
        projectPackages.map(async (pkg) => {
          const paths = await globAsync(markdownGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: pkg.root
          });

          return [pkg.id, paths] as [string, string[]];
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
        projectPackages.map(async (pkg) => {
          const paths = await globAsync(typescriptGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: pkg.root
          });

          return [pkg.id, paths] as [string, string[]];
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

    const ignore = skipIgnored
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
      projectPackages.map((pkg) => {
        const paths = globSync(markdownGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: pkg.root
        });

        return [pkg.id, paths] as [string, AbsolutePath[]];
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
      projectPackages.map((pkg) => {
        const paths = globSync(typescriptGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: pkg.root
        });

        return [pkg.id, paths] as [string, AbsolutePath[]];
      })
    );

    finalize();
  }

  function initialize() {
    if (
      !ignoreUnsupportedFeatures &&
      (projectMetadata.project.json.directories ||
        projectMetadata.project.packages
          ?.values()
          .some(({ json: { directories } }) => directories))
    ) {
      throw new ProjectError(
        ErrorMessage.UnsupportedFeature('the package.json "directories" field')
      );
    }

    packageJsonFiles.atProjectRoot = `${projectRoot}/package.json` as AbsolutePath;

    packageJsonFiles.atWorkspaceRoot = new Map(
      projectPackages.map((pkg) => [pkg.id, `${pkg.root}/package.json` as AbsolutePath])
    );

    packageJsonFiles.atAnyRoot = [packageJsonFiles.atProjectRoot].concat(
      Array.from(packageJsonFiles.atWorkspaceRoot.values())
    );
  }

  function finalize() {
    binFiles.atProjectRoot = resolveMainBinFile(projectMetadata.project);

    binFiles.atWorkspaceRoot = new Map(
      projectPackages.map((pkg) => [pkg.id, resolveMainBinFile(pkg)])
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

    if (useCached || !_internalProjectFilesCache.has(projectMetadata)) {
      _internalProjectFilesCache.set(projectMetadata, projectFiles);
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }

  function resolveMainBinFile(pkg: RootPackage | WorkspacePackage) {
    const { bin } = pkg.json;
    const mainBin =
      typeof bin === 'string' ? bin : Object.values(bin ?? {}).find((path) => !!path);

    return mainBin ? (toAbsolutePath(pkg.root, mainBin) as AbsolutePath) : undefined;
  }

  function appendWorkspacesToIgnore(ignore: string[]) {
    // ? Absolute paths in .gitignore/.prettierignore are relative to repo
    return ignore.concat('/packages');
  }

  function appendPackageJsonFilesToIgnore(ignore: string[]) {
    // ? Absolute paths in .gitignore/.prettierignore are relative to repo
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
