// * These tests ensure universe assets exports function as expected

import { readdirSync } from 'node:fs';

import { type Merge } from 'type-fest';

import { type ProjectMetadata } from 'multiverse+project-utils:analyze.ts';

import {
  allContributorsConfigProjectBase,
  dotEnvConfigProjectBase,
  dotEnvDefaultConfigProjectBase,
  toAbsolutePath,
  toPath,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger, createGenericLogger } from 'multiverse+rejoinder';

import {
  compileTemplate,
  compileTemplateInMemory,
  compileTemplates,
  deepMergeConfig,
  directoryAssetTransformers,
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

  describe('<generated asset content snapshots>', () => {
    for (const transformerBasename of readdirSync(directoryAssetTransformers)) {
      const transformerId = transformerBasename.slice(1, -3);

      // eslint-disable-next-line jest/valid-title
      describe(transformerId, () => {
        test('generates expected assets for polyrepo', async () => {
          expect.hasAssertions();

          const projectMetadata = fixtureToProjectMetadata(
            'goodPolyrepoNoSrc',
            'self'
          ) as TransformerContext['projectMetadata'];

          const assets = await gatherAssetsFromTransformer({
            transformerId,
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
        });

        test('generates expected assets at non-hybrid monorepo', async () => {
          expect.hasAssertions();

          const projectMetadata = fixtureToProjectMetadata(
            'goodMonorepoNoSrc',
            'pkg-1'
          ) as TransformerContext['projectMetadata'];

          {
            const assets = await gatherAssetsFromTransformer({
              transformerId,
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
            'goodHybridrepo',
            'self'
          ) as TransformerContext['projectMetadata'];

          {
            const assets = await gatherAssetsFromTransformer({
              transformerId,
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
      });
    }
  });

  describe('<additional asset content tests>', () => {
    describe('dotenv', () => {
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
