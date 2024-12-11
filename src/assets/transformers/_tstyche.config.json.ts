import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () =>
        JSON.stringify({
          $schema: 'https://tstyche.org/schemas/config.json',
          testFileMatch: ['**/type-*.test.ts', '**/type-*.test.tsx']
        })
    }
  ];
});
