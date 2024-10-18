import { runNoRejectOnBadExit } from 'multiverse#run';

import { pathToPackage } from '#project-utils src/analyze/exports/path-to-package.ts';
import { ErrorMessage } from '#project-utils src/error.ts';
import { type AbsolutePath, type RelativePath } from '#project-utils src/fs/index.ts';

import {
  analyzeProjectStructure,
  assetPrefix,
  clearInternalCache,
  gatherImportEntriesFromFiles,
  gatherPackageBuildTargets,
  gatherPackageSrcFiles,
  gatherProjectFiles,
  generatePackageJsonEngineMaintainedNodeVersions,
  packageRootToId,
  ProjectAttribute,
  type PackageBuildTargets,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage
} from '#project-utils src/index.ts';

import {
  fixtures,
  fixtureToProjectMetadata,
  patchReadPackageJsonAtRoot,
  type FixtureName
} from '#project-utils test/helpers/dummy-repo.ts';

import { asMockedFunction } from 'testverse setup.ts';

jest.mock<typeof import('browserslist')>('browserslist', () => {
  return mockShouldReturnBrowserslistMock
    ? mockBrowserslist
    : jest.requireActual('browserslist');
});

jest.mock('multiverse#run');

// eslint-disable-next-line jest/require-hook
let mockShouldReturnBrowserslistMock = false;

const mockBrowserslist = asMockedFunction<typeof import('browserslist')>();
const mockRunNoRejectOnBadExit = asMockedFunction(runNoRejectOnBadExit);

beforeEach(() => {
  jest.spyOn(process, 'cwd').mockImplementation(() => '/fake/cwd');
});

