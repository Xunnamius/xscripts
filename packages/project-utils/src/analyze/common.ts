import { createDebugLogger } from 'multiverse+rejoinder';

import { globalDebuggerNamespace } from 'rootverse+project-utils:src/constant.ts';

import {
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs/common.ts';

import type { OmitIndexSignature, PackageJson } from 'type-fest';

// @ts-expect-error: used in documentation
import type {
  // ? Used in documentation eslint-disable-next-line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nextjsConfigProjectBase,
  // ? Used in documentation eslint-disable-next-line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpackConfigProjectBase
} from 'rootverse+project-utils:src/fs/well-known-constants.ts';

export const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:analyze`
});

export type WorkspacePackageName = string;

/**
 * A so-called "package-id" of a workspace package. The package-id is derived
 * from the name of the parent directory of the package's `package.json` file,
 * i.e. the basename of `root`.
 *
 * The package-id is alphanumeric + hyphens and must be at least one character.
 */
export type WorkspacePackageId = string;

/**
 * An object representing the root or "top-level" package in a monorepo or
 * polyrepo project.
 */
export type RootPackage<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The absolute path to the root directory of the entire project.
   */
  root: AbsolutePath;
  /**
   * The contents of the root `package.json` file.
   */
  json: Json;
  /**
   * A collection of {@link ProjectAttribute} flags describing the project.
   */
  attributes: { [key in ProjectAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata<Json>;
};

/**
 * An object representing a non-root package in a monorepo project.
 */
export type WorkspacePackage<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The package-id of the workspace package. The package-id is derived from the
   * name of the parent directory of this package's `package.json` file, i.e.
   * the basename of `root`.
   *
   * The package-id must be alphanumeric + hyphens and must be at least one
   * character.
   */
  id: WorkspacePackageId;
  /**
   * The absolute path to the root directory of the package.
   */
  root: AbsolutePath;
  /**
   * The contents of the package's `package.json` file.
   */
  json: Json;
  /**
   * A collection of {@link WorkspaceAttribute} flags describing the workspace.
   */
  attributes: { [key in WorkspaceAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata<Json>;
};

/**
 * An object representing a package in a monorepo or polyrepo project.
 *
 * @see {@link RootPackage}
 * @see {@link WorkspacePackage}
 */
export type Package<Json extends PackageJson | XPackageJson = XPackageJson> =
  | RootPackage<Json>
  | WorkspacePackage<Json>;

/**
 * A "project attribute" describes a capability, scope, or some other
 * interesting property of a project's repository.
 */
export enum ProjectAttribute {
  /**
   * A {@link nextjsConfigProjectBase} file exists at the project root.
   */
  Next = 'next',
  /**
   * The root `package.json` file has a `bin` key.
   */
  Cli = 'cli',
  /**
   * A {@link webpackConfigProjectBase} file exists at the project root.
   */
  Webpack = 'webpack',
  /**
   * A `vercel.json` or `.vercel/project.json` file exists at the project root.
   */
  Vercel = 'vercel',
  /**
   * The root `package.json` file does not have a `type: "module"` key.
   */
  Cjs = 'cjs',
  /**
   * The root `package.json` file has a `type: "module"` key.
   */
  Esm = 'esm',
  /**
   * The root `package.json` file has a `private: true` key.
   */
  Private = 'private',
  /**
   * The root `package.json` file has a `workspaces` key.
   */
  Monorepo = 'monorepo',
  /**
   * The root `package.json` file does not have a `workspaces` key.
   */
  Polyrepo = 'polyrepo',
  /**
   * The root `package.json` file has a `workspaces` key and a `src` directory
   * exists at the project root.
   */
  Hybridrepo = 'hybridrepo'
}

/**
 * A "workspace attribute" describes a capability, scope, or some other
 * interesting property of a workspace/sub-root within a monorepo project.
 */
export enum WorkspaceAttribute {
  /**
   * The workspace's `package.json` file does not have a `type: "module"` key.
   */
  Cjs = 'cjs',
  /**
   * The workspace's `package.json` file has a `bin` key.
   */
  Cli = 'cli',
  /**
   * The workspace's `package.json` file has a `type: "module"` key.
   */
  Esm = 'esm',
  /**
   * The workspace's `package.json` file has a `private: true` key.
   */
  Private = 'private',
  /**
   * A {@link webpackConfigProjectBase} file exists at the workspace's root.
   */
  Webpack = 'webpack',
  /**
   * The workspace root contains the file {@link sharedConfigPackageBase},
   * signifying that paths and commits scoped to this workspace will be
   * considered "global"; that is: as if they existed in the scopes of every
   * workspace in the project.
   *
   * The existence of this attribute will modify the behavior of xscript
   * commands like "build changelog", and in "release" when analyzing commits to
   * determine the next release version.
   *
   * Beside changelog generation, **no build artifacts or distributables are
   * affected by shared packages**. For instance, a shared package is not
   * automatically included in the build distributables of some other unrelated
   * package.
   */
  Shared = 'shared'
}

/**
 * A collection of useful information about a project.
 */
export type ProjectMetadata<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The type of the project.
   */
  type: ProjectAttribute.Polyrepo | ProjectAttribute.Monorepo;
  /**
   * Project root package data.
   */
  rootPackage: RootPackage<Json>;
  /**
   * The "current package" data. The "current" package is determined by the
   * current working directory and will always strictly equal (`===`) either (1)
   * exactly one value in {@link RootPackage.packages}'s `all` property or (2)
   * `rootPackage`.
   */
  cwdPackage: Package<Json>;
  /**
   * A mapping of sub-root package names to {@link WorkspacePackage} objects in
   * a monorepo, or `undefined` in a polyrepo.
   */
  subRootPackages:
    | (Map<WorkspacePackageName, WorkspacePackage> & {
        /**
         * A mapping of sub-root packages missing the `"name"` field in their
         * respective `package.json` files and {@link WorkspacePackage} objects.
         */
        unnamed: Map<WorkspacePackageId, WorkspacePackage<PackageJson>>;
        /**
         * An array of "broken" pseudo-sub-root pseudo-package directories that
         * are matching workspace paths but are missing a `package.json` file.
         */
        broken: AbsolutePath[];
        /**
         * An array of *all* non-broken sub-root packages both named and
         * unnamed. Sugar for the following:
         *
         * ```TypeScript
         * Array.from(packages.values())
         *      .concat(Array.from(packages.unnamed.values()))
         * ```
         */
        all: WorkspacePackage<Json>[];
      })
    | undefined;
};

/**
 * In the context of a {@link Package}, this object represents a collection of
 * all the file paths **relative to the _project root_** that must be transpiled
 * (source; typically TypeScript files) and/or copied (assets; typically
 * everything that isn't a TypeScript file) to build a specific package.
 *
 * These paths are split into internal and external
 * {@link PackageBuildTargets.targets}. Interesting
 * {@link PackageBuildTargets.metadata} is returned as well.
 */
export type PackageBuildTargets = {
  /**
   * The file paths, **relative to the _project root_**, that must be transpiled
   * and/or copied when building a specific {@link Package}'s distributables.
   */
  targets: {
    /**
     * These {@link RelativePath}s are the internal build targets belonging to
     * the package. They are the contents of `${packageRoot}/src` and can be any
     * file type.
     *
     * These paths will always be **relative to the _project root_**.
     */
    internal: Set<RelativePath>;
    /**
     * These {@link RelativePath}s are the so-called "multiversal" build targets
     * external to the package. They are derived from import specifiers and can
     * be any file type.
     *
     * These paths will always be **relative to the _project root_**.
     */
    external: Set<RelativePath>;
  };
  // TODO: probably prudent to split this off into its own thing, perhaps even
  // TODO: its own function (or gated behind a parameter or something)
  metadata: {
    imports: {
      /**
       * A mapping between well-known import aliases within the project and the
       * number of times they are imported by the build target files.
       *
       * Imports from non-TS JS files under `${packageRoot}/src` (so: assets)
       * will be prefixed with `<❗FROM-ASSET> `.
       */
      aliasCounts: Record<string, number>;
      /**
       * A mapping between packages imported from outside the project, such as
       * builtins (e.g. from Node) and dependencies (e.g. node_modules), and the
       * number of times those packages are imported by the build target files.
       *
       * Imports from non-TS JS files under `${packageRoot}/src` (so: assets)
       * will be prefixed with `<❗FROM-ASSET> `.
       */
      dependencyCounts: Record<string, number>;
    };
  };
};

/**
 * A collection of {@link AbsolutePath}s within this project organized by
 * location and utility.
 *
 * Unnamed and broken workspaces/packages are ignored.
 */
export type ProjectFiles = {
  /**
   * The project's various `package.json` files.
   */
  packageJsonFiles: {
    /**
     * An absolute path to the project's root `package.json` file.
     */
    atProjectRoot: AbsolutePath;
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * each workspace's root `package.json` files.
     */
    atWorkspaceRoot: Map<WorkspacePackageId, AbsolutePath>;
    /**
     * Sugar for `atProjectRoot + atWorkspaceRoot`.
     */
    atAnyRoot: AbsolutePath[];
    /**
     * Other `package.json` files within the project that are not at a root or
     * sub-root. These `package.json` files are likely used to set the `type` of
     * surrounding JavaScript files and/or belong to unnamed or broken
     * workspaces.
     */
    elsewhere: AbsolutePath[];
  };
  /**
   * The first defined `bin` value (i.e. each package's "main binary") within
   * the project's root and sub-root `package.json`'s files.
   */
  mainBinFiles: {
    /**
     * An absolute path to an executable derived from the project's root
     * `package.json` `bin` value (if it exists).
     */
    atProjectRoot: AbsolutePath | undefined;
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute executable
     * paths derived from each workspace's root `package.json` `bin` value (if
     * it exists).
     */
    atWorkspaceRoot: Map<WorkspacePackageId, AbsolutePath | undefined>;
    /**
     * Sugar for `atProjectRoot + atWorkspaceRoot`.
     */
    atAnyRoot: AbsolutePath[];
  };
  /**
   * The project's Markdown (.md) files.
   */
  markdownFiles: {
    /**
     * An array of zero or more absolute paths to Markdown files within the
     * project but not within any workspace.
     */
    inRoot: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * Markdown files within the project's workspaces.
     */
    inWorkspace: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * Sugar for `inRoot + inWorkspace`.
     */
    all: AbsolutePath[];
  };
  /**
   * The project's TypeScript (.ts, .tsx, .mts, .cts) files that are within a
   * `src/` directory.
   */
  typescriptSrcFiles: {
    /**
     * An array of zero or more absolute paths to TypeScript files within the
     * project's root `src/` directory.
     */
    inRootSrc: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * TypeScript files within each project workspace's `src/` directory.
     */
    inWorkspaceSrc: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * Sugar for `inRootSrc + inWorkspaceSrc`.
     */
    all: AbsolutePath[];
  };
  /**
   * The project's TypeScript (.ts, .tsx, .mts, .cts) files with names following
   * the pattern `*.test.{ts,tsx,mts,cts}` that are within a `test/` directory.
   */
  typescriptTestFiles: {
    /**
     * An array of zero or more absolute paths to TypeScript files with names
     * following the pattern `*.test.{ts,tsx,mts,cts}` that are within the
     * project's root `test/` directory.
     */
    inRootTest: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * TypeScript files with names following the pattern
     * `*.test.{ts,tsx,mts,cts}` that are within each project workspace's
     * `test/` directory.
     */
    inWorkspaceTest: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * Sugar for `inRootTest + inWorkspaceTest`.
     */
    all: AbsolutePath[];
  };
};

/**
 * In the context of a {@link Package}, this type represents a collection of
 * {@link AbsolutePath}s, one for each file under the package root that is not
 * ignored by Git. However, note that files under `${packageRoot}/dist`, while
 * usually ignored by Git, will _not_ be automatically ignored by this function.
 *
 * The collection is organized by location and utility.
 */
export type PackageFiles = {
  /**
   * Every file under the package's `./dist` directory.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  dist: AbsolutePath[];
  /**
   * Every file under the package's `./docs` directory that is not ignored by
   * Git.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  docs: AbsolutePath[];
  /**
   * Every file under the package's `./src` directory that is not ignored by
   * Git. Does not include files under `./types` (those are in
   * {@link PackageFiles.other}).
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  src: AbsolutePath[];
  /**
   * Every file under the package's `./test` directory that is not ignored by
   * Git.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  test: AbsolutePath[];
  /**
   * Every file under the package's root directory that is not ignored by Git
   * nor contained in any other {@link PackageFiles} property.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  other: AbsolutePath[];
};

/**
 * A collection of useful information about a polyrepo.
 *
 * @see {@link ProjectMetadata}
 */
export type PolyrepoMetadata<Json extends PackageJson | XPackageJson = XPackageJson> =
  ProjectMetadata<Json> & {
    type: ProjectAttribute.Polyrepo;
    subRootPackages: undefined;
  };

/**
 * A collection of useful information about a monorepo.
 *
 * @see {@link ProjectMetadata}
 */
export type MonorepoMetadata<Json extends PackageJson | XPackageJson = XPackageJson> =
  ProjectMetadata<Json> & {
    type: ProjectAttribute.Monorepo;
    subRootPackages: NonNullable<ProjectMetadata['subRootPackages']>;
  };

/**
 * Additional scripts available when working on an xscripts-powered project.
 */
export type XPackageJsonScripts = {
  /**
   * Run by users, xscripts, and related tooling when building the current
   * package's production-ready distributables.
   *
   * This script is usually a reference to `npm run build:dist`.
   *
   * @example `npm run build:dist --`
   */
  build?: string;
  /**
   * Run by users, xscripts, and related tooling when building the current
   * package's `CHANGELOG.md` file.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts build changelog`
   */
  'build:changelog'?: string;
  /**
   * Run by users, xscripts, and related tooling when building the current
   * package's production-ready distributables.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts build distributables`
   */
  'build:dist'?: string;
  /**
   * Run by users, xscripts, and related tooling when building the current
   * package's documentation (typically found under `docs/`).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts build docs`
   */
  'build:docs'?: string;
  /**
   * Run by users, xscripts, and related tooling when removing files from the
   * project or package that are ignored by git (with exceptions).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts clean`
   */
  clean?: string;
  /**
   * Run by users, xscripts, and related tooling when formatting the project
   * or package.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts format --hush`
   */
  format?: string;
  /**
   * Run by users, xscripts, and related tooling when printing information
   * about the current project or package.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts project info`
   */
  info?: string;
  /**
   * Run by users, xscripts, and related tooling when linting the current
   * package's files.
   *
   * This script is usually a reference to `npm run lint:package`.
   *
   * @example `npm run lint:package --`
   */
  lint?: string;
  /**
   * Run by users, xscripts, and related tooling when linting all of the
   * lintable files under the current package's root along with any other
   * source files that comprise this package's build targets (see
   * {@link gatherPackageBuildTargets}).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts lint --scope this-package`
   */
  'lint:package'?: string;
  /**
   * Run by users, xscripts, and related tooling when linting all lintable
   * files in the entire project.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts lint --scope unlimited`
   */
  'lint:packages'?: string;
  /**
   * Run by users, xscripts, and related tooling when linting a project's
   * metadata, such as its file structure and configuration settings.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts project lint`
   */
  'lint:project'?: string;
  /**
   * Run by users, xscripts, and related tooling when printing information
   * about available scripts in `package.json`.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts list-tasks`
   */
  'list-tasks'?: string;
  /**
   * Run by users, xscripts, and related tooling when preparing a fresh
   * development environment.
   *
   * See [the
   * docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
   * for more information.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts project prepare`
   */
  prepare?: string;
  /**
   * Run by users, xscripts, and related tooling when potentially releasing
   * the next version of a package.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts release`
   */
  release?: string;
  /**
   * Run by users, xscripts, and related tooling when manipulating a project's
   * _metadata_, such as its file structure and configuration settings, with
   * the goal of bringing the project up to date on latest best practices.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts project renovate --`
   */
  renovate?: string;
  /**
   * Run by users, xscripts, and related tooling when attempting to execute a
   * project's distributables locally.
   *
   * See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
   * for more information.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts start --`
   */
  start?: string;
  /**
   * Run by users, xscripts, and related tooling when spinning up a project's
   * local development environment.
   */
  dev?: string;
  /**
   * Run by users, xscripts, and related tooling  when executing unit tests
   * against the current package.
   *
   * This script is usually a reference to `npm run test:package:unit`. See
   * [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for
   * more information.
   *
   * @example `npm run test:package:unit --`
   */
  test?: string;
  /**
   * Run by users, xscripts, and related tooling when executing all possible
   * tests against the current package. In a monorepo context, this script
   * will also run the tests of any package that this package depends on
   * (including transitive dependencies).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --coverage`
   */
  'test:package:all'?: string;
  /**
   * Run by users, xscripts, and related tooling when executing end-to-end
   * tests against the current package. In a monorepo context, this script
   * will also run the tests of any package that this package depends on
   * (including transitive dependencies).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests end-to-end`
   */
  'test:package:e2e'?: string;
  /**
   * Run by users, xscripts, and related tooling when executing integration
   * tests against the current package. In a monorepo context, this script
   * will also run the tests of any package that this package depends on
   * (including transitive dependencies).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests integration`
   */
  'test:package:integration'?: string;
  /**
   * Run by users, xscripts, and related tooling when executing unit tests
   * against the current package. In a monorepo context, this script
   * will also run the tests of any package that this package depends on
   * (including transitive dependencies).
   *
   * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests unit`
   */
  'test:package:unit'?: string;
  /**
   * Run by users, xscripts, and related tooling when executing all possible
   * tests across the entire project.
   *
   * @example `NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage`
   */
  'test:packages:all'?: string;
};

