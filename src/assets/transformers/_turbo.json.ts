import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      // TODO:
      path: toProjectAbsolutePath(asset),
      generate: () => JSON.stringify({})
    }
  ];
});
