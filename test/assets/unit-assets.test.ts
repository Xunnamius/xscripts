// * These tests ensure universe assets exports function as expected

import { type Merge } from 'type-fest';

import { type ProjectMetadata } from 'multiverse+project-utils:analyze.ts';

import {
  allContributorsConfigProjectBase,
  babelConfigProjectBase,
  browserslistrcConfigProjectBase,
  changelogPatchConfigPackageBase,
  codecovConfigProjectBase,
  commitlintConfigProjectBase,
  directoryGithubConfigProjectBase,
  directoryHuskyProjectBase,
  directorySrcPackageBase,
  directoryTestPackageBase,
  directoryTypesProjectBase,
  directoryVscodeProjectBase,
  dotEnvConfigProjectBase,
  dotEnvDefaultConfigPackageBase,
  dotEnvDefaultConfigProjectBase,
  editorConfigProjectBase,
  eslintConfigProjectBase,
  gacConfigPackageBase,
  gitattributesConfigProjectBase,
  gitignoreConfigProjectBase,
  jestConfigProjectBase,
  lintStagedConfigProjectBase,
  markdownArchitectureProjectBase,
  markdownContributingProjectBase,
  markdownLicensePackageBase,
  markdownMaintainingProjectBase,
  markdownReadmePackageBase,
  markdownSecurityProjectBase,
  ncuConfigProjectBase,
  nextjsConfigProjectBase,
  packageJsonConfigPackageBase,
  postcssConfigProjectBase,
  prettierConfigProjectBase,
  prettierIgnoreConfigProjectBase,
  remarkConfigProjectBase,
  spellcheckIgnoreConfigProjectBase,
  tailwindConfigProjectBase,
  toAbsolutePath,
  toPath,
  Tsconfig,
  tstycheConfigProjectBase,
  turboConfigProjectBase,
  vercelConfigProjectBase,
  webpackConfigProjectBase,
  xchangelogConfigProjectBase,
  xreleaseConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger, createGenericLogger } from 'multiverse+rejoinder';

import {
  compileTemplate,
  compileTemplateInMemory,
  compileTemplates,
  deepMergeConfig,
  gatherAssetsFromTransformer,
  makeTransformer,
  type Asset,
  type AssetPreset,
  type IncomingTransformerContext,
  type ReifiedAssets,
  type TransformerContext
} from 'universe:assets.ts';

import { DefaultGlobalScope } from 'universe:configure.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

const dummyContext: IncomingTransformerContext = {
  log: createGenericLogger({ namespace: 'unit-assets-dummy-context' }),
  debug: createDebugLogger({ namespace: 'unit-assets-dummy-context' }),

  toProjectAbsolutePath: (...pathsLike) => toAbsolutePath('/dummy', ...pathsLike),
  toPackageAbsolutePath: (...pathsLike) =>
    toAbsolutePath('/dummy/packages/pkg', ...pathsLike),

  shouldDeriveAliases: true,
  forceOverwritePotentiallyDestructive: false,
  scope: DefaultGlobalScope.Unlimited,
  assetPreset: undefined,
  projectMetadata: fixtureToProjectMetadata(
    'goodHybridrepo'
  ) as TransformerContext['projectMetadata'],
  additionalRawAliasMappings: [],

  repoOwner: 'repo-owner',
  repoName: 'repo-name',
  year: '1776'
};

dummyContext.log.enabled = false;
dummyContext.debug.enabled = false;

