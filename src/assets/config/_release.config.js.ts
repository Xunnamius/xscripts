// * The semantic-release plugin exports wrap the following functionality:
// *
// * - @semantic-release/release-notes-generator
// * - @semantic-release/changelog
// * - @-xun/scripts (build changelog)

import { readFile, writeFile, rm as rmFile } from 'node:fs/promises';
import assert from 'node:assert';

import { type ExecutionContext } from '@black-flag/core/util';

import { createDebugLogger } from 'multiverse/rejoinder';
import { getInvocableExtendedHandler } from 'multiverse/@black-flag/extensions/index.js';
import { run } from 'multiverse/run';

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

import { ErrorMessage } from 'universe/error';

import type { EmptyObject } from 'type-fest';

import type {
  Options as ReleaseConfig,
  VerifyConditionsContext,
  SuccessContext,
  GenerateNotesContext
} from 'semantic-release';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:release`
});

export type Context = EmptyObject;

export function moduleExport({
  releaseSectionPath,
  parserOpts,
  writerOpts
}: Partial<
  Pick<PluginConfig, 'releaseSectionPath' | 'parserOpts' | 'writerOpts'>
>): ReleaseConfig {
  assert(releaseSectionPath, ErrorMessage.BadParameter('releaseSectionPath'));
  assert(parserOpts, ErrorMessage.BadParameter('parserOpts'));
  assert(writerOpts, ErrorMessage.BadParameter('writerOpts'));

  return {
    branches: [
      '+([0-9])?(.{+([0-9]),x}).x',
      'main',
      {
        name: 'canary',
        channel: 'canary',
        prerelease: true
      }
    ],
    plugins: [
      // * Prepare

      [
        '@semantic-release/commit-analyzer',
        {
          parserOpts,
          releaseRules: [
            // ? releaseRules are checked first; if none match, defaults are
            // ? checked next.

            // ! These two lines must always appear first and in order:
            { breaking: true, release: 'major' },
            { revert: true, release: 'patch' },

            // * Custom release rules, if any, may appear next:
            { type: 'build', release: 'patch' }
          ]
        }
      ],
      // ? This block pulls in a custom semantic-release plugin that mutates
      // ? internal state as required.
      [
        '@-xun/scripts/assets/config/release.config.js',
        {
          releaseSectionPath,
          parserOpts,
          writerOpts
        }
      ],

      // * Publish

      // ! This ordering is important to ensure errors stop the process safely
      // ! and that broken builds are not published. The proper order is:
      // ! NPM (+ attestations) > Git > GitHub.

      // TODO: add support for GitHub Actions build provenance attestations here
      '@semantic-release/npm',
      [
        '@semantic-release/git',
        {
          assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'docs'],
          // ? Make sure semantic-release uses a patched release (changelog) body.
          message: `release: <%= nextRelease.version %> [skip ci]\n\n<%= nextRelease.notes %>`
        }
      ],
      '@semantic-release/github'
    ]
  };
}

const releaseSectionFilenameTemplateSource =
  '`xscripts-release-changelog-${crypto.randomBytes(4).readUInt32LE(0).toString(16)}.md`';

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
'use strict';

const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const { deepMergeConfig } = require('@-xun/scripts/assets');
const { moduleExport } = require('@-xun/scripts/assets/config/release.config.js');

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug-extended');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:release'
});*/

const { parserOpts, writerOpts } = require('./conventional.config');

const releaseSectionPath = path.join(
  os.tmpdir(),
  ${releaseSectionFilenameTemplateSource}
);

module.exports = deepMergeConfig(
  moduleExport({ releaseSectionPath, parserOpts, writerOpts }),
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

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
  pluginDebug('entered step function');

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
  pluginDebug('entered step function');

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

  const { generateNotes: generateRawNotes } = await import(
    '@semantic-release/release-notes-generator'
  );

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

  return (
    prettyTrimmedNotes
      // ? Make it pretty for the GitHub Releases page :)
      .split('\n')
      .slice(1)
      .join('\n')
      .trimStart()
      .replaceAll(/^#+/gm, '##')
  );
}

/**
 * This is a custom semantic-release plugin step that logs a GitHub Actions (or
 * other) warning if the release pipeline ends with the repository in an unclean
 * state.
 */
export async function success(_pluginConfig: PluginConfig, context: SuccessContext) {
  const pluginDebug = debug.extend('generateNotes');
  pluginDebug('entered step function');

  const { stdout } = await run('git', ['status', '--porcelain']);

  if (stdout) {
    pluginDebug.warn('repository was left in an unclean state! Git status output:');
    pluginDebug.message('%O', stdout);

    if (context.envCi.isCi) {
      process.stdout.write(
        '::warning title=Repository left in unclean state::The release pipeline has terminated but the repository remains in an unclean state. This is typically evident of a broken build process.'
      );
    }
  }
}
