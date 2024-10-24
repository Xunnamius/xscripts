import assert from 'node:assert';
import { dirname, join as joinPath } from 'node:path';

import { sync as findUp } from 'find-up~5';

import {
  glob as globAsync,
  sync as globSync,
  type GlobGitignoreOptions
} from 'glob-gitignore';

import { toss } from 'toss-expression';

import {
  _internalProjectMetadataCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

import {
  debug as debug_,
  ProjectAttribute,
  WorkspaceAttribute,
  type Package,
  type PolyrepoMetadata,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage,
  type WorkspacePackageId
} from '#project-utils src/analyze/common.ts';

import { packageRootToId } from '#project-utils src/analyze/exports/package-root-to-id.ts';

import {
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  ErrorMessage,
  NotAGitRepositoryError,
  ProjectError
} from '#project-utils src/error.ts';

import {
  deriveVirtualGitignoreLines,
  ensurePathIsAbsolute,
  isAccessible,
  nextjsConfigProjectBase,
  readPackageJsonAtRoot,
  webpackConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from '#project-utils src/fs/index.ts';

import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { PackageJson, Promisable } from 'type-fest';

const debug = debug_.extend('getProjectMetadata');

/**
 * @see {@link analyzeProjectStructure}
 */
export type AnalyzeProjectStructureOptions = {
  /**
   * The current working directory as an absolute path.
   *
   * @default process.cwd()
   */
  cwd?: AbsolutePath;
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `analyzeProjectStructure` will be cached regardless of
   * `useCached` (unless it has already been cached). `useCached` determines if
   * the cached result will be returned or recomputed on subsequent calls.
   *
   * @default true
   */
  useCached?: boolean;
};

function analyzeProjectStructure_(
  shouldRunSynchronously: false,
  options?: AnalyzeProjectStructureOptions
): Promise<ProjectMetadata>;
function analyzeProjectStructure_(
  shouldRunSynchronously: true,
  options?: AnalyzeProjectStructureOptions
): ProjectMetadata;
function analyzeProjectStructure_(
  shouldRunSynchronously: boolean,
  options: AnalyzeProjectStructureOptions = {}
): Promisable<ProjectMetadata> {
  const { cwd: cwd_ = process.cwd(), useCached = true } = options;
  const cwd = cwd_ as AbsolutePath;

  debug('cwd: %O', cwd);
  debug('shouldRunSynchronously: %O,', shouldRunSynchronously);

  return (shouldRunSynchronously ? runSynchronously : runAsynchronously)();

  async function runAsynchronously() {
    return Promise.resolve().then(async () => {
      const projectRoot = await determineProjectRootFromCwd(false, cwd);
      debug('projectRoot: %O', projectRoot);

      if (useCached && _internalProjectMetadataCache.has(projectRoot)) {
        cacheDebug('cache hit!');

        const cachedMetadata = _internalProjectMetadataCache.get(projectRoot)!;

        return {
          ...cachedMetadata,
          cwdPackage: await determineCwdPackage(false, cwd, cachedMetadata)
        } satisfies ProjectMetadata;
      } else {
        cacheDebug('cache miss');
      }

      const projectJson = await readPackageJsonAtRoot({
        root: projectRoot
      });

      const projectAttributes = await getProjectAttributes(
        false,
        projectRoot,
        projectJson,
        projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo
      );

      const rootPackage: RootPackage = {
        root: projectRoot,
        json: projectJson,
        attributes: projectAttributes,
        // ? This is defined for real below
        projectMetadata: '<circular>' as unknown as ProjectMetadata
      };

      debug('rootPackage: %O', rootPackage);

      const finalMetadata: ProjectMetadata = {
        type: ProjectAttribute.Polyrepo,
        cwdPackage: rootPackage,
        rootPackage,
        subRootPackages: undefined
      } satisfies PolyrepoMetadata;

      rootPackage.projectMetadata = finalMetadata;

      if (projectAttributes[ProjectAttribute.Monorepo]) {
        await setSubrootPackagesAndCwdPackage(false, cwd, finalMetadata);

        finalMetadata.type = ProjectAttribute.Monorepo;
      }

      finalize(finalMetadata);
      return finalMetadata;
    });
  }

  function runSynchronously() {
    const projectRoot = determineProjectRootFromCwd(true, cwd);
    debug('projectRoot: %O', projectRoot);

    if (useCached && _internalProjectMetadataCache.has(projectRoot)) {
      cacheDebug('cache hit!');

      const cachedMetadata = _internalProjectMetadataCache.get(projectRoot)!;

      return {
        ...cachedMetadata,
        cwdPackage: determineCwdPackage(true, cwd, cachedMetadata)
      } satisfies ProjectMetadata;
    } else {
      cacheDebug('cache miss');
    }

    const projectJson = readPackageJsonAtRoot.sync({
      root: projectRoot
    });

    const projectAttributes = getProjectAttributes(
      true,
      projectRoot,
      projectJson,
      projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo
    );

    const rootPackage: RootPackage = {
      root: projectRoot,
      json: projectJson,
      attributes: projectAttributes,
      // ? This is defined for real below
      projectMetadata: '<circular>' as unknown as ProjectMetadata
    };

    debug('rootPackage: %O', rootPackage);

    const finalMetadata: ProjectMetadata = {
      type: ProjectAttribute.Polyrepo,
      cwdPackage: rootPackage,
      rootPackage,
      subRootPackages: undefined
    } satisfies PolyrepoMetadata;

    rootPackage.projectMetadata = finalMetadata;

    if (projectAttributes[ProjectAttribute.Monorepo]) {
      setSubrootPackagesAndCwdPackage(true, cwd, finalMetadata);

      finalMetadata.type = ProjectAttribute.Monorepo;
    }

    finalize(finalMetadata);
    return finalMetadata;
  }

  function finalize(projectMetadata: ProjectMetadata) {
    debug('project metadata: %O', projectMetadata);

    if (
      useCached ||
      !_internalProjectMetadataCache.has(projectMetadata.rootPackage.root)
    ) {
      _internalProjectMetadataCache.set(
        projectMetadata.rootPackage.root,
        projectMetadata
      );
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }
}

/**
 * Asynchronously returns information about the structure of the project at the
 * current working directory.
 *
 * @see {@link clearInternalCache}
 */
export function analyzeProjectStructure(
  ...args: ParametersNoFirst<typeof analyzeProjectStructure_>
) {
  return analyzeProjectStructure_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace analyzeProjectStructure {
  /**
   * Synchronously returns information about the structure of the project at the
   * current working directory.
   *
   * @see {@link clearInternalCache}
   */
  export const sync = function (...args) {
    return analyzeProjectStructure_(true, ...args);
  } as SyncVersionOf<typeof analyzeProjectStructure>;
}

function determineProjectRootFromCwd(
  runSynchronously: false,
  cwd: string
): Promise<AbsolutePath>;
function determineProjectRootFromCwd(runSynchronously: true, cwd: string): AbsolutePath;
function determineProjectRootFromCwd(
  runSynchronously: boolean,
  cwd_: string
): Promisable<AbsolutePath> {
  if (runSynchronously) {
    const cwd = ensurePathIsAbsolute.sync({ path: cwd_ });

    let root: string;
    try {
      root = dirname(findUp('.git', { cwd, type: 'directory' })!);
    } catch {
      throw new NotAGitRepositoryError();
    }

    return ensurePathIsAbsolute.sync({ path: root });
  } else {
    return ensurePathIsAbsolute({ path: cwd_ }).then(async (cwd) => {
      let root: string;
      try {
        root = dirname(findUp('.git', { cwd, type: 'directory' })!);
      } catch {
        throw new NotAGitRepositoryError();
      }

      return ensurePathIsAbsolute({ path: root });
    });
  }
}

function setSubrootPackagesAndCwdPackage(
  runSynchronously: false,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): Promise<void>;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): void;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): Promisable<void> {
  const debug = debug_.extend('getWorkspacePackages');
  const projectRoot = projectMetadata.rootPackage.root;
  const { workspaces: workspaces_ } = projectMetadata.rootPackage.json;

  const workspaces = Array.isArray(workspaces_)
    ? workspaces_
    : Array.isArray(workspaces_?.packages)
      ? workspaces_.packages
      : undefined;

  assert(workspaces, ErrorMessage.NotAMonorepoError());

  const globOptions: GlobGitignoreOptions = {
    cwd: projectRoot,
    absolute: true,
    ignore: []
  };

  const subRootPackages = (projectMetadata.subRootPackages = new Map() as NonNullable<
    ProjectMetadata['subRootPackages']
  >);

  subRootPackages.unnamed = new Map();
  subRootPackages.broken = [];

  if (runSynchronously) {
    globOptions.ignore = deriveVirtualGitignoreLines.sync({ projectRoot });

    for (const pattern_ of workspaces) {
      const [pattern, negate] = normalizePattern(pattern_);

      for (const packageRoot of globSync(pattern, globOptions) as AbsolutePath[]) {
        assert(typeof packageRoot === 'string');

        const packageJson = (() => {
          try {
            return readPackageJsonAtRoot.sync({ root: packageRoot });
          } catch (error) {
            debug.warn('encountered broken package at %O: %O', packageRoot, error);
            subRootPackages.broken.push(packageRoot);
            return undefined;
          }
        })();

        if (packageJson) {
          const attributes = getWorkspaceAttributes(true, packageRoot, packageJson);
          addWorkspacePackage({
            packageId: packageRootToId.sync(packageRoot),
            attributes,
            negate,
            packageJson,
            packageRoot
          });
        }
      }
    }

    finalize(determineCwdPackage(true, cwd, projectMetadata));
  } else {
    return Promise.resolve().then(async () => {
      const workspacesAddFunctionsToCall: {
        patternIndex: number;
        fn: () => Promisable<void>;
      }[] = [];

      globOptions.ignore = await deriveVirtualGitignoreLines({
        projectRoot,
        includeUnknownPaths: false
      });

      await Promise.all(
        workspaces.map(async (pattern_, patternIndex) => {
          const [pattern, negate] = normalizePattern(pattern_);

          return globAsync(pattern, globOptions).then((packageRoots_) => {
            const packageRoots = packageRoots_ as AbsolutePath[];
            return Promise.all(
              packageRoots.map(async (packageRoot) => {
                assert(typeof packageRoot === 'string');

                const packageJson = await (async () => {
                  try {
                    return await readPackageJsonAtRoot({
                      root: packageRoot
                    });
                  } catch (error) {
                    debug.warn(
                      'encountered broken package at %O: %O',
                      packageRoot,
                      error
                    );
                    subRootPackages.broken.push(packageRoot);
                    return undefined;
                  }
                })();

                if (packageJson) {
                  const attributes = await getWorkspaceAttributes(
                    false,
                    packageRoot,
                    packageJson
                  );

                  // ? Negation relies on addWorkspacePackage being called in
                  // ? a specific order, so we need to preserve that order.
                  // ? We'll execute these functions in a synchronization step
                  // ? later.
                  workspacesAddFunctionsToCall.push({
                    patternIndex,
                    fn: async () =>
                      addWorkspacePackage({
                        packageId: await packageRootToId(packageRoot),
                        attributes,
                        negate,
                        packageJson,
                        packageRoot
                      })
                  });
                }
              })
            );
          });
        })
      );

      for (const { fn } of workspacesAddFunctionsToCall.sort(
        ({ patternIndex: indexA }, { patternIndex: indexB }) =>
          indexA === indexB ? 0 : indexA < indexB ? -1 : 1
      )) {
        // ? These need to be executed in order due to negations (see
        // ? addWorkspacePackage).
        // eslint-disable-next-line no-await-in-loop
        await fn();
      }

      finalize(await determineCwdPackage(false, cwd, projectMetadata));
    });
  }

  function finalize(cwdPackage: Package) {
    // ? Sugar property for getting *all* of a project's packages
    Object.defineProperty(subRootPackages, 'all', {
      configurable: false,
      enumerable: false,
      get: () => {
        return Array.from(subRootPackages.values()).concat(
          Array.from(subRootPackages.unnamed.values())
        );
      }
    });

    const seenPackages = new Map<WorkspacePackageId, AbsolutePath>();

    // ? Ensure no duplicate package-ids across named and unnamed workspaces.
    subRootPackages.all.forEach(({ id, root }) => {
      if (seenPackages.has(id)) {
        throw new DuplicatePackageIdError(id, root, seenPackages.get(id)!);
      } else {
        seenPackages.set(id, root);
      }
    });

    // ? Set cwdPackage in projectMetadata
    projectMetadata.cwdPackage = cwdPackage;
  }

  function addWorkspacePackage({
    attributes,
    packageRoot,
    packageId,
    packageJson,
    negate
  }: {
    attributes: WorkspacePackage['attributes'];
    packageRoot: AbsolutePath;
    packageId: string;
    packageJson: PackageJson;
    negate: boolean;
  }): Promisable<void> {
    const workspacePackage = {
      id: packageId,
      root: packageRoot,
      projectMetadata,
      json: packageJson,
      attributes
    } satisfies WorkspacePackage;

    if (negate) {
      if (workspacePackage.json.name) {
        subRootPackages.delete(workspacePackage.json.name);
      } else {
        subRootPackages.unnamed.delete(workspacePackage.id);
      }
    } else {
      if (workspacePackage.json.name) {
        if (subRootPackages.has(workspacePackage.json.name)) {
          const subrootPackage = subRootPackages.get(workspacePackage.json.name)!;
          if (subrootPackage.root !== workspacePackage.root) {
            throw new DuplicatePackageNameError(
              workspacePackage.json.name,
              subrootPackage.root,
              workspacePackage.root
            );
          }
        } else {
          subRootPackages.set(workspacePackage.json.name, workspacePackage);
        }
      } else {
        if (subRootPackages.unnamed.has(workspacePackage.id)) {
          const subrootPackage = subRootPackages.unnamed.get(workspacePackage.id)!;
          /* istanbul ignore else */
          if (subrootPackage.root !== workspacePackage.root) {
            throw new DuplicatePackageIdError(
              workspacePackage.id,
              subrootPackage.root,
              workspacePackage.root
            );
          }
        } else {
          subRootPackages.unnamed.set(workspacePackage.id, workspacePackage);
        }
      }
    }
  }
}

function determineCwdPackage(
  runSynchronously: false,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): Promise<Package>;
function determineCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): Package;
function determineCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata
): Promisable<Package> {
  const { subRootPackages, rootPackage } = projectMetadata;
  const { root: projectRoot } = rootPackage;

  if (!subRootPackages) {
    return runSynchronously ? rootPackage : Promise.resolve(rootPackage);
  }

  // ? At least the root package.json is guaranteed to exist at this point.
  const cwdPackageRoot = dirname(findUp('package.json', { cwd })!) as AbsolutePath;

  if (cwdPackageRoot === projectRoot) {
    return runSynchronously ? rootPackage : Promise.resolve(rootPackage);
  } else {
    let cwdPackage: Package = rootPackage;

    if (runSynchronously) {
      const cwdPackageName = readPackageJsonAtRoot.sync({ root: cwdPackageRoot }).name;
      finalize(cwdPackageName, packageRootToId.sync(cwdPackageRoot));
      return cwdPackage;
    } else {
      return readPackageJsonAtRoot({
        root: cwdPackageRoot
      }).then(async ({ name: cwdPackageName }) => {
        finalize(cwdPackageName, await packageRootToId(cwdPackageRoot));
        return cwdPackage;
      });
    }

    function finalize(cwdPackageName: string | undefined, packageId: string) {
      cwdPackage =
        (cwdPackageName ? subRootPackages?.get(cwdPackageName) : undefined) ||
        subRootPackages?.unnamed.get(packageId) ||
        toss(new ProjectError(ErrorMessage.GuruMeditation()));
    }
  }
}

