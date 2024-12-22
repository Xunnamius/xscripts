// * These tests ensure universe util exports functions as expected

import nodeFs from 'node:fs/promises';

import * as xrun from '@-xun/run';

import { type ProjectMetadata } from 'multiverse+project-utils:analyze.ts';

import {
  dotEnvConfigPackageBase,
  dotEnvConfigProjectBase,
  dotEnvDefaultConfigPackageBase,
  dotEnvDefaultConfigProjectBase,
  getInitialWorkingDirectory,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger } from 'multiverse+rejoinder';

import { type TransformerContext } from 'universe:assets.ts';
import { DefaultGlobalScope } from 'universe:configure.ts';
import { ErrorMessage } from 'universe:error.ts';

import {
  deriveScopeNarrowingPathspecs,
  determineRepoWorkingTreeDirty,
  getRelevantDotEnvFilePaths,
  replaceRegionsRespectively,
  runGlobalPreChecks
} from 'universe:util.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

const dummyDebugger = createDebugLogger({ namespace: 'fake' });
dummyDebugger.enabled = false;

describe('::runGlobalPreChecks', () => {
  it('throws if project metadata is not resolvable', async () => {
    expect.hasAssertions();

    await expect(
      runGlobalPreChecks({
        debug_: dummyDebugger,
        projectMetadata_: undefined,
        scope: DefaultGlobalScope.Unlimited
      })
    ).rejects.toMatchObject({ message: ErrorMessage.CannotRunOutsideRoot() });
  });

  it('throws if the initial working directory is not a project or package root', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: { root: '/fake' as AbsolutePath, attributes: {} },
      rootPackage: { root: '/fake' as AbsolutePath, attributes: {} }
    } as ProjectMetadata;

    await expect(
      runGlobalPreChecks({
        debug_: dummyDebugger,
        projectMetadata_: fakeProjectMetadata,
        scope: DefaultGlobalScope.Unlimited
      })
    ).rejects.toMatchObject({ message: ErrorMessage.CannotRunOutsideRoot() });

    fakeProjectMetadata.cwdPackage.root = getInitialWorkingDirectory();

    expect(
      (
        await runGlobalPreChecks({
          debug_: dummyDebugger,
          projectMetadata_: fakeProjectMetadata,
          scope: DefaultGlobalScope.Unlimited
        })
      ).projectMetadata
    ).toBe(fakeProjectMetadata);
  });

  it('throws if the scope=this-package, cwdPackage is the root package, and the project is a non-hybrid monorepo', async () => {
    expect.hasAssertions();

    {
      const fakeProjectMetadata = fixtureToProjectMetadata(
        'goodPolyrepo'
      ) as ProjectMetadata;

      fakeProjectMetadata.cwdPackage.root = getInitialWorkingDirectory();

      expect(
        (
          await runGlobalPreChecks({
            debug_: dummyDebugger,
            projectMetadata_: fakeProjectMetadata,
            scope: DefaultGlobalScope.ThisPackage
          })
        ).projectMetadata
      ).toBe(fakeProjectMetadata);
    }

    {
      const fakeProjectMetadata = fixtureToProjectMetadata(
        'goodHybridrepo'
      ) as ProjectMetadata;

      fakeProjectMetadata.cwdPackage.root = getInitialWorkingDirectory();

      expect(
        (
          await runGlobalPreChecks({
            debug_: dummyDebugger,
            projectMetadata_: fakeProjectMetadata,
            scope: DefaultGlobalScope.ThisPackage
          })
        ).projectMetadata
      ).toBe(fakeProjectMetadata);
    }

    {
      const fakeProjectMetadata = fixtureToProjectMetadata(
        'goodMonorepo'
      ) as ProjectMetadata;

      fakeProjectMetadata.cwdPackage.root = getInitialWorkingDirectory();

      await expect(
        runGlobalPreChecks({
          debug_: dummyDebugger,
          projectMetadata_: fakeProjectMetadata,
          scope: DefaultGlobalScope.ThisPackage
        })
      ).rejects.toMatchObject({
        message: ErrorMessage.CannotRunInNonHybridMonorepoRootPackage()
      });
    }
  });
});

