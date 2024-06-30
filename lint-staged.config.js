'use strict';

/**
 * These scripts are the constituent parts of the `npm run format` command.
 *
 * ! Unlike other lint-staged scripts, since this project is itself xscripts,
 * ! we avoid using npx here. For any other project, npx should be used.
 */
module.exports = {
  '*.md': './node_modules/@-xun/scripts/dist/src/cli.js format --only-markdown --files',
  'package.json':
    './node_modules/@-xun/scripts/dist/src/cli.js format --only-package-json --files',
  '*': './node_modules/@-xun/scripts/dist/src/cli.js format --only-prettier --files'
};
