import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';

// {@xscripts/notExtraneous lint-staged}

export function moduleExport() {
  return {
    '*.md': 'npx xscripts format --only-markdown --files',
    'package.json': 'npx xscripts format --only-package-json --files',
    '*': 'npx xscripts format --only-prettier --files'
  } as const;
}

/**
 * The scripts returned by this function are the constituent parts of the \`npm
 * run format\` xscripts command.
 */
export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => /*js*/ `
// @ts-check
'use strict';

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/${asset}';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:lint-staged' });*/

const config = deepMergeConfig(moduleExport(), {
  // Any custom configs here will be deep merged with moduleExport's result
});

export default config;

/*debug('exported config: %O', config);*/
`
    }
  ];
});
