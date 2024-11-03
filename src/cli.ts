import { runProgram } from '@black-flag/core';

import { toAbsolutePath } from 'multiverse+project-utils:fs';

import type { GlobalExecutionContext } from 'universe:configure.ts';

/**
 * This is the simple CLI entry point executed directly by node.
 */
export default runProgram<GlobalExecutionContext>(
  toAbsolutePath(__dirname, 'commands'),
  require('universe:configure.ts')
);

module.exports = exports.default;
module.exports.default = exports.default;
