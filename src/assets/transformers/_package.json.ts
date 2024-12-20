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

import {
  compileTemplateInMemory,
  generatePerPackageAssets,
  makeTransformer,
  type TransformerContext
} from 'universe:assets.ts';

import { ErrorMessage } from 'universe:error.ts';

export type GeneratorParameters = [
  json: Package['json'] &
    Required<Pick<Package['json'], 'name' | 'version' | 'description'>>,
  repoUrl: string
];

// ! Can never use the global (g) flag
export const githubUrlRegExp = /github.com\/([^/]+)\/([^/]+?)(?:\.git)?$/;

export function generateBaseXPackageJson(
  ...[incomingPackageJson, repoUrl]: GeneratorParameters
) {
  return {
    ...incomingPackageJson,
    name: incomingPackageJson.name,
    version: incomingPackageJson.version,
    description: incomingPackageJson.description,
    keywords: incomingPackageJson.keywords || [],
    homepage: `${repoUrl}#readme`,
    bugs: {
      url: `${repoUrl}/issues`
    },
    repository: {
      type: 'git',
      url: `git+${repoUrl}.git`
    },
    license: incomingPackageJson.license ?? 'MIT',
    author: incomingPackageJson.author ?? 'Xunnamius',
    sideEffects: incomingPackageJson.sideEffects ?? false,
    type: incomingPackageJson.type ?? 'commonjs',
    exports: incomingPackageJson.exports ?? {
      '.': {
        types: './dist/src/index.d.ts',
        default: './dist/src/index.js'
      },
      './package': './package.json',
      './package.json': './package.json'
    },
    typesVersions: incomingPackageJson.typesVersions ?? {
      '*': {
        index: ['dist/src/index.d.ts'],
        package: ['package.json']
      }
    },
    files: incomingPackageJson.files ?? [
      '/dist',
      '/LICENSE',
      '/package.json',
      '/README.md'
    ],
    scripts: {
      ...incomingPackageJson.scripts,
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
        'NODE_NO_WARNINGS=1 xscripts project renovate --github-reconfigure-repo --regenerate-assets --assets-preset basic',
      start: 'NODE_NO_WARNINGS=1 xscripts start --',
      test: 'npm run test:package:unit --',
      'test:package:all': 'NODE_NO_WARNINGS=1 xscripts test --coverage',
      'test:package:e2e': 'NODE_NO_WARNINGS=1 xscripts test --tests end-to-end',
      'test:package:integration': 'NODE_NO_WARNINGS=1 xscripts test --tests integration',
      'test:package:unit': 'NODE_NO_WARNINGS=1 xscripts test --tests unit',
      'test:packages:all':
        'NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage'
    },
    engines: incomingPackageJson.engines ?? {
      node: generatePackageJsonEngineMaintainedNodeVersions({ format: 'engines' })
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org',
      ...incomingPackageJson.publishConfig
    }
  } as const satisfies XPackageJson;
}

export function generateBasePolyrepoXPackageJson(
  ...[incomingPackageJson, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(incomingPackageJson, repoUrl),
    dependencies: incomingPackageJson.dependencies ?? {},
    devDependencies: incomingPackageJson.devDependencies ?? {
      '@-xun/scripts': `^${xscriptsVersion}`
    }
  } as const satisfies XPackageJsonPolyrepoRoot;
}

export function generateBaseMonorepoProjectRootXPackageJson(
  ...[incomingPackageJson, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(incomingPackageJson, repoUrl),
    name: incomingPackageJson.name.endsWith('-monorepo')
      ? incomingPackageJson.name
      : `${incomingPackageJson.name}-monorepo`,
    version: incomingPackageJson.version.endsWith('-monorepo')
      ? incomingPackageJson.version
      : `${incomingPackageJson.version}-monorepo`,
    private: true,
    devDependencies: incomingPackageJson.devDependencies ?? {},
    workspaces: incomingPackageJson.workspaces ?? ['packages/*', '!packages/*.ignore*']
  } as const satisfies XPackageJsonMonorepoProjectRoot;
}

