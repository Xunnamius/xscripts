import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform({ asset }) {
    return {
      [asset]: `
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
    };
  }
});