describe('::determineRepoWorkingTreeDirty', () => {
  it('returns isDirty=true when git status output or exit code indicates failure', async () => {
    expect.hasAssertions();

    const spy = jest.spyOn(xrun, 'runNoRejectOnBadExit');

    spy.mockImplementation(
      () =>
        Promise.resolve({ all: '', exitCode: 0 }) as ReturnType<
          typeof xrun.runNoRejectOnBadExit
        >
    );

    await expect(determineRepoWorkingTreeDirty()).resolves.toStrictEqual({
      gitStatusOutput: '',
      gitStatusExitCode: 0,
      isDirty: false
    });

    spy.mockImplementation(
      () =>
        Promise.resolve({ all: 'a', exitCode: 0 }) as ReturnType<
          typeof xrun.runNoRejectOnBadExit
        >
    );

    await expect(determineRepoWorkingTreeDirty()).resolves.toStrictEqual({
      gitStatusOutput: 'a',
      gitStatusExitCode: 0,
      isDirty: true
    });

    spy.mockImplementation(
      () =>
        Promise.resolve({ all: '', exitCode: 1 }) as ReturnType<
          typeof xrun.runNoRejectOnBadExit
        >
    );

    await expect(determineRepoWorkingTreeDirty()).resolves.toStrictEqual({
      gitStatusOutput: '',
      gitStatusExitCode: 1,
      isDirty: true
    });

    spy.mockImplementation(
      () =>
        Promise.resolve({ all: 'a', exitCode: 1 }) as ReturnType<
          typeof xrun.runNoRejectOnBadExit
        >
    );

    await expect(determineRepoWorkingTreeDirty()).resolves.toStrictEqual({
      gitStatusOutput: 'a',
      gitStatusExitCode: 1,
      isDirty: true
    });
  });
});

describe('::getRelevantDotEnvFilePaths', () => {
  it('returns two properly-ordered paths in polyrepo by default', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: { root: '/fake-root' as AbsolutePath },
      rootPackage: { root: '/fake-root' as AbsolutePath }
    } as ProjectMetadata;

    expect(getRelevantDotEnvFilePaths(fakeProjectMetadata)).toStrictEqual([
      `/fake-root/${dotEnvDefaultConfigPackageBase}`,
      `/fake-root/${dotEnvConfigPackageBase}`
    ]);
  });

  it('returns two properly-ordered paths in monorepo/hybridrepo at root by default', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: { root: '/fake-root' as AbsolutePath },
      rootPackage: { root: '/fake-root' as AbsolutePath }
    } as ProjectMetadata;

    expect(getRelevantDotEnvFilePaths(fakeProjectMetadata)).toStrictEqual([
      `/fake-root/${dotEnvDefaultConfigPackageBase}`,
      `/fake-root/${dotEnvConfigPackageBase}`
    ]);
  });

  it('returns four properly-ordered paths in monorepo/hybridrepo at package by default', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: {
        root: '/fake-project-root/packages/fake-package-root' as AbsolutePath
      },
      rootPackage: { root: '/fake-project-root' as AbsolutePath }
    } as ProjectMetadata;

    expect(getRelevantDotEnvFilePaths(fakeProjectMetadata)).toStrictEqual([
      `/fake-project-root/${dotEnvDefaultConfigPackageBase}`,
      `/fake-project-root/packages/fake-package-root/${dotEnvDefaultConfigProjectBase}`,
      `/fake-project-root/${dotEnvConfigPackageBase}`,
      `/fake-project-root/packages/fake-package-root/${dotEnvConfigProjectBase}`
    ]);
  });

  it('returns package-specific properly-ordered paths when scope=package-only', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: {
        root: '/fake-project-root/packages/fake-package-root' as AbsolutePath
      },
      rootPackage: { root: '/fake-project-root' as AbsolutePath }
    } as ProjectMetadata;

    expect(
      getRelevantDotEnvFilePaths(fakeProjectMetadata, 'package-only')
    ).toStrictEqual([
      `/fake-project-root/packages/fake-package-root/${dotEnvDefaultConfigProjectBase}`,
      `/fake-project-root/packages/fake-package-root/${dotEnvConfigProjectBase}`
    ]);
  });

  it('returns package-specific properly-ordered paths when scope=project-only', async () => {
    expect.hasAssertions();

    const fakeProjectMetadata = {
      cwdPackage: {
        root: '/fake-project-root/packages/fake-package-root' as AbsolutePath
      },
      rootPackage: { root: '/fake-project-root' as AbsolutePath }
    } as ProjectMetadata;

    expect(
      getRelevantDotEnvFilePaths(fakeProjectMetadata, 'project-only')
    ).toStrictEqual([
      `/fake-project-root/${dotEnvDefaultConfigPackageBase}`,
      `/fake-project-root/${dotEnvConfigPackageBase}`
    ]);
  });
});

