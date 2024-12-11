import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => `
* text=auto eol=lf
`
    }
  ];
});