function getProjectAttributes(
  runSynchronously: false,
  root: AbsolutePath,
  projectJson: PackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo
): Promise<RootPackage['attributes']>;
function getProjectAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  projectJson: PackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo
): RootPackage['attributes'];
function getProjectAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  projectJson: PackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo
): Promisable<RootPackage['attributes']> {
  const attributes: RootPackage['attributes'] = { [repoType]: true };
  const { type = 'commonjs', bin, private: private_ } = projectJson;

  if (runSynchronously) {
    if (isAccessibleFromRoot(true, nextjsConfigProjectBase as RelativePath, root)) {
      attributes[ProjectAttribute.Next] = true;
    }

    if (isAccessibleFromRoot(true, webpackConfigProjectBase as RelativePath, root)) {
      attributes[ProjectAttribute.Webpack] = true;
    }

    if (
      repoType === ProjectAttribute.Monorepo &&
      isAccessibleFromRoot(true, 'src' as RelativePath, root)
    ) {
      attributes[ProjectAttribute.Hybridrepo] = true;
    }

    if (
      isAccessibleFromRoot(true, 'vercel.json' as RelativePath, root) ||
      isAccessibleFromRoot(true, '.vercel/project.json' as RelativePath, root)
    ) {
      attributes[ProjectAttribute.Vercel] = true;
    }

    finalize();

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      const [hasNext, hasWebpack, isHybridrepo, hasVercel] = await Promise.all([
        isAccessibleFromRoot(false, nextjsConfigProjectBase as RelativePath, root),
        isAccessibleFromRoot(false, webpackConfigProjectBase as RelativePath, root),
        isAccessibleFromRoot(false, 'src' as RelativePath, root),
        isAccessibleFromRoot(false, 'vercel.json' as RelativePath, root).then(
          async (result) => {
            return (
              result ||
              isAccessibleFromRoot(false, '.vercel/project.json' as RelativePath, root)
            );
          }
        )
      ]);

      if (hasNext) {
        attributes[ProjectAttribute.Next] = true;
      }

      if (hasWebpack) {
        attributes[ProjectAttribute.Webpack] = true;
      }

      if (repoType === ProjectAttribute.Monorepo && isHybridrepo) {
        attributes[ProjectAttribute.Hybridrepo] = true;
      }

      if (hasVercel) {
        attributes[ProjectAttribute.Vercel] = true;
      }

      finalize();

      return attributes;
    });
  }

  function finalize() {
    if (!['module', 'commonjs'].includes(type)) {
      throw new ProjectError(ErrorMessage.BadProjectTypeInPackageJson());
    }

    if (type === 'module') {
      attributes[ProjectAttribute.Esm] = true;
    }

    if (type === 'commonjs') {
      attributes[ProjectAttribute.Cjs] = true;
    }

    if (bin) {
      attributes[ProjectAttribute.Cli] = true;
    }

    if (private_) {
      attributes[ProjectAttribute.Private] = true;
    }

    if (attributes[ProjectAttribute.Cli] && attributes[ProjectAttribute.Next]) {
      throw new ProjectError(ErrorMessage.CannotBeCliAndNextJs());
    }
  }
}

