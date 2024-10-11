import assert from 'node:assert';
import { dirname, join as joinPath } from 'node:path';

import { sync as findUp } from 'find-up~5';

import {
  type GlobGitignoreOptions,
  sync as globSync,
  glob as globAsync
} from 'glob-gitignore';

import {
  ErrorMessage,
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  NotAGitRepositoryError,
  ProjectError
} from '#project-utils src/error.ts';

import {
  isAccessible,
  ensurePathIsAbsolute,
  readPackageJsonAtRoot,
  deriveVirtualGitignoreLines,
  nextjsConfigProjectBase,
  webpackConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from '#project-utils src/fs/index.ts';

import {
  debug as debug_,
  ProjectAttribute,
  WorkspaceAttribute,
  type MonorepoMetadata,
  type PolyrepoMetadata,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage,
  type WorkspacePackageId
} from '#project-utils src/analyze/common.ts';

import {
  _internalProjectMetadataCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';
import { packageRootToId } from '#project-utils src/analyze/exports/package-root-to-id.ts';

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
): Promise<MonorepoMetadata | PolyrepoMetadata>;
function analyzeProjectStructure_(
  shouldRunSynchronously: true,
  options?: AnalyzeProjectStructureOptions
): MonorepoMetadata | PolyrepoMetadata;
function analyzeProjectStructure_(
  shouldRunSynchronously: boolean,
  options: AnalyzeProjectStructureOptions = {}
): Promisable<MonorepoMetadata | PolyrepoMetadata> {
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
          package: await determineCwdPackage(false, {
            cwd,
            projectRoot,
            packages: cachedMetadata.project.packages
          })
        } as typeof cachedMetadata;
      } else {
        cacheDebug('cache miss');
      }

      const projectJson = await readPackageJsonAtRoot({
        root: projectRoot
      });

      debug('projectJson: %O', projectJson);

      const projectAttributes = await getProjectAttributes(
        false,
        projectRoot,
        projectJson,
        projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo
      );

      debug('projectAttributes: %O', projectAttributes);

      const finalMetadata = {
        type: ProjectAttribute.Polyrepo,
        project: {
          root: projectRoot,
          json: projectJson,
          attributes: projectAttributes,
          packages: undefined
        },
        package: undefined
      } as MonorepoMetadata | PolyrepoMetadata;

      if (projectAttributes[ProjectAttribute.Monorepo]) {
        const { packages, cwdPackage } = await getWorkspacePackages(false, {
          cwd,
          projectJson,
          projectMetadata: finalMetadata
        });

        Object.assign(finalMetadata, {
          type: ProjectAttribute.Monorepo,
          project: {
            root: projectRoot,
            json: projectJson,
            attributes: projectAttributes,
            packages
          },
          package: cwdPackage
        } satisfies MonorepoMetadata);
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
        package: determineCwdPackage(true, {
          cwd,
          projectRoot,
          packages: cachedMetadata.project.packages
        })
      } as typeof cachedMetadata;
    } else {
      cacheDebug('cache miss');
    }

    const projectJson = readPackageJsonAtRoot.sync({ root: projectRoot });
    debug('projectJson: %O', projectJson);

    const projectAttributes = getProjectAttributes(
      true,
      projectRoot,
      projectJson,
      projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo
    );

    debug('projectAttributes: %O', projectAttributes);

    const finalMetadata = {
      type: ProjectAttribute.Polyrepo,
      project: {
        root: projectRoot,
        json: projectJson,
        attributes: projectAttributes,
        packages: undefined
      },
      package: undefined
    } as MonorepoMetadata | PolyrepoMetadata;

    if (projectAttributes[ProjectAttribute.Monorepo]) {
      const { packages, cwdPackage } = getWorkspacePackages(true, {
        cwd,
        projectJson,
        projectMetadata: finalMetadata
      });

      Object.assign(finalMetadata, {
        type: ProjectAttribute.Monorepo,
        project: {
          root: projectRoot,
          json: projectJson,
          attributes: projectAttributes,
          packages
        },
        package: cwdPackage
      } satisfies MonorepoMetadata);
    }

    finalize(finalMetadata);
    return finalMetadata;
  }

  function finalize(projectMetadata: MonorepoMetadata | PolyrepoMetadata) {
    debug('project metadata: %O', projectMetadata);

    if (useCached || !_internalProjectMetadataCache.has(projectMetadata.project.root)) {
      _internalProjectMetadataCache.set(projectMetadata.project.root, projectMetadata);
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }
}

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

