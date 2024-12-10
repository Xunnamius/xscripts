// @ts-check
'use strict';

const debug = require('debug')('xscripts:semantic-release-config');

const { deepMergeConfig } = require('@-xun/scripts/assets');
const { moduleExport } = require('@-xun/scripts/assets/config/release.config.cjs');

const { parserOpts, writerOpts } = require('./conventional.config.cjs');

// TODO: delete this
const {
  analyzeProjectStructure
} = require('./dist/packages/project-utils/src/index.js');

// TODO: delete this
const {
  noSpecialInitialCommitIndicator
} = require('./dist/src/assets/config/_conventional.config.cjs.js');

module.exports = deepMergeConfig(
  moduleExport({
    parserOpts,
    writerOpts,
    projectMetadata: analyzeProjectStructure.sync({ useCached: true }),
    specialInitialCommit: noSpecialInitialCommitIndicator
  }),
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

debug('exports: %O', module.exports);