function getWorkspaceAttributes(
  runSynchronously: false,
  root: AbsolutePath,
  workspaceJson: PackageJson
): Promise<WorkspacePackage['attributes']>;
function getWorkspaceAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  workspaceJson: PackageJson
): WorkspacePackage['attributes'];
function getWorkspaceAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  workspaceJson: PackageJson
): Promisable<WorkspacePackage['attributes']> {
  const attributes: WorkspacePackage['attributes'] = {};
  const { type = 'commonjs', bin, private: private_ } = workspaceJson;

  if (!['module', 'commonjs'].includes(type)) {
    throw new ProjectError(ErrorMessage.BadProjectTypeInPackageJson());
  }

  if (type === 'module') {
    attributes[WorkspaceAttribute.Esm] = true;
  }

  if (type === 'commonjs') {
    attributes[WorkspaceAttribute.Cjs] = true;
  }

  if (bin) {
    attributes[WorkspaceAttribute.Cli] = true;
  }

  if (private_) {
    attributes[WorkspaceAttribute.Private] = true;
  }

  if (runSynchronously) {
    if (isAccessibleFromRoot(true, webpackConfigProjectBase as RelativePath, root)) {
      attributes[WorkspaceAttribute.Webpack] = true;
    }

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      if (
        await isAccessibleFromRoot(false, webpackConfigProjectBase as RelativePath, root)
      ) {
        attributes[WorkspaceAttribute.Webpack] = true;
      }

      return attributes;
    });
  }
}

