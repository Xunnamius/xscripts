'use strict';

const {
  assertEnvironment,
  moduleExport
} = require('@-xun/scripts/assets/conventional.config.cjs');

module.exports = moduleExport({
  ...assertEnvironment(),
  configOverrides(config) {
    // Any custom configs here will be deep merged with moduleExport
    return config;
  }
});
