import { createDebugLogger } from 'multiverse+rejoinder';

import { globalDebuggerNamespace } from 'rootverse+project-utils:src/constant.ts';

import {
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs/common.ts';

// @ts-expect-error: used in documentation
import type {
  // ? Used in documentation eslint-disable-next-line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nextjsConfigProjectBase,
  // ? Used in documentation eslint-disable-next-line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpackConfigProjectBase
} from 'rootverse+project-utils:src/fs/well-known-constants.ts';

import type { PackageJson } from 'type-fest';

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
export type RootPackage = {
  /**
   * The absolute path to the root directory of the entire project.
   */
  root: AbsolutePath;
  /**
   * The contents of the root `package.json` file.
   */
  json: PackageJson;
  /**
   * A collection of {@link ProjectAttribute} flags describing the project.
   */
  attributes: { [key in ProjectAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata;
};

/**
 * An object representing a non-root package in a monorepo project.
 */
export type WorkspacePackage = {
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
  json: PackageJson;
  /**
   * A collection of {@link WorkspaceAttribute} flags describing the workspace.
   */
  attributes: { [key in WorkspaceAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata;
};

/**
 * An object representing a package in a monorepo or polyrepo project.
 *
 * @see {@link RootPackage}
 * @see {@link WorkspacePackage}
 */
export type Package = RootPackage | WorkspacePackage;

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
  Webpack = 'webpack'
}

/**
 * A collection of useful information about a project.
 */
export type ProjectMetadata = {
  /**
   * The type of the project.
   */
  type: ProjectAttribute.Polyrepo | ProjectAttribute.Monorepo;
  /**
   * Project root package data.
   */
  rootPackage: RootPackage;
  /**
   * The "current package" data. The "current" package is determined by the
   * current working directory and will always strictly equal (`===`) either (1)
   * exactly one value in {@link RootPackage.packages}'s `all` property or (2)
   * `rootPackage`.
   */
  cwdPackage: Package;
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
        unnamed: Map<WorkspacePackageId, WorkspacePackage>;
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
        all: WorkspacePackage[];
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
       * will be prefixed with `<!FROM-ASSET> `.
       */
      aliasCounts: Record<string, number>;
      /**
       * A mapping between packages imported from outside the project, such as
       * builtins (e.g. from Node) and dependencies (e.g. node_modules), and the
       * number of times those packages are imported by the build target files.
       *
       * Imports from non-TS JS files under `${packageRoot}/src` (so: assets)
       * will be prefixed with `<!FROM-ASSET> `.
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
     * A map of zero or more absolute paths to each workspace's root
     * `package.json` files.
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
     * A map of zero or more absolute executable paths derived from each
     * workspace's root `package.json` `bin` value (if it exists).
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
     * A map of zero or more absolute paths to Markdown files within the
     * project's workspaces.
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
  typescriptFiles: {
    /**
     * An array of zero or more absolute paths to TypeScript files within the
     * project's root `src/` directory.
     */
    inRootSrc: AbsolutePath[];
    /**
     * A map of zero or more absolute paths to TypeScript files within each
     * project workspace's `src/` directory.
     */
    inWorkspaceSrc: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * Sugar for `inRootSrc + inWorkspaceSrc`.
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
   * Git.
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
   * Every file under the package's root directory that is not ignored by Git,
   * not contained in any other {@link PackageFiles} property.
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
export type PolyrepoMetadata = ProjectMetadata & {
  type: ProjectAttribute.Polyrepo;
  subRootPackages: undefined;
};

/**
 * A collection of useful information about a monorepo.
 *
 * @see {@link ProjectMetadata}
 */
export type MonorepoMetadata = ProjectMetadata & {
  type: ProjectAttribute.Monorepo;
  subRootPackages: NonNullable<ProjectMetadata['subRootPackages']>;
};

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
 * Returns `true` if `o` is probably an instance of `WorkspacePackage`.
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
 * Returns `true` if `o` is probably an instance of `RootPackage`.
 */
export function isRootPackage(o: unknown): o is RootPackage {
  return (
    !!o &&
    typeof o === 'object' &&
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