describe('::gatherAssetsFromTransformer', () => {
  it('invoke a transformer via its filename', async () => {
    expect.hasAssertions();

    const transformerContext = {
      ...dummyContext,
      packageName: 'pkg-name',
      shouldDeriveAliases: false
    } as IncomingTransformerContext;

    const assets = await gatherAssetsFromTransformer({
      transformerId: allContributorsConfigProjectBase,
      transformerContext,
      options: { transformerFiletype: 'ts' }
    });

    const dummyAbsolutePath = dummyContext.toProjectAbsolutePath(
      allContributorsConfigProjectBase
    );

    const expectedAssets = await (
      await import('universe:assets/transformers/_.all-contributorsrc.ts')
    ).transformer({ ...transformerContext, asset: allContributorsConfigProjectBase });

    await expect(assets[dummyAbsolutePath]()).resolves.toStrictEqual(
      await expectedAssets[dummyAbsolutePath]()
    );
  });

  it('throws if transformer not found', async () => {
    expect.hasAssertions();

    await expect(
      gatherAssetsFromTransformer({
        transformerId: 'fake-does-not-exist',
        transformerContext: {} as IncomingTransformerContext
      })
    ).rejects.toMatchObject({
      message: expect.stringMatching(/failed to retrieve asset/)
    });
  });

  describe('<config assets>', () => {
    it('all-contributors', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: allContributorsConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('browserslist', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: browserslistrcConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('codecov', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: codecovConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('editor-config', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: editorConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    describe('dotenv', () => {
      test('generates expected assets for polyrepo', async () => {
        expect.hasAssertions();

        const projectMetadata = fixtureToProjectMetadata(
          'goodPolyrepo'
        ) as TransformerContext['projectMetadata'];

        {
          const assets = await gatherAssetsFromTransformer({
            transformerId: dotEnvDefaultConfigProjectBase,
            transformerContext: {
              ...dummyContext,
              projectMetadata,
              ...makeDummyPathFunctions(projectMetadata)
            },
            options: { transformerFiletype: 'ts' }
          });

          await expectAssetsToMatchSnapshots(
            assets,
            dummyContext.scope,
            dummyContext.assetPreset
          );
        }
      });

      test('generates expected assets at non-hybrid monorepo', async () => {
        expect.hasAssertions();

        const projectMetadata = fixtureToProjectMetadata(
          'goodMonorepo'
        ) as TransformerContext['projectMetadata'];

        {
          const assets = await gatherAssetsFromTransformer({
            transformerId: dotEnvDefaultConfigPackageBase,
            transformerContext: {
              ...dummyContext,
              projectMetadata,
              ...makeDummyPathFunctions(projectMetadata)
            },
            options: { transformerFiletype: 'ts' }
          });

          await expectAssetsToMatchSnapshots(
            assets,
            dummyContext.scope,
            dummyContext.assetPreset
          );
        }
      });

      test('generates expected assets at hybridrepo', async () => {
        expect.hasAssertions();

        const projectMetadata = fixtureToProjectMetadata(
          'goodHybridrepo'
        ) as TransformerContext['projectMetadata'];

        {
          const assets = await gatherAssetsFromTransformer({
            transformerId: dotEnvDefaultConfigPackageBase,
            transformerContext: {
              ...dummyContext,
              projectMetadata,
              ...makeDummyPathFunctions(projectMetadata)
            },
            options: { transformerFiletype: 'ts' }
          });

          await expectAssetsToMatchSnapshots(
            assets,
            dummyContext.scope,
            dummyContext.assetPreset
          );
        }
      });

      it('merges with .env if it already exists only if force is used', async () => {
        expect.hasAssertions();

        {
          const projectMetadata = fixtureToProjectMetadata(
            'goodPolyrepo'
          ) as TransformerContext['projectMetadata'];

          const assets = await gatherAssetsFromTransformer({
            transformerId: dotEnvDefaultConfigProjectBase,
            transformerContext: {
              ...dummyContext,
              projectMetadata,
              ...makeDummyPathFunctions(projectMetadata)
            },
            options: { transformerFiletype: 'ts' }
          });

          expect(assets).not.toHaveProperty(
            toPath(projectMetadata.rootPackage.root, dotEnvConfigProjectBase)
          );
        }

        {
          const projectMetadata = fixtureToProjectMetadata(
            'goodPolyrepo'
          ) as TransformerContext['projectMetadata'];

          const assets = await gatherAssetsFromTransformer({
            transformerId: dotEnvDefaultConfigProjectBase,
            transformerContext: {
              ...dummyContext,
              projectMetadata,
              forceOverwritePotentiallyDestructive: true,
              ...makeDummyPathFunctions(projectMetadata)
            },
            options: { transformerFiletype: 'ts' }
          });

          await expect(
            assets[toPath(projectMetadata.rootPackage.root, dotEnvConfigProjectBase)]()
          ).resolves.toMatchInlineSnapshot(`
            "FAKE_SECRET=fake_value
            FAKE_SECRET_2=fake-string-thing
            NPM_TOKEN=fake
            # Comment
            CODECOV_TOKEN=fake

            SOMETHING=5
            #

            GITHUB_TOKEN=
            GIT_AUTHOR_NAME=
            GIT_COMMITTER_NAME=
            GIT_AUTHOR_EMAIL=
            GIT_COMMITTER_EMAIL=
            GPG_PASSPHRASE=
            GPG_PRIVATE_KEY=
            "
          `);
        }
      });
    });

    it('git-attributes', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: gitattributesConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('github (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directoryGithubConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('git-ignore', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: gitignoreConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('husky (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directoryHuskyProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('npm-check-updates', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: ncuConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('prettier-ignore', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: prettierIgnoreConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('remark', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: remarkConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('commit-spell', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: spellcheckIgnoreConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('vscode (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directoryVscodeProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('architecture (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownArchitectureProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('babel', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: babelConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('changelog.patch.mjs', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: changelogPatchConfigPackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('commitlint.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: commitlintConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('contributing (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownContributingProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('xchangelog', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: xchangelogConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('eslint', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: eslintConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('git-add-then-commit', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: gacConfigPackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('jest', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: jestConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('license (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownLicensePackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('lint-staged', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: lintStagedConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('maintaining (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownMaintainingProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('next.js', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: nextjsConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('package.json', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: packageJsonConfigPackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('postcss', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: postcssConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('prettier', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: prettierConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('readme (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownReadmePackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('xrelease', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: xreleaseConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('security (markdown)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: markdownSecurityProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('src (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directorySrcPackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('tailwind', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: tailwindConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('test (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directoryTestPackageBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('tsconfig (all variants)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: Tsconfig.ProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('tstyche.config.json', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: tstycheConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('turbo.json', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: turboConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('types (directory)', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: directoryTypesProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('vercel.json', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: vercelConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });

    it('webpack', async () => {
      expect.hasAssertions();

      const assets = await gatherAssetsFromTransformer({
        transformerId: webpackConfigProjectBase,
        transformerContext: dummyContext,
        options: { transformerFiletype: 'ts' }
      });

      await expectAssetsToMatchSnapshots(
        assets,
        dummyContext.scope,
        dummyContext.assetPreset
      );
    });
  });
});

describe('::compileTemplate', () => {
  it('accepts a template file path and returns a compilation result string', async () => {
    expect.hasAssertions();

    const asset = 'SECURITY.md' as RelativePath;

    await expect(
      compileTemplate(asset, { ...dummyContext, asset })
    ).resolves.toMatchSnapshot(asset);
  });
});

describe('::compileTemplates', () => {
  it('accepts an object of template file path values and returns the same object with corresponding compilation result string values', async () => {
    expect.hasAssertions();

    const assets = {
      'root/README.md': 'README.monorepo.md',
      'package/README.md': 'README.package.md',
      'CONTRIBUTING.md': 'CONTRIBUTING.md',
      'SECURITY.md': 'SECURITY.md',
      '.github/SUPPORT.md': 'github/SUPPORT.md'
    } as Record<RelativePath, RelativePath>;

    await expect(
      toAssetsMap(await compileTemplates(assets, { ...dummyContext, asset: 'combined' }))
    ).resolves.toMatchSnapshot();
  });
});

describe('::compileTemplateInMemory', () => {
  it('accepts a template string and returns a compilation result string', async () => {
    expect.hasAssertions();

    const templateString = `
<!-- xscripts-template-region-start -->

<p align="center" width="100%">
  <img width="300" src="./{{repoName}}.png">
</p>

<p align="center" width="100%">
<!-- xscripts-template-region-end -->

{{projectMetadata.cwdPackage.json.description}}

<!-- xscripts-template-region-start -->

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]

</div>

# <!-- TODO: --> Project Title Here

<!-- xscripts-template-region-end -->

{{projectMetadata.cwdPackage.json.description}}

To install {{repoName}}:

\`\`\`shell
npm install {{projectMetadata.cwdPackage.json.name}}
\`\`\`

[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/{{repoOwner}}/{{repoName}}/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_root
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/{{repoOwner}}/{{repoName}}
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/{{projectMetadata.cwdPackage.json.name}}?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/{{repoOwner}}/{{repoName}}?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/{{projectMetadata.cwdPackage.json.name}}?style=flat-square
  "This package's source license"
`.trim();

    expect(
      compileTemplateInMemory(templateString, { ...dummyContext, asset: 'in-memory' })
    ).toMatchInlineSnapshot(`
      "<!-- xscripts-template-region-start -->

      <p align="center" width="100%">
        <img width="300" src="./repo-name.png">
      </p>

      <p align="center" width="100%">
      <!-- xscripts-template-region-end -->

      good-hybridrepo-description

      <!-- xscripts-template-region-start -->

      <div align="center">

      [![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]

      </div>

      # <!-- TODO: --> Project Title Here

      <!-- xscripts-template-region-end -->

      good-hybridrepo-description

      To install repo-name:

      \`\`\`shell
      npm install good-hybridrepo
      \`\`\`

      [x-badge-codecov-image]:
        https://img.shields.io/codecov/c/github/repo-owner/repo-name/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_root
        'Is this package well-tested?'
      [x-badge-codecov-link]: https://codecov.io/gh/repo-owner/repo-name
      [x-badge-downloads-image]:
        https://img.shields.io/npm/dm/good-hybridrepo?style=flat-square
        'Number of times this package has been downloaded per month'
      [x-badge-lastcommit-image]:
        https://img.shields.io/github/last-commit/repo-owner/repo-name?style=flat-square
        'Latest commit timestamp'
      [x-badge-license-image]:
        https://img.shields.io/npm/l/good-hybridrepo?style=flat-square
        "This package's source license""
    `);
  });
});

describe('::makeTransformer', () => {
  it('returns a transformer', async () => {
    expect.hasAssertions();

    const path = 'abs-path' as AbsolutePath;

    const { transformer } = makeTransformer(function (context) {
      return [{ path, generate: () => JSON.stringify(context) }];
    });

    const context = { asset: 'name' } as TransformerContext;
    const assets = await transformer(context);

    await expect(assets[path]()).resolves.toStrictEqual(JSON.stringify(context) + '\n');
  });

  describe('::TransformerOptions', () => {
    describe('::trimContents', () => {
      const files = [
        {
          path: 'file1',
          generate: () => `
          contents1
        `
        },
        {
          path: 'file2',
          generate: () => `
            contents2
          `
        }
      ] as Merge<Asset, { generate: () => string }>[];

      const context = { asset: 'name' } as TransformerContext;

      it('"start" trims each file start', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer(() => files);
        const assets = await transformer(context, { trimContents: 'start' });

        await expect(toAssetsMap(assets)).resolves.toStrictEqual({
          file1: files[0].generate().trimStart(),
          file2: files[1].generate().trimStart()
        });
      });

      it('"end" trims each file end', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer(() => files);
        const assets = await transformer(context, { trimContents: 'end' });

        await expect(toAssetsMap(assets)).resolves.toStrictEqual({
          file1: files[0].generate().trimEnd(),
          file2: files[1].generate().trimEnd()
        });
      });

      it('"both" trims each file both', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer(() => files);
        const assets = await transformer(context, { trimContents: 'both' });

        await expect(toAssetsMap(assets)).resolves.toStrictEqual({
          file1: files[0].generate().trim(),
          file2: files[1].generate().trim()
        });
      });

      it('"both-then-append-newline" (or defaulted) trims each file both-then-append-newline', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer(() => files);

        {
          const assets = await transformer(context, {
            trimContents: 'both-then-append-newline'
          });

          await expect(toAssetsMap(assets)).resolves.toStrictEqual({
            file1: files[0].generate().trim() + '\n',
            file2: files[1].generate().trim() + '\n'
          });
        }

        {
          const assets = await transformer(context);

          await expect(toAssetsMap(assets)).resolves.toStrictEqual({
            file1: files[0].generate().trim() + '\n',
            file2: files[1].generate().trim() + '\n'
          });
        }
      });

      it('false does no trimming', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer(() => files);
        const assets = await transformer(context, { trimContents: false });

        await expect(toAssetsMap(assets)).resolves.toStrictEqual({
          file1: files[0].generate(),
          file2: files[1].generate()
        });
      });
    });
  });
});

describe('::deepMergeConfig', () => {
  it('does not overwrite original configuration', async () => {
    expect.hasAssertions();

    const originalConfiguration = { a: 1 as number | boolean };

    expect(deepMergeConfig(originalConfiguration, { a: false })).toStrictEqual({
      a: false
    });

    expect(originalConfiguration).toStrictEqual({ a: 1 });
  });
});

async function expectAssetsToMatchSnapshots(
  assets: ReifiedAssets,
  scope: DefaultGlobalScope,
  preset: AssetPreset | undefined
) {
  for (const [key, asset] of Object.entries(assets)) {
    expect(
      `key: ${key}\nscope: ${scope}\npreset: ${String(preset)}\n⏶⏷⏶⏷⏶\n` +
        // eslint-disable-next-line no-await-in-loop
        String(await asset())
    ).toMatchSnapshot(key);
  }
}

async function toAssetsMap(assets: ReifiedAssets | Asset[]) {
  const entries = Array.isArray(assets)
    ? assets.map(({ path, generate }) => [path, generate] as const)
    : Object.entries(assets);

  return Object.fromEntries(
    await Promise.all(entries.map(async ([k, v]) => [k, await v()]))
  );
}

function makeDummyPathFunctions({
  cwdPackage,
  rootPackage: { root: packageRoot }
}: ProjectMetadata): Pick<
  TransformerContext,
  'toPackageAbsolutePath' | 'toProjectAbsolutePath'
> {
  return {
    toPackageAbsolutePath: (...args) =>
      toAbsolutePath(
        packageRoot,
        'relativeRoot' in cwdPackage ? cwdPackage.relativeRoot : '',
        ...args
      ),
    toProjectAbsolutePath: (...args) => toAbsolutePath(packageRoot, ...args)
  };
}
