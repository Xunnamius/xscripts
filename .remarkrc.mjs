// @ts-check

import { deepMergeConfig } from '@-xun/scripts/assets';

import { moduleExport, assertEnvironment } from '@-xun/scripts/assets/.remarkrc.mjs';

// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: 'xscripts:config:remarkrc' });*/

const config = deepMergeConfig(
  moduleExport(await assertEnvironment()),
  /**
   * @type {import('@-xun/scripts/assets/.remarkrc.mjs').RemarkConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport
  }
);

export default config;

/*debug('exported config: %O', config);*/
