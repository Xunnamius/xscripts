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
  debug as debug_,
  ProjectAttribute,
  WorkspaceAttribute,
  type Package,
  type PolyrepoMetadata,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage,
  type WorkspacePackageId
} from 'rootverse+project-utils:src/analyze/common.ts';

import { packageRootToId } from 'rootverse+project-utils:src/analyze/package-root-to-id.ts';
import { cache, CacheScope } from 'rootverse+project-utils:src/cache.ts';

import {
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  ErrorMessage,
  NotAGitRepositoryError,
  ProjectError
} from 'rootverse+project-utils:src/error.ts';

import {
  deriveVirtualGitignoreLines,
  isAccessible,
  nextjsConfigProjectBase,
  readPackageJsonAtRoot,
  webpackConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

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
   * **WARNING: the results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal (`===`) each other.**
   * However, each {@link Package} instance within the returned results _will_
   * strictly equal each other, respectively.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function analyzeProjectStructure_(
  shouldRunSynchronously: false,
  options: AnalyzeProjectStructureOptions
): Promise<ProjectMetadata>;
function analyzeProjectStructure_(
  shouldRunSynchronously: true,
  options: AnalyzeProjectStructureOptions
): ProjectMetadata;
function analyzeProjectStructure_(
  shouldRunSynchronously: boolean,
  {
    useCached,
    cwd = process.cwd() as AbsolutePath,
    ...incompleteCacheIdComponentsObject
  }: AnalyzeProjectStructureOptions
): Promisable<ProjectMetadata> {
  const cacheIdComponentsObject = { ...incompleteCacheIdComponentsObject, cwd };

  debug('cwd: %O', cwd);
  debug('shouldRunSynchronously: %O,', shouldRunSynchronously);

  return (shouldRunSynchronously ? runSynchronously : runAsynchronously)();

  async function runAsynchronously() {
    return Promise.resolve().then(async () => {
      const projectRoot = determineProjectRootFromCwd(cwd);
      debug('projectRoot: %O', projectRoot);

      if (useCached) {
        const cachedMetadata_ = cache.get(CacheScope.AnalyzeProjectStructure, [
          cacheIdComponentsObject
        ]);

        if (cachedMetadata_) {
          const cachedMetadata = {
            ...cachedMetadata_,
            cwdPackage: await determineCwdPackage(false, cwd, cachedMetadata_, useCached)
          } satisfies ProjectMetadata;

          debug('reusing cached resources: %O', cachedMetadata);
          return cachedMetadata;
        }
      }

      const projectJson = await readPackageJsonAtRoot(projectRoot, { useCached });

      const projectAttributes = await getProjectAttributes(
        false,
        projectRoot,
        projectJson,
        projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo,
        useCached
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
        await setSubrootPackagesAndCwdPackage(false, cwd, finalMetadata, useCached);

        finalMetadata.type = ProjectAttribute.Monorepo;
      }

      finalize(finalMetadata);
      return finalMetadata;
    });
  }

  function runSynchronously() {
    const projectRoot = determineProjectRootFromCwd(cwd);
    debug('projectRoot: %O', projectRoot);

    if (useCached) {
      const cachedMetadata_ = cache.get(CacheScope.AnalyzeProjectStructure, [
        cacheIdComponentsObject
      ]);

      if (cachedMetadata_) {
        const cachedMetadata = {
          ...cachedMetadata_,
          cwdPackage: determineCwdPackage(true, cwd, cachedMetadata_, useCached)
        } satisfies ProjectMetadata;

        debug('reusing cached resources: %O', cachedMetadata);
        return cachedMetadata;
      }
    }

    const projectJson = readPackageJsonAtRoot.sync(projectRoot, { useCached });

    const projectAttributes = getProjectAttributes(
      true,
      projectRoot,
      projectJson,
      projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo,
      useCached
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
      setSubrootPackagesAndCwdPackage(true, cwd, finalMetadata, useCached);

      finalMetadata.type = ProjectAttribute.Monorepo;
    }

    finalize(finalMetadata);
    return finalMetadata;
  }

  function finalize(projectMetadata: ProjectMetadata) {
    debug('project metadata: %O', projectMetadata);

    cache.set(
      CacheScope.AnalyzeProjectStructure,
      [cacheIdComponentsObject],
      projectMetadata
    );
  }
}

/**
 * Asynchronously returns information about the structure of the project at the
 * current working directory.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
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
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return analyzeProjectStructure_(true, ...args);
  } as SyncVersionOf<typeof analyzeProjectStructure>;
}

function determineProjectRootFromCwd(cwd: AbsolutePath): AbsolutePath {
  try {
    return dirname(findUp('.git', { cwd, type: 'directory' })!) as AbsolutePath;
  } catch {
    throw new NotAGitRepositoryError();
  }
}

function setSubrootPackagesAndCwdPackage(
  runSynchronously: false,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata,
  useCached: boolean
): Promise<void>;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata,
  useCached: boolean
): void;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata,
  useCached: boolean
): Promisable<void> {
  const dbg = debug.extend('subroot');
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
    globOptions.ignore = deriveVirtualGitignoreLines.sync(projectRoot, { useCached });

    for (const pattern_ of workspaces) {
      const [pattern, negate] = normalizePattern(pattern_);

      for (const packageRoot of globSync(pattern, globOptions) as AbsolutePath[]) {
        assert(typeof packageRoot === 'string');

        const packageJson = (() => {
          try {
            return readPackageJsonAtRoot.sync(packageRoot, { useCached });
          } catch (error) {
            dbg.warn('encountered broken package at %O: %O', packageRoot, error);
            subRootPackages.broken.push(packageRoot);
            return undefined;
          }
        })();

        if (packageJson) {
          const attributes = getWorkspaceAttributes(
            true,
            packageRoot,
            packageJson,
            useCached
          );
          addWorkspacePackage({
            packageId: packageRootToId(packageRoot),
            attributes,
            negate,
            packageJson,
            packageRoot
          });
        }
      }
    }

    finalize(determineCwdPackage(true, cwd, projectMetadata, useCached));
  } else {
    return Promise.resolve().then(async () => {
      const workspacesAddFunctionsToCall: {
        patternIndex: number;
        fn: () => Promisable<void>;
      }[] = [];

      globOptions.ignore = await deriveVirtualGitignoreLines(projectRoot, {
        useCached,
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
                    return await readPackageJsonAtRoot(packageRoot, { useCached });
                  } catch (error) {
                    dbg.warn('encountered broken package at %O: %O', packageRoot, error);
                    subRootPackages.broken.push(packageRoot);
                    return undefined;
                  }
                })();

                if (packageJson) {
                  const attributes = await getWorkspaceAttributes(
                    false,
                    packageRoot,
                    packageJson,
                    useCached
                  );

                  // ? Negation relies on addWorkspacePackage being called in ?
                  // a specific order, so we need to preserve that order. ?
                  // We'll execute these functions in a synchronization step ?
                  // later.
                  workspacesAddFunctionsToCall.push({
                    patternIndex,
                    fn: async () =>
                      addWorkspacePackage({
                        packageId: packageRootToId(packageRoot),
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

      finalize(await determineCwdPackage(false, cwd, projectMetadata, useCached));
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
  projectMetadata: ProjectMetadata,
  useCached: boolean
): Promise<Package>;
function determineCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata,
  useCached: boolean
): Package;
function determineCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: ProjectMetadata,
  useCached: boolean
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
      const cwdPackageName = readPackageJsonAtRoot.sync(cwdPackageRoot, {
        useCached
      }).name;

      finalize(cwdPackageName, packageRootToId(cwdPackageRoot));
      return cwdPackage;
    } else {
      return readPackageJsonAtRoot(cwdPackageRoot, { useCached }).then(
        async ({ name: cwdPackageName }) => {
          finalize(cwdPackageName, packageRootToId(cwdPackageRoot));
          return cwdPackage;
        }
      );
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
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promise<RootPackage['attributes']>;
function getProjectAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  projectJson: PackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): RootPackage['attributes'];
function getProjectAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  projectJson: PackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promisable<RootPackage['attributes']> {
  const attributes: RootPackage['attributes'] = { [repoType]: true };
  const { type = 'commonjs', bin, private: private_ } = projectJson;

  if (runSynchronously) {
    if (
      isAccessibleFromRoot(true, nextjsConfigProjectBase as RelativePath, root, useCached)
    ) {
      attributes[ProjectAttribute.Next] = true;
    }

    if (
      isAccessibleFromRoot(
        true,
        webpackConfigProjectBase as RelativePath,
        root,
        useCached
      )
    ) {
      attributes[ProjectAttribute.Webpack] = true;
    }

    if (
      repoType === ProjectAttribute.Monorepo &&
      isAccessibleFromRoot(true, 'src' as RelativePath, root, useCached)
    ) {
      attributes[ProjectAttribute.Hybridrepo] = true;
    }

    if (
      isAccessibleFromRoot(true, 'vercel.json' as RelativePath, root, useCached) ||
      isAccessibleFromRoot(true, '.vercel/project.json' as RelativePath, root, useCached)
    ) {
      attributes[ProjectAttribute.Vercel] = true;
    }

    finalize();

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      const [hasNext, hasWebpack, isHybridrepo, hasVercel] = await Promise.all([
        isAccessibleFromRoot(
          false,
          nextjsConfigProjectBase as RelativePath,
          root,
          useCached
        ),
        isAccessibleFromRoot(
          false,
          webpackConfigProjectBase as RelativePath,
          root,
          useCached
        ),
        isAccessibleFromRoot(false, 'src' as RelativePath, root, useCached),
        isAccessibleFromRoot(false, 'vercel.json' as RelativePath, root, useCached).then(
          async (result) => {
            return (
              result ||
              isAccessibleFromRoot(
                false,
                '.vercel/project.json' as RelativePath,
                root,
                useCached
              )
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
  workspaceJson: PackageJson,
  useCached: boolean
): Promise<WorkspacePackage['attributes']>;
function getWorkspaceAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  workspaceJson: PackageJson,
  useCached: boolean
): WorkspacePackage['attributes'];
function getWorkspaceAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  workspaceJson: PackageJson,
  useCached: boolean
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
    if (
      isAccessibleFromRoot(
        true,
        webpackConfigProjectBase as RelativePath,
        root,
        useCached
      )
    ) {
      attributes[WorkspaceAttribute.Webpack] = true;
    }

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      if (
        await isAccessibleFromRoot(
          false,
          webpackConfigProjectBase as RelativePath,
          root,
          useCached
        )
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
  root: AbsolutePath,
  useCached: boolean
): Promise<boolean>;
function isAccessibleFromRoot(
  runSynchronously: true,
  path: RelativePath,
  root: AbsolutePath,
  useCached: boolean
): boolean;
function isAccessibleFromRoot(
  runSynchronously: boolean,
  path: RelativePath,
  root: AbsolutePath,
  useCached: boolean
): Promisable<boolean> {
  return (runSynchronously ? isAccessible.sync : isAccessible)(joinPath(root, path), {
    useCached
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
  // TODO: entries. ? Is hoisting this necessary or is this once-off
  // TODO: functionality?

  // * This pattern sanitization logic comes from @npmcli/map-workspaces

  // ? Normalize path separators (not like backslashes should be in globs...)
  pattern = pattern.replaceAll('\\', '/');

  // ? Strip off any / from the start of the pattern: /foo ==> foo
  pattern = pattern.replace(/^\/+/, '');

  // ? An odd number of ! removed means a negated pattern: !!foo ==> foo
  const negate = !!excl && excl[0].length % 2 === 1;

  // ? Ensure only directories are matched
  pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;

  return [pattern, negate] as const;
}
