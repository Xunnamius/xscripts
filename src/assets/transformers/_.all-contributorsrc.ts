import { makeTransformer } from 'universe:assets.ts';

// {@xscripts/notExtraneous all-contributors-cli}

export const { transformer } = makeTransformer(function ({
  asset,
  packageName,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () =>
        JSON.stringify(
          {
            projectName: packageName,
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
                contributions: ['infra', 'code', 'doc', 'maintenance', 'test', 'review']
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
