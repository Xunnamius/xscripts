import { basename, resolve } from 'node:path';

import { type Package } from '#project-utils src/analyze/common.ts';
import * as fs from '#project-utils src/fs.ts';

import {
  ProjectAttribute,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage
} from '#project-utils src/index.ts';

import type { PackageJson } from 'type-fest';

/**
 * Patch the package.json data returned by {@link fs.readPackageJsonAtRoot} or
 * the sync version. Successive calls to this function overwrite previous calls.
 */
export function patchReadPackageJsonAtRoot(
  /**
   * The `package.json` patches to apply per root path. When `root` is equal to
   * `"*"`, it will be used to patch all `package.json` imports but can be
   * overwritten by a more specific `root` string.
   */
  spec: { [root: string]: PackageJson },
  /**
   * Options that influence the patching process.
   */
  options?: {
    /**
     * Whether to merely patch the actual package.json contents (`undefined`),
     * completely replace them (`true`), or only overwrite them if they don't
     * already exist (`false`).
     *
     * @default undefined
     */
    replace?: boolean;
  }
) {
  const actualReadPackageJsonAtRoot = jest.requireActual<
    typeof import('#project-utils src/fs.ts')
  >('#project-utils src/fs.ts').readPackageJsonAtRoot;

  jest.spyOn(fs, 'readPackageJsonAtRoot').mockImplementation(async ({ root }) => {
    const packageJson = await actualReadPackageJsonAtRoot({ root });
    return finalize(root, packageJson);
  });

  // @ts-expect-error: we're mocking do we'll do what we like
  fs.readPackageJsonAtRoot.sync = ({ root }) => {
    const packageJson = actualReadPackageJsonAtRoot.sync({ root });
    return finalize(root, packageJson);
  };

  return spec;

  function finalize(root: string, packageJson: PackageJson): PackageJson {
    return options?.replace === false
      ? {
          ...spec['*'],
          ...spec[root],
          ...packageJson
        }
      : {
          ...(options?.replace ? {} : packageJson),
          ...spec['*'],
          ...spec[root]
        };
  }
}

/**
 * A type representing a dummy monorepo or polyrepo project's metadata.
 */
export type Fixture = {
  root: fs.AbsolutePath;
  json: PackageJson;
  attributes: RootPackage['attributes'];
  namedPackageMapData: PackageMapEntry[];
  unnamedPackageMapData: PackageMapEntry[];
  brokenPackageRoots: fs.AbsolutePath[];
};

/**
 * A type representing the name of an available fixture.
 */
export type FixtureName =
  | 'badHybridrepoBadSpecifiers'
  | 'goodHybridrepoSelfRef'
  | 'badMonorepo'
  | 'badMonorepoDuplicateIdUnnamed'
  | 'badMonorepoDuplicateName'
  | 'badMonorepoEmptyMdFiles'
  | 'badMonorepoNextjsProject'
  | 'badMonorepoNonPackageDir'
  | 'badPolyrepo'
  | 'badPolyrepoBadType'
  | 'badPolyrepoConflictingAttributes'
  | 'badPolyrepoEmptyMdFiles'
  | 'badPolyrepoImporter'
  | 'badPolyrepoNextjsProject'
  | 'badPolyrepoNonPackageDir'
  | 'badPolyrepoTsbuildinfo'
  | 'goodHybridrepo'
  | 'goodHybridrepoMultiversal'
  | 'goodMonorepo'
  | 'badMonorepoDuplicateIdNamed'
  | 'goodMonorepoNegatedPaths'
  | 'goodMonorepoNextjsProject'
  | 'goodMonorepoSimplePaths'
  | 'goodMonorepoWeirdAbsolute'
  | 'goodMonorepoWeirdBoneless'
  | 'goodMonorepoWeirdOverlap'
  | 'goodMonorepoWeirdSameNames'
  | 'goodMonorepoWeirdYarn'
  | 'goodMonorepoWindows'
  | 'goodPolyrepo'
  | 'goodPolyrepoNextjsProject'
  | 'repoThatDoesNotExist';

/**
 * A type represents an object that will be expanded into a
 * {@link PackageMapEntry}.
 */
export type PackageMapDatum = {
  /**
   * A package's name (for named packages) or its id (for unnamed packages).
   */
  name: string;
  root: string;
  attributes: WorkspacePackage['attributes'];
};

/**
 * A type represents a single entry of a packages map.
 *
 * `name` represents a package's name (for named packages) or its id (for
 * unnamed packages).
 */
export type PackageMapEntry = [name: string, workspacePackage: WorkspacePackage];

/**
 * A collection of fixtures representing dummy monorepo and polyrepo projects.
 * Useful for testing purposes.
 */
export const fixtures = {} as Record<FixtureName, Fixture>;