afterEach(() => {
  mockShouldReturnBrowserslistMock = false;
  clearInternalCache();
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
  describe('<synchronous>', () => {
    it('translates a path to a package id', async () => {
      expect.hasAssertions();

      expect(
        packageRootToId.sync({ packageRoot: '/repo/path/packages/pkg-1' as AbsolutePath })
      ).toBe('pkg-1');
    });

    it('replaces non-alphanumeric characters with hyphens', async () => {
      expect.hasAssertions();

      expect(
        packageRootToId.sync({
          packageRoot: '/repo/path/packages/bad& pack@g3!d' as AbsolutePath
        })
      ).toBe('bad--pack-g3-d');
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      expect(() =>
        packageRootToId.sync({ packageRoot: 'repo/path/packages/pkg-1' as AbsolutePath })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('repo/path/packages/pkg-1'));
    });
  });

  describe('<asynchronous>', () => {
    it('translates a path to a package id', async () => {
      expect.hasAssertions();

      await expect(
        packageRootToId({ packageRoot: '/repo/path/packages/pkg-1' as AbsolutePath })
      ).resolves.toBe('pkg-1');
    });

    it('replaces non-alphanumeric characters with hyphens', async () => {
      expect.hasAssertions();

      await expect(
        packageRootToId({
          packageRoot: '/repo/path/packages/bad& pack@g3!d' as AbsolutePath
        })
      ).resolves.toBe('bad--pack-g3-d');
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      await expect(
        packageRootToId({ packageRoot: 'repo/path/packages/pkg-1' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('repo/path/packages/pkg-1'));
    });
  });
});

describe('::pathToPackage', () => {
  describe('<synchronous>', () => {
    it('translates a path to the root package in a polyrepo', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodPolyrepo');

      expect(
        pathToPackage.sync({
          path: fixtures.goodPolyrepo.root,
          projectMetadata
        })
      ).toStrictEqual(projectMetadata.project);

      expect(
        pathToPackage.sync({
          path: (fixtures.goodPolyrepo.root +
            '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(projectMetadata.project);
    });

    it('translates a path to the root package in a hybridrepo', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      expect(
        pathToPackage.sync({
          path: fixtures.goodHybridrepo.root,
          projectMetadata
        })
      ).toStrictEqual(projectMetadata.project);

      expect(
        pathToPackage.sync({
          path: (fixtures.goodHybridrepo.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(projectMetadata.project);
    });

    it('translates a path to a sub-root package in a monorepo', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');
      const firstPkg = fixtures.goodHybridrepo.namedPkgMapData[0][1];
      const secondPkg = fixtures.goodHybridrepo.unnamedPkgMapData[0][1];

      expect(
        pathToPackage.sync({
          path: firstPkg.root,
          projectMetadata
        })
      ).toStrictEqual(firstPkg);

      expect(
        pathToPackage.sync({
          path: (firstPkg.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(firstPkg);

      expect(
        pathToPackage.sync({
          path: (firstPkg.root + '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(firstPkg);

      expect(
        pathToPackage.sync({
          path: secondPkg.root,
          projectMetadata
        })
      ).toStrictEqual(secondPkg);

      expect(
        pathToPackage.sync({
          path: (secondPkg.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(secondPkg);

      expect(
        pathToPackage.sync({
          path: (secondPkg.root + '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).toStrictEqual(secondPkg);
    });

    it('throws if path is not absolute', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      expect(() =>
        pathToPackage.sync({
          // * A convenient lie
          path: './src' as AbsolutePath,
          projectMetadata
        })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('./src'));
    });

    it('throws if path is not within project', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      expect(() =>
        pathToPackage.sync({
          path: '/dev/null' as AbsolutePath,
          projectMetadata
        })
      ).toThrow(ErrorMessage.PathOutsideRoot('/'));
    });
  });

  describe('<asynchronous>', () => {
    it('translates a path to the root package in a polyrepo', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodPolyrepo');

      await expect(
        pathToPackage({
          path: fixtures.goodPolyrepo.root,
          projectMetadata
        })
      ).resolves.toStrictEqual(projectMetadata.project);

      await expect(
        pathToPackage({
          path: (fixtures.goodPolyrepo.root +
            '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(projectMetadata.project);
    });

    it('translates a path to the root package in a hybridrepo', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      await expect(
        pathToPackage({
          path: fixtures.goodHybridrepo.root,
          projectMetadata
        })
      ).resolves.toStrictEqual(projectMetadata.project);

      await expect(
        pathToPackage({
          path: (fixtures.goodHybridrepo.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(projectMetadata.project);
    });

    it('translates a path to a sub-root package in a monorepo', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');
      const firstPkg = fixtures.goodHybridrepo.namedPkgMapData[0][1];
      const secondPkg = fixtures.goodHybridrepo.unnamedPkgMapData[0][1];

      await expect(
        pathToPackage({
          path: firstPkg.root,
          projectMetadata
        })
      ).resolves.toStrictEqual(firstPkg);

      await expect(
        pathToPackage({
          path: (firstPkg.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(firstPkg);

      await expect(
        pathToPackage({
          path: (firstPkg.root + '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(firstPkg);

      await expect(
        pathToPackage({
          path: secondPkg.root,
          projectMetadata
        })
      ).resolves.toStrictEqual(secondPkg);

      await expect(
        pathToPackage({
          path: (secondPkg.root + '/package.json') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(secondPkg);

      await expect(
        pathToPackage({
          path: (secondPkg.root + '/some/path/to/somewhere.ts') as AbsolutePath,
          projectMetadata
        })
      ).resolves.toStrictEqual(secondPkg);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      await expect(
        pathToPackage({
          // * A convenient lie
          path: './src' as AbsolutePath,
          projectMetadata
        })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('./src'));
    });

    it('throws if path is not within project', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepo');

      await expect(
        pathToPackage({
          path: '/dev/null' as AbsolutePath,
          projectMetadata
        })
      ).rejects.toThrow(ErrorMessage.PathOutsideRoot('/'));
    });
  });
});

describe('::analyzeProjectStructure', () => {
  describe('<synchronous>', () => {
    it('accepts workspaces.packages array in package.json', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepoWeirdYarn.root
        })
      ).not.toThrow();
    });

    it('returns expected metadata when cwd is polyrepo project root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodPolyrepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.packages).toBeUndefined();

      expect(result.project.attributes).toStrictEqual(fixtures.goodPolyrepo.attributes);
    });

    it('returns expected metadata when cwd is monorepo project root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.attributes).toStrictEqual(fixtures.goodMonorepo.attributes);

      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodHybridrepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.attributes).toStrictEqual(fixtures.goodHybridrepo.attributes);

      checkForExpectedPackages(result.project.packages, 'goodHybridrepo');
    });

    it('returns expected project.attributes and project.packages[].attributes for various Next.js projects', async () => {
      expect.hasAssertions();

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.project.packages, 'badMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.badPolyrepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.badPolyrepoNextjsProject.attributes
        );

        expect(result.project.packages).toBeUndefined();
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.project.packages, 'goodMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.goodPolyrepoNextjsProject.attributes
        );

        expect(result.project.packages).toBeUndefined();
      }
    });

    it('returns expected project.packages and package when cwd is monorepo root with the same name as a sub-root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdSameNames.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected project.packages and package when cwd is a sub-root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      });

      expect(result.package).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected project.packages and package when cwd is under the project root but not under a sub-root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..` as AbsolutePath
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected project.packages and package when cwd is somewhere under a sub-root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src` as AbsolutePath
      });

      expect(result.package).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('works with simple workspace cwd', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1].root}/src` as AbsolutePath
      });

      expect(result.package).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1]
      );

      expect(result.project.attributes).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.project.packages, 'goodMonorepoSimplePaths');
    });

    it('works with workspace cwd using Windows-style path separators', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWindows.namedPkgMapData[0][1].root
      });

      expect(result.package).toStrictEqual(
        fixtures.goodMonorepoWindows.namedPkgMapData[0][1]
      );

      checkForExpectedPackages(result.project.packages, 'goodMonorepoWindows');
    });

    it('works with a cwd pointing to a subdirectory of a package root', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${fixtures.goodMonorepoWeirdAbsolute.namedPkgMapData[0][1].root}/..` as AbsolutePath
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdAbsolute');
    });

    it('normalizes workspace cwd to ignore non-directories', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdBoneless.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoWeirdOverlap.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepoNegatedPaths.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoNegatedPaths');
    });

    test('matching workspace pseudo-roots (without a package.json) are classified "broken"', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.badMonorepoNonPackageDir.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', async () => {
      expect.hasAssertions();
      expect(() => analyzeProjectStructure.sync()).toThrow(
        ErrorMessage.NotAGitRepositoryError()
      );
    });

    it('correctly determines repository type', async () => {
      expect.hasAssertions();

      expect(analyzeProjectStructure.sync({ cwd: fixtures.goodMonorepo.root }).type).toBe(
        ProjectAttribute.Monorepo
      );

      expect(analyzeProjectStructure.sync({ cwd: fixtures.goodPolyrepo.root }).type).toBe(
        ProjectAttribute.Polyrepo
      );
    });

    test('project.root and project.json are correct regardless of cwd', async () => {
      expect.hasAssertions();

      const expectedJsonSpec = patchReadPackageJsonAtRoot(
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

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
        }).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        analyzeProjectStructure.sync({
          cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..` as AbsolutePath
        }).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        analyzeProjectStructure.sync({
          cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src` as AbsolutePath
        }).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root
        }).project
      ).toStrictEqual({
        root: fixtures.goodPolyrepo.root,
        json: expectedJsonSpec[fixtures.goodPolyrepo.root],
        attributes: fixtures.goodPolyrepo.attributes,
        packages: undefined
      });

      expect(
        analyzeProjectStructure.sync({
          cwd: `${fixtures.goodPolyrepo.root}/src` as AbsolutePath
        }).project
      ).toStrictEqual({
        root: fixtures.goodPolyrepo.root,
        json: expectedJsonSpec[fixtures.goodPolyrepo.root],
        attributes: fixtures.goodPolyrepo.attributes,
        packages: undefined
      });
    });

    test('project.packages is populated with correct WorkspacePackage objects in monorepo', async () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root
        }).project.packages,
        'goodMonorepo'
      );
    });

    test('project.packages is undefined when in polyrepo', async () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root
        }).project.packages
      ).toBeUndefined();
    });

    test('package is undefined when in polyrepo or at project root in monorepo', async () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root
        }).package
      ).toBeUndefined();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root
        }).package
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodPolyrepo.root
      });

      expect(result.project).not.toBe(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root,
          useCached: false
        }).project
      );

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodPolyrepo.root
        }).project
      ).toBe(result.project);
    });

    it('package is not undefined when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', async () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.root
        }).package
      ).toBeUndefined();

      expect(
        analyzeProjectStructure.sync({
          cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
        }).package
      ).toBeDefined();
    });

    test('project.packages[package.json.name] strictly equals package when expected', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      });

      expect(result.project.packages?.get(result.package!.json.name!)).toBe(
        result.package
      );

      expect(!!result.package).toBeTrue();
    });

    test('project.packages.unnamed[package.id] strictly equals package when expected', async () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: fixtures.goodMonorepo.unnamedPkgMapData[0][1].root
      });

      expect(result.project.packages?.unnamed.get(result.package!.id)).toBe(
        result.package
      );

      expect(!!result.package).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({ cwd: '/fake/root' as AbsolutePath })
      ).toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({ cwd: '/does/not/exist' as AbsolutePath })
      ).toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when passed a relative cwd', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({ cwd: 'does/not/exist' as AbsolutePath })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist'));
    });

    it('throws when a project has conflicting cli and next attributes', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badPolyrepoConflictingAttributes.root
        })
      ).toThrow(ErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({ cwd: fixtures.badPolyrepoBadType.root })
      ).toThrow(ErrorMessage.BadProjectTypeInPackageJson());
    });

    it('throws when two packages have the same "name" field in package.json', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoDuplicateName.root
        })
      ).toThrow(
        ErrorMessage.DuplicatePackageName(
          'pkg',
          `${fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`,
          `${fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`
        )
      );
    });

    it('throws when two unnamed packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: fixtures.badMonorepoDuplicateIdUnnamed.root
        })
      ).toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-1/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdUnnamed.root}/packages-2/pkg-1`
        )
      );
    });

    it('throws when two differently-named packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({ cwd: fixtures.badMonorepoDuplicateIdNamed.root })
      ).toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });
  });

  describe('<asynchronous>', () => {
    it('accepts workspaces.packages array in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.goodMonorepoWeirdYarn.root
        })
      ).resolves.toBeDefined();
    });

    it('returns expected metadata when cwd is polyrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodPolyrepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.packages).toBeUndefined();

      expect(result.project.attributes).toStrictEqual(fixtures.goodPolyrepo.attributes);
    });

    it('returns expected metadata when cwd is monorepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.attributes).toStrictEqual(fixtures.goodMonorepo.attributes);

      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodHybridrepo.root
      });

      expect(result.package).toBeUndefined();
      expect(result.project.attributes).toStrictEqual(fixtures.goodHybridrepo.attributes);

      checkForExpectedPackages(result.project.packages, 'goodHybridrepo');
    });

    it('returns expected project.attributes and project.packages[].attributes for various Next.js projects', async () => {
      expect.hasAssertions();

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.badMonorepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.project.packages, 'badMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.badPolyrepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.badPolyrepoNextjsProject.attributes
        );

        expect(result.project.packages).toBeUndefined();
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.goodMonorepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.project.packages, 'goodMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: fixtures.goodPolyrepoNextjsProject.root
        });

        expect(result.project.attributes).toStrictEqual(
          fixtures.goodPolyrepoNextjsProject.attributes
        );

        expect(result.project.packages).toBeUndefined();
      }
    });

    it('returns expected project.packages and package when cwd is monorepo root with the same name as a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdSameNames.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected project.packages and package when cwd is a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      });

      expect(result.package).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected project.packages and package when cwd is under the project root but not under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..` as AbsolutePath
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('returns expected project.packages and package when cwd is somewhere under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src` as AbsolutePath
      });

      expect(result.package).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
      checkForExpectedPackages(result.project.packages, 'goodMonorepo');
    });

    it('works with simple workspace cwd', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1].root}/src` as AbsolutePath
      });

      expect(result.package).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1]
      );

      expect(result.project.attributes).toStrictEqual(
        fixtures.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.project.packages, 'goodMonorepoSimplePaths');
    });

    it('works with workspace cwd using Windows-style path separators', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWindows.namedPkgMapData[0][1].root
      });

      expect(result.package).toStrictEqual(
        fixtures.goodMonorepoWindows.namedPkgMapData[0][1]
      );

      checkForExpectedPackages(result.project.packages, 'goodMonorepoWindows');
    });

    it('works with a cwd pointing to a subdirectory of a package root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${fixtures.goodMonorepoWeirdAbsolute.namedPkgMapData[0][1].root}/..` as AbsolutePath
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdAbsolute');
    });

    it('normalizes workspace cwd to ignore non-directories', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdBoneless.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoWeirdOverlap.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepoNegatedPaths.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'goodMonorepoNegatedPaths');
    });

    test('matching workspace pseudo-roots (without a package.json) are classified "broken"', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.badMonorepoNonPackageDir.root
      });

      expect(result.package).toBeUndefined();
      checkForExpectedPackages(result.project.packages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', async () => {
      expect.hasAssertions();
      await expect(analyzeProjectStructure()).rejects.toThrow(
        ErrorMessage.NotAGitRepositoryError()
      );
    });

    it('correctly determines repository type', async () => {
      expect.hasAssertions();

      expect(
        (await analyzeProjectStructure({ cwd: fixtures.goodMonorepo.root })).type
      ).toBe(ProjectAttribute.Monorepo);

      expect(
        (await analyzeProjectStructure({ cwd: fixtures.goodPolyrepo.root })).type
      ).toBe(ProjectAttribute.Polyrepo);
    });

    test('project.root and project.json are correct regardless of cwd', async () => {
      expect.hasAssertions();

      const expectedJsonSpec = patchReadPackageJsonAtRoot(
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

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
          })
        ).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        (
          await analyzeProjectStructure({
            cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..` as AbsolutePath
          })
        ).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        (
          await analyzeProjectStructure({
            cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src` as AbsolutePath
          })
        ).project
      ).toStrictEqual({
        root: fixtures.goodMonorepo.root,
        json: expectedJsonSpec[fixtures.goodMonorepo.root],
        attributes: fixtures.goodMonorepo.attributes,
        packages: expect.any(Map)
      });

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root
          })
        ).project
      ).toStrictEqual({
        root: fixtures.goodPolyrepo.root,
        json: expectedJsonSpec[fixtures.goodPolyrepo.root],
        attributes: fixtures.goodPolyrepo.attributes,
        packages: undefined
      });

      expect(
        (
          await analyzeProjectStructure({
            cwd: `${fixtures.goodPolyrepo.root}/src` as AbsolutePath
          })
        ).project
      ).toStrictEqual({
        root: fixtures.goodPolyrepo.root,
        json: expectedJsonSpec[fixtures.goodPolyrepo.root],
        attributes: fixtures.goodPolyrepo.attributes,
        packages: undefined
      });
    });

    test('project.packages is populated with correct WorkspacePackage objects in monorepo', async () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root
          })
        ).project.packages,
        'goodMonorepo'
      );
    });

    test('project.packages is undefined when in polyrepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root
          })
        ).project.packages
      ).toBeUndefined();
    });

    test('package is undefined when in polyrepo or at project root in monorepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root
          })
        ).package
      ).toBeUndefined();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root
          })
        ).package
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodPolyrepo.root
      });

      expect(result.project).not.toBe(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root,
            useCached: false
          })
        ).project
      );

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodPolyrepo.root
          })
        ).project
      ).toBe(result.project);
    });

    it('package is not undefined when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.root
          })
        ).package
      ).toBeUndefined();

      expect(
        (
          await analyzeProjectStructure({
            cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
          })
        ).package
      ).toBeDefined();
    });

    test('project.packages[package.json.name] strictly equals package when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      });

      expect(result.project.packages?.get(result.package!.json.name!)).toBe(
        result.package
      );

      expect(!!result.package).toBeTrue();
    });

    test('project.packages.unnamed[package.id] strictly equals package when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: fixtures.goodMonorepo.unnamedPkgMapData[0][1].root
      });

      expect(result.project.packages?.unnamed.get(result.package!.id)).toBe(
        result.package
      );

      expect(!!result.package).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({ cwd: '/fake/root' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({ cwd: '/does/not/exist' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.NotAGitRepositoryError());
    });

    it('throws when passed a relative cwd', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({ cwd: 'does/not/exist' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist'));
    });

    it('throws when a project has conflicting cli and next attributes', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badPolyrepoConflictingAttributes.root
        })
      ).rejects.toThrow(ErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({ cwd: fixtures.badPolyrepoBadType.root })
      ).rejects.toThrow(ErrorMessage.BadProjectTypeInPackageJson());
    });

    it('throws when two packages have the same "name" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badMonorepoDuplicateName.root
        })
      ).rejects.toThrow(ErrorMessage.DuplicatePackageName('pkg', '', '').trim());
    });

    it('throws when two unnamed packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: fixtures.badMonorepoDuplicateIdUnnamed.root
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
        analyzeProjectStructure({ cwd: fixtures.badMonorepoDuplicateIdNamed.root })
      ).rejects.toThrow(
        ErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${fixtures.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });
  });
});