/**
 * A version of {@link PackageJson} used by xscripts-powered projects with
 * certain additional properties and other properties that are guaranteed to
 * exist.
 */
export type XPackageJson<Scripts extends Record<string, string> = XPackageJsonScripts> =
  Omit<OmitIndexSignature<PackageJson>, 'bin' | 'name'> & {
    scripts?: Scripts;
    bin?: string | Record<string, string>;
    name: NonNullable<PackageJson['name']>;
  };

/**
 * A version of {@link XPackageJson} specifically for polyrepo roots.
 */
export type XPackageJsonPolyrepoRoot = Omit<XPackageJson, 'workspaces'>;

/**
 * A version of {@link XPackageJson} specifically for non-hybrid monorepo roots.
 */
export type XPackageJsonMonorepoProjectRoot = Omit<XPackageJson, 'dependencies'> &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

/**
 * A version of {@link XPackageJson} specifically for hybridrepo roots.
 */
export type XPackageJsonHybridrepoProjectRoot = XPackageJson &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

/**
 * A version of {@link XPackageJson} specifically for package subroots in a
 * monorepo.
 */
export type XPackageJsonMonorepoPackageRoot = Omit<
  XPackageJson,
  'workspaces' | 'devDependencies'
>;

/**
 * Represents any `package.json` file in the wild, including xscript-ready
 * `package.json` files.
 */
