'use strict';

/**
 * These scripts are the constituent parts of the `npm run format` command.
 */
module.exports = {
  '*.md': 'npx xscripts format --only-markdown --files',
  'package.json': 'npx xscripts format --only-package-json --files',
  '*': 'npx xscripts format --only-prettier --files'
};
