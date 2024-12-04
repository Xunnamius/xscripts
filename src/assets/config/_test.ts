import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform() {
    return {
      'test/index.ts': /*js*/ `
/**
 ** This file exports test utilities specific to this project and beyond what is
 ** exported by @-xun/test; these can be imported using \`testverse\` aliases.
 */

export {};
`,
      'test/setup.ts': /*js*/ `
// ? https://github.com/jest-community/jest-extended#typescript
import 'jest-extended';
import 'jest-extended/all';
`
    };
  }
});
