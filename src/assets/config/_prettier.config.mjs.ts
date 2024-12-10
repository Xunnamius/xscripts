import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';

import type { Config as PrettierConfig } from 'prettier';

export type { PrettierConfig };

export function moduleExport() {
  return {
    endOfLine: 'lf',
    printWidth: 80,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    overrides: [
      {
        files: '**/*.?(@(c|m))@(ts|js)?(x)',
        options: {
          parser: 'babel-ts',
          printWidth: 89
        }
      }
    ]
  } as const satisfies PrettierConfig;
}

export const { transformer } = makeTransformer({
  transform({ asset }) {
    return {
      [asset]: /*js*/ `
// @ts-check
'use strict';

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/config/${asset}';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:prettier' });*/

const config = deepMergeConfig(
  moduleExport(),
  /**
   * @type {import('@-xun/scripts/assets/config/${asset}').PrettierConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

export default config;

/*debug('exported config: %O', config);*/
`
    };
  }
});
