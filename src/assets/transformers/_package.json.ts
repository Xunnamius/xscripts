import { type Jsonifiable } from 'type-fest';

import {
  isRootPackage,
  ProjectAttribute,
  type Package,
  type XPackageJson,
  type XPackageJsonHybridrepoProjectRoot,
  type XPackageJsonMonorepoPackageRoot,
  type XPackageJsonMonorepoProjectRoot,
  type XPackageJsonPolyrepoRoot
} from 'multiverse+project-utils:analyze/common.ts';

import { generatePackageJsonEngineMaintainedNodeVersions } from 'multiverse+project-utils:analyze/generate-package-json-engine-maintained-node-versions.ts';
import { ProjectError } from 'multiverse+project-utils:error.ts';
import { packageJsonConfigPackageBase } from 'multiverse+project-utils:fs.ts';

import { version as xscriptsVersion } from 'rootverse:package.json';

import { makeTransformer, type Asset } from 'universe:assets.ts';
import { DefaultGlobalScope } from 'universe:configure.ts';
import { ErrorMessage } from 'universe:error.ts';

export type GeneratorParameters = [
  json: Package['json'] &
    Required<Pick<Package['json'], 'name' | 'version' | 'description'>>,
  repoUrl: string
];

// ! Can never use the global (g) flag
export const githubUrlRegExp = /github.com\/([^/]+)\/([^/]+?)(?:\.git)?$/;

export function generateBaseXPackageJson(...[json, repoUrl]: GeneratorParameters) {
  return {
    ...json,
    name: json.name,
    version: json.version,
    description: json.description,
    keywords: json.keywords || [],
    homepage: `${repoUrl}#readme`,
    bugs: {
      url: `${repoUrl}/issues`
    },
    repository: {
      type: 'git',
      url: `git+${repoUrl}.git`
    },
    license: json.license ?? 'MIT',
    author: json.author ?? 'Xunnamius',
    sideEffects: json.sideEffects ?? false,
    type: json.type ?? 'commonjs',
    exports: json.exports ?? {
      '.': {
        types: './dist/src/index.d.ts',
        default: './dist/src/index.js'
      },
      './package': './package.json',
      './package.json': './package.json'
    },
    typesVersions: json.typesVersions ?? {
      '*': {
        index: ['dist/src/index.d.ts'],
        package: ['package.json']
      }
    },
    files: json.files ?? ['/dist', '/LICENSE', '/package.json', '/README.md'],
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
      renovate:
        'NODE_NO_WARNINGS=1 xscripts project renovate --sync-deps --github-reconfigure-repo --regenerate-assets --assets-preset basic',
      start: 'NODE_NO_WARNINGS=1 xscripts start --',
      test: 'npm run test:package:unit --',
      'test:package:all': 'NODE_NO_WARNINGS=1 xscripts test --coverage',
      'test:package:e2e': 'NODE_NO_WARNINGS=1 xscripts test --tests end-to-end',
      'test:package:integration': 'NODE_NO_WARNINGS=1 xscripts test --tests integration',
      'test:package:unit': 'NODE_NO_WARNINGS=1 xscripts test --tests unit',
      'test:packages:all':
        'NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage'
    },
    engines: json.engines ?? {
      node: generatePackageJsonEngineMaintainedNodeVersions({ format: 'engines' })
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org',
      ...json.publishConfig
    }
  } as const satisfies XPackageJson;
}

export function generateBasePolyrepoXPackageJson(
  ...[json, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(json, repoUrl),
    dependencies: json.dependencies ?? {},
    devDependencies: json.devDependencies ?? {
      '@-xun/scripts': `^${xscriptsVersion}`
    }
  } as const satisfies XPackageJsonPolyrepoRoot;
}

export function generateBaseMonorepoProjectRootXPackageJson(
  ...[json, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(json, repoUrl),
    name: json.name.endsWith('-monorepo') ? json.name : `${json.name}-monorepo`,
    version: json.version.endsWith('-monorepo')
      ? json.version
      : `${json.version}-monorepo`,
    private: true,
    devDependencies: json.devDependencies ?? {},
    workspaces: json.workspaces ?? ['packages/*', '!packages/*.ignore*']
  } as const satisfies XPackageJsonMonorepoProjectRoot;
}

