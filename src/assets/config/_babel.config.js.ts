import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';

import type { EmptyObject } from 'type-fest';

export const babelExpectedEnv = [
  'development',
  'test',
  'production',
  'production-esm',
  'production-cjs',
  'production-types'
];

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  moduleExport,
  babelExpectedEnv
} = require('@-xun/scripts/assets/config/.remarkrc.mjs');

const mode = process.env.NODE_ENV;

if (!babelExpectedEnv.includes(mode)) {
  throw new Error(
    'babel expects NODE_ENV to be one of either: ' + babelExpectedEnv.join(', ')
  );
}

// TODO

export default deepMergeConfig(moduleExport(mode), {
  // Any custom configs here will be deep merged with moduleExport
});
`.trimStart()
    };
  }
});
