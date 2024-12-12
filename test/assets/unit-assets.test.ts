// * These tests ensure universe assets exports function as expected

import { type Merge } from 'type-fest';

import { ProjectAttribute } from 'multiverse+project-utils:analyze.ts';

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
  Tsconfig,
  tstycheConfigProjectBase,
  turboConfigProjectBase,
  webpackConfigProjectBase,
  xchangelogConfigProjectBase,
  xreleaseConfigProjectBase,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  compileTemplate,
  compileTemplateInMemory,
  compileTemplates,
  deepMergeConfig,
  gatherAssetsFromTransformer,
  makeTransformer,
  type Asset,
  type IncomingTransformerContext,
  type ReifiedAssets,
  type TransformerContext
} from 'universe:assets.ts';

import { type RenovationPreset } from 'universe:commands/project/renovate.ts';
import { DefaultGlobalScope } from 'universe:configure.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

const dummyContext: IncomingTransformerContext = {
  targetAssetsPreset: undefined,
  badges: 'badges',
  packageName: 'package-name',
  packageVersion: '1.2.3-fake',
  packageDescription: 'package-description',
  packageBuildDetailsShort: [
    'package-build-details-short-1',
    'package-build-details-short-2',
    'package-build-details-short-3',
    'package-build-details-short-4'
  ],
  packageBuildDetailsLong: ['package-build-details-long-1'],
  projectMetadata: fixtureToProjectMetadata(
    'goodHybridrepo'
  ) as TransformerContext['projectMetadata'],
  titleName: 'title-name',
  repoName: 'repo-name',
  repoType: ProjectAttribute.Polyrepo,
  repoUrl: 'repo-url',
  repoSnykUrl: 'repo-snyk-url',
  repoReferenceDocs: 'repo-reference-docs',
  repoReferenceLicense: 'repo-reference-license',
  repoReferenceNewIssue: 'repo-reference-new-issue',
  repoReferencePrCompare: 'repo-reference-pr-compare',
  repoReferenceSelf: 'repo-reference-self',
  repoReferenceSponsor: 'repo-reference-sponsor',
  repoReferenceContributing: 'repo-reference-contributing',
  repoReferenceSupport: 'repo-reference-support',
  repoReferenceAllContributors: 'repo-reference-all-contributors',
  repoReferenceAllContributorsEmojis: 'repo-reference-all-contributors-emojis',
  repoReferenceDefinitionsBadge: 'repo-reference-definitions-badge',
  repoReferenceDefinitionsPackage: 'repo-reference-definitions-package',
  repoReferenceDefinitionsRepo: 'repo-reference-definitions-repo',
  shouldDeriveAliases: true,
  log: (() => undefined) as unknown as IncomingTransformerContext['log'],
  debug: (() => undefined) as unknown as IncomingTransformerContext['debug'],
  toProjectAbsolutePath: (...pathsLike) => toAbsolutePath('/dummy', ...pathsLike),
  toPackageAbsolutePath: (...pathsLike) =>
    toAbsolutePath('/dummy/packages/pkg', ...pathsLike),
  forceOverwritePotentiallyDestructive: false,
  scope: DefaultGlobalScope.Unlimited
};

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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
      );
    });

    it('dotenv (default)', async () => {
      expect.hasAssertions();

      {
        const assets = await gatherAssetsFromTransformer({
          transformerId: dotEnvDefaultConfigProjectBase,
          transformerContext: dummyContext,
          options: { transformerFiletype: 'ts' }
        });

        await expectAssetsToMatchSnapshots(
          assets,
          dummyContext.scope,
          dummyContext.targetAssetsPreset
        );
      }

      {
        const assets = await gatherAssetsFromTransformer({
          transformerId: dotEnvDefaultConfigPackageBase,
          transformerContext: dummyContext,
          options: { transformerFiletype: 'ts' }
        });

        await expectAssetsToMatchSnapshots(
          assets,
          dummyContext.scope,
          dummyContext.targetAssetsPreset
        );
      }
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
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
        dummyContext.targetAssetsPreset
      );
    });
  });
});

describe('::compileTemplate', () => {
  it('accepts a template file path and returns a compilation result string', async () => {
    expect.hasAssertions();

    const asset = 'README.md' as RelativePath;

    await expect(
      compileTemplate(asset, { ...dummyContext, asset })
    ).resolves.toMatchSnapshot(asset);
  });
});

describe('::compileTemplates', () => {
  it('accepts an object of template file path values and returns the same object with corresponding compilation result string values', async () => {
    expect.hasAssertions();

    const assets = {
      'README.md': 'README.md',
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
{{badges}}

# {{prettyName}}

{{packageDescription}}

npm install {{packageName}}

Further documentation can be found under {{repoReferenceDocs:\`docs/\`}}.

{{packageBuildDetailsShort}}

See {{repoReferenceLicense:LICENSE}}.

**{{repoReferenceNewIssue:New issues}} and
{{repoReferencePrCompare:pull requests}} are always welcome and greatly
appreciated! 🤩** Just as well, you can
{{repoReferenceSelf:star 🌟 this project}} to let me know you found it useful!
✊🏿 Or you could consider {{repoReferenceSponsor:buying me a beer}}. Thank you!

See {{repoReferenceContributing:CONTRIBUTING.md}} and
{{repoReferenceSupport:SUPPORT.md}} for more information.

{{repoReferenceSupport}}

Thanks goes to these wonderful people
({{repoReferenceAllContributorsEmojis:emoji key}})

This project follows the {{repoReferenceAllContributors:all-contributors}}
specification. Contributions of any kind welcome!
`.trim();

    expect(
      compileTemplateInMemory(templateString, { ...dummyContext, asset: 'in-memory' })
    ).toMatchInlineSnapshot(`
      "badges

      # {{prettyName}}

      package-description

      npm install package-name

      Further documentation can be found under [\`docs/\`](repo-reference-docs).

      <!-- TODO: Choose one of the following and ✄ delete ✄ the others: -->

      package-build-details-short-1

      ---✄---

      package-build-details-short-2

      ---✄---

      package-build-details-short-3

      ---✄---

      package-build-details-short-4

      See [LICENSE](repo-reference-license).

      **[New issues](repo-reference-new-issue) and
      [pull requests](repo-reference-pr-compare) are always welcome and greatly
      appreciated! 🤩** Just as well, you can
      [star 🌟 this project](repo-reference-self) to let me know you found it useful!
      ✊🏿 Or you could consider [buying me a beer](repo-reference-sponsor). Thank you!

      See [CONTRIBUTING.md](repo-reference-contributing) and
      [SUPPORT.md](repo-reference-support) for more information.

      repo-reference-support

      Thanks goes to these wonderful people
      ([emoji key](repo-reference-all-contributors-emojis))

      This project follows the [all-contributors](repo-reference-all-contributors)
      specification. Contributions of any kind welcome!"
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
  preset: RenovationPreset | undefined
) {
  for (const [key, asset] of Object.entries(assets)) {
    expect(
      `key: ${key}\nscope: ${scope}\npreset: ${String(preset)}\n⏶⏷⏶⏷⏶\n` +
        // eslint-disable-next-line no-await-in-loop
        (await asset())
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