export function generateBaseHybridrepoProjectRootXPackageJson(
  ...[json, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseMonorepoProjectRootXPackageJson(json, repoUrl),
    private: false,
    ...generateBasePolyrepoXPackageJson(json, repoUrl)
  } as const satisfies XPackageJsonHybridrepoProjectRoot;
}

export function generateBaseMonorepoPackageRootXPackageJson(
  ...[json, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(json, repoUrl)
  } as const satisfies XPackageJsonMonorepoPackageRoot;
}

/**
 * Takes an {@link XPackageJson} instance and returns the repository owner and
 * name or throws if said information is not derivable.
 */
export function parsePackageJsonRepositoryIntoOwnerAndRepo({
  repository,
  name
}: XPackageJson) {
  if (repository) {
    const target = typeof repository === 'string' ? repository : repository.url;
    const match = target.match(githubUrlRegExp);

    if (match) {
      const [, owner, repo] = match;
      return { owner, repo };
    }
  }

  throw new ProjectError(ErrorMessage.BadRepositoryInCwdPackageJson(name));
}

export const { transformer } = makeTransformer(function (context) {
  const {
    scope,
    toProjectAbsolutePath,
    projectMetadata: { rootPackage, cwdPackage, subRootPackages }
  } = context;

  const assets: Asset[] = [];
  const { attributes: projectAttributes } = rootPackage;

  if (scope === DefaultGlobalScope.ThisPackage) {
    addPackageAssets(cwdPackage);
  } else {
    const allPackages = [cwdPackage].concat(...(subRootPackages?.values() || []));
    for (const package_ of allPackages) {
      addPackageAssets(package_);
    }
  }

  return assets;

  function addPackageAssets({ json: packageJson, ...package_ }: Package) {
    const { owner, repo } = parsePackageJsonRepositoryIntoOwnerAndRepo(packageJson);
    const repoUrl = `https://github.com/${owner}/${repo}`;

    const isNonHybridMonorepo =
      rootPackage.attributes[ProjectAttribute.Monorepo] &&
      !rootPackage.attributes[ProjectAttribute.Hybridrepo];

    const packageJsonSubset = {
      name: packageJson.name,
      version: packageJson.version ?? (isNonHybridMonorepo ? '0.0.0-monorepo' : '1.0.0'),
      description:
        packageJson.description ??
        (isNonHybridMonorepo
          ? 'Monorepo for the {{repoName}} project'
          : 'TODO: project description here')
    } satisfies Parameters<typeof generateBaseXPackageJson>[0];

    if (projectAttributes[ProjectAttribute.Polyrepo]) {
      assets.push({
        path: toProjectAbsolutePath(packageJsonConfigPackageBase),
        generate: () =>
          stringify(generateBasePolyrepoXPackageJson(packageJsonSubset, repoUrl))
      });
    } else {
      const isPackageTheRootPackage = isRootPackage(package_);
      const relativeRoot = 'relativeRoot' in package_ ? package_.relativeRoot : '';

      if (isPackageTheRootPackage) {
        assets.push(
          rootPackage.attributes[ProjectAttribute.Hybridrepo]
            ? {
                path: toProjectAbsolutePath(relativeRoot, packageJsonConfigPackageBase),
                generate: () =>
                  stringify(
                    generateBaseHybridrepoProjectRootXPackageJson(
                      packageJsonSubset,
                      repoUrl
                    )
                  )
              }
            : {
                path: toProjectAbsolutePath(relativeRoot, packageJsonConfigPackageBase),
                generate: () =>
                  stringify(
                    generateBaseMonorepoProjectRootXPackageJson(
                      packageJsonSubset,
                      repoUrl
                    )
                  )
              }
        );
      } else {
        assets.push({
          path: toProjectAbsolutePath(relativeRoot, packageJsonConfigPackageBase),
          generate: () =>
            stringify(
              generateBaseMonorepoPackageRootXPackageJson(packageJsonSubset, repoUrl)
            )
        });
      }
    }
  }
});

function stringify(o: Jsonifiable) {
  return JSON.stringify(o, undefined, 2);
}
