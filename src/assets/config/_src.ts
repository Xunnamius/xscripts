import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform() {
    return {
      'src/index.ts': /*js*/ `export {};`
    };
  }
});
