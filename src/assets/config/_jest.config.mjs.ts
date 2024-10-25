import { type Config } from 'jest';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe assets.ts';
import { globalDebuggerNamespace } from 'universe constant.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const baseConfig: Config = {
  // TODO: finish copying over jest.config.mjs
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/']
};

export function moduleExport() {
  return baseConfig;
}

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:conventional'
});*/

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  moduleExport,
  babelExpectedEnvironment
} = require('@-xun/scripts/assets/config/${name}');

const nodeEnv = process.env.NODE_ENV;

/*debug('node env: %O', nodeEnv);*/

if (!babelExpectedEnvironment.includes(nodeEnv)) {
  throw new Error(
    'babel expects NODE_ENV to be one of either: ' + babelExpectedEnvironment.join(', ')
  );
}

module.exports = deepMergeConfig(moduleExport(), {
  // Any custom configs here will be deep merged with moduleExport's result
});

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});