describe('::replaceRegionsRespectively', () => {
  const dummyOutputPath = '/fake/file.md' as AbsolutePath;
  let readExistingContentSpy: jest.SpyInstance;

  const dummyContext = {
    debug: dummyDebugger,
    log: dummyDebugger,
    forceOverwritePotentiallyDestructive: false
  } as TransformerContext;

  const dummyExisting = `
EXISTING Outside
<!-- xscripts-template-region-start 1 -->
EXISTING Inside
<!-- xscripts-template-region-end -->

EXISTING Also outside

<!-- xscripts-template-region-start two -->

EXISTING Another insider

<!-- xscripts-template-region-end -->

EXISTING Final outside
`;

  const dummyTemplate = `
TEMPLATE Outside
<!-- xscripts-template-region-start 1 -->
TEMPLATE Inside
<!-- xscripts-template-region-end -->

TEMPLATE Also outside

<!-- xscripts-template-region-start two -->

TEMPLATE Another insider

<!-- xscripts-template-region-end -->

TEMPLATE Final outside
`;

  beforeEach(() => (readExistingContentSpy = jest.spyOn(nodeFs, 'readFile')));

  it('performs regional replacements', async () => {
    expect.hasAssertions();

    readExistingContentSpy.mockImplementation(() => Promise.resolve(dummyExisting));

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(`
EXISTING Outside
<!-- xscripts-template-region-start 1 -->
TEMPLATE Inside
<!-- xscripts-template-region-end -->

EXISTING Also outside

<!-- xscripts-template-region-start two -->

TEMPLATE Another insider

<!-- xscripts-template-region-end -->

EXISTING Final outside
`);
  });

  it('performs reference definition replacements', async () => {
    expect.hasAssertions();

    const dummyTemplate_ =
      dummyTemplate +
      `
[ref2]: TEMPLATE-new-ref 'new ref'
[ref-10]: https://ref.com/ref/TEMPLATE
[ref-multiline]:
  https://some/url/TEMPLATE
  'some title'
[ref-3]: ./local/TEMPLATE
`;

    {
      const dummyExisting_ =
        dummyExisting +
        `
[ref-1]: EXISTING-ref 'existing ref'
[ref2]: https://ref.com/ref/EXISTING
[ref-three]: ./local/EXISTING
[ref-multiline]:
  https://some/url/EXISTING
  'some title'
[1]: EXISTING-numbered-ref-1
[2]: EXISTING-numbered-ref-2
[5]: EXISTING-numbered-ref-5
`;

      readExistingContentSpy.mockImplementation(() => Promise.resolve(dummyExisting_));

      await expect(
        replaceRegionsRespectively({
          templateContent: dummyTemplate_,
          outputPath: dummyOutputPath,
          context: dummyContext
        })
      ).resolves.toBe(`
EXISTING Outside
<!-- xscripts-template-region-start 1 -->
TEMPLATE Inside
<!-- xscripts-template-region-end -->

EXISTING Also outside

<!-- xscripts-template-region-start two -->

TEMPLATE Another insider

<!-- xscripts-template-region-end -->

EXISTING Final outside

[ref-1]: EXISTING-ref 'existing ref'
[ref2]: TEMPLATE-new-ref 'new ref'
[ref-three]: ./local/EXISTING
[ref-multiline]:
  https://some/url/TEMPLATE
  'some title'
[ref-10]: https://ref.com/ref/TEMPLATE
[ref-3]: ./local/TEMPLATE
[1]: EXISTING-numbered-ref-1
[2]: EXISTING-numbered-ref-2
[5]: EXISTING-numbered-ref-5
`);
    }

    {
      // * Testing edge case where existing file does not end with newline and
      // * does not end with numeric references, which means the final ref def
      // * may change and may or may not have a newline
      const dummyExisting_ =
        dummyExisting +
        `
[ref-1]: EXISTING-ref 'existing ref'
[ref2]: https://ref.com/ref/EXISTING
[ref-three]: ./local/EXISTING
[ref-multiline]:
  https://some/url/EXISTING
  'some title'`;

      readExistingContentSpy.mockImplementation(() => Promise.resolve(dummyExisting_));

      await expect(
        replaceRegionsRespectively({
          templateContent: dummyTemplate_,
          outputPath: dummyOutputPath,
          context: dummyContext
        })
      ).resolves.toBe(`
EXISTING Outside
<!-- xscripts-template-region-start 1 -->
TEMPLATE Inside
<!-- xscripts-template-region-end -->

EXISTING Also outside

<!-- xscripts-template-region-start two -->

TEMPLATE Another insider

<!-- xscripts-template-region-end -->

EXISTING Final outside

[ref-1]: EXISTING-ref 'existing ref'
[ref2]: TEMPLATE-new-ref 'new ref'
[ref-three]: ./local/EXISTING
[ref-multiline]:
  https://some/url/TEMPLATE
  'some title'
[ref-10]: https://ref.com/ref/TEMPLATE
[ref-3]: ./local/TEMPLATE`);
    }
  });

  it('writes through template when force is enabled', async () => {
    expect.hasAssertions();

    readExistingContentSpy.mockImplementation(() => Promise.resolve(dummyExisting));

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate,
        outputPath: dummyOutputPath,
        context: { ...dummyContext, forceOverwritePotentiallyDestructive: true }
      })
    ).resolves.toBe(dummyTemplate);
  });

  it('writes through template when no pre-existing content is loadable', async () => {
    expect.hasAssertions();

    readExistingContentSpy.mockImplementation(() => Promise.resolve(''));

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(dummyTemplate);
  });

  it('writes through template when pre-existing content has no regions', async () => {
    expect.hasAssertions();

    readExistingContentSpy.mockImplementation(() =>
      Promise.resolve('EXISTING CONTENT NO REGIONS')
    );

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(dummyTemplate);
  });

  it('writes through template when template content has no regions', async () => {
    expect.hasAssertions();

    readExistingContentSpy.mockImplementation(() => Promise.resolve(dummyExisting));

    await expect(
      replaceRegionsRespectively({
        templateContent: 'TEMPLATE CONTENT NO REGIONS',
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe('TEMPLATE CONTENT NO REGIONS');
  });

  it('writes through template when pre-existing region ids are not surjective wrt template regions', async () => {
    expect.hasAssertions();

    const spy = jest.spyOn(nodeFs, 'readFile');
    const additionalRegionY = `
<!-- xscripts-template-region-start is-y -->

EXISTING Also insider

<!-- xscripts-template-region-end -->`;

    spy.mockImplementation(() =>
      Promise.resolve(
        dummyExisting +
          `
<!-- xscripts-template-region-start is-not-y -->

EXISTING Also insider

<!-- xscripts-template-region-end -->`
      )
    );

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate + additionalRegionY,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(dummyTemplate + additionalRegionY);
  });

  it('writes through template when pre-existing region count does not match template region count', async () => {
    expect.hasAssertions();

    const spy = jest.spyOn(nodeFs, 'readFile');
    const additionalRegion = `
<!-- xscripts-template-region-start x -->

EXISTING Also insider

<!-- xscripts-template-region-end -->`;

    spy.mockImplementation(() => Promise.resolve(dummyExisting + additionalRegion));

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(dummyTemplate);

    spy.mockImplementation(() => Promise.resolve(dummyExisting));

    await expect(
      replaceRegionsRespectively({
        templateContent: dummyTemplate + additionalRegion,
        outputPath: dummyOutputPath,
        context: dummyContext
      })
    ).resolves.toBe(dummyTemplate + additionalRegion);
  });
});

describe('::deriveScopeNarrowingPathspecs', () => {
  it('returns no pathspecs for polyrepo', async () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodPolyrepo') as ProjectMetadata;
    expect(deriveScopeNarrowingPathspecs({ projectMetadata })).toStrictEqual([]);
  });

  it('returns expected pathspecs for hybridrepo with root cwdPackage', async () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata(
      'goodHybridrepo'
    ) as ProjectMetadata;

    expect(deriveScopeNarrowingPathspecs({ projectMetadata })).toStrictEqual([
      ':(top,glob)src',
      ':(top,glob)test',
      ':(top,glob)docs',
      ':(top,glob)tsc.package.*',
      ':(top,glob)*-lock.json',
      ':(top,glob)CHANGELOG.md',
      ':(top,glob).gitignore',
      ':(top,glob).prettierignore',
      ':(top,glob)package.json',
      ':(top,glob)vercel.json',
      ':(top,glob)webpack.config.mjs'
    ]);
  });

  it('returns expected pathspecs for hybridrepo with non-root cwdPackage', async () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata(
      'goodHybridrepo',
      'cli'
    ) as ProjectMetadata;

    expect(deriveScopeNarrowingPathspecs({ projectMetadata })).toStrictEqual([
      ':(top,glob)packages/cli',
      ':(top,glob).gitignore',
      ':(top,glob).prettierignore',
      ':(top,glob)vercel.json',
      ':(top,glob)webpack.config.mjs'
    ]);
  });

  it('returns expected pathspecs for non-hybrid monorepo with non-root cwdPackage', async () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata(
      'goodMonorepo',
      'pkg-1'
    ) as ProjectMetadata;

    expect(deriveScopeNarrowingPathspecs({ projectMetadata })).toStrictEqual([
      ':(top,glob)packages/pkg-1',
      ':(top,glob).prettierignore',
      ':(top,glob)package.json',
      ':(top,glob)something-else.md'
    ]);
  });

  it('throws for non-hybrid monorepo with root cwdPackage', async () => {
    expect.hasAssertions();

    const projectMetadata = fixtureToProjectMetadata('goodMonorepo') as ProjectMetadata;

    expect(() => deriveScopeNarrowingPathspecs({ projectMetadata })).toThrow(
      ErrorMessage.GuruMeditation()
    );
  });
});