fixtures.repoThatDoesNotExist = {
  root: '/does/not/exist' as fs.AbsolutePath,
  json: {},
  attributes: {},
  namedPackageMapData: [],
  unnamedPackageMapData: [],
  brokenPackageRoots: []
};

createFixture({
  fixtureName: 'goodHybridrepoSelfRef',
  prototypeRoot: 'good-hybridrepo-self-ref',
  attributes: {
    cjs: true,
    monorepo: true,
    hybridrepo: true,
    cli: true,
    private: true,
    vercel: true,
    webpack: true
  },
  namedPackageMapData: [
    // * Note how the package name and package-id diverge!
    { name: 'package-one', root: 'packages/pkg-1', attributes: { cjs: true, cli: true } }
  ],
  unnamedPackageMapData: []
});

createFixture({
  fixtureName: 'badHybridrepoBadSpecifiers',
  prototypeRoot: 'bad-hybridrepo-bad-specifiers',
  attributes: {
    cjs: true,
    monorepo: true,
    hybridrepo: true,
    cli: true,
    private: true,
    vercel: true,
    webpack: true
  },
  namedPackageMapData: [
    { name: 'package-one', root: 'packages/pkg-1', attributes: { cjs: true, cli: true } }
  ],
  unnamedPackageMapData: []
});

