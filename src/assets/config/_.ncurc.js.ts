import {
  assertIsExpectedTransformerContext,
  makeTransformer
} from 'universe assets/index.ts';
import { globalDebuggerNamespace } from 'universe constant.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
// * https://www.npmjs.com/package/npm-check-updates#configuration-files
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:ncurc'
});*/

module.exports = {
  reject: [
    // Specify an array of pinned packages
  ]
};

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});
