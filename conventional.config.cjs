'use strict';

const {
  moduleExport,
  noSpecialInitialCommitIndicator
} = require('@-xun/scripts/assets/config/conventional.config.cjs');

// TODO: delete this
const { analyzeProjectStructure } = require('./dist/packages/project-utils/src/index.js');

module.exports = moduleExport({
  configOverrides(config) {
    // Any custom configs here will be deep merged with moduleExport
    return config;
  },
  projectMetadata: analyzeProjectStructure.sync({ useCached: true }),
  specialInitialCommit: noSpecialInitialCommitIndicator
});
