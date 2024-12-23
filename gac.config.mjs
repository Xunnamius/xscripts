// @ts-check
'use strict';

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/gac.config.mjs';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: 'xscripts:config:gac' });*/

const config = deepMergeConfig(
  moduleExport(),
  /**
   * @type {import('@-xun/scripts/assets/gac.config.mjs').GacConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

export default config;

/*debug('exported config: %O', config);*/
