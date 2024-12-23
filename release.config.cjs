// @ts-check
'use strict';

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  assertEnvironment,
  moduleExport
} = require('@-xun/scripts/assets/release.config.cjs');

// TODO: publish latest rejoinder package first, then update configs to use it
//const { createDebugLogger } = require('rejoinder');

/*const debug = createDebugLogger({ namespace: 'xscripts:config:release' });*/

module.exports = deepMergeConfig(
  moduleExport(assertEnvironment({ projectRoot: __dirname })),
  /**
   * @type {import('@-xun/scripts/assets/release.config.cjs').ReleaseConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

/*debug('exported config: %O', module.exports);*/
