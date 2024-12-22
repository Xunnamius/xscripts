// @ts-check
'use strict';

const debug = require('debug')('xscripts:semantic-release-config');

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  assertEnvironment,
  moduleExport
} = require('@-xun/scripts/assets/release.config.cjs');

module.exports = deepMergeConfig(
  moduleExport(assertEnvironment({ projectRoot: __dirname })),
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

debug('exports: %O', module.exports);
