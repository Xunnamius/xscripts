// * These tests ensure universe assets exports function as expected

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
  Tsconfig,
  tstycheConfigProjectBase,
  turboConfigProjectBase,
  webpackConfigProjectBase,
  xchangelogConfigProjectBase,
  xreleaseConfigProjectBase,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  compileTemplate,
  compileTemplateInMemory,
  compileTemplates,
  deepMergeConfig,
  makeTransformer,
  retrieveConfigAsset,
  type TransformerContext,
  type TransformerResult
} from 'universe:assets.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

const dummyContext: Omit<TransformerContext, 'asset'> = {
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
  shouldDeriveAliases: true
};

describe('::retrieveConfigAsset', () => {
  it('retrieve an asset via its filename', async () => {
    expect.hasAssertions();

    await expect(
      retrieveConfigAsset({
        asset: allContributorsConfigProjectBase,
        context: {
          packageName: 'pkg-name',
          shouldDeriveAliases: false
        } as TransformerContext,
        options: { assetContainerFiletype: 'ts' }
      })
    ).resolves.toStrictEqual(
      await (
        await import('universe:assets/config/_.all-contributorsrc.ts')
      ).transformer({
        asset: allContributorsConfigProjectBase,
        packageName: 'pkg-name'
      } as TransformerContext)
    );
  });

  it('throws if transformer not found', async () => {
    expect.hasAssertions();

    await expect(
      retrieveConfigAsset({
        asset: 'fake-does-not-exist',
        context: {} as TransformerContext
      })
    ).rejects.toMatchObject({
      message: expect.stringMatching(/failed to retrieve asset.+cannot find module/i)
    });
  });

  describe('<config assets>', () => {
    it('all-contributors', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: allContributorsConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('browserslist', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: browserslistrcConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('codecov', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: codecovConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('editor-config', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: editorConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('dotenv (default)', async () => {
      expect.hasAssertions();

      {
        const assets = await retrieveConfigAsset({
          asset: dotEnvDefaultConfigProjectBase,
          context: dummyContext,
          options: { assetContainerFiletype: 'ts' }
        });

        expectAssetsToMatchSnapshots(assets);
      }

      {
        const assets = await retrieveConfigAsset({
          asset: dotEnvDefaultConfigPackageBase,
          context: dummyContext,
          options: { assetContainerFiletype: 'ts' }
        });

        expectAssetsToMatchSnapshots(assets);
      }
    });

    it('git-attributes', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: gitattributesConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('github (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directoryGithubConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('git-ignore', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: gitignoreConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('husky (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directoryHuskyProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('npm-check-updates', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: ncuConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('prettier', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: prettierConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('prettier-ignore', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: prettierIgnoreConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('remark', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: remarkConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('commit-spell', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: spellcheckIgnoreConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('vscode (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directoryVscodeProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('architecture (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownArchitectureProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('babel', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: babelConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('changelog.patch.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: changelogPatchConfigPackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('commitlint.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: commitlintConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('contributing (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownContributingProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('xchangelog', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: xchangelogConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('eslint', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: eslintConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('git-add-then-commit', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: gacConfigPackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('jest', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: jestConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('license (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownLicensePackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('lint-staged', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: lintStagedConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('maintaining (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownMaintainingProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('next.js', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: nextjsConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('package.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: packageJsonConfigPackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('postcss', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: postcssConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('readme (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownReadmePackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('xrelease', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: xreleaseConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('security (markdown)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: markdownSecurityProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('src (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directorySrcPackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tailwind', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: tailwindConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('test (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directoryTestPackageBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tsconfig (all variants)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: Tsconfig.ProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tstyche.config.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: tstycheConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('turbo.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: turboConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('types (directory)', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: directoryTypesProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('webpack', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: webpackConfigProjectBase,
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
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
      compileTemplates(assets, { ...dummyContext, asset: 'combined' })
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

    const { transformer } = makeTransformer({
      transform(context) {
        return { file: JSON.stringify(context) };
      }
    });

    const context = { asset: 'name' } as TransformerContext;

    await expect(transformer(context)).resolves.toStrictEqual({
      file: JSON.stringify(context) + '\n'
    });
  });

  describe('::TransformerOptions', () => {
    describe('::trimContents', () => {
      const files = {
        file1: `
          contents1
        `,
        file2: `
        contents2
      `
      };

      const context = { asset: 'name' } as TransformerContext;

      it('"start" trims each file start', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer({
          transform() {
            return { ...files };
          }
        });

        await expect(
          transformer(context, { trimContents: 'start' })
        ).resolves.toStrictEqual({
          file1: files.file1.trimStart(),
          file2: files.file2.trimStart()
        });
      });

      it('"end" trims each file end', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer({
          transform() {
            return { ...files };
          }
        });

        await expect(
          transformer(context, { trimContents: 'end' })
        ).resolves.toStrictEqual({
          file1: files.file1.trimEnd(),
          file2: files.file2.trimEnd()
        });
      });

      it('"both" trims each file both', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer({
          transform() {
            return { ...files };
          }
        });

        await expect(
          transformer(context, { trimContents: 'both' })
        ).resolves.toStrictEqual({
          file1: files.file1.trim(),
          file2: files.file2.trim()
        });
      });

      it('"both-then-append-newline" (or defaulted) trims each file both-then-append-newline', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer({
          transform() {
            return { ...files };
          }
        });

        await expect(
          transformer(context, { trimContents: 'both-then-append-newline' })
        ).resolves.toStrictEqual({
          file1: files.file1.trim() + '\n',
          file2: files.file2.trim() + '\n'
        });

        await expect(transformer(context)).resolves.toStrictEqual({
          file1: files.file1.trim() + '\n',
          file2: files.file2.trim() + '\n'
        });
      });

      it('false does no trimming', async () => {
        expect.hasAssertions();

        const { transformer } = makeTransformer({
          transform() {
            return { ...files };
          }
        });

        await expect(
          transformer(context, { trimContents: false })
        ).resolves.toStrictEqual({
          file1: files.file1,
          file2: files.file2
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

function expectAssetsToMatchSnapshots(assets: Awaited<TransformerResult>) {
  for (const [key, asset] of Object.entries(assets)) {
    expect(key + '\n⏶⏷⏶⏷⏶\n' + asset).toMatchSnapshot(key);
  }
}
