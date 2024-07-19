import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { allowedCommitTypes } from 'universe/assets/config/_conventional.config.js';
import { globalDebuggerNamespace } from 'universe/constant';

import type { EmptyObject } from 'type-fest';

export const moduleExport = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'type-enum': [2, 'always', allowedCommitTypes]
  }
};

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug-extended');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:commitlint'
});*/

const { moduleExport } = require('@-xun/scripts/assets/config/commitlint.config.js');
module.exports = moduleExport;

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});