function getWorkspacePackages(
  runSynchronously: false,
  options: {
    cwd: AbsolutePath;
    projectMetadata: ProjectMetadata;
    projectJson: PackageJson;
  }
): Promise<{
  packages: NonNullable<ProjectMetadata['project']['packages']>;
  cwdPackage: WorkspacePackage | undefined;
}>;
function getWorkspacePackages(
  runSynchronously: true,
  options: {
    cwd: AbsolutePath;
    projectMetadata: ProjectMetadata;
    projectJson: PackageJson;
  }
): {
  packages: NonNullable<ProjectMetadata['project']['packages']>;
  cwdPackage: WorkspacePackage | undefined;
};
function getWorkspacePackages(
  runSynchronously: boolean,
  {
    cwd,
    projectMetadata,
    projectJson: { workspaces }
  }: {
    cwd: AbsolutePath;
    projectMetadata: ProjectMetadata;
    projectJson: PackageJson;
  }
): Promisable<{
  packages: NonNullable<ProjectMetadata['project']['packages']>;
  cwdPackage: WorkspacePackage | undefined;
}> {
  const debug = debug_.extend('getWorkspacePackages');
  const projectRoot = projectMetadata.project.root;

  workspaces = Array.isArray(workspaces)
    ? workspaces
    : Array.isArray(workspaces?.packages)
      ? workspaces.packages
      : undefined;

  assert(workspaces, ErrorMessage.NotAMonorepoError());

  const globOptions: GlobGitignoreOptions = {
    cwd: projectRoot,
    absolute: true,
    ignore: []
  };

  const packages = new Map() as NonNullable<RootPackage['packages']>;
  packages.unnamed = new Map();
  packages.broken = [];

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
            packages.broken.push(packageRoot);
            return undefined;
          }
        })();

        if (packageJson) {
          const attributes = getWorkspaceAttributes(true, packageRoot, packageJson);
          addWorkspacePackage({
            packageId: packageRootToId.sync({ packageRoot }),
            attributes,
            negate,
            packageJson,
            packageRoot
          });
        }
      }
    }

    finalize();

    return {
      packages,
      cwdPackage: determineCwdPackage(true, { cwd, packages, projectRoot })
    };
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
                    packages.broken.push(packageRoot);
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
                        packageId: await packageRootToId({ packageRoot }),
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

      finalize();

      return {
        packages,
        cwdPackage: await determineCwdPackage(false, {
          cwd,
          packages,
          projectRoot
        })
      };
    });
  }

  function finalize() {
    // ? Sugar property for getting *all* of a project's packages
    Object.defineProperty(packages, 'all', {
      configurable: false,
      enumerable: false,
      get: () => {
        return Array.from(packages.values()).concat(
          Array.from(packages.unnamed.values())
        );
      }
    });

    const seenPackages = new Map<WorkspacePackageId, AbsolutePath>();

    // ? Ensure no duplicate package-ids across named and unnamed workspaces.
    packages.all.forEach(({ id, root }) => {
      if (seenPackages.has(id)) {
        throw new DuplicatePackageIdError(id, root, seenPackages.get(id)!);
      } else {
        seenPackages.set(id, root);
      }
    });
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
        packages.delete(workspacePackage.json.name);
      } else {
        packages.unnamed.delete(workspacePackage.id);
      }
    } else {
      if (workspacePackage.json.name) {
        if (packages.has(workspacePackage.json.name)) {
          const pkg = packages.get(workspacePackage.json.name)!;
          if (pkg.root !== workspacePackage.root) {
            throw new DuplicatePackageNameError(
              workspacePackage.json.name,
              pkg.root,
              workspacePackage.root
            );
          }
        } else {
          packages.set(workspacePackage.json.name, workspacePackage);
        }
      } else {
        if (packages.unnamed.has(workspacePackage.id)) {
          const pkg = packages.unnamed.get(workspacePackage.id)!;
          /* istanbul ignore else */
          if (pkg.root !== workspacePackage.root) {
            throw new DuplicatePackageIdError(
              workspacePackage.id,
              pkg.root,
              workspacePackage.root
            );
          }
        } else {
          packages.unnamed.set(workspacePackage.id, workspacePackage);
        }
      }
    }
  }
}

function determineCwdPackage(
  runSynchronously: false,
  options: {
    cwd: AbsolutePath;
    packages: RootPackage['packages'];
    projectRoot: AbsolutePath;
  }
): Promise<WorkspacePackage | undefined>;
function determineCwdPackage(
  runSynchronously: true,
  options: {
    cwd: AbsolutePath;
    packages: RootPackage['packages'];
    projectRoot: AbsolutePath;
  }
): WorkspacePackage | undefined;
function determineCwdPackage(
  runSynchronously: boolean,
  {
    cwd,
    packages,
    projectRoot
  }: {
    cwd: AbsolutePath;
    packages: RootPackage['packages'];
    projectRoot: AbsolutePath;
  }
): Promisable<WorkspacePackage | undefined> {
  if (!packages) {
    return runSynchronously ? undefined : Promise.resolve(undefined);
  }

  // ? At least the root package.json is guaranteed to exist at this point.
  const cwdPackageRoot = dirname(findUp('package.json', { cwd })!) as AbsolutePath;
  let cwdPackage: WorkspacePackage | undefined = undefined;

  if (cwdPackageRoot !== projectRoot) {
    if (runSynchronously) {
      const cwdPackageName = readPackageJsonAtRoot.sync({ root: cwdPackageRoot }).name;
      finalize(cwdPackageName, packageRootToId.sync({ packageRoot: cwdPackageRoot }));
      return cwdPackage;
    } else {
      return readPackageJsonAtRoot({
        root: cwdPackageRoot
      }).then(async ({ name: cwdPackageName }) => {
        finalize(cwdPackageName, await packageRootToId({ packageRoot: cwdPackageRoot }));
        return cwdPackage;
      });
    }

    function finalize(cwdPackageName: string | undefined, packageId: string) {
      if (cwdPackageName) {
        cwdPackage = packages!.get(cwdPackageName);
      }

      if (cwdPackage === undefined) {
        cwdPackage = packages!.unnamed.get(packageId);
      }
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
