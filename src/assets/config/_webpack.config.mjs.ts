import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';

export function moduleExport() {
  return {
    // TODO
  };
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

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:webpack' });*/

const config = deepMergeConfig(moduleExport(), {
  // Any custom configs here will be deep merged with moduleExport's result
});

export default config;

/*debug('exported config: %O', config);*/
`
    };
  }
});
