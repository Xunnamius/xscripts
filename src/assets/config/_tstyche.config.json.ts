import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform({ asset }) {
    return {
      [asset]: JSON.stringify({
        $schema: 'https://tstyche.org/schemas/config.json',
        testFileMatch: ['**/type-*.test.ts', '**/type-*.test.tsx']
      })
    };
  }
});
