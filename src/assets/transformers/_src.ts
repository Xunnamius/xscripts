import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({ toProjectAbsolutePath }) {
  return [
    {
      path: toProjectAbsolutePath('src/index.ts'),
      generate: () => /*js*/ `export {};`
    }
  ];
});
