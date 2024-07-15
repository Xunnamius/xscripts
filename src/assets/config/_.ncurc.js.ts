import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// * https://www.npmjs.com/package/npm-check-updates#configuration-files

module.exports = {
  reject: [
    // Specify an array of pinned packages
  ]
};
`.trimStart()
    };
  }
});
