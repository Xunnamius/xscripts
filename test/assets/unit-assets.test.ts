/* eslint-disable jest/prefer-lowercase-title */
// * These tests ensure universe assets exports function as expected

import { ProjectAttribute } from 'multiverse+project-utils:analyze.ts';

import {
  deepMergeConfig,
  makeTransformer,
  retrieveConfigAsset,
  type TransformerContext,
  type TransformerResult
} from 'universe:assets.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

describe('::retrieveConfigAsset', () => {
  it('retrieve an asset via its filename', async () => {
    expect.hasAssertions();

    await expect(
      retrieveConfigAsset({
        asset: '.all-contributorsrc',
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
        asset: '.all-contributorsrc',
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

  describe('::<config assets>', () => {
    const dummyContext: Omit<TransformerContext, 'asset'> = {
      packageName: 'package-name',
      packageVersion: '1.2.3-fake',
      packageDescription: 'package-description',
      packageBuildDetailsShort: 'package-build-details-short',
      packageBuildDetailsLong: 'package-build-details-long',
      projectMetadata: fixtureToProjectMetadata('goodHybridrepo'),
      prettyName: 'pretty-name',
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

    it('.all-contributorsrc', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.all-contributorsrc',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.browserslistrc', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.browserslistrc',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.codecov.yml', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.codecov.yml',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.editorconfig', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.editorconfig',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.env.default', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.env.default',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.gitattributes', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.gitattributes',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.github', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.github',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.gitignore', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.gitignore',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.husky', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.husky',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.ncurc.cjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.ncurc.cjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.prettierignore', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.prettierignore',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.remarkrc.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.remarkrc.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.spellcheckignore', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.spellcheckignore',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('.vscode', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: '.vscode',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('ARCHITECTURE.md', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'ARCHITECTURE.md',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('babel.config.cjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'babel.config.cjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('changelog.patch.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'changelog.patch.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('commitlint.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'commitlint.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('CONTRIBUTING.md', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'CONTRIBUTING.md',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('conventional.config.cjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'conventional.config.cjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('eslint.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'eslint.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('gac.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'gac.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('jest.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'jest.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('LICENSE', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'LICENSE',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('lint-staged.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'lint-staged.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('MAINTAINING.md', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'MAINTAINING.md',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('next.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'next.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('package.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'package.json',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('postcss.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'postcss.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('prettier.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'prettier.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('README.md', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'README.md',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('release.config.cjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'release.config.cjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('SECURITY.md', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'SECURITY.md',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('src', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'src',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tailwind.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'tailwind.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('test', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'test',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tsconfig.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'tsconfig.json',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('tstyche.config.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'tstyche.config.json',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('turbo.json', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'turbo.json',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('types', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'types',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });

    it('webpack.config.mjs', async () => {
      expect.hasAssertions();

      const assets = await retrieveConfigAsset({
        asset: 'webpack.config.mjs',
        context: dummyContext,
        options: { assetContainerFiletype: 'ts' }
      });

      expectAssetsToMatchSnapshots(assets);
    });
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
    expect(key + '\n⏶⏷⏶⏷⏶\n' + asset).toMatchSnapshot();
  }
}