function isAccessibleFromRoot(
  runSynchronously: false,
  path: RelativePath,
  root: AbsolutePath
): Promise<boolean>;
function isAccessibleFromRoot(
  runSynchronously: true,
  path: RelativePath,
  root: AbsolutePath
): boolean;
function isAccessibleFromRoot(
  runSynchronously: boolean,
  path: RelativePath,
  root: AbsolutePath
): Promisable<boolean> {
  return (runSynchronously ? isAccessible.sync : isAccessible)({
    path: joinPath(root, path)
  });
}

function normalizePattern(pattern: string) {
  const excl = pattern.match(/^!+/);

  if (excl) {
    // ? Remove exclamation points prefix from pattern: !!!foo ==> foo
    pattern = pattern.slice(excl[0].length);
  }

  // TODO: hoist the negation logic up to @-xun/glob-gitignore; note in the
  // TODO: documentation that negations only apply to the glob paths that
  // TODO: came before it and the later globs can re-add previously ignored
  // TODO: entries.

  // * This pattern sanitization logic comes from @npmcli/map-workspaces

  // ? Normalize path separators (not like backslashes should be in
  // globs...)
  pattern = pattern.replaceAll('\\', '/');

  // ? Strip off any / from the start of the pattern: /foo ==> foo
  pattern = pattern.replace(/^\/+/, '');

  // ? An odd number of ! removed means a negated pattern: !!foo ==> foo
  const negate = !!excl && excl[0].length % 2 === 1;

  // ? Ensure only directories are matched
  pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;

  return [pattern, negate] as const;
}