export type GenericPackageJson = PackageJson | XPackageJson;

/**
 * A non-generic version of {@link ProjectMetadata} with
 * {@link GenericPackageJson} as its type parameter.
 */
export type GenericProjectMetadata = ProjectMetadata<GenericPackageJson>;

/**
 * A non-generic version of {@link Package} with {@link GenericPackageJson} as
 * its type parameter.
 */
export type GenericPackage = Package<GenericPackageJson>;

/**
 * A non-generic version of {@link WorkspacePackage} with
 * {@link GenericPackageJson} as its type parameter.
 */
export type GenericWorkspacePackage = WorkspacePackage<GenericPackageJson>;

/**
 * A non-generic version of {@link RootPackage} with {@link GenericPackageJson}
 * as its type parameter.
 */
export type GenericRootPackage = RootPackage<GenericPackageJson>;

/**
 * Used to assign the result of an asynchronous operation to some key in some
 * object. For example:
 *
 * ```typescript
 * await Promise.all(items.map(async (item) => { ... }))
 *   .then((mappedItems) => new Map(mappedItems))
 *   .then(assignResultTo(accumulatorObject, 'someKey'));
 *
 * await someAsyncFn(something).then(
 *   assignResultTo(accumulatorObject, 'someOtherKey')
 * );
 * ```
 */
