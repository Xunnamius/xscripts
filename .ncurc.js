'use strict';

// * https://www.npmjs.com/package/npm-check-updates#configuration-files

module.exports = {
  reject: [
    // ? Reject any super-pinned dependencies (e.g. find-up~5 and execa~7)
    '*~*',
    // ? Pin the CJS version (for the debug package)
    'supports-color',
    // ? Until upstream semantic-release-atam updates, this needs to be frozen
    '@semantic-release/release-notes-generator',
    // TODO: report that the latest version of this package causes issues
    'remark-lint-no-inline-padding'
  ]
};