describe('::gatherProjectFiles', () => {
  describe('<synchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodPolyrepo'))
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodMonorepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodMonorepo'))
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = fixtures.goodHybridrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodHybridrepo'))
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
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [],
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const projectFiles = gatherProjectFiles.sync(dummyMetadata);

      expect(projectFiles).not.toBe(
        gatherProjectFiles.sync(dummyMetadata, { useCached: false })
      );

      expect(gatherProjectFiles.sync(dummyMetadata)).toBe(projectFiles);
    });

    it('does not ignore files in prettier when "skipIgnored" is false', () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(fixtureToProjectMetadata('goodPolyrepo'), {
          skipIgnored: false
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
        typescriptFiles: {
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
        }
      });
    });

    it('throws given bad sync options', async () => {
      expect.hasAssertions();

      expect(() =>
        gatherProjectFiles.sync({} as ProjectMetadata, {
          // @ts-expect-error: we expect this to fail or something's wrong
          skipUnknown: true
        })
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('throws if a root or workspace package.json file contains "directories"', () => {
      expect.hasAssertions();

      expect(() =>
        gatherProjectFiles.sync({
          project: {
            root: '/fake',
            packages: undefined,
            json: { directories: { bin: 'bad' } }
          }
        } as ProjectMetadata)
      ).toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync({
          project: {
            root: '/fake',
            packages: new Map([
              [
                'id',
                {
                  root: 'fake/pkg',
                  json: { directories: { bin: 'bad' } }
                } as WorkspacePackage
              ]
            ]),
            json: {}
          }
        } as ProjectMetadata)
      ).toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync({
          project: {
            root: '/fake',
            packages: undefined,
            json: {}
          }
        } as ProjectMetadata)
      ).not.toThrow(ErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync({
          project: {
            root: '/fake',
            packages: new Map([
              ['id', { root: 'fake/pkg', json: {} } as WorkspacePackage]
            ]),
            json: {}
          }
        } as ProjectMetadata)
      ).not.toThrow(ErrorMessage.UnsupportedFeature(''));
    });
  });

  describe('<asynchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodPolyrepo'))
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodMonorepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodMonorepo'))
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = fixtures.goodHybridrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodHybridrepo'))
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
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [],
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
        typescriptFiles: {
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
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const projectFiles = await gatherProjectFiles(dummyMetadata);

      expect(projectFiles).not.toBe(
        gatherProjectFiles(dummyMetadata, { useCached: false })
      );

      await expect(gatherProjectFiles(dummyMetadata)).resolves.toBe(projectFiles);
    });

    it('does not ignore files in prettier when "skipIgnored" is false', async () => {
      expect.hasAssertions();

      const root = fixtures.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(fixtureToProjectMetadata('goodPolyrepo'), {
          skipIgnored: false
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
        typescriptFiles: {
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
          skipUnknown: true
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
        typescriptFiles: {
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
        }
      });
    });

    it('generates a type error if "skipUnknown" is true when "skipIgnored" is false', async () => {
      expect.hasAssertions();

      await expect(
        gatherProjectFiles(
          {
            project: {
              root: '/fake',
              packages: undefined,
              json: {}
            }
          } as ProjectMetadata,
          {
            skipIgnored: false,
            // @ts-expect-error: if this doesn't cause an error, something's wrong
            skipUnknown: true
          }
        )
      ).resolves.toBeDefined();
    });

    it('throws if a root or workspace package.json file contains "directories"', async () => {
      expect.hasAssertions();

      await expect(
        gatherProjectFiles({
          project: {
            root: '/fake',
            packages: undefined,
            json: { directories: { bin: 'bad' } }
          }
        } as ProjectMetadata)
      ).rejects.toThrow(ErrorMessage.UnsupportedFeature(''));

      await expect(
        gatherProjectFiles({
          project: {
            root: '/fake',
            packages: new Map([
              [
                'id',
                {
                  root: 'fake/pkg',
                  json: { directories: { bin: 'bad' } }
                } as WorkspacePackage
              ]
            ]),
            json: {}
          }
        } as ProjectMetadata)
      ).rejects.toThrow(ErrorMessage.UnsupportedFeature(''));

      await expect(
        gatherProjectFiles({
          project: {
            root: '/fake',
            packages: undefined,
            json: {}
          }
        } as ProjectMetadata)
      ).resolves.toBeDefined();

      await expect(
        gatherProjectFiles({
          project: {
            root: '/fake',
            packages: new Map([
              ['id', { root: 'fake/pkg', json: {} } as WorkspacePackage]
            ]),
            json: {}
          }
        } as ProjectMetadata)
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

      const fileOneResult = new Set([
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
      ]);

      const fileTwoResult = new Set([
        './tool.js',
        '../path/to/import.js',
        'string-literal'
      ]);

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      expect(gatherImportEntriesFromFiles.sync([fileOne])).toStrictEqual([
        [fileOne, fileOneResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileTwo])).toStrictEqual([
        [fileTwo, fileTwoResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileThree])).toStrictEqual([
        [fileThree, fileThreeResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileFour])).toStrictEqual([
        [fileFour, fileFourResult]
      ]);

      expect(
        gatherImportEntriesFromFiles.sync([
          fileOne,
          fileTwo,
          fileOne,
          fileThree,
          fileFour
        ])
      ).toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('includes type imports when excludeTypeImports is false', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/4.tsx` as AbsolutePath;

      const fileOneResult = new Set([
        'react',
        './some-utils.js',
        'side-effects.js',
        './styles.css',
        'some-lib',
        'package.json',
        'type-fest-1',
        'type-fest-2',
        'my-neat-lib',
        './source.js',
        './another-source.js',
        './type-fest-3.js',
        '@type/fest4',
        'my-neat-lib-2',
        'dynamic',
        'package.json',
        'this-is-a-typeof-import',
        'this-is-a-type-import'
      ]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { excludeTypeImports: false })
      ).toStrictEqual([[fileOne, fileOneResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileFour], { excludeTypeImports: false })
      ).toStrictEqual([[fileFour, fileOneResult]]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/5.js` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/6.mjs` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/7.cjs` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/8.jsx` as AbsolutePath;

      const fileResult = new Set([
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
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileOne])).toStrictEqual([
        [fileOne, fileResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileTwo])).toStrictEqual([
        [fileTwo, fileResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileThree])).toStrictEqual([
        [fileThree, fileResult]
      ]);

      expect(gatherImportEntriesFromFiles.sync([fileFour])).toStrictEqual([
        [fileFour, fileResult]
      ]);

      expect(
        gatherImportEntriesFromFiles.sync([
          fileOne,
          fileTwo,
          fileOne,
          fileThree,
          fileFour
        ])
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

      expect(gatherImportEntriesFromFiles.sync([fileOne])).toStrictEqual([
        [fileOne, new Set()]
      ]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne, fileOne, fileOne])
      ).toStrictEqual([
        [fileOne, new Set()],
        [fileOne, new Set()],
        [fileOne, new Set()]
      ]);
    });

    it('throws if @babel/core is not available', () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      expect(() => gatherImportEntriesFromFiles.sync([])).toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-import-attributes is not available', () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-import-attributes', () => {
        throw new Error('fake import failure!');
      });

      expect(() => gatherImportEntriesFromFiles.sync([])).toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-import-attributes');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      expect(() => gatherImportEntriesFromFiles.sync([])).toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });
  });

  describe('<asynchronous>', () => {
    it('returns an array of import specifier entries from esm-style imports without type imports', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/2.mts` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/3.cts` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/4.tsx` as AbsolutePath;

      const fileOneResult = new Set([
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
      ]);

      const fileTwoResult = new Set([
        './tool.js',
        '../path/to/import.js',
        'string-literal'
      ]);

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      await expect(gatherImportEntriesFromFiles([fileOne])).resolves.toStrictEqual([
        [fileOne, fileOneResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileTwo])).resolves.toStrictEqual([
        [fileTwo, fileTwoResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileThree])).resolves.toStrictEqual([
        [fileThree, fileThreeResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileFour])).resolves.toStrictEqual([
        [fileFour, fileFourResult]
      ]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour])
      ).resolves.toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('includes type imports when excludeTypeImports is false', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/1.ts` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/4.tsx` as AbsolutePath;

      const fileOneResult = new Set([
        'react',
        './some-utils.js',
        'side-effects.js',
        './styles.css',
        'some-lib',
        'package.json',
        'type-fest-1',
        'type-fest-2',
        'my-neat-lib',
        './source.js',
        './another-source.js',
        './type-fest-3.js',
        '@type/fest4',
        'my-neat-lib-2',
        'dynamic',
        'package.json',
        'this-is-a-typeof-import',
        'this-is-a-type-import'
      ]);

      await expect(
        gatherImportEntriesFromFiles([fileOne], { excludeTypeImports: false })
      ).resolves.toStrictEqual([[fileOne, fileOneResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileFour], { excludeTypeImports: false })
      ).resolves.toStrictEqual([[fileFour, fileOneResult]]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', async () => {
      expect.hasAssertions();

      const fileOne = `${__dirname}/fixtures/dummy-imports/5.js` as AbsolutePath;
      const fileTwo = `${__dirname}/fixtures/dummy-imports/6.mjs` as AbsolutePath;
      const fileThree = `${__dirname}/fixtures/dummy-imports/7.cjs` as AbsolutePath;
      const fileFour = `${__dirname}/fixtures/dummy-imports/8.jsx` as AbsolutePath;

      const fileResult = new Set([
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
      ]);

      await expect(gatherImportEntriesFromFiles([fileOne])).resolves.toStrictEqual([
        [fileOne, fileResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileTwo])).resolves.toStrictEqual([
        [fileTwo, fileResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileThree])).resolves.toStrictEqual([
        [fileThree, fileResult]
      ]);

      await expect(gatherImportEntriesFromFiles([fileFour])).resolves.toStrictEqual([
        [fileFour, fileResult]
      ]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour])
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

      await expect(gatherImportEntriesFromFiles([fileOne])).resolves.toStrictEqual([
        [fileOne, new Set()]
      ]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileOne, fileOne])
      ).resolves.toStrictEqual([
        [fileOne, new Set()],
        [fileOne, new Set()],
        [fileOne, new Set()]
      ]);
    });

    it('throws if @babel/core is not available', async () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      await expect(gatherImportEntriesFromFiles([])).rejects.toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-import-attributes is not available', async () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-import-attributes', () => {
        throw new Error('fake import failure!');
      });

      await expect(gatherImportEntriesFromFiles([])).rejects.toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-import-attributes');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', async () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      await expect(gatherImportEntriesFromFiles([])).rejects.toThrow(
        ErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });
  });
});

