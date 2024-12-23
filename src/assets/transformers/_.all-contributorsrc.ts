import { allContributorsConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import {
  generateRootOnlyAssets,
  libAssetPresets,
  makeTransformer
} from 'universe:assets.ts';

// {@xscripts/notExtraneous all-contributors-cli}

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset, repoName } = context;

  // * Do not generate any files when using the "wrong" preset
  if (!libAssetPresets.includes(assetPreset)) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(allContributorsConfigProjectBase),
        generate: () =>
          JSON.stringify(
            {
              projectName: repoName,
              projectOwner: 'Xunnamius',
              repoType: 'github',
              repoHost: 'https://github.com',
              files: ['README.md'],
              imageSize: 100,
              commit: false,
              commitConvention: 'angular',
              contributors: [
                {
                  login: 'Xunnamius',
                  name: 'Bernard',
                  avatar_url: 'https://avatars.githubusercontent.com/u/656017?v=4',
                  profile: 'https://xunn.io/',
                  contributions: [
                    'infra',
                    'code',
                    'doc',
                    'maintenance',
                    'test',
                    'review'
                  ]
                }
              ],
              contributorsPerLine: 7,
              linkToUsage: true
            },
            undefined,
            2
          )
      }
    ];
  });
});