export function generateBaseHybridrepoProjectRootXPackageJson(
  ...[incomingPackageJson, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseMonorepoProjectRootXPackageJson(incomingPackageJson, repoUrl),
    private: false,
    ...generateBasePolyrepoXPackageJson(incomingPackageJson, repoUrl)
  } as const satisfies XPackageJsonHybridrepoProjectRoot;
}

export function generateBaseMonorepoPackageRootXPackageJson(
  ...[incomingPackageJson, repoUrl]: GeneratorParameters
) {
  return {
    ...generateBaseXPackageJson(incomingPackageJson, repoUrl)
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

  throw new ProjectError(ErrorMessage.BadRepositoryInPackageJson(name));
}

export const { transformer } = makeTransformer(function (context) {
  const {
    toProjectAbsolutePath,
    forceOverwritePotentiallyDestructive,
    projectMetadata: {
      rootPackage: { attributes: projectAttributes }
    }
  } = context;

  // * Every package gets these files, including non-hybrid monorepo roots
  return generatePerPackageAssets(
    context,
    function ({ package_ }) {
      const { json: packageJson } = package_;

      const { owner, repo } = parsePackageJsonRepositoryIntoOwnerAndRepo(packageJson);
      const repoUrl = `https://github.com/${owner}/${repo}`;

      const isNonHybridMonorepo =
        projectAttributes[ProjectAttribute.Monorepo] &&
        !projectAttributes[ProjectAttribute.Hybridrepo];

      const finalPackageJson = {
        ...(forceOverwritePotentiallyDestructive ? {} : packageJson),
        name: packageJson.name,
        version:
          packageJson.version ?? (isNonHybridMonorepo ? '0.0.0-monorepo' : '1.0.0'),
        description:
          packageJson.description ??
          (isNonHybridMonorepo
            ? 'Monorepo for the {{repoName}} project'
            : 'TODO: project or package description here')
      } satisfies Parameters<typeof generateBaseXPackageJson>[0];

      if (projectAttributes[ProjectAttribute.Polyrepo]) {
        return [
          {
            path: toProjectAbsolutePath(packageJsonConfigPackageBase),
            generate: () =>
              stringify(
                generateBasePolyrepoXPackageJson(finalPackageJson, repoUrl),
                context
              )
          }
        ];
      } else {
        const isPackageTheRootPackage = isRootPackage(package_);
        const relativeRoot = 'relativeRoot' in package_ ? package_.relativeRoot : '';

        if (isPackageTheRootPackage) {
          return projectAttributes[ProjectAttribute.Hybridrepo]
            ? [
                {
                  path: toProjectAbsolutePath(
                    relativeRoot,
                    packageJsonConfigPackageBase
                  ),
                  generate: () =>
                    stringify(
                      generateBaseHybridrepoProjectRootXPackageJson(
                        finalPackageJson,
                        repoUrl
                      ),
                      context
                    )
                }
              ]
            : [
                {
                  path: toProjectAbsolutePath(
                    relativeRoot,
                    packageJsonConfigPackageBase
                  ),
                  generate: () =>
                    stringify(
                      generateBaseMonorepoProjectRootXPackageJson(
                        finalPackageJson,
                        repoUrl
                      ),
                      context
                    )
                }
              ];
        } else {
          return [
            {
              path: toProjectAbsolutePath(relativeRoot, packageJsonConfigPackageBase),
              generate: () =>
                stringify(
                  generateBaseMonorepoPackageRootXPackageJson(finalPackageJson, repoUrl),
                  context
                )
            }
          ];
        }
      }
    },
    { includeRootPackageInNonHybridMonorepo: true }
  );
});

function stringify(o: Jsonifiable, context: TransformerContext) {
  return compileTemplateInMemory(JSON.stringify(o, undefined, 2), context);
}
