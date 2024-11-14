'use strict';

// {@xscripts/notExtraneous npm-check-updates}

// * https://www.npmjs.com/package/npm-check-updates#configuration-files
// @renovate
module.exports = {
  install: 'never',
  reject: [
    // ? Reject any super-pinned dependencies (e.g. find-up~5 and execa~7)
    '*~*',
    // TODO: delete this once @-xun/debug migrates out of packages/
    // ? Pin the CJS version (for the debug package)
    'supports-color'
  ]
};
