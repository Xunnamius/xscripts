import { readFile, rm as rmFile } from 'node:fs/promises';
import assert from 'node:assert';

import { createDebugLogger } from 'multiverse/rejoinder';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { globalDebuggerNamespace } from 'universe/constant';

import type { EmptyObject } from 'type-fest';

import type {
  GlobalConfig,
  VerifyConditionsContext,
  PrepareContext,
  SuccessContext
} from 'semantic-release';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:release`
});

const pluginDebug = debug.extend('plugin');

export type Context = EmptyObject;

// TODO: fixme
export const moduleExport = {} as GlobalConfig;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug-extended');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:release'
});*/

// TODO

/*debug('exported config: %O', module.exports);*/

`.trimStart()
    };
  }
});

/**
 * The custom configuration object expected by the custom semantic-release
 * plugin steps defined below.
 */
export type PluginConfig = {
  releaseSectionPath: string;
};

/**
 * This is a custom semantic-release plugin step that validates the options
 * passed via `release.config.js`.
 */
export function verifyConditions(
  pluginConfig: Partial<PluginConfig>,
  _context: VerifyConditionsContext
) {
  pluginDebug('entered verifyConditions function');
  pluginDebug('releaseSectionPath: %O', pluginConfig.releaseSectionPath);

  assert(
    pluginConfig.releaseSectionPath,
    'the @-xun/scripts semantic-release plugin requires the "releaseSectionPath" option be defined'
  );
}

/**
 * This is a custom semantic-release plugin step that replaces
 * `nextRelease.notes` with the version patched by xscripts.
 */
export async function prepare(
  { releaseSectionPath }: PluginConfig,
  context: PrepareContext
) {
  pluginDebug('entered custom plugin prepare function');

  /*try {*/
  const updatedNotes = (await readFile(releaseSectionPath, 'utf8')).trim();

  if (!updatedNotes) {
    throw new Error(`unexpectedly empty temporary changelog file: ${releaseSectionPath}`);
  }

  context.nextRelease.notes = updatedNotes;

  pluginDebug('updated nextRelease.notes: %O', context.nextRelease.notes);

  // ? We don't really care if this succeeds or fails.
  void rmFile(releaseSectionPath, { force: true }).catch();
  /*} catch (error) {
    // TODO: add a call out to pluginDebug.error here once we start using rejoinder
    throw error;
  }*/
}

// TODO: warn if the release pipeline ends with the repository in an unclean
// TODO: state (git).
/**
 * This is a custom semantic-release plugin step that logs a GitHub Actions (or
 * other) warning if the release pipeline ends with the repository in an unclean
 * state.
 */
export function success({ releaseSectionPath }: PluginConfig, context: SuccessContext) {
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void releaseSectionPath, context;
}
