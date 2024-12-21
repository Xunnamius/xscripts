import { runNoRejectOnBadExit } from '@-xun/run';
import { toss } from 'toss-expression';

import { type GenericProjectMetadata } from 'multiverse+project-utils:analyze/common.ts';
import { asMockedFunction } from 'multiverse+test-utils';

import { pathToPackage } from 'rootverse+project-utils:src/analyze/path-to-package.ts';
import { cache } from 'rootverse+project-utils:src/cache.ts';
import { ErrorMessage } from 'rootverse+project-utils:src/error.ts';

import {
  toPath,
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs.ts';

import {
  analyzeProjectStructure,
  gatherImportEntriesFromFiles,
  gatherPackageBuildTargets,
  gatherPackageFiles,
  gatherProjectFiles,
  gatherPseudodecoratorEntriesFromFiles,
  generatePackageJsonEngineMaintainedNodeVersions,
  packageRootToId,
  prefixAssetImport,
  prefixExternalImport,
  prefixInternalImport,
  prefixNormalImport,
  prefixTypeOnlyImport,
  ProjectAttribute,
  PseudodecoratorTag,
  type PackageBuildTargets,
  type ProjectMetadata,
  type WorkspacePackage
} from 'rootverse+project-utils:src/index.ts';

import {
  fixtures,
  fixtureToProjectMetadata,
  patchReadXPackageJsonAtRoot,
  type FixtureName
} from 'rootverse+project-utils:test/helpers/dummy-repo.ts';

jest.mock<typeof import('browserslist')>('browserslist', () => {
  return mockShouldReturnBrowserslistMock
    ? mockBrowserslist
    : jest.requireActual('browserslist');
});

jest.mock('@-xun/run');

// eslint-disable-next-line jest/require-hook
let mockShouldReturnBrowserslistMock = false;

const mockBrowserslist = asMockedFunction<typeof import('browserslist')>();
// ? We mock this so we can control what external calls to git/npx/etc do
const mockRunNoRejectOnBadExit = asMockedFunction(runNoRejectOnBadExit);

beforeEach(() => {
  jest.spyOn(process, 'cwd').mockImplementation(() => '/fake/cwd');
});

afterEach(() => {
  mockShouldReturnBrowserslistMock = false;
  cache.clear();
});

describe('::generatePackageJsonEngineMaintainedNodeVersions', () => {
  it('returns maintained node versions in engine format by default', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 1.2.3',
        'node 4.5.6',
        'node 7.8.9'
      ]);

      expect(generatePackageJsonEngineMaintainedNodeVersions()).toBe(
        '^1.2.3 || ^4.5.6 || >=7.8.9'
      );
    });
  });

  it('can return maintained node versions in array format', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 1.2.3',
        'node 4.5.6',
        'node 7.8.9'
      ]);

      expect(
        generatePackageJsonEngineMaintainedNodeVersions({ format: 'array' })
      ).toStrictEqual(['1.2.3', '4.5.6', '7.8.9']);
    });
  });

  it('always lists versions in ascending semver order (highest last)', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 4.5.6',
        'node 7.8.9',
        'node 1.2.3'
      ]);

      expect(generatePackageJsonEngineMaintainedNodeVersions()).toBe(
        '^1.2.3 || ^4.5.6 || >=7.8.9'
      );
    });
  });
});

describe('::packageRootToId', () => {
  it('translates a path to a package id', async () => {
    expect.hasAssertions();

    expect(packageRootToId('/repo/path/packages/pkg-1' as AbsolutePath)).toBe('pkg-1');
  });

  it('replaces non-alphanumeric characters with hyphens', async () => {
    expect.hasAssertions();

    expect(packageRootToId('/repo/path/packages/bad& pack@g3!d' as AbsolutePath)).toBe(
      'bad--pack-g3-d'
    );
  });
});