describe('::gatherPackageSrcFiles', () => {
  describe('<synchronous>', () => {
    it('returns src files for root package of polyrepo', () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodPolyrepo');

      expect(gatherPackageSrcFiles.sync(project)).toStrictEqual([
        `${project.root}/src/1.ts`,
        `${project.root}/src/2.mts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.js`,
        `${project.root}/src/package.json`
      ]);
    });

    it('returns src files for root and sub-root packages (named and unnamed) of hybridrepo', () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodHybridrepo');

      expect(gatherPackageSrcFiles.sync(project)).toStrictEqual([
        `${project.root}/src/1.js`,
        `${project.root}/src/2.mts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.ts`,
        `${project.root}/src/package.json`
      ]);

      expect(gatherPackageSrcFiles.sync(project.packages!.get('cli')!)).toStrictEqual([
        `${project.root}/packages/cli/src/index.js`,
        `${project.root}/packages/cli/src/package.json`,
        `${project.root}/packages/cli/src/som-file.tsx`
      ]);

      expect(
        gatherPackageSrcFiles.sync(project.packages!.unnamed.get('unnamed-cjs')!)
      ).toStrictEqual([
        `${project.root}/packages/unnamed-cjs/src/index.js`,
        `${project.root}/packages/unnamed-cjs/src/package.json`
      ]);
    });

    it('respects ignore option', () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodPolyrepo');

      expect(
        gatherPackageSrcFiles.sync(project, { ignore: ['*.mts', '/4.tsx'] })
      ).toStrictEqual([
        `${project.root}/src/1.ts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.js`,
        `${project.root}/src/package.json`
      ]);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const pkgSrcFiles = gatherPackageSrcFiles.sync(dummyMetadata.project);

      expect(pkgSrcFiles).not.toBe(
        gatherPackageSrcFiles.sync(dummyMetadata.project, { useCached: false })
      );

      expect(gatherPackageSrcFiles.sync(dummyMetadata.project)).toBe(pkgSrcFiles);
    });

    it('throws if src directory is empty or non-existent', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageSrcFiles.sync({ root: '/dev/null' } as RootPackage)
      ).toThrow(ErrorMessage.EmptyOrMissingSrcDir(''));

      expect(() =>
        gatherPackageSrcFiles.sync({
          root: fixtures.badPolyrepoNonPackageDir.root
        } as RootPackage)
      ).toThrow(
        ErrorMessage.EmptyOrMissingSrcDir(fixtures.badPolyrepoNonPackageDir.root)
      );
    });
  });

  describe('<asynchronous>', () => {
    it('returns src files for root package of polyrepo', async () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodPolyrepo');

      await expect(gatherPackageSrcFiles(project)).resolves.toStrictEqual([
        `${project.root}/src/1.ts`,
        `${project.root}/src/2.mts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.js`,
        `${project.root}/src/package.json`
      ]);
    });

    it('returns src files for root and sub-root packages (named and unnamed) of hybridrepo', async () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodHybridrepo');

      await expect(gatherPackageSrcFiles(project)).resolves.toStrictEqual([
        `${project.root}/src/1.js`,
        `${project.root}/src/2.mts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.ts`,
        `${project.root}/src/package.json`
      ]);

      await expect(
        gatherPackageSrcFiles(project.packages!.get('cli')!)
      ).resolves.toStrictEqual([
        `${project.root}/packages/cli/src/index.js`,
        `${project.root}/packages/cli/src/package.json`,
        `${project.root}/packages/cli/src/som-file.tsx`
      ]);

      await expect(
        gatherPackageSrcFiles(project.packages!.unnamed.get('unnamed-cjs')!)
      ).resolves.toStrictEqual([
        `${project.root}/packages/unnamed-cjs/src/index.js`,
        `${project.root}/packages/unnamed-cjs/src/package.json`
      ]);
    });

    it('respects ignore option', async () => {
      expect.hasAssertions();

      const { project } = fixtureToProjectMetadata('goodPolyrepo');

      await expect(
        gatherPackageSrcFiles(project, { ignore: ['*.mts', '/4.tsx'] })
      ).resolves.toStrictEqual([
        `${project.root}/src/1.ts`,
        `${project.root}/src/3.cts`,
        `${project.root}/src/4.tsx`,
        `${project.root}/src/index.js`,
        `${project.root}/src/package.json`
      ]);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');
      const pkgSrcFiles = await gatherPackageSrcFiles(dummyMetadata.project);

      expect(pkgSrcFiles).not.toBe(
        await gatherPackageSrcFiles(dummyMetadata.project, { useCached: false })
      );

      await expect(gatherPackageSrcFiles(dummyMetadata.project)).resolves.toBe(
        pkgSrcFiles
      );
    });

    it('throws if src directory is empty or non-existent', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageSrcFiles({ root: '/dev/null' } as RootPackage)
      ).rejects.toThrow(ErrorMessage.EmptyOrMissingSrcDir(''));

      await expect(
        gatherPackageSrcFiles({
          root: fixtures.badPolyrepoNonPackageDir.root
        } as RootPackage)
      ).rejects.toThrow(
        ErrorMessage.EmptyOrMissingSrcDir(fixtures.badPolyrepoNonPackageDir.root)
      );
    });
  });
});

