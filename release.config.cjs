// @ts-check
'use strict';

const debug = require('debug')('xscripts:semantic-release-config');

const { deepMergeConfig } = require('@-xun/scripts/assets');
const { moduleExport } = require('@-xun/scripts/assets/config/release.config.cjs');

const { parserOpts, writerOpts } = require('./conventional.config.cjs');

module.exports = deepMergeConfig(moduleExport({ parserOpts, writerOpts }), {
  // Any custom configs here will be deep merged with moduleExport's result
});

debug('exports: %O', module.exports);