describe('::pathToPackage', () => {
  it('translates a path to the root package in a polyrepo', () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodPolyrepo');

    expect(pathToPackage(fixtures.goodPolyrepo.root, projectMetadata)).toStrictEqual(
      projectMetadata.rootPackage
    );

    expect(
      pathToPackage(
        (fixtures.goodPolyrepo.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(projectMetadata.rootPackage);
  });

  it('translates a path to the root package in a hybridrepo', () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

    expect(pathToPackage(fixtures.goodHybridrepo.root, projectMetadata)).toStrictEqual(
      projectMetadata.rootPackage
    );

    expect(
      pathToPackage(
        (fixtures.goodHybridrepo.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(projectMetadata.rootPackage);
  });

  it('translates a path to a sub-root package in a monorepo', () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');
    const firstPackage = fixtures.goodHybridrepo.namedPackageMapData[0][1];
    const secondPackage = fixtures.goodHybridrepo.unnamedPackageMapData[0][1];

    expect(pathToPackage(firstPackage.root, projectMetadata)).toStrictEqual(
      firstPackage
    );

    expect(
      pathToPackage(
        (firstPackage.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(firstPackage);

    expect(
      pathToPackage(
        (firstPackage.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(firstPackage);

    expect(pathToPackage(secondPackage.root, projectMetadata)).toStrictEqual(
      secondPackage
    );

    expect(
      pathToPackage(
        (secondPackage.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(secondPackage);

    expect(
      pathToPackage(
        (secondPackage.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(secondPackage);
  });

  it('throws if path is not within project', () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

    expect(() => pathToPackage('/dev/null' as AbsolutePath, projectMetadata)).toThrow(
      ErrorMessage.PathOutsideRoot('/')
    );
  });
});

describe('::gatherProjectFiles', () => {
  describe('<synchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodPolyrepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodMonorepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodMonorepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [
            `${root}/packages/pkg-1/dist/index.js`,
            `${root}/packages/pkg-2/dist/x.js`
          ],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/dist/index.js`],
            ['pkg-2', `${root}/packages/pkg-2/dist/x.js`],
            ['pkg-import', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/packages/pkg-1/README.md`,
            `${root}/packages/pkg-2/some-other-file.md`,
            `${root}/packages/pkg-import/README.md`
          ],
          inRoot: [`${root}/README.md`, `${root}/something-else.md`],
          inWorkspace: new Map([
            ['pkg-1', [`${root}/packages/pkg-1/README.md`]],
            ['pkg-2', [`${root}/packages/pkg-2/some-other-file.md`]],
            ['pkg-import', [`${root}/packages/pkg-import/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/pkg-1/package.json`,
            `${root}/packages/pkg-2/package.json`,
            `${root}/packages/pkg-import/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/package.json`],
            ['pkg-2', `${root}/packages/pkg-2/package.json`],
            ['pkg-import', `${root}/packages/pkg-import/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/pkg-2/src/package.json`,
            `${root}/packages/pkg-import/src/package.json`,
            `${root}/packages/unnamed-pkg-1/package.json`,
            `${root}/packages/unnamed-pkg-2/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/packages/pkg-2/src/4.tsx`,
            `${root}/packages/pkg-import/src/index.ts`
          ],
          inRootSrc: [],
          inWorkspaceSrc: new Map([
            ['pkg-1', []],
            ['pkg-2', [`${root}/packages/pkg-2/src/4.tsx`]],
            ['pkg-import', [`${root}/packages/pkg-import/src/index.ts`]]
          ])
        },
        typescriptTestFiles: {
          all: [],
          inRootTest: [],
          inWorkspaceTest: new Map([
            ['pkg-1', []],
            ['pkg-2', []],
            ['pkg-import', []]
          ])
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodHybridrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodHybridrepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [`${root}/dist/src/cli.js`, `${root}/packages/cli/dist/index.js`],
          atProjectRoot: `${root}/dist/src/cli.js`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/dist/index.js`],
            ['private', undefined],
            ['webpack', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/.git-ignored/nope.md`,
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [`${root}/.git-ignored/nope.md`],
          inWorkspace: new Map([
            ['cli', [`${root}/packages/cli/README.md`]],
            [
              'private',
              [
                `${root}/packages/private/src/markdown/1.md`,
                `${root}/packages/private/src/markdown/2.md`,
                `${root}/packages/private/src/markdown/3.md`
              ]
            ],
            ['webpack', [`${root}/packages/webpack/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/cli/package.json`,
            `${root}/packages/private/package.json`,
            `${root}/packages/webpack/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/package.json`],
            ['private', `${root}/packages/private/package.json`],
            ['webpack', `${root}/packages/webpack/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/cli/src/package.json`,
            `${root}/packages/private/src/markdown/package.json`,
            `${root}/packages/unnamed-cjs/package.json`,
            `${root}/packages/unnamed-cjs/src/package.json`,
            `${root}/packages/unnamed-esm/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/packages/cli/src/som-file.tsx`
          ],
          inRootSrc: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          inWorkspaceSrc: new Map([
            ['cli', [`${root}/packages/cli/src/som-file.tsx`]],
            ['private', []],
            ['webpack', []]
          ])
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`,
            `${root}/packages/cli/test/my.unit.test.ts`,
            `${root}/packages/cli/test/nested/type-3.test.ts`,
            `${root}/packages/cli/test/type-4.test.ts`,
            `${root}/packages/private/test/my.unit.test.ts`,
            `${root}/packages/private/test/nested/my.unit.test.ts`,
            `${root}/packages/private/test/type-5.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map([
            [
              'cli',
              [
                `${root}/packages/cli/test/my.unit.test.ts`,
                `${root}/packages/cli/test/nested/type-3.test.ts`,
                `${root}/packages/cli/test/type-4.test.ts`
              ]
            ],
            [
              'private',
              [
                `${root}/packages/private/test/my.unit.test.ts`,
                `${root}/packages/private/test/nested/my.unit.test.ts`,
                `${root}/packages/private/test/type-5.test.ts`
              ]
            ],
            ['webpack', []]
          ])
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const projectFiles = gatherProjectFiles.sync(dummyMetadata, { useCached: false });

      expect(projectFiles).toBe(
        gatherProjectFiles.sync(dummyMetadata, { useCached: true })
      );

      const updatedProjectFiles = gatherProjectFiles.sync(dummyMetadata, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      expect(gatherProjectFiles.sync(dummyMetadata, { useCached: true })).toBe(
        updatedProjectFiles
      );
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      const result1 = gatherProjectFiles.sync(projectMetadata, {
        ignoreUnsupportedFeatures: true,
        useCached: true
      });

      const result2 = gatherProjectFiles.sync(projectMetadata, {
        ignoreUnsupportedFeatures: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('does not ignore files in prettier when "skipPrettierIgnored" is false', () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodPolyrepo'), {
          skipPrettierIgnored: false,
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [
            `${root}/.vercel/package.json`,
            `${root}/dist/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('throws given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        gatherProjectFiles.sync(
          { projectMetadata: {}, rootPackage: {} } as unknown as ProjectMetadata,
          {
            // @ts-expect-error: we expect this to fail or something's wrong
            skipUnknown: true,
            useCached: true
          }
        )
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('throws if a root or workspace package.json file contains "directories"', () => {
      expect.hasAssertions();

      expect(() =>
        gatherProjectFiles.sync(
          {
            rootPackage: {
              root: '/fake',
              json: { directories: { bin: 'bad' } }
            },
            subRootPackages: undefined
          } as ProjectMetadata,
          { useCached: true }
        )
      ).toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: new Map([
              [
                'id',
                {
                  root: 'fake/package',
                  json: { directories: { bin: 'bad' } }
                } as WorkspacePackage
              ]
            ])
          } as ProjectMetadata,
          { useCached: true }
        )
      ).toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: undefined
          } as ProjectMetadata,
          { useCached: true }
        )
      ).not.toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: new Map([
              ['id', { root: 'fake/package', json: {} } as WorkspacePackage]
            ])
          } as ProjectMetadata,
          { useCached: true }
        )
      ).not.toThrow(ErrorMessage.UnsupportedFeature(''));
    });
  });

  describe('<asynchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodPolyrepo'), { useCached: true })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodMonorepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodMonorepo'), { useCached: true })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [
            `${root}/packages/pkg-1/dist/index.js`,
            `${root}/packages/pkg-2/dist/x.js`
          ],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/dist/index.js`],
            ['pkg-2', `${root}/packages/pkg-2/dist/x.js`],
            ['pkg-import', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/packages/pkg-1/README.md`,
            `${root}/packages/pkg-2/some-other-file.md`,
            `${root}/packages/pkg-import/README.md`
          ],
          inRoot: [`${root}/README.md`, `${root}/something-else.md`],
          inWorkspace: new Map([
            ['pkg-1', [`${root}/packages/pkg-1/README.md`]],
            ['pkg-2', [`${root}/packages/pkg-2/some-other-file.md`]],
            ['pkg-import', [`${root}/packages/pkg-import/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/pkg-1/package.json`,
            `${root}/packages/pkg-2/package.json`,
            `${root}/packages/pkg-import/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/package.json`],
            ['pkg-2', `${root}/packages/pkg-2/package.json`],
            ['pkg-import', `${root}/packages/pkg-import/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/pkg-2/src/package.json`,
            `${root}/packages/pkg-import/src/package.json`,
            `${root}/packages/unnamed-pkg-1/package.json`,
            `${root}/packages/unnamed-pkg-2/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/packages/pkg-2/src/4.tsx`,
            `${root}/packages/pkg-import/src/index.ts`
          ],
          inRootSrc: [],
          inWorkspaceSrc: new Map([
            ['pkg-1', []],
            ['pkg-2', [`${root}/packages/pkg-2/src/4.tsx`]],
            ['pkg-import', [`${root}/packages/pkg-import/src/index.ts`]]
          ])
        },
        typescriptTestFiles: {
          all: [],
          inRootTest: [],
          inWorkspaceTest: new Map([
            ['pkg-1', []],
            ['pkg-2', []],
            ['pkg-import', []]
          ])
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodHybridrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodHybridrepo'), {
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [`${root}/dist/src/cli.js`, `${root}/packages/cli/dist/index.js`],
          atProjectRoot: `${root}/dist/src/cli.js`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/dist/index.js`],
            ['private', undefined],
            ['webpack', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/.git-ignored/nope.md`,
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [`${root}/.git-ignored/nope.md`],
          inWorkspace: new Map([
            ['cli', [`${root}/packages/cli/README.md`]],
            [
              'private',
              [
                `${root}/packages/private/src/markdown/1.md`,
                `${root}/packages/private/src/markdown/2.md`,
                `${root}/packages/private/src/markdown/3.md`
              ]
            ],
            ['webpack', [`${root}/packages/webpack/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/cli/package.json`,
            `${root}/packages/private/package.json`,
            `${root}/packages/webpack/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/package.json`],
            ['private', `${root}/packages/private/package.json`],
            ['webpack', `${root}/packages/webpack/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/cli/src/package.json`,
            `${root}/packages/private/src/markdown/package.json`,
            `${root}/packages/unnamed-cjs/package.json`,
            `${root}/packages/unnamed-cjs/src/package.json`,
            `${root}/packages/unnamed-esm/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/packages/cli/src/som-file.tsx`
          ],
          inRootSrc: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          inWorkspaceSrc: new Map([
            ['cli', [`${root}/packages/cli/src/som-file.tsx`]],
            ['private', []],
            ['webpack', []]
          ])
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`,
            `${root}/packages/cli/test/my.unit.test.ts`,
            `${root}/packages/cli/test/nested/type-3.test.ts`,
            `${root}/packages/cli/test/type-4.test.ts`,
            `${root}/packages/private/test/my.unit.test.ts`,
            `${root}/packages/private/test/nested/my.unit.test.ts`,
            `${root}/packages/private/test/type-5.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map([
            [
              'cli',
              [
                `${root}/packages/cli/test/my.unit.test.ts`,
                `${root}/packages/cli/test/nested/type-3.test.ts`,
                `${root}/packages/cli/test/type-4.test.ts`
              ]
            ],
            [
              'private',
              [
                `${root}/packages/private/test/my.unit.test.ts`,
                `${root}/packages/private/test/nested/my.unit.test.ts`,
                `${root}/packages/private/test/type-5.test.ts`
              ]
            ],
            ['webpack', []]
          ])
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const projectFiles = await gatherProjectFiles(dummyMetadata, { useCached: false });

      expect(projectFiles).toBe(
        await gatherProjectFiles(dummyMetadata, { useCached: true })
      );

      const updatedProjectFiles = await gatherProjectFiles(dummyMetadata, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      await expect(gatherProjectFiles(dummyMetadata, { useCached: true })).resolves.toBe(
        updatedProjectFiles
      );
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      const result1 = await gatherProjectFiles(projectMetadata, {
        ignoreUnsupportedFeatures: true,
        useCached: true
      });

      const result2 = await gatherProjectFiles(projectMetadata, {
        ignoreUnsupportedFeatures: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('does not ignore files in prettier when "skipPrettierIgnored" is false', async () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodPolyrepo'), {
          skipPrettierIgnored: false,
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [
            `${root}/.vercel/package.json`,
            `${root}/dist/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('ignores files unknown to git when "skipUnknown" is true', async () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      mockRunNoRejectOnBadExit.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => Promise.resolve({ stdout: 'something-else*' } as any)
      );

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodPolyrepo'), {
          skipUnknown: true,
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [`${root}/.vercel/something.md`, `${root}/README.md`],
          inRoot: [`${root}/.vercel/something.md`, `${root}/README.md`],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('generates a type error if "skipUnknown" is true when "skipPrettierIgnored" is false', async () => {
      expect.hasAssertions();

      await expect(
        gatherProjectFiles(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: undefined
          } as ProjectMetadata,
          // @ts-expect-error: if this doesn't cause an error, something's wrong
          {
            skipPrettierIgnored: false,
            skipUnknown: true,
            useCached: true
          }
        )
      ).resolves.toBeDefined();
    });

    it('throws if a root or workspace package.json file contains "directories"', async () => {
      expect.hasAssertions();

      await expect(
        gatherProjectFiles(
          {
            rootPackage: {
              root: '/fake',
              json: { directories: { bin: 'bad' } }
            },
            subRootPackages: undefined
          } as ProjectMetadata,
          { useCached: true }
        )
      ).rejects.toThrow(ErrorMessage.UnsupportedFeature(''));

      await expect(
        gatherProjectFiles(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: new Map([
              [
                'id',
                {
                  root: 'fake/package',
                  json: { directories: { bin: 'bad' } }
                } as WorkspacePackage
              ]
            ])
          } as ProjectMetadata,
          { useCached: true }
        )
      ).rejects.toThrow(ErrorMessage.UnsupportedFeature(''));

      await expect(
        gatherProjectFiles(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: undefined
          } as ProjectMetadata,
          { useCached: true }
        )
      ).resolves.toBeDefined();

      await expect(
        gatherProjectFiles(
          {
            rootPackage: {
              root: '/fake',
              json: {}
            },
            subRootPackages: new Map([
              ['id', { root: 'fake/package', json: {} } as WorkspacePackage]
            ])
          } as ProjectMetadata,
          { useCached: true }
        )
      ).resolves.toBeDefined();
    });
  });
});

describe('::gatherImportEntriesFromFiles', () => {
  describe('<synchronous>', () => {
    it('returns an array of import specifier entries from esm-style imports without type imports', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/2.mts` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/3.cts` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/4.tsx` as AbsolutePath;

      const fileOneResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          'package.json',
          'my-neat-lib',
          './source.js',
          './another-source.js',
          'my-neat-lib-2',
          'dynamic',
          'package.json'
        ]),
        typeOnly: new Set([
          'type-fest-1',
          'type-fest-2',
          './type-fest-3.js',
          '@type/fest4',
          'this-is-a-typeof-import',
          'this-is-a-type-import'
        ])
      };

      const fileTwoResult = {
        normal: new Set(['./tool.js', '../path/to/import.js', 'string-literal']),
        typeOnly: new Set([])
      };

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, fileOneResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileTwo], { useCached: true })
      ).toStrictEqual([[fileTwo, fileTwoResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileThree], { useCached: true })
      ).toStrictEqual([[fileThree, fileThreeResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileFour], { useCached: true })
      ).toStrictEqual([[fileFour, fileFourResult]]);

      expect(
        gatherImportEntriesFromFiles.sync(
          [fileOne, fileTwo, fileOne, fileThree, fileFour],
          { useCached: true }
        )
      ).toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/5.js` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/6.mjs` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/7.cjs` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/8.jsx` as AbsolutePath;

      const fileResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          './source.js',
          './another-source.js',
          './tool.js',
          '../path/to/import.js',
          'string-literal'
        ]),
        typeOnly: new Set([])
      };

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileTwo], { useCached: true })
      ).toStrictEqual([[fileTwo, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileThree], { useCached: true })
      ).toStrictEqual([[fileThree, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileFour], { useCached: true })
      ).toStrictEqual([[fileFour, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync(
          [fileOne, fileTwo, fileOne, fileThree, fileFour],
          { useCached: true }
        )
      ).toStrictEqual([
        [fileOne, fileResult],
        [fileTwo, fileResult],
        [fileOne, fileResult],
        [fileThree, fileResult],
        [fileFour, fileResult]
      ]);
    });

    it('returns empty set for non-typescript files', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/package.json` as AbsolutePath;

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, { normal: new Set(), typeOnly: new Set() }]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne, fileOne, fileOne], {
          useCached: true
        })
      ).toStrictEqual([
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }]
      ]);
    });

    it('throws if @babel/core is not available', () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      expect(() =>
        gatherImportEntriesFromFiles.sync(['/file.ts' as AbsolutePath], {
          useCached: true
        })
      ).toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      expect(() =>
        gatherImportEntriesFromFiles.sync(['/file.ts' as AbsolutePath], {
          useCached: true
        })
      ).toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;

      const importEntries = gatherImportEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(importEntries[0][1]).toBe(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })[0][1]
      );

      const updatedImportEntries = gatherImportEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(updatedImportEntries[0][1]).not.toBe(importEntries[0][1]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })[0][1]
      ).toBe(updatedImportEntries[0][1]);
    });
  });

  describe('<asynchronous>', () => {
    it('returns an array of import specifier entries from esm-style imports without type imports', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/2.mts` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/3.cts` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/4.tsx` as AbsolutePath;

      const fileOneResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          'package.json',
          'my-neat-lib',
          './source.js',
          './another-source.js',
          'my-neat-lib-2',
          'dynamic',
          'package.json'
        ]),
        typeOnly: new Set([
          'type-fest-1',
          'type-fest-2',
          './type-fest-3.js',
          '@type/fest4',
          'this-is-a-typeof-import',
          'this-is-a-type-import'
        ])
      };

      const fileTwoResult = {
        normal: new Set(['./tool.js', '../path/to/import.js', 'string-literal']),
        typeOnly: new Set([])
      };

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, fileOneResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileTwo], { useCached: true })
      ).resolves.toStrictEqual([[fileTwo, fileTwoResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileThree], { useCached: true })
      ).resolves.toStrictEqual([[fileThree, fileThreeResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileFour], { useCached: true })
      ).resolves.toStrictEqual([[fileFour, fileFourResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour], {
          useCached: true
        })
      ).resolves.toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/5.js` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/6.mjs` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/7.cjs` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/8.jsx` as AbsolutePath;

      const fileResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          './source.js',
          './another-source.js',
          './tool.js',
          '../path/to/import.js',
          'string-literal'
        ]),
        typeOnly: new Set([])
      };

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileTwo], { useCached: true })
      ).resolves.toStrictEqual([[fileTwo, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileThree], { useCached: true })
      ).resolves.toStrictEqual([[fileThree, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileFour], { useCached: true })
      ).resolves.toStrictEqual([[fileFour, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour], {
          useCached: true
        })
      ).resolves.toStrictEqual([
        [fileOne, fileResult],
        [fileTwo, fileResult],
        [fileOne, fileResult],
        [fileThree, fileResult],
        [fileFour, fileResult]
      ]);
    });

    it('returns empty set for non-typescript files', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/package.json` as AbsolutePath;

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, { normal: new Set(), typeOnly: new Set() }]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileOne, fileOne], { useCached: true })
      ).resolves.toStrictEqual([
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }]
      ]);
    });

    it('throws if @babel/core is not available', async () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      await expect(
        gatherImportEntriesFromFiles(['/file.ts' as AbsolutePath], { useCached: true })
      ).rejects.toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', async () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      await expect(
        gatherImportEntriesFromFiles(['/file.ts' as AbsolutePath], { useCached: true })
      ).rejects.toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;

      const importEntries = await gatherImportEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(importEntries[0][1]).toBe(
        (await gatherImportEntriesFromFiles([fileOne], { useCached: true }))[0][1]
      );

      const updatedImportEntries = await gatherImportEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(updatedImportEntries[0][1]).not.toBe(importEntries[0][1]);

      expect(
        (await gatherImportEntriesFromFiles([fileOne], { useCached: true }))[0][1]
      ).toBe(updatedImportEntries[0][1]);
    });
  });
});

