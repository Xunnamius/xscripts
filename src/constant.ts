/**
 * The name of the command line interface.
 */
export const globalCliName = 'xscripts';

/**
 * The CLI-wide namespace that appears in logger output.
 */
export const globalLoggerNamespace = globalCliName;

/**
 * The CLI-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = globalCliName;

/**
 * The CLI-wide shebang prepended to entry file(s) when building other CLIs.
 */
export const standardNodeShebang = '#!/usr/bin/env node\n';
