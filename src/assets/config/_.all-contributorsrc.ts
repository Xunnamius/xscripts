import {
  assertIsExpectedTransformerContext,
  makeTransformer,
  type StandardTransformerContext
} from 'universe assets/index.ts';

export type Context = Pick<StandardTransformerContext, 'packageName'>;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name, packageName } = assertIsExpectedTransformerContext(context, [
      'packageName'
    ]);

    return {
      [name]: JSON.stringify({
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
      })
    };
  }
});
