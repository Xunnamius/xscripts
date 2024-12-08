import {
  isRootPackage,
  ProjectAttribute,
  type XPackageJson,
  type XPackageJsonHybridrepoProjectRoot,
  type XPackageJsonMonorepoPackageRoot,
  type XPackageJsonMonorepoProjectRoot,
  type XPackageJsonPolyrepoRoot
} from 'multiverse+project-utils:analyze/common.ts';

import { generatePackageJsonEngineMaintainedNodeVersions } from 'multiverse+project-utils:analyze/generate-package-json-engine-maintained-node-versions.ts';

import { version as xscriptsVersion } from 'rootverse:package.json';

import { compileTemplateInMemory, makeTransformer } from 'universe:assets.ts';

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
    renovate: 'NODE_NO_WARNINGS=1 xscripts project renovate --',
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
