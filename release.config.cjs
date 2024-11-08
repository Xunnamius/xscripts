// @ts-check
'use strict';

const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');

const debug = require('debug')('xscripts:semantic-release-config');

const { deepMergeConfig } = require('@-xun/scripts/assets');
const { moduleExport } = require('@-xun/scripts/assets/config/release.config.cjs');

const { parserOpts, writerOpts } = require('./conventional.config.cjs');

const releaseSectionPath = path.join(
  os.tmpdir(),
  `xscripts-release-changelog-${crypto.randomBytes(4).readUInt32LE(0).toString(16)}.md`
);

debug(`releaseSectionPath: ${releaseSectionPath}`);

module.exports = deepMergeConfig(
  moduleExport({ releaseSectionPath, parserOpts, writerOpts }),
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

debug('exports: %O', module.exports);
