// * The semantic-release plugin exports replaces the following functionality:
// * - @semantic-release/release-notes-generator
// * - @semantic-release/changelog

// {@xscripts/notExtraneous @-xun/release}
import assert from 'node:assert';
import crypto from 'node:crypto';
import { readFile, rm as rmFile, writeFile } from 'node:fs/promises';
import os from 'node:os';

import { run } from '@-xun/run';
import { type ExecutionContext } from '@black-flag/core/util';

import { getInvocableExtendedHandler } from 'multiverse+bfe';
import { analyzeProjectStructure } from 'multiverse+project-utils:analyze.ts';

import {
  conventionalChangelogConfigProjectBase,
  releaseConfigProjectBase,
  toPath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger } from 'multiverse+rejoinder';

import {
  getExcludedPathsRelativeToProjectRoot,
  noSpecialInitialCommitIndicator
} from 'universe:assets/config/_conventional.config.cjs.ts';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe:assets.ts';

import {
  default as buildChangelog,
  OutputOrder,
  type CustomCliArguments as BuildChangelogCliArguments
} from 'universe:commands/build/changelog.ts';

import {
  $executionContext,
  configureExecutionContext,
  ThisPackageGlobalScope,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';

import type {
  XchangelogConfig,
  XchangelogConfigOptions
} from '@-xun/changelog' with { 'resolution-mode': 'import' };

import type {
  GenerateNotesContext,
  Options as ReleaseConfig,
  SuccessContext,
  VerifyConditionsContext
} from 'semantic-release' with { 'resolution-mode': 'import' };

import type { EmptyObject } from 'type-fest';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:release`
});

export type Context = EmptyObject;

export function moduleExport({
  parserOpts,
  writerOpts
}: Partial<Pick<PluginConfig, 'parserOpts' | 'writerOpts'>>): ReleaseConfig {
  const specialInitialCommit = process.env.XSCRIPTS_SPECIAL_INITIAL_COMMIT;
  debug('specialInitialCommit: %O', specialInitialCommit);

  assert(
    specialInitialCommit && typeof specialInitialCommit === 'string',
    ErrorMessage.MissingXscriptsEnvironmentVariable('XSCRIPTS_SPECIAL_INITIAL_COMMIT')
  );

  assert(parserOpts, ErrorMessage.BadParameter('parserOpts'));
  assert(writerOpts, ErrorMessage.BadParameter('writerOpts'));

  const releaseSectionPath = toPath(
    os.tmpdir(),
    `xscripts-release-changelog-${crypto.randomBytes(4).readUInt32LE(0).toString(16)}.md`
  );

  debug('releaseSectionPath: %O', releaseSectionPath);

  const { cwdPackage } = analyzeProjectStructure.sync({ useCached: true });
  const gitLogPathspecs = getExcludedPathsRelativeToProjectRoot();

  const cwdPackageName = cwdPackage.json.name;
  assert(cwdPackageName);

  const finalConfig = {
    // ? Tell xrelease what package-specific tags look like
    tagFormat: `${cwdPackageName}@\${version}`,
    // ? Tell xrelease to remove this string from maintenance branch names when
    // ? resolving their respective ranges and channels
    branchRangePrefix: `${cwdPackageName}@`,
    gitLogOptions: {
      // ? Tell xrelease to exclude commits up to and including a special
      // ? "initial commit" that serves to divide repo history, with the portion
      // ? at and/or after the [INIT] commit being ignored entirely (as if all
      // ? commits before and including the initial commit didn't exist at all)
      flags:
        specialInitialCommit !== noSpecialInitialCommitIndicator
          ? `^${specialInitialCommit}`
          : '',
      // ? Tell xrelease to exclude commits from the other packages
      // ? unless that package is "shared" (according to @-xun/project)
      paths: gitLogPathspecs
    },
    branches: [
      // ? Tell xrelease what package-specific maintenance branch names look
      // ? like. Specifically: they must begin with `branchRangePrefix`
      `${cwdPackageName}@+([0-9])?(.{+([0-9]),x}).x`,
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
        `@-xun/scripts/assets/config/${releaseConfigProjectBase}`,
        {
          releaseSectionPath,
          parserOpts,
          writerOpts: {
            ...writerOpts,
            finalizeContext(context: XchangelogConfig['context']) {
              context.packageName = cwdPackageName;
              return context;
            }
          }
        }
      ],

      // * Publish

      // ! This ordering is important to ensure errors stop the process safely
      // ! and that broken builds are not published. The proper order is:
      // ! NPM (+ attestations) > Git > GitHub.

      // TODO: add support for GitHub Actions build provenance attestations here
      // This comes bundled with semantic-release
      '@semantic-release/npm',
      [
        // {@xscripts/notExtraneous @semantic-release/git}
        '@semantic-release/git',
        {
          assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'docs'],
          // ? Make sure we send out the patched release notes (i.e. changelog)
          message: `release: ${cwdPackageName}@<%= nextRelease.version %> [skip ci]\n\n<%= nextRelease.notes %>`
        }
      ],
      // This comes bundled with semantic-release
      '@semantic-release/github'
    ]
  } satisfies ReleaseConfig;

  debug('finalConfig: %O', finalConfig);
  return finalConfig;
}

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
const { moduleExport } = require('@-xun/scripts/assets/config/${name}');

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:release'
});*/

const { parserOpts, writerOpts } = require('./${conventionalChangelogConfigProjectBase}');

module.exports = deepMergeConfig(
  moduleExport({ parserOpts, writerOpts }),
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
  parserOpts: NonNullable<XchangelogConfigOptions['parserOpts']>;
  writerOpts: NonNullable<XchangelogConfigOptions['writerOpts']>;
  [key: string]: unknown;
};

/**
 * This is a custom semantic-release plugin step that validates the options
 * passed via `release.config.cjs`.
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

// TODO: implement so-called cross-dependency version coherence here (--synchronize-interdependencies)

// TODO: ONLY when cutting a new major, update engines.node to maintained node versions unless --no-update-engines-on-major sets appropriate environment variable

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
    env: { XSCRIPTS_RELEASE_REBUILD_CHANGELOG }
  } = context;

  const shouldRebuildChangelog = XSCRIPTS_RELEASE_REBUILD_CHANGELOG !== 'false';
  pluginDebug('shouldRebuildChangelog: %O', shouldRebuildChangelog);

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

  if (shouldRebuildChangelog) {
    pluginDebug('rebuilding changelog (calling out to xscripts api)');

    await buildChangelogHandler({
      [$executionContext]: pseudoBfGlobalExecutionContext,
      $0: 'build changelog',
      _: [],
      scope: ThisPackageGlobalScope.ThisPackage,
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
    pluginDebug('skipped rebuilding changelog');
  }

  pluginDebug(
    `patching and formatting ${releaseSectionPath} (calling out to xscripts api)`
  );

  await buildChangelogHandler({
    [$executionContext]: pseudoBfGlobalExecutionContext,
    $0: 'build changelog',
    _: [],
    scope: ThisPackageGlobalScope.ThisPackage,
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

  pluginDebug('updating remote');
  await run('git', ['fetch', '--prune']);

  pluginDebug('analyzing repository state');
  const { isDirty } = await determineRepoWorkingTreeDirty();

  if (isDirty && context.envCi.isCi) {
    process.stdout.write(
      '::warning title=Repository left in unclean state::The release pipeline has terminated but the repository remains in an unclean state. This is typically evident of a broken build process.\n'
    );
  }
}

/**
 * If `gitStatusOutput` is not empty or `gitStatusExitCode` is non-zero, then
 * the current working tree is dirty. This can be checked quickly via the
 * `isDirty` property.
 */
export async function determineRepoWorkingTreeDirty() {
  const { all: gitStatusOutput, exitCode: gitStatusExitCode } = await run(
    'git',
    ['status', '--porcelain'],
    { all: true }
  );

  const isDirty = !!gitStatusOutput || gitStatusExitCode !== 0;

  if (isDirty) {
    debug.warn(
      'repository was left in an unclean state! Git status output (exit code %O):',
      gitStatusExitCode
    );
  }

  debug.message('%O', gitStatusOutput);

  return {
    gitStatusOutput,
    gitStatusExitCode,
    isDirty
  };
}