describe('::gatherPseudodecoratorEntriesFromFiles', () => {
  const tsFile = `${__dirname}/fixtures/dummy-pseudodecorators/1.ts` as AbsolutePath;
  const jsFile = `${__dirname}/fixtures/dummy-pseudodecorators/2.js` as AbsolutePath;
  const jsonFile = `${__dirname}/fixtures/dummy-pseudodecorators/3.json` as AbsolutePath;
  const mdFile = `${__dirname}/fixtures/dummy-pseudodecorators/4.md` as AbsolutePath;
  const ymlFile = `${__dirname}/fixtures/dummy-pseudodecorators/5.yml` as AbsolutePath;

  describe('<synchronous>', () => {
    it('returns an array of pseudodecorator entries from a variety of files', () => {
      expect.hasAssertions();

      expect(
        gatherPseudodecoratorEntriesFromFiles.sync(
          [tsFile, jsFile, jsonFile, mdFile, ymlFile],
          { useCached: true }
        )
      ).toStrictEqual(
        getExpectedPseudodecorators(tsFile, jsFile, jsonFile, mdFile, ymlFile)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;

      const decoratorEntries = gatherPseudodecoratorEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(decoratorEntries[0][1]).toBe(
        gatherPseudodecoratorEntriesFromFiles.sync([fileOne], { useCached: true })[0][1]
      );

      const updatedDecoratorEntries = gatherPseudodecoratorEntriesFromFiles.sync(
        [fileOne],
        { useCached: false }
      );

      expect(updatedDecoratorEntries[0][1]).not.toBe(decoratorEntries[0][1]);

      expect(
        gatherPseudodecoratorEntriesFromFiles.sync([fileOne], { useCached: true })[0][1]
      ).toBe(updatedDecoratorEntries[0][1]);
    });
  });

  describe('<asynchronous>', () => {
    it('returns an array of pseudodecorator entries from a variety of files', async () => {
      expect.hasAssertions();

      await expect(
        gatherPseudodecoratorEntriesFromFiles(
          [tsFile, jsFile, jsonFile, mdFile, ymlFile],
          { useCached: true }
        )
      ).resolves.toStrictEqual(
        getExpectedPseudodecorators(tsFile, jsFile, jsonFile, mdFile, ymlFile)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;

      const decoratorEntries = await gatherPseudodecoratorEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(decoratorEntries[0][1]).toBe(
        (
          await gatherPseudodecoratorEntriesFromFiles([fileOne], { useCached: true })
        )[0][1]
      );

      const updatedDecoratorEntries = await gatherPseudodecoratorEntriesFromFiles(
        [fileOne],
        { useCached: false }
      );

      expect(updatedDecoratorEntries[0][1]).not.toBe(decoratorEntries[0][1]);

      expect(
        (
          await gatherPseudodecoratorEntriesFromFiles([fileOne], { useCached: true })
        )[0][1]
      ).toBe(updatedDecoratorEntries[0][1]);
    });
  });
});

describe('::gatherPackageFiles', () => {
  describe('<synchronous>', () => {
    it('returns expected file paths for polyrepo root package', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodPolyrepo');
      const { root } = rootPackage;

      expect(gatherPackageFiles.sync(rootPackage, { useCached: true })).toStrictEqual({
        dist: [
          `${root}/dist/index.js`,
          `${root}/dist/package.json`,
          `${root}/dist/should-be-ignored.md`
        ],
        docs: [],
        other: [
          `${root}/.env`,
          `${root}/.prettierignore`,
          `${root}/.vercel/package.json`,
          `${root}/.vercel/project.json`,
          `${root}/.vercel/something.md`,
          `${root}/package.json`,
          `${root}/README.md`,
          `${root}/something-else.md`,
          `${root}/types/global.ts`
        ],
        src: [
          `${root}/src/1.ts`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.js`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo (monorepo) root package', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      expect(gatherPackageFiles.sync(rootPackage, { useCached: true })).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo sub-root packages (named and unnamed)', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      {
        const workspacePackage = projectMetadata.subRootPackages!.get('cli')!;
        const { root } = workspacePackage;

        expect(
          gatherPackageFiles.sync(workspacePackage, { useCached: true })
        ).toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [`${root}/docs/docs.md`],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [
            `${root}/src/index.js`,
            `${root}/src/package.json`,
            `${root}/src/som-file.tsx`
          ],
          test: [
            `${root}/test/my.unit.test.ts`,
            `${root}/test/nested/type-3.test.ts`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-4.test.ts`
          ]
        });
      }

      {
        const workspacePackage =
          projectMetadata.subRootPackages!.unnamed.get('unnamed-cjs')!;
        const { root } = workspacePackage;

        expect(
          gatherPackageFiles.sync(workspacePackage, { useCached: true })
        ).toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [`${root}/src/index.js`, `${root}/src/package.json`],
          test: []
        });
      }
    });

    it('respects "ignore" option including negation', () => {
      expect.hasAssertions();

      {
        const { rootPackage } = fixtureToProjectMetadata('goodPolyrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: ['*.mts', '/4.tsx', '.vercel'],
            useCached: true
          })
        ).toStrictEqual({
          dist: [
            `${root}/dist/index.js`,
            `${root}/dist/package.json`,
            `${root}/dist/should-be-ignored.md`
          ],
          docs: [],
          other: [
            `${root}/.env`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/types/global.ts`
          ],
          src: [
            `${root}/src/1.ts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.js`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: ['package.json'],
            useCached: true
          })
        ).toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: [`!.git-ignored/nope.md`],
            useCached: true
          })
        ).toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.git-ignored/nope.md`,
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }
    });

    it('respects "skipGitIgnored" option', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      expect(
        gatherPackageFiles.sync(rootPackage, { skipGitIgnored: true, useCached: true })
      ).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });

      expect(
        gatherPackageFiles.sync(rootPackage, { skipGitIgnored: false, useCached: true })
      ).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.git-ignored/nope.md`,
          `${root}/.git/.gitkeep`,
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const packageFiles = gatherPackageFiles.sync(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(packageFiles).toBe(
        gatherPackageFiles.sync(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedPackageFiles = gatherPackageFiles.sync(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(updatedPackageFiles).not.toBe(packageFiles);

      expect(
        gatherPackageFiles.sync(dummyMetadata.rootPackage, { useCached: true })
      ).toBe(updatedPackageFiles);
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const result1 = gatherPackageFiles.sync(rootPackage, {
        skipGitIgnored: true,
        useCached: true
      });
      const result2 = gatherPackageFiles.sync(rootPackage, {
        skipGitIgnored: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });
  });

  describe('<asynchronous>', () => {
    it('returns expected file paths for polyrepo root package', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodPolyrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { useCached: true })
      ).resolves.toStrictEqual({
        dist: [
          `${root}/dist/index.js`,
          `${root}/dist/package.json`,
          `${root}/dist/should-be-ignored.md`
        ],
        docs: [],
        other: [
          `${root}/.env`,
          `${root}/.prettierignore`,
          `${root}/.vercel/package.json`,
          `${root}/.vercel/project.json`,
          `${root}/.vercel/something.md`,
          `${root}/package.json`,
          `${root}/README.md`,
          `${root}/something-else.md`,
          `${root}/types/global.ts`
        ],
        src: [
          `${root}/src/1.ts`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.js`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo (monorepo) root package', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo sub-root packages (named and unnamed)', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      {
        const workspacePackage = projectMetadata.subRootPackages!.get('cli')!;
        const { root } = workspacePackage;

        await expect(
          gatherPackageFiles(workspacePackage, { useCached: true })
        ).resolves.toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [`${root}/docs/docs.md`],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [
            `${root}/src/index.js`,
            `${root}/src/package.json`,
            `${root}/src/som-file.tsx`
          ],
          test: [
            `${root}/test/my.unit.test.ts`,
            `${root}/test/nested/type-3.test.ts`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-4.test.ts`
          ]
        });
      }

      {
        const workspacePackage =
          projectMetadata.subRootPackages!.unnamed.get('unnamed-cjs')!;
        const { root } = workspacePackage;

        await expect(
          gatherPackageFiles(workspacePackage, { useCached: true })
        ).resolves.toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [`${root}/src/index.js`, `${root}/src/package.json`],
          test: []
        });
      }
    });

    it('respects "ignore" option including negation', async () => {
      expect.hasAssertions();

      {
        const { rootPackage } = fixtureToProjectMetadata('goodPolyrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, {
            ignore: ['*.mts', '/4.tsx', '.vercel'],
            useCached: true
          })
        ).resolves.toStrictEqual({
          dist: [
            `${root}/dist/index.js`,
            `${root}/dist/package.json`,
            `${root}/dist/should-be-ignored.md`
          ],
          docs: [],
          other: [
            `${root}/.env`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/types/global.ts`
          ],
          src: [
            `${root}/src/1.ts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.js`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, { ignore: ['package.json'], useCached: true })
        ).resolves.toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, {
            ignore: [`!.git-ignored/nope.md`],
            useCached: true
          })
        ).resolves.toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.git-ignored/nope.md`,
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }
    });

    it('respects "skipGitIgnored" option', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { skipGitIgnored: true, useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });

      await expect(
        gatherPackageFiles(rootPackage, { skipGitIgnored: false, useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.git-ignored/nope.md`,
          `${root}/.git/.gitkeep`,
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const projectFiles = await gatherPackageFiles(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(projectFiles).toBe(
        await gatherPackageFiles(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedProjectFiles = await gatherPackageFiles(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      await expect(
        gatherPackageFiles(dummyMetadata.rootPackage, { useCached: true })
      ).resolves.toBe(updatedProjectFiles);
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const result1 = await gatherPackageFiles(rootPackage, {
        skipGitIgnored: true,
        useCached: true
      });
      const result2 = await gatherPackageFiles(rootPackage, {
        skipGitIgnored: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });
  });
});