export function assignResultTo(parentObject: Record<string, unknown>, key: string) {
  return function (result: unknown) {
    parentObject[key] = result;
  };
}

/**
 * Returns `true` if `o` is probably an instance of `RootPackage` or
 * `WorkspacePackage`.
 */
export function isPackage(o: unknown): o is Package {
  return isWorkspacePackage(o) || isRootPackage(o);
}

/**
 * Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
 * a {@link RootPackage}).
 */
export function isWorkspacePackage(o: unknown): o is WorkspacePackage {
  return (
    !!o &&
    typeof o === 'object' &&
    'id' in o &&
    'root' in o &&
    'json' in o &&
    'attributes' in o &&
    'projectMetadata' in o
  );
}

/**
 * Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
 * {@link WorkspacePackage}).
 */
// TODO: unit test these isX functions
export function isRootPackage(o: unknown): o is RootPackage {
  return (
    !!o &&
    typeof o === 'object' &&
    !('id' in o) &&
    'root' in o &&
    'json' in o &&
    'attributes' in o &&
    'projectMetadata' in o
  );
}

// TODO: aren't these sentinel functions the use case for Zod? Let's try that!
/**
 * Returns `true` if `o` is probably an instance of `ProjectMetadata`.
 */
export function isProjectMetadata(o: unknown): o is ProjectMetadata {
  return (
    !!o &&
    typeof o === 'object' &&
    'type' in o &&
    [ProjectAttribute.Polyrepo, ProjectAttribute.Monorepo].includes(
      o.type as ProjectAttribute
    ) &&
    'rootPackage' in o &&
    isRootPackage(o.rootPackage) &&
    'cwdPackage' in o &&
    isPackage(o.cwdPackage) &&
    'subRootPackages' in o
  );
}

/**
 * Returns `true` if `o` is probably an instance of `XPackageJson`.
 */
export function isXPackageJson(o: unknown): o is XPackageJson {
  return !!(
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    o.name.length
  );
}
