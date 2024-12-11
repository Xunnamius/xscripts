import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => `
[production]
last 2 versions
>0.2%
not dead

[development]
last 2 versions
>0.2%
not dead

[test]
current node
`
    }
  ];
});