createFixture({
  fixtureName: 'badMonorepo',
  prototypeRoot: 'bad-monorepo',
  attributes: {},
  unnamedPackageMapData: [
    { name: 'empty', root: 'packages/0-empty', attributes: { cjs: true } },
    { name: 'tsbuildinfo', root: 'packages/1-tsbuildinfo', attributes: { cjs: true } },
    { name: 'bad-importer', root: 'packages/2-bad-importer', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'badMonorepoDuplicateName',
  prototypeRoot: 'bad-monorepo-duplicate-name',
  attributes: {}
});

createFixture({
  fixtureName: 'badMonorepoDuplicateIdNamed',
  prototypeRoot: 'bad-monorepo-duplicate-id-named',
  attributes: {},
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages-1/pkg-1', attributes: { cjs: true } },
    { name: 'pkg-2', root: 'packages-2/pkg-1', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'badMonorepoDuplicateIdUnnamed',
  prototypeRoot: 'bad-monorepo-duplicate-id-unnamed',
  attributes: {}
});

createFixture({
  fixtureName: 'badMonorepoEmptyMdFiles',
  prototypeRoot: 'bad-monorepo-empty-md-files',
  attributes: { cjs: true, polyrepo: true },
  unnamedPackageMapData: [
    { name: 'md-empty', root: 'packages/md-empty', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'badMonorepoNextjsProject',
  prototypeRoot: 'bad-monorepo-nextjs-project',
  attributes: { cjs: true, monorepo: true, next: true },
  unnamedPackageMapData: [
    { name: 'empty', root: 'packages/empty', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'badMonorepoNonPackageDir',
  prototypeRoot: 'bad-monorepo-non-package-dir',
  attributes: { cjs: true, polyrepo: true },
  namedPackageMapData: [{ name: 'pkg-1', root: 'pkgs/pkg-1', attributes: { cjs: true } }],
  brokenPackageRoots: ['pkgs/pkg-10', 'pkgs/pkg-100']
});

createFixture({
  fixtureName: 'badPolyrepo',
  prototypeRoot: 'bad-polyrepo',
  attributes: { cjs: true, polyrepo: true }
});

createFixture({
  fixtureName: 'badPolyrepoBadType',
  prototypeRoot: 'bad-polyrepo-bad-type',
  attributes: {}
});

createFixture({
  fixtureName: 'badPolyrepoConflictingAttributes',
  prototypeRoot: 'bad-polyrepo-conflicting-attributes',
  attributes: {}
});

createFixture({
  fixtureName: 'badPolyrepoEmptyMdFiles',
  prototypeRoot: 'bad-polyrepo-empty-md-files',
  attributes: { cjs: true, polyrepo: true }
});

createFixture({
  fixtureName: 'badPolyrepoImporter',
  prototypeRoot: 'bad-polyrepo-importer',
  attributes: { cjs: true, polyrepo: true }
});

createFixture({
  fixtureName: 'badPolyrepoNextjsProject',
  prototypeRoot: 'bad-polyrepo-nextjs-project',
  attributes: { cjs: true, polyrepo: true, next: true }
});

createFixture({
  fixtureName: 'badPolyrepoNonPackageDir',
  prototypeRoot: 'bad-polyrepo-non-package-dir',
  attributes: { cjs: true, polyrepo: true }
});

createFixture({
  fixtureName: 'badPolyrepoTsbuildinfo',
  prototypeRoot: 'bad-polyrepo-tsbuildinfo',
  attributes: { cjs: true, polyrepo: true }
});

createFixture({
  fixtureName: 'goodHybridrepo',
  prototypeRoot: 'good-hybridrepo',
  attributes: {
    cjs: true,
    monorepo: true,
    hybridrepo: true,
    cli: true,
    private: true,
    vercel: true,
    webpack: true
  },
  namedPackageMapData: [
    { name: 'cli', root: 'packages/cli', attributes: { cjs: true, cli: true } },
    {
      name: 'private',
      root: 'packages/private',
      attributes: { cjs: true, private: true }
    },
    {
      name: 'webpack',
      root: 'packages/webpack',
      attributes: { cjs: true, webpack: true }
    }
  ],
  unnamedPackageMapData: [
    {
      name: 'unnamed-cjs',
      root: 'packages/unnamed-cjs',
      attributes: { cjs: true, private: true }
    },
    {
      name: 'unnamed-esm',
      root: 'packages/unnamed-esm',
      attributes: { esm: true }
    }
  ]
});

createFixture({
  fixtureName: 'goodHybridrepoMultiversal',
  prototypeRoot: 'good-hybridrepo-multiversal',
  attributes: {
    cjs: true,
    monorepo: true,
    hybridrepo: true,
    cli: true,
    private: true,
    vercel: true,
    webpack: true
  },
  namedPackageMapData: [
    { name: 'cli', root: 'packages/cli', attributes: { cjs: true, cli: true } },
    {
      name: '@namespaced/webpack-common-config',
      root: 'packages/webpack',
      attributes: { cjs: true, webpack: true }
    }
  ],
  unnamedPackageMapData: [
    {
      name: 'private',
      root: 'packages/private',
      attributes: { cjs: true, private: true }
    }
  ]
});

createFixture({
  fixtureName: 'goodMonorepo',
  prototypeRoot: 'good-monorepo',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1', attributes: { cjs: true, cli: true } },
    {
      name: '@namespaced/pkg',
      root: 'packages/pkg-2',
      attributes: { cjs: true, cli: true }
    },
    {
      name: '@namespaced/importer',
      root: 'packages/pkg-import',
      attributes: { cjs: true }
    }
  ],
  unnamedPackageMapData: [
    { name: 'unnamed-pkg-1', root: 'packages/unnamed-pkg-1', attributes: { cjs: true } },
    { name: 'unnamed-pkg-2', root: 'packages/unnamed-pkg-2', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNegatedPaths',
  prototypeRoot: 'good-monorepo-negated-paths',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1', attributes: { cjs: true } },
    { name: '@namespace/pkg-3', root: 'packages/pkg-3-x', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNextjsProject',
  prototypeRoot: 'good-monorepo-nextjs-project',
  attributes: { cjs: true, monorepo: true, next: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1', attributes: { cjs: true } },
    { name: '@namespaced/pkg', root: 'packages/pkg-2', attributes: { cjs: true } },
    {
      name: '@namespaced/importer',
      root: 'packages/pkg-import',
      attributes: { cjs: true }
    }
  ],
  unnamedPackageMapData: [
    { name: 'unnamed-pkg-1', root: 'packages/unnamed-pkg-1', attributes: { cjs: true } },
    { name: 'unnamed-pkg-2', root: 'packages/unnamed-pkg-2', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoSimplePaths',
  prototypeRoot: 'good-monorepo-simple-paths',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1', attributes: { cjs: true } },
    { name: 'pkg-10', root: 'pkgs/pkg-10', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdAbsolute',
  prototypeRoot: 'good-monorepo-weird-absolute',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1', attributes: { cjs: true } },
    { name: 'pkg-2', root: 'packages/pkg-2', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdBoneless',
  prototypeRoot: 'good-monorepo-weird-boneless',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [{ name: 'pkg-1', root: 'pkg-1', attributes: { cjs: true } }]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdOverlap',
  prototypeRoot: 'good-monorepo-weird-overlap',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1', attributes: { cjs: true } },
    { name: 'pkg-2', root: 'pkgs/pkg-20', attributes: { cjs: true } }
  ],
  // I can't imagine a project having such weird (useless) overlapping paths...
  brokenPackageRoots: [
    'pkgs',
    'pkgs/pkg-1/dist',
    'pkgs/pkg-1/src',
    'pkgs/pkg-20/dist',
    'pkgs/pkg-20/src'
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdSameNames',
  prototypeRoot: 'good-monorepo-weird-same-names',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    {
      name: 'good-monorepo-weird-same-names',
      root: 'packages/pkg-1',
      attributes: { cjs: true }
    },
    { name: 'pkg-2', root: 'packages/pkg-2', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdYarn',
  prototypeRoot: 'good-monorepo-weird-yarn',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1', attributes: { cjs: true } },
    { name: 'pkg-2', root: 'packages/pkg-2', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWindows',
  prototypeRoot: 'good-monorepo-windows',
  attributes: { cjs: true, monorepo: true },
  namedPackageMapData: [
    { name: 'pkg-1', root: 'packages/deep/pkg', attributes: { cjs: true } },
    { name: 'pkg-2', root: 'packages/deep/wkg', attributes: { cjs: true } }
  ]
});

createFixture({
  fixtureName: 'goodPolyrepo',
  prototypeRoot: 'good-polyrepo',
  attributes: { cjs: true, polyrepo: true, vercel: true }
});

createFixture({
  fixtureName: 'goodPolyrepoNextjsProject',
  prototypeRoot: 'good-polyrepo-nextjs-project',
  attributes: { esm: true, polyrepo: true, next: true }
});

/**
 * Create a new dummy test fixture based on a fixture prototype and with
 * optionally patched package.json data.
 */
function createFixture({
  fixtureName,
  prototypeRoot: prototypeRoot_,
  attributes,
  namedPackageMapData: namedPackageMapData = [],
  unnamedPackageMapData: unnamedPackageMapData = [],
  brokenPackageRoots: brokenPackageRoots = []
}: {
  fixtureName: FixtureName;
  prototypeRoot: string;
  attributes: Fixture['attributes'];
  namedPackageMapData?: PackageMapDatum[];
  unnamedPackageMapData?: PackageMapDatum[];
  brokenPackageRoots?: string[];
}) {
  const prototypeRoot = resolve(
    __dirname,
    '../fixtures/dummy-repo',
    prototypeRoot_
  ) as fs.AbsolutePath;

  fixtures[fixtureName] = {
    root: prototypeRoot,
    json:
      (() => {
        try {
          return require(`${prototypeRoot}/package.json`);
        } catch {}
      })() || {},
    attributes,
    namedPackageMapData: namedPackageMapData.map((datum) => expandDatumToEntry(datum)),
    unnamedPackageMapData: unnamedPackageMapData.map((datum) =>
      expandDatumToEntry(datum)
    ),
    brokenPackageRoots: brokenPackageRoots.map(
      (path) => `${prototypeRoot}/${path}` as fs.AbsolutePath
    )
  };

  function expandDatumToEntry({
    name,
    root: subRoot,
    attributes
  }: PackageMapDatum): PackageMapEntry {
    return [
      name,
      {
        id: basename(subRoot),
        root: `${prototypeRoot}/${subRoot}` as fs.AbsolutePath,
        json: require(`${prototypeRoot}/${subRoot}/package.json`),
        attributes,
        // ? Side-step this whole thing
        projectMetadata: expect.anything()
      } satisfies WorkspacePackage
    ];
  }
}

export function fixtureToProjectMetadata(
  fixtureName: FixtureName,
  cwdPackage_?: Omit<WorkspacePackage, 'projectMetadata'>
) {
  const rootPackage = {
    root: fixtures[fixtureName].root,
    json: fixtures[fixtureName].json,
    attributes: fixtures[fixtureName].attributes
    // ? the "projectMetadata" property is properly initialized below
    // projectMetadata: mockProjectMetadata
  } satisfies Omit<RootPackage, 'projectMetadata'> as RootPackage;

  // ? the "projectMetadata" property is properly initialized below
  const cwdPackage = (cwdPackage_ ?? rootPackage) as Package;

  const mockProjectMetadata: ProjectMetadata = {
    type: fixtures[fixtureName].attributes[ProjectAttribute.Polyrepo]
      ? ProjectAttribute.Polyrepo
      : ProjectAttribute.Monorepo,
    rootPackage,
    cwdPackage,
    subRootPackages: (fixtures[fixtureName].namedPackageMapData.length ||
    fixtures[fixtureName].unnamedPackageMapData.length
      ? // ? This map is properly initialized below
        new Map()
      : undefined) as ProjectMetadata['subRootPackages']
  };

  rootPackage.projectMetadata = cwdPackage.projectMetadata = mockProjectMetadata;

  if (mockProjectMetadata.subRootPackages) {
    mockProjectMetadata.subRootPackages = new Map(
      fixtures[fixtureName].namedPackageMapData.map(([key, package_]) => {
        return [key, { ...package_, projectMetadata: mockProjectMetadata }];
      })
    ) as NonNullable<ProjectMetadata['subRootPackages']>;

    mockProjectMetadata.subRootPackages.broken = fixtures[fixtureName].brokenPackageRoots;

    mockProjectMetadata.subRootPackages.unnamed = new Map(
      fixtures[fixtureName].unnamedPackageMapData.map(([key, package_]) => {
        return [key, { ...package_, projectMetadata: mockProjectMetadata }];
      })
    );

    mockProjectMetadata.subRootPackages.all = Array.from(
      mockProjectMetadata.subRootPackages.values()
    ).concat(Array.from(mockProjectMetadata.subRootPackages.unnamed.values()));
  }

  return mockProjectMetadata;
}
