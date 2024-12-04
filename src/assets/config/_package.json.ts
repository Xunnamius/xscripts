import {
  generatePackageJsonEngineMaintainedNodeVersions,
  isRootPackage,
  ProjectAttribute,
  // ? Used in documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type gatherPackageBuildTargets
} from 'multiverse+project-utils:analyze.ts';

import { version as xscriptsVersion } from 'rootverse:package.json';

import { compileTemplateInMemory, makeTransformer } from 'universe:assets.ts';

import type { OmitIndexSignature, PackageJson } from 'type-fest';

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
   * @example `NODE_NO_WARNINGS=1 xscripts project renovate`
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

// TODO: the XPackageJson type goes into @-xun/types (also update deps) because
// TODO: importing this type needs to be lightweight and not require the whole
// TODO: @-xun/scripts package!
export type XPackageJson<Scripts extends Record<string, string> = XPackageJsonScripts> =
  Omit<OmitIndexSignature<PackageJson>, 'bin'> & {
    scripts?: Scripts;
    bin?: string | Record<string, string>;
  };

export type XPackageJsonPolyrepoRoot = Omit<XPackageJson, 'workspaces'>;

export type XPackageJsonMonorepoProjectRoot = Omit<XPackageJson, 'dependencies'> &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

export type XPackageJsonHybridrepoProjectRoot = XPackageJson &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

export type XPackageJsonMonorepoPackageRoot = Omit<
  XPackageJson,
  'workspaces' | 'devDependencies'
>;

export const baseXPackageJson = {
  name: '{{packageName}}',
  version: '{{packageVersion}}',
  description: '{{packageDescription}}',
  keywords: [],
  homepage: '{{repoUrl}}#readme',
  bugs: {
    url: '{{repoUrl}}/issues'
  },
  repository: {
    type: 'git',
    url: 'git+{{repoUrl}}.git'
  },
  license: 'MIT',
  author: 'Xunnamius',
  sideEffects: false,
  type: 'commonjs',
  exports: {
    '.': {
      types: './dist/src/index.d.ts',
      default: './dist/src/index.js'
    },
    './package': './package.json',
    './package.json': './package.json'
  },
  typesVersions: {
    '*': {
      index: ['dist/src/index.d.ts'],
      package: ['package.json']
    }
  },
  files: ['/dist', '/LICENSE', '/package.json', '/README.md'],
  scripts: {
    build: 'npm run build:dist --',
    'build:changelog': 'NODE_NO_WARNINGS=1 xscripts build changelog',
    'build:dist': 'NODE_NO_WARNINGS=1 xscripts build distributables',
    'build:docs': 'NODE_NO_WARNINGS=1 xscripts build docs',
    clean: 'NODE_NO_WARNINGS=1 xscripts clean',
    format: 'NODE_NO_WARNINGS=1 xscripts format --hush',
    info: 'NODE_NO_WARNINGS=1 xscripts project info',
    lint: 'npm run lint:package --',
    'lint:package': 'NODE_NO_WARNINGS=1 xscripts lint',
    'lint:packages': 'NODE_NO_WARNINGS=1 xscripts lint --scope unlimited',
    'lint:project': 'NODE_NO_WARNINGS=1 xscripts project lint',
    'list-tasks': 'NODE_NO_WARNINGS=1 xscripts list-tasks',
    prepare: 'NODE_NO_WARNINGS=1 xscripts project prepare',
    release: 'NODE_NO_WARNINGS=1 xscripts release',
    renovate: 'NODE_NO_WARNINGS=1 xscripts project renovate',
    start: 'NODE_NO_WARNINGS=1 xscripts start --',
    test: 'npm run test:package:unit --',
    'test:package:all': 'NODE_NO_WARNINGS=1 xscripts test --coverage',
    'test:package:e2e': 'NODE_NO_WARNINGS=1 xscripts test --tests end-to-end',
    'test:package:integration': 'NODE_NO_WARNINGS=1 xscripts test --tests integration',
    'test:package:unit': 'NODE_NO_WARNINGS=1 xscripts test --tests unit',
    'test:packages:all': 'NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage'
  },
  engines: {
    node: generatePackageJsonEngineMaintainedNodeVersions({ format: 'engines' })
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org'
  }
} as const satisfies XPackageJson;

export const basePolyrepoXPackageJson = {
  ...baseXPackageJson,
  dependencies: {},
  devDependencies: {
    '@-xun/scripts': `^${xscriptsVersion}`
  }
} as const satisfies XPackageJsonPolyrepoRoot;

export const baseMonorepoProjectRootXPackageJson = {
  ...baseXPackageJson,
  name: '{{repoName}}-monorepo',
  version: '0.0.0-monorepo',
  description: 'Monorepo for the {{repoName}} project',
  private: true,
  devDependencies: basePolyrepoXPackageJson.devDependencies,
  workspaces: ['packages/*', '!packages/*.ignore*']
} as const satisfies XPackageJsonMonorepoProjectRoot;

export const baseHybridrepoProjectRootXPackageJson = {
  ...basePolyrepoXPackageJson,
  workspaces: baseMonorepoProjectRootXPackageJson.workspaces
} as const satisfies XPackageJsonHybridrepoProjectRoot;

export const baseMonorepoPackageRootXPackageJson = {
  ...baseXPackageJson,
  dependencies: basePolyrepoXPackageJson.dependencies
} as const satisfies XPackageJsonMonorepoPackageRoot;

export const { transformer } = makeTransformer({
  transform(context) {
    const {
      asset,
      projectMetadata: {
        rootPackage: { attributes: projectAttributes },
        cwdPackage
      }
    } = context;

    const packageJsonString = JSON.stringify(getBasePackageJson(), undefined, 2);

    return {
      [asset]: compileTemplateInMemory(packageJsonString, context)
    };

    function getBasePackageJson() {
      if (projectAttributes[ProjectAttribute.Polyrepo]) {
        return basePolyrepoXPackageJson;
      }

      const isCwdPackageTheRootPackage = isRootPackage(cwdPackage);

      if (isCwdPackageTheRootPackage) {
        return baseMonorepoPackageRootXPackageJson;
      }

      return projectAttributes[ProjectAttribute.Hybridrepo]
        ? baseHybridrepoProjectRootXPackageJson
        : baseMonorepoProjectRootXPackageJson;
    }
  }
});
