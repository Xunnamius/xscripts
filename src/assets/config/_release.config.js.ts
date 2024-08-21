import { readFile, writeFile, rm as rmFile } from 'node:fs/promises';
import assert from 'node:assert';

import { type ExecutionContext } from '@black-flag/core/util';

import { createDebugLogger } from 'multiverse/rejoinder';
import { getInvocableExtendedHandler } from 'multiverse/@black-flag/extensions/index.js';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { globalDebuggerNamespace } from 'universe/constant';

import {
  $executionContext,
  configureExecutionContext,
  type GlobalExecutionContext
} from 'universe/configure';

import {
  default as buildChangelog,
  OutputOrder,
  type CustomCliArguments as BuildChangelogCliArguments
} from 'universe/commands/build/changelog';

import type { ConventionalChangelogCliConfig } from 'universe/assets/config/_conventional.config.js';

import type { EmptyObject } from 'type-fest';

import type {
  GlobalConfig,
  VerifyConditionsContext,
  SuccessContext,
  GenerateNotesContext
} from 'semantic-release';

// * This plugin wraps the following plugins/functionality:
// *
// * - @semantic-release/release-notes-generator
// * - @semantic-release/changelog
// * - @-xun/scripts (build changelog)

type GenerateNotesFromSemanticReleasePlugin = (
  pluginConfig: { parserOpts: unknown; writerOpts: unknown },
  context: GenerateNotesContext
) => Promise<string>;

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:release`
});

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
  parserOpts: NonNullable<ConventionalChangelogCliConfig['parserOpts']>;
  writerOpts: NonNullable<ConventionalChangelogCliConfig['writerOpts']>;
  [key: string]: unknown;
};

/**
 * This is a custom semantic-release plugin step that validates the options
 * passed via `release.config.js`.
 */
export function verifyConditions(
  pluginConfig: Partial<PluginConfig>,
  _context: VerifyConditionsContext
) {
  const pluginDebug = debug.extend('verifyConditions');

  pluginDebug('entered verifyConditions function');
  pluginDebug('releaseSectionPath: %O', pluginConfig.releaseSectionPath);
  pluginDebug('parserOpts: %O', pluginConfig.parserOpts);
  pluginDebug('writerOpts: %O', pluginConfig.writerOpts);

  assert(
    pluginConfig.releaseSectionPath?.endsWith('.md'),
    'the @-xun/scripts semantic-release plugin requires the "releaseSectionPath" option be a non-empty string ending with ".md"'
  );

  assert(
    pluginConfig.parserOpts,
    'the @-xun/scripts semantic-release plugin requires the "parserOpts" option to be defined'
  );

  assert(
    pluginConfig.writerOpts,
    'the @-xun/scripts semantic-release plugin requires the "writerOpts" option to be defined'
  );
}

/**
 * This is a custom semantic-release plugin step that replaces
 * `nextRelease.notes` with the version patched by xscripts.
 */
export async function generateNotes(
  { releaseSectionPath, parserOpts, writerOpts }: PluginConfig,
  context: GenerateNotesContext
): Promise<string> {
  const pluginDebug = debug.extend('generateNotes');

  const {
    env: { UPDATE_CHANGELOG }
  } = context;

  const shouldUpdateChangelog = UPDATE_CHANGELOG !== 'false';
  pluginDebug('shouldUpdateChangelog: %O', shouldUpdateChangelog);

  const pseudoBfGlobalExecutionContext = await configureExecutionContext({
    commands: new Map(),
    state: {},
    debug: createDebugLogger({ namespace: 'pseudo-bf' })
  } as unknown as ExecutionContext);

  const buildChangelogHandler = await getInvocableExtendedHandler<
    BuildChangelogCliArguments,
    GlobalExecutionContext
  >(buildChangelog, pseudoBfGlobalExecutionContext);

  const generateRawNotes: GenerateNotesFromSemanticReleasePlugin = (
    await import(
      // TODO: fix this
      // @ts-expect-error: a necessary evil until we fix semantic-release-atam
      'universe/../../node_modules/semantic-release/node_modules/@semantic-release/release-notes-generator/index.js'
    )
  ).generateNotes;

  pluginDebug('generating release notes with @semantic-release/release-notes-generator');

  const rawNotes = await generateRawNotes({ parserOpts, writerOpts }, context);

  pluginDebug('rawNotes: %O', rawNotes);
  pluginDebug('writing generated notes out to: %O', releaseSectionPath);

  await writeFile(releaseSectionPath, rawNotes);

  if (shouldUpdateChangelog) {
    pluginDebug('updating changelog (calling out to xscripts api)');

    await buildChangelogHandler({
      [$executionContext]: pseudoBfGlobalExecutionContext,
      $0: 'build changelog',
      _: [],
      silent: true,
      quiet: true,
      hush: true,
      skipTopmatter: false,
      patchChangelog: true,
      onlyPatchChangelog: false,
      formatChangelog: true,
      outputUnreleased: false,
      outputOrder: OutputOrder.Storybook,
      importSectionFile: releaseSectionPath,
      changelogFile: 'CHANGELOG.md'
    });

    pluginDebug('xscripts api call completed successfully');
  } else {
    pluginDebug('skipped updating changelog');
  }

  pluginDebug(
    `patching and formatting ${releaseSectionPath} (calling out to xscripts api)`
  );

  await buildChangelogHandler({
    [$executionContext]: pseudoBfGlobalExecutionContext,
    $0: 'build changelog',
    _: [],
    silent: true,
    quiet: true,
    hush: true,
    skipTopmatter: false,
    patchChangelog: true,
    onlyPatchChangelog: true,
    formatChangelog: true,
    outputUnreleased: false,
    outputOrder: OutputOrder.Storybook,
    changelogFile: releaseSectionPath
  });

  pluginDebug('xscripts api call completed successfully');

  const prettyTrimmedNotes = (await readFile(releaseSectionPath, 'utf8')).trim();
  pluginDebug('prettyTrimmedNotes: %O', prettyTrimmedNotes);

  // ? We don't really care if this succeeds or fails.
  void rmFile(releaseSectionPath, { force: true }).catch((error: unknown) => {
    pluginDebug.warn(
      'attempt to cleanup (delete) %O failed: %O',
      releaseSectionPath,
      error
    );
  });

  if (!prettyTrimmedNotes) {
    throw new Error(`unexpectedly empty temporary changelog file: ${releaseSectionPath}`);
  }

  return prettyTrimmedNotes;
}

/**
 * This is a custom semantic-release plugin step that logs a GitHub Actions (or
 * other) warning if the release pipeline ends with the repository in an unclean
 * state.
 */
export function success({ releaseSectionPath }: PluginConfig, context: SuccessContext) {
  const pluginDebug = debug.extend('generateNotes');

  // TODO: warn if the release pipeline ends with the repository in an unclean
  // TODO: state (git).

  void releaseSectionPath;

  pluginDebug.message('(release.config.js success step is unfinished)');
  context.logger.warn('(release.config.js success step is unfinished)');
}