describe('::gatherPackageBuildTargets', () => {
  describe('<synchronous>', () => {
    it('returns expected build targets for polyrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          fixtureToProjectMetadata('goodPolyrepo').rootPackage,
          { useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['types/global.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'src/1.ts',
            'src/2.mts',
            'src/3.cts',
            'src/4.tsx',
            'src/index.js',
            'src/package.json'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          fixtureToProjectMetadata('goodHybridrepoMultiversal').rootPackage,
          { useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/cli/src/index.ts',
              'packages/private/src/index.ts',
              'packages/private/package.json',
              'packages/webpack/webpack.config.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/private/src/lib/library2.ts',
              'packages/webpack/src/webpack-lib2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([
              'src/index.ts',
              'src/others.ts',
              'types/global.ts',
              'types/others.ts'
            ] as RelativePath[])
          },
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+cli': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+private': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+private': {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+webpack': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              typeverse: {
                count: 3,
                prefixes: new Set([
                  prefixTypeOnlyImport,
                  prefixNormalImport,
                  prefixExternalImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              }
            },
            dependencyCounts: {
              '@babel/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              '@black-flag/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'another-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'node:path': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'some-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'webpack~2': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          fixtureToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
            'cli'
          )!,
          { useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
          },
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+private': {
                count: 2,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'rootverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixTypeOnlyImport,
                  prefixNormalImport,
                  prefixExternalImport
                ])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'another-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('does not consider self-referential rootverse imports as "external"', () => {
      expect.hasAssertions();

      try {
        fixtures.goodHybridrepoMultiversal.namedPackageMapData.push(
          fixtures.goodHybridrepoMultiversal.unnamedPackageMapData[0]
        );

        expect(
          gatherPackageBuildTargets.sync(
            fixtureToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
              'private'
            )!,
            { useCached: true }
          )
        ).toStrictEqual({
          targets: {
            external: {
              normal: new Set([] as RelativePath[]),
              typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
            },
            internal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/src/markdown/1.md',
              'packages/private/src/markdown/2.md',
              'packages/private/src/markdown/3.md'
            ] as RelativePath[])
          },
          metadata: {
            imports: {
              aliasCounts: {
                'rootverse+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                typeverse: {
                  count: 2,
                  prefixes: new Set([
                    prefixTypeOnlyImport,
                    prefixNormalImport,
                    prefixInternalImport,
                    prefixExternalImport
                  ])
                }
              },
              dependencyCounts: {
                'another-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'some-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'type-fest': {
                  count: 2,
                  prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
                }
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        fixtures.goodHybridrepoMultiversal.namedPackageMapData.pop();
      }
    });

    it('does not consider self-referential rootverse imports as "external" even when the package id and package name diverge', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          fixtureToProjectMetadata('goodHybridrepoSelfRef').subRootPackages!.get(
            'package-one'
          )!,
          { useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const packageBuildTargets = gatherPackageBuildTargets.sync(
        dummyMetadata.rootPackage,
        {
          useCached: false
        }
      );

      expect(packageBuildTargets).toBe(
        gatherPackageBuildTargets.sync(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedPackageBuildTargets = gatherPackageBuildTargets.sync(
        dummyMetadata.rootPackage,
        { useCached: false }
      );

      expect(updatedPackageBuildTargets).not.toBe(packageBuildTargets);

      expect(
        gatherPackageBuildTargets.sync(dummyMetadata.rootPackage, { useCached: true })
      ).toBe(updatedPackageBuildTargets);
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const result1 = gatherPackageBuildTargets.sync(rootPackage, { useCached: true });
      const result2 = gatherPackageBuildTargets.sync(rootPackage, {
        excludeInternalsPatterns: ['/fake/exclude'],
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('returns same results regardless of explicitly empty includes/excludes', () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(rootPackage, {
          excludeInternalsPatterns: [],
          includeExternalsPatterns: [],
          useCached: true
        })
      ).toStrictEqual(gatherPackageBuildTargets.sync(rootPackage, { useCached: true }));
    });

    it('respects includeExternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            includeExternalsPatterns: ['packages/private/src/index.ts'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          { includeExternalsPatterns: ['**/private/*/index.ts'], useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            excludeInternalsPatterns: [
              'packages/webpack/src/webpack-lib.ts',
              'src/webpack-lib2.ts'
            ],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('return an empty result if there is nothing to return', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          { excludeInternalsPatterns: ['webpack-lib*'], useCached: true }
        )
      ).toStrictEqual({
        metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } },
        targets: {
          external: { normal: new Set(), typeOnly: new Set([] as RelativePath[]) },
          internal: new Set()
        }
      });
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('prefixes but does not perform well-formedness checks on specifiers from assets', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            includeExternalsPatterns: ['packages/webpack/webpack.config.mjs'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              '../webpack/src/webpack-lib2.js': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package2.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              '@some/namespaced': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~3': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageBuildTargets.sync(
          fixtureToProjectMetadata('badHybridrepoBadSpecifiers').rootPackage,
          { useCached: true }
        )
      ).toThrow(ErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1:lib.ts'));
    });
  });

  describe('<asynchronous>', () => {
    it('returns expected build targets for polyrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(fixtureToProjectMetadata('goodPolyrepo').rootPackage, {
          useCached: true
        })
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['types/global.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'src/1.ts',
            'src/2.mts',
            'src/3.cts',
            'src/4.tsx',
            'src/index.js',
            'src/package.json'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          fixtureToProjectMetadata('goodHybridrepoMultiversal').rootPackage,
          { useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/cli/src/index.ts',
              'packages/private/src/index.ts',
              'packages/private/package.json',
              'packages/webpack/webpack.config.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/private/src/lib/library2.ts',
              'packages/webpack/src/webpack-lib2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([
              'src/index.ts',
              'src/others.ts',
              'types/global.ts',
              'types/others.ts'
            ] as RelativePath[])
          },
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+cli': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+private': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+private': {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+webpack': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              typeverse: {
                count: 3,
                prefixes: new Set([
                  prefixTypeOnlyImport,
                  prefixNormalImport,
                  prefixExternalImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              }
            },
            dependencyCounts: {
              '@babel/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              '@black-flag/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'another-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'node:path': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'some-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'webpack~2': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          fixtureToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
            'cli'
          )!,
          { useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
          },
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+private': {
                count: 2,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'rootverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixTypeOnlyImport,
                  prefixNormalImport,
                  prefixExternalImport
                ])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'another-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('does not consider self-referential rootverse imports as "external"', async () => {
      expect.hasAssertions();

      try {
        fixtures.goodHybridrepoMultiversal.namedPackageMapData.push(
          fixtures.goodHybridrepoMultiversal.unnamedPackageMapData[0]
        );

        await expect(
          gatherPackageBuildTargets(
            fixtureToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
              'private'
            )!,
            { useCached: true }
          )
        ).resolves.toStrictEqual({
          targets: {
            external: {
              normal: new Set([] as RelativePath[]),
              typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
            },
            internal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/src/markdown/1.md',
              'packages/private/src/markdown/2.md',
              'packages/private/src/markdown/3.md'
            ] as RelativePath[])
          },
          metadata: {
            imports: {
              aliasCounts: {
                'rootverse+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                typeverse: {
                  count: 2,
                  prefixes: new Set([
                    prefixTypeOnlyImport,
                    prefixNormalImport,
                    prefixInternalImport,
                    prefixExternalImport
                  ])
                }
              },
              dependencyCounts: {
                'another-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'some-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'type-fest': {
                  count: 2,
                  prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
                }
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        fixtures.goodHybridrepoMultiversal.namedPackageMapData.pop();
      }
    });

    it('does not consider self-referential rootverse imports as "external" even when the package id and package name diverge', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          fixtureToProjectMetadata('goodHybridrepoSelfRef').subRootPackages!.get(
            'package-one'
          )!,
          { useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const packageBuildTargets = await gatherPackageBuildTargets(
        dummyMetadata.rootPackage,
        { useCached: false }
      );

      expect(packageBuildTargets).toBe(
        await gatherPackageBuildTargets(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedPackageBuildTargets = await gatherPackageBuildTargets(
        dummyMetadata.rootPackage,
        { useCached: false }
      );

      expect(updatedPackageBuildTargets).not.toBe(packageBuildTargets);

      await expect(
        gatherPackageBuildTargets(dummyMetadata.rootPackage, { useCached: true })
      ).resolves.toBe(updatedPackageBuildTargets);
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepo');
      const result1 = await gatherPackageBuildTargets(rootPackage, { useCached: true });
      const result2 = await gatherPackageBuildTargets(rootPackage, {
        excludeInternalsPatterns: ['/fake/exclude'],
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('returns same results regardless of explicitly empty includes/excludes', async () => {
      expect.hasAssertions();

      const { rootPackage } = fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(rootPackage, {
          excludeInternalsPatterns: [],
          includeExternalsPatterns: [],
          useCached: true
        })
      ).resolves.toStrictEqual(
        await gatherPackageBuildTargets(rootPackage, { useCached: true })
      );
    });

    it('respects includeExternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            includeExternalsPatterns: ['packages/private/src/index.ts'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          { includeExternalsPatterns: ['**/private/*/index.ts'], useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            excludeInternalsPatterns: [
              'packages/webpack/src/webpack-lib.ts',
              'src/webpack-lib2.ts'
            ],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('return an empty result if there is nothing to return', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          { excludeInternalsPatterns: ['webpack-lib*'], useCached: true }
        )
      ).resolves.toStrictEqual({
        metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } },
        targets: {
          external: { normal: new Set(), typeOnly: new Set([] as RelativePath[]) },
          internal: new Set()
        }
      });
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('prefixes but does not perform well-formedness checks on specifiers from assets', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        fixtureToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            includeExternalsPatterns: ['packages/webpack/webpack.config.mjs'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              '../webpack/src/webpack-lib2.js': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package2.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              '@some/namespaced': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~3': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          fixtureToProjectMetadata('badHybridrepoBadSpecifiers').rootPackage,
          { useCached: true }
        )
      ).rejects.toThrow(
        ErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1:lib.ts')
      );
    });
  });
});

describe('::analyzeProjectStructure', () => {
  describe('<synchronous>', () => {
    it('accepts workspaces.packages array in package.json', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepoWeirdYarn.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toBeDefined();
    });

    it('returns expected metadata when cwd is polyrepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodPolyrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeUndefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Polyrepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodPolyrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodPolyrepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodPolyrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);
    });

    it('returns expected metadata when cwd is monorepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodMonorepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodMonorepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodMonorepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodHybridrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodHybridrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodHybridrepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodHybridrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodHybridrepo');
    });

    it('returns expected project and workspace attributes for various Next.js projects', () => {
      expect.hasAssertions();

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'badMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.badPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.badPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.goodPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }
    });

    it('returns expected subRootPackages and cwdPackage when cwd is monorepo root with the same name as a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdSameNames.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepo.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is somewhere under a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepo.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage with simple workspace cwd', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepoSimplePaths.namedPackageMapData[0][1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.namedPackageMapData[0][1]
      );

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoSimplePaths');
    });

    it('returns expected subRootPackages and cwdPackage when workspace cwd uses Windows-style path separators', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWindows.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepoWindows.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWindows');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root in a monorepo with weird absolute paths', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepoWeirdAbsolute.namedPackageMapData[0][1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdAbsolute');
    });

    it('normalizes workspace cwd to ignore non-directories', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdBoneless.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdOverlap.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoNegatedPaths.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNegatedPaths');
    });

    it('classifies matching workspace pseudo-roots (without a package.json) as "broken"', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.badMonorepoNonPackageDir.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', () => {
      expect.hasAssertions();
      expect(() =>
        analyzeProjectStructure.sync({ useCached: true, allowUnnamedPackages: true })
      ).toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('correctly determines repository type', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).type
      ).toBe(ProjectAttribute.Monorepo);

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).type
      ).toBe(ProjectAttribute.Polyrepo);
    });

    it('returns correct rootPackage regardless of cwd', () => {
      expect.hasAssertions();

      const expectedJsonSpec = patchReadXPackageJsonAtRoot(
        {
          [fixtures.goodMonorepo.root]: {
            name: 'good-monorepo-package-json-name',
            workspaces: ['packages/*']
          },
          [fixtures.goodPolyrepo.root]: {
            name: 'good-polyrepo-package-json-name'
          }
        },
        { replace: true }
      );

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/..` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodPolyrepo.root,
          json: expectedJsonSpec[fixtures.goodPolyrepo.root],
          attributes: fixtures.goodPolyrepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${fixtures.goodPolyrepo.root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodPolyrepo.root,
          json: expectedJsonSpec[fixtures.goodPolyrepo.root],
          attributes: fixtures.goodPolyrepo.attributes,
          projectMetadata: expect.anything()
        });
      }
    });

    it('populates subRootPackages with correct WorkspacePackage objects in monorepo', () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).subRootPackages,
        'goodMonorepo'
      );
    });

    it('returns undefined subRootPackages when in polyrepo', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).subRootPackages
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = analyzeProjectStructure.sync({
        cwd: fixtures.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(dummyMetadata.rootPackage).toBe(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).rootPackage
      );

      const updatedDummyMetadata = analyzeProjectStructure.sync({
        cwd: fixtures.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(updatedDummyMetadata.rootPackage).not.toBe(dummyMetadata.rootPackage);

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).rootPackage
      ).toBe(updatedDummyMetadata.rootPackage);
    });

    it('defines cwdPackage properly when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).cwdPackage
      ).toStrictEqual(fixtureToProjectMetadata('goodMonorepo').rootPackage);

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
          useCached: true,
          allowUnnamedPackages: true
        }).cwdPackage
      ).toStrictEqual(fixtures.goodMonorepo.namedPackageMapData[0][1]);
    });

    it('sets subRootPackages[package.json.name] to strictly equal cwdPackage when expected', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.subRootPackages?.get(result.cwdPackage.json.name!)).toBe(
        result.cwdPackage
      );

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('sets subRootPackages.unnamed[package.id] to strictly equal cwdPackage when expected', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.unnamedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(
        result.subRootPackages?.unnamed.get((result.cwdPackage as WorkspacePackage).id)
      ).toBe(result.cwdPackage);

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: '/fake/root' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: '/does/not/exist' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when a project has conflicting cli and next attributes', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badPolyrepoConflictingAttributes.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(ErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badPolyrepoBadType.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        ErrorMessage.BadProjectTypeInPackageJson(
          toPath(fixtures.badPolyrepoBadType.root, 'package.json')
        )
      );
    });

    it('throws when two packages have the same "name" field in package.json', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoDuplicateName.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(ErrorMessage.DuplicatePackageName('pkg', '', '').trim());
    });

    it('throws when two unnamed packages resolve to the same package-id', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoDuplicateIdUnnamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-1/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-2/pkg-1`
        )
      );
    });

    it('throws when two differently-named packages resolve to the same package-id', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoDuplicateIdNamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });

    it('throws when allowUnnamedPackages is false (the default) and unnamed packages are present', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: false
        })
      ).toThrow(
        ErrorMessage.MissingNameInPackageJson(
          toPath(fixtures.goodMonorepo.unnamedPackageMapData[0][1].root, 'package.json')
        )
      );

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: true
          // * allowUnnamedPackages: false should be the default
        })
      ).toThrow(
        ErrorMessage.MissingNameInPackageJson(
          toPath(fixtures.goodMonorepo.unnamedPackageMapData[0][1].root, 'package.json')
        )
      );

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root,
          useCached: false,
          allowUnnamedPackages: true
        })
      ).not.toThrow();
    });
  });

  describe('<asynchronous>', () => {
    it('accepts workspaces.packages array in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.goodMonorepoWeirdYarn.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).resolves.toBeDefined();
    });

    it('returns expected metadata when cwd is polyrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodPolyrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeUndefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Polyrepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodPolyrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodPolyrepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodPolyrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);
    });

    it('returns expected metadata when cwd is monorepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodMonorepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodMonorepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodMonorepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodHybridrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodHybridrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(fixtures.goodHybridrepo.json);
      expect(result.rootPackage.root).toBe(fixtures.goodHybridrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodHybridrepo');
    });

    it('returns expected project and workspace attributes for various Next.js projects', async () => {
      expect.hasAssertions();

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.badMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'badMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.badPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.badPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.goodMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.goodPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          fixtures.goodPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }
    });

    it('returns expected subRootPackages and cwdPackage when cwd is monorepo root with the same name as a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdSameNames.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepo.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is somewhere under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepo.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage with simple workspace cwd', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepoSimplePaths.namedPackageMapData[0][1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.namedPackageMapData[0][1]
      );

      expect(result.rootPackage.attributes).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoSimplePaths');
    });

    it('returns expected subRootPackages and cwdPackage when workspace cwd uses Windows-style path separators', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWindows.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        fixtures.goodMonorepoWindows.namedPackageMapData[0][1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWindows');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root in a monorepo with weird absolute paths', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepoWeirdAbsolute.namedPackageMapData[0][1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdAbsolute');
    });

    it('normalizes workspace cwd to ignore non-directories', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdBoneless.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdOverlap.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoNegatedPaths.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNegatedPaths');
    });

    it('classifies matching workspace pseudo-roots (without a package.json) as "broken"', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.badMonorepoNonPackageDir.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', async () => {
      expect.hasAssertions();
      await expect(
        analyzeProjectStructure({ useCached: true, allowUnnamedPackages: true })
      ).rejects.toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('correctly determines repository type', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).type
      ).toBe(ProjectAttribute.Monorepo);

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).type
      ).toBe(ProjectAttribute.Polyrepo);
    });

    it('returns correct rootPackage regardless of cwd', async () => {
      expect.hasAssertions();

      const expectedJsonSpec = patchReadXPackageJsonAtRoot(
        {
          [fixtures.goodMonorepo.root]: {
            name: 'good-monorepo-package-json-name',
            workspaces: ['packages/*']
          },
          [fixtures.goodPolyrepo.root]: {
            name: 'good-polyrepo-package-json-name'
          }
        },
        { replace: true }
      );

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/..` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${fixtures.goodMonorepo.namedPackageMapData[0][1].root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodMonorepo.root,
          json: expectedJsonSpec[fixtures.goodMonorepo.root],
          attributes: fixtures.goodMonorepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: fixtures.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodPolyrepo.root,
          json: expectedJsonSpec[fixtures.goodPolyrepo.root],
          attributes: fixtures.goodPolyrepo.attributes,
          projectMetadata: expect.anything()
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${fixtures.goodPolyrepo.root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(rootPackage).toStrictEqual({
          root: fixtures.goodPolyrepo.root,
          json: expectedJsonSpec[fixtures.goodPolyrepo.root],
          attributes: fixtures.goodPolyrepo.attributes,
          projectMetadata: expect.anything()
        });
      }
    });

    it('populates subRootPackages with correct WorkspacePackage objects in monorepo', async () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).subRootPackages,
        'goodMonorepo'
      );
    });

    it('returns undefined subRootPackages when in polyrepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).subRootPackages
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = await analyzeProjectStructure({
        cwd: fixtures.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(dummyMetadata.rootPackage).toBe(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).rootPackage
      );

      const updatedDummyMetadata = await analyzeProjectStructure({
        cwd: fixtures.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(updatedDummyMetadata.rootPackage).not.toBe(dummyMetadata.rootPackage);

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).rootPackage
      ).toBe(updatedDummyMetadata.rootPackage);
    });

    it('defines cwdPackage properly when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).cwdPackage
      ).toStrictEqual(fixtureToProjectMetadata('goodMonorepo').rootPackage);

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).cwdPackage
      ).toStrictEqual(fixtures.goodMonorepo.namedPackageMapData[0][1]);
    });

    it('sets subRootPackages[package.json.name] to strictly equal cwdPackage when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.namedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.subRootPackages?.get(result.cwdPackage.json.name!)).toBe(
        result.cwdPackage
      );

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('sets subRootPackages.unnamed[package.id] to strictly equal cwdPackage when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.unnamedPackageMapData[0][1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(
        result.subRootPackages?.unnamed.get((result.cwdPackage as WorkspacePackage).id)
      ).toBe(result.cwdPackage);

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: '/fake/root' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: '/does/not/exist' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when a project has conflicting cli and next attributes', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badPolyrepoConflictingAttributes.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(ErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badPolyrepoBadType.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        ErrorMessage.BadProjectTypeInPackageJson(
          toPath(fixtures.badPolyrepoBadType.root, 'package.json')
        )
      );
    });

    it('throws when two packages have the same "name" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badMonorepoDuplicateName.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(ErrorMessage.DuplicatePackageName('pkg', '', '').trim());
    });

    it('throws when two unnamed packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badMonorepoDuplicateIdUnnamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-1/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-2/pkg-1`
        )
      );
    });

    it('throws when two differently-named packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badMonorepoDuplicateIdNamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });

    it('throws when allowUnnamedPackages is false (the default) and unnamed packages are present', async () => {
      expect.hasAssertions();

      await expect(() =>
        analyzeProjectStructure({
          cwd: fixtures.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: false
        })
      ).rejects.toMatchObject({
        message: expect.stringContaining(ErrorMessage.MissingNameInPackageJson(''))
      });

      await expect(() =>
        analyzeProjectStructure({
          cwd: fixtures.goodMonorepo.root,
          useCached: true
          // * allowUnnamedPackages: false should be the default
        })
      ).rejects.toMatchObject({
        message: expect.stringContaining(ErrorMessage.MissingNameInPackageJson(''))
      });

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.goodMonorepo.root,
          useCached: false,
          allowUnnamedPackages: true
        })
      ).resolves.not.toThrow();
    });
  });
});

function checkForExpectedPackages(
  maybeResult: GenericProjectMetadata['subRootPackages'],
  fixtureName: FixtureName
) {
  const result = maybeResult!;

  expect(maybeResult).toBeDefined();

  expect(Array.from(result.entries())).toIncludeSameMembers(
    fixtures[fixtureName].namedPackageMapData
  );

  expect(Array.from(result.unnamed.entries())).toIncludeSameMembers(
    fixtures[fixtureName].unnamedPackageMapData
  );

  expect(result.broken).toIncludeSameMembers(fixtures[fixtureName].brokenPackageRoots);

  expect(result.all).toIncludeSameMembers([
    ...fixtures[fixtureName].namedPackageMapData.map(([, data]) => data),
    ...fixtures[fixtureName].unnamedPackageMapData.map(([, data]) => data)
  ]);
}

function getExpectedPseudodecorators(
  tsFile: string,
  jsFile: string,
  jsonFile: string,
  mdFile: string,
  ymlFile: string
) {
  return [
    [
      tsFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: [
            'all-contributors-cli',
            'remark-cli',
            'jest',
            'husky',
            'doctoc',
            '@babel/cli'
          ]
        },
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: [
            '@types/eslint__js',
            'remark-cli',
            'jest',
            'husky',
            'lodash.mergewith',
            'doctoc',
            '@babel/cli'
          ]
        }
      ]
    ],
    [
      jsFile,
      [
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        { tag: PseudodecoratorTag.NotInvalid, items: [] },
        { tag: PseudodecoratorTag.NotInvalid, items: [] },
        { tag: PseudodecoratorTag.NotExtraneous, items: [] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something-else'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something-', 'else'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['ugly', 'but', 'works'] }
      ]
    ],
    [
      jsonFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['a1', 'p2', '@lib/three', '@-xun/four']
        }
      ]
    ],
    [
      mdFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        { tag: PseudodecoratorTag.NotExtraneous, items: ['more'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['even', 'more', 'items'] }
      ]
    ],
    [
      ymlFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', '@doc/toc']
        }
      ]
    ]
  ];
}