describe('::gatherPackageBuildTargets', () => {
  describe('<synchronous>', () => {
    it('returns expected build targets for polyrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodPolyrepo'),
          targetPackageName: undefined
        })
      ).toStrictEqual({
        targets: {
          external: new Set(),
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
            aliasCounts: { universe: 4, typeverse: 1 },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined
        })
      ).toStrictEqual({
        targets: {
          external: new Set([
            'packages/cli/src/index.ts',
            'packages/private/src/index.ts',
            'packages/private/package.json',
            'packages/webpack/webpack.config.ts',
            'packages/private/src/lib/library.ts',
            'packages/webpack/src/webpack-lib.ts',
            'packages/private/src/lib/library2.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[]),
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 2,
              '#webpack': 3,
              'multiverse#cli': 1,
              'multiverse#private': 3,
              universe: 1
            },
            dependencyCounts: {
              '@babel/core': 1,
              '@black-flag/core': 1,
              'node:path': 1,
              'some-package': 1,
              'another-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: 'cli'
        })
      ).toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library.ts',
            'packages/webpack/src/webpack-lib.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1,
              '#webpack': 1,
              'multiverse#private': 2
            },
            dependencyCounts: {
              '@black-flag/core': 1,
              webpack: 1,
              'another-package': 1,
              'some-package': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo self-contained sub-root package with a scoped name different than its package-id', () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepoMultiversal');
      // ? Test that we're actually looking up packages by name and not id
      const targetPackageName = fixtures.goodHybridrepoMultiversal.namedPkgMapData[1][0];
      const targetPackageId = fixtures.goodHybridrepoMultiversal.namedPkgMapData[1][1].id;

      expect(
        gatherPackageBuildTargets.sync({ projectMetadata, targetPackageName })
      ).toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set([
            `packages/${targetPackageId}/src/webpack-lib2.ts`,
            `packages/${targetPackageId}/src/webpack-lib.ts`
          ] as RelativePath[])
        },
        metadata: {
          imports: { aliasCounts: {}, dependencyCounts: { webpack: 1, 'webpack~2': 1 } }
        }
      } satisfies PackageBuildTargets);
    });

    it('does not consider self-referential rootverse imports as "external"', () => {
      expect.hasAssertions();

      try {
        fixtures.goodHybridrepoMultiversal.namedPkgMapData.push(
          fixtures.goodHybridrepoMultiversal.unnamedPkgMapData[0]
        );

        expect(
          gatherPackageBuildTargets.sync({
            projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
            targetPackageName: 'private'
          })
        ).toStrictEqual({
          targets: {
            external: new Set([] as RelativePath[]),
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
                '#private': 1
              },
              dependencyCounts: {
                'another-package': 1,
                'some-package': 1
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        fixtures.goodHybridrepoMultiversal.namedPkgMapData.pop();
      }
    });

    it('does not consider self-referential rootverse imports as "external" even when the package id and package name diverge', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoSelfRef'),
          targetPackageName: 'package-one'
        })
      ).toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#pkg-1': 1
            },
            dependencyCounts: {
              '@black-flag/core': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');

      const packageBuildTargets = gatherPackageBuildTargets.sync({
        projectMetadata: dummyMetadata,
        targetPackageName: undefined
      });

      expect(packageBuildTargets).not.toBe(
        gatherPackageBuildTargets.sync({
          projectMetadata: dummyMetadata,
          targetPackageName: undefined,
          useCached: false
        })
      );

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: dummyMetadata,
          targetPackageName: undefined
        })
      ).toBe(packageBuildTargets);
    });

    it('returns same results regardless of explicitly empty includes/excludes', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined,
          excludeInternalsPatterns: [],
          includeExternalsPatterns: []
        })
      ).toStrictEqual(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined
        })
      );
    });

    it('respects includeExternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['packages/private/src/index.ts']
        })
      ).toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1
            },
            dependencyCounts: {
              'some-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['**/private/*/index.ts']
        })
      ).toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1
            },
            dependencyCounts: {
              'some-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: ['webpack-lib*']
        })
      ).toThrow(
        ErrorMessage.EmptyOrMissingSrcDir(fixtures.goodHybridrepoMultiversal.root)
      );

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: [
            'packages/webpack/src/webpack-lib.ts',
            'src/webpack-lib2.ts'
          ]
        })
      ).toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
          includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts']
        })
      ).toStrictEqual({
        targets: {
          external: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('tags and does not perform well-formedness checks on specifiers from assets', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['packages/webpack/webpack.config.mjs']
        })
      ).toStrictEqual({
        targets: {
          external: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: 1,
              'webpack~2': 1,
              [`${assetPrefix} ./package.json`]: 1,
              [`${assetPrefix} ./package2.json`]: 1,
              [`${assetPrefix} ../webpack/src/webpack-lib2.js`]: 1,
              [`${assetPrefix} webpack~3`]: 1,
              [`${assetPrefix} @some/namespaced`]: 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('badHybridrepoBadSpecifiers'),
          targetPackageName: undefined
        })
      ).toThrow(ErrorMessage.SpecifierNotOkSelfReferential('multiverse#pkg-1 lib.ts'));
    });

    it('throws upon encountering an unknown package name', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageBuildTargets.sync({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: 'private'
        })
      ).toThrow(ErrorMessage.UnknownWorkspacePackageName('private'));
    });
  });

  describe('<asynchronous>', () => {
    it('returns expected build targets for polyrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodPolyrepo'),
          targetPackageName: undefined
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set(),
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
            aliasCounts: { universe: 4, typeverse: 1 },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([
            'packages/cli/src/index.ts',
            'packages/private/src/index.ts',
            'packages/private/package.json',
            'packages/webpack/webpack.config.ts',
            'packages/private/src/lib/library.ts',
            'packages/webpack/src/webpack-lib.ts',
            'packages/private/src/lib/library2.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[]),
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 2,
              '#webpack': 3,
              'multiverse#cli': 1,
              'multiverse#private': 3,
              universe: 1
            },
            dependencyCounts: {
              '@babel/core': 1,
              '@black-flag/core': 1,
              'node:path': 1,
              'some-package': 1,
              'another-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: 'cli'
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library.ts',
            'packages/webpack/src/webpack-lib.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1,
              '#webpack': 1,
              'multiverse#private': 2
            },
            dependencyCounts: {
              '@black-flag/core': 1,
              webpack: 1,
              'another-package': 1,
              'some-package': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo self-contained sub-root package with a scoped name different than its package-id', async () => {
      expect.hasAssertions();

      const projectMetadata = fixtureToProjectMetadata('goodHybridrepoMultiversal');
      // ? Test that we're actually looking up packages by name and not id
      const targetPackageName = fixtures.goodHybridrepoMultiversal.namedPkgMapData[1][0];
      const targetPackageId = fixtures.goodHybridrepoMultiversal.namedPkgMapData[1][1].id;

      await expect(
        gatherPackageBuildTargets({ projectMetadata, targetPackageName })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set([
            `packages/${targetPackageId}/src/webpack-lib2.ts`,
            `packages/${targetPackageId}/src/webpack-lib.ts`
          ] as RelativePath[])
        },
        metadata: {
          imports: { aliasCounts: {}, dependencyCounts: { webpack: 1, 'webpack~2': 1 } }
        }
      } satisfies PackageBuildTargets);
    });

    it('does not consider self-referential rootverse imports as "external"', async () => {
      expect.hasAssertions();

      try {
        fixtures.goodHybridrepoMultiversal.namedPkgMapData.push(
          fixtures.goodHybridrepoMultiversal.unnamedPkgMapData[0]
        );

        await expect(
          gatherPackageBuildTargets({
            projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
            targetPackageName: 'private'
          })
        ).resolves.toStrictEqual({
          targets: {
            external: new Set([] as RelativePath[]),
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
                '#private': 1
              },
              dependencyCounts: {
                'another-package': 1,
                'some-package': 1
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        fixtures.goodHybridrepoMultiversal.namedPkgMapData.pop();
      }
    });

    it('does not consider self-referential rootverse imports as "external" even when the package id and package name diverge', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoSelfRef'),
          targetPackageName: 'package-one'
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#pkg-1': 1
            },
            dependencyCounts: {
              '@black-flag/core': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = fixtureToProjectMetadata('goodPolyrepo');

      const packageBuildTargets = await gatherPackageBuildTargets({
        projectMetadata: dummyMetadata,
        targetPackageName: undefined
      });

      expect(packageBuildTargets).not.toBe(
        gatherPackageBuildTargets({
          projectMetadata: dummyMetadata,
          targetPackageName: undefined,
          useCached: false
        })
      );

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: dummyMetadata,
          targetPackageName: undefined
        })
      ).resolves.toBe(packageBuildTargets);
    });

    it('returns same results regardless of explicitly empty includes/excludes', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined,
          excludeInternalsPatterns: [],
          includeExternalsPatterns: []
        })
      ).resolves.toStrictEqual(
        await gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: undefined
        })
      );
    });

    it('respects includeExternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['packages/private/src/index.ts']
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1
            },
            dependencyCounts: {
              'some-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['**/private/*/index.ts']
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([
            'packages/private/src/index.ts',
            'packages/private/src/lib/library2.ts'
          ] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              '#private': 1
            },
            dependencyCounts: {
              'some-package': 1,
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: ['webpack-lib*']
        })
      ).rejects.toThrow(
        ErrorMessage.EmptyOrMissingSrcDir(fixtures.goodHybridrepoMultiversal.root)
      );

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: [
            'packages/webpack/src/webpack-lib.ts',
            'src/webpack-lib2.ts'
          ]
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set([] as RelativePath[]),
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
          includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts']
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: 1,
              'webpack~2': 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('tags and does not perform well-formedness checks on specifiers from assets', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: '@namespaced/webpack-common-config',
          includeExternalsPatterns: ['packages/webpack/webpack.config.mjs']
        })
      ).resolves.toStrictEqual({
        targets: {
          external: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: 1,
              'webpack~2': 1,
              [`${assetPrefix} ./package.json`]: 1,
              [`${assetPrefix} ./package2.json`]: 1,
              [`${assetPrefix} ../webpack/src/webpack-lib2.js`]: 1,
              [`${assetPrefix} webpack~3`]: 1,
              [`${assetPrefix} @some/namespaced`]: 1
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('badHybridrepoBadSpecifiers'),
          targetPackageName: undefined
        })
      ).rejects.toThrow(
        ErrorMessage.SpecifierNotOkSelfReferential('multiverse#pkg-1 lib.ts')
      );
    });

    it('throws upon encountering an unknown package name', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets({
          projectMetadata: fixtureToProjectMetadata('goodHybridrepoMultiversal'),
          targetPackageName: 'private'
        })
      ).rejects.toThrow(ErrorMessage.UnknownWorkspacePackageName('private'));
    });
  });
});

function checkForExpectedPackages(
  maybeResult: RootPackage['packages'],
  fixtureName: FixtureName
) {
  const result = maybeResult!;

  expect(maybeResult).toBeDefined();

  expect(Array.from(result.entries())).toIncludeSameMembers(
    fixtures[fixtureName].namedPkgMapData
  );

  expect(Array.from(result.unnamed.entries())).toIncludeSameMembers(
    fixtures[fixtureName].unnamedPkgMapData
  );

  expect(result.broken).toIncludeSameMembers(fixtures[fixtureName].brokenPkgRoots);

  expect(result.all).toIncludeSameMembers([
    ...fixtures[fixtureName].namedPkgMapData.map(([, data]) => data),
    ...fixtures[fixtureName].unnamedPkgMapData.map(([, data]) => data)
  ]);
}
