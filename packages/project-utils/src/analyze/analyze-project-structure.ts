import assert from 'node:assert';
import { dirname } from 'node:path';

import { sync as findUp } from 'find-up~5';

import {
  glob as globAsync,
  sync as globSync,
  type GlobGitignoreOptions
} from 'glob-gitignore';

import { toss } from 'toss-expression';
import { type Promisable } from 'type-fest';

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
  getCurrentWorkingDirectory,
  isAccessible,
  nextjsConfigProjectBase,
  readPackageJsonAtRoot,
  sharedConfigPackageBase,
  toAbsolutePath,
  toPath,
  toRelativePath,
  webpackConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

// TODO: replace with import from @-xun/types
import { type XPackageJson } from 'rootverse:src/assets/config/_package.json.ts';

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
    cwd = getCurrentWorkingDirectory(),
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
    return toAbsolutePath(dirname(findUp('.git', { cwd, type: 'directory' })!));
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

        // TODO: maybe be redundant given package.json workspaces negated glob
        if (packageRoot.endsWith('.ignore')) {
          dbg.warn('encountered explicitly ignored package at %O', packageRoot);
          continue;
        }

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

                // TODO: maybe redundant w/ package.json workspaces negated glob
                if (packageRoot.endsWith('.ignore')) {
                  dbg.warn('encountered explicitly ignored package at %O', packageRoot);
                  return undefined;
                }

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
    packageJson: XPackageJson;
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
      debug('package "%O" analysis result: negated and removed', packageId);

      if (workspacePackage.json.name) {
        subRootPackages.delete(workspacePackage.json.name);
      } else {
        subRootPackages.unnamed.delete(workspacePackage.id);
      }
    } else {
      debug('package "%O" analysis result: added (unless validation fails)', packageId);

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
  const cwdPackageRoot = toAbsolutePath(dirname(findUp('package.json', { cwd })!));

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
  projectJson: XPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promise<RootPackage['attributes']>;
function getProjectAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  projectJson: XPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): RootPackage['attributes'];
function getProjectAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  projectJson: XPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promisable<RootPackage['attributes']> {
  const attributes: RootPackage['attributes'] = { [repoType]: true };
  const { type = 'commonjs', bin, private: private_ } = projectJson;

  if (runSynchronously) {
    if (
      isAccessibleFromRoot(true, toRelativePath(nextjsConfigProjectBase), root, useCached)
    ) {
      attributes[ProjectAttribute.Next] = true;
    }

    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(webpackConfigProjectBase),
        root,
        useCached
      )
    ) {
      attributes[ProjectAttribute.Webpack] = true;
    }

    if (
      repoType === ProjectAttribute.Monorepo &&
      isAccessibleFromRoot(true, toRelativePath('src'), root, useCached)
    ) {
      attributes[ProjectAttribute.Hybridrepo] = true;
    }

    if (
      isAccessibleFromRoot(true, toRelativePath('vercel.json'), root, useCached) ||
      isAccessibleFromRoot(true, toRelativePath('.vercel/project.json'), root, useCached)
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
          toRelativePath(nextjsConfigProjectBase),
          root,
          useCached
        ),
        isAccessibleFromRoot(
          false,
          toRelativePath(webpackConfigProjectBase),
          root,
          useCached
        ),
        isAccessibleFromRoot(false, toRelativePath('src'), root, useCached),
        isAccessibleFromRoot(false, toRelativePath('vercel.json'), root, useCached).then(
          async (result) => {
            return (
              result ||
              isAccessibleFromRoot(
                false,
                toRelativePath('.vercel/project.json'),
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
  workspaceJson: XPackageJson,
  useCached: boolean
): Promise<WorkspacePackage['attributes']>;
function getWorkspaceAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  workspaceJson: XPackageJson,
  useCached: boolean
): WorkspacePackage['attributes'];
function getWorkspaceAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  workspaceJson: XPackageJson,
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
        toRelativePath(webpackConfigProjectBase),
        root,
        useCached
      )
    ) {
      attributes[WorkspaceAttribute.Webpack] = true;
    }

    if (
      isAccessibleFromRoot(true, toRelativePath(sharedConfigPackageBase), root, useCached)
    ) {
      attributes[WorkspaceAttribute.Shared] = true;
    }

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      if (
        await isAccessibleFromRoot(
          false,
          toRelativePath(webpackConfigProjectBase),
          root,
          useCached
        )
      ) {
        attributes[WorkspaceAttribute.Webpack] = true;
      }

      if (
        await isAccessibleFromRoot(
          false,
          toRelativePath(sharedConfigPackageBase),
          root,
          useCached
        )
      ) {
        attributes[WorkspaceAttribute.Shared] = true;
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
  return (runSynchronously ? isAccessible.sync : isAccessible)(toPath(root, path), {
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
