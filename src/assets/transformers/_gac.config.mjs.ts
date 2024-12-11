import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';

// TODO: this function returns one of the types exported by gac package
export function moduleExport() {
  return {
    // TODO
  };
}

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

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:gac' });*/

const config = deepMergeConfig(moduleExport(),
/**
 * @type {import('@-xun/scripts/assets/${asset}').GacConfig}
 */
{
  // Any custom configs here will be deep merged with moduleExport's result
});

export default config;

/*debug('exported config: %O', config);*/
`
    }
  ];
});
