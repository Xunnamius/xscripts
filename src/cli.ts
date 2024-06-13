#!/usr/bin/env node

import { join } from 'node:path';

import { runProgram } from '@black-flag/core';
import { suppressNodeWarnings } from 'multiverse/suppress-warnings';

import type { GlobalExecutionContext } from 'universe/configure';

suppressNodeWarnings('ExperimentalWarning');

/**
 * This is the simple CLI entry point executed directly by node.
 */
export default runProgram<GlobalExecutionContext>(
  join(__dirname, 'commands'),
  require('universe/configure')
);

module.exports = exports.default;
module.exports.default = exports.default;
