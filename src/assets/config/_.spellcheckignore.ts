import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform({ asset }) {
    return { [asset]: '' };
  }
});
