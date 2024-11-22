import assert from 'node:assert';
import childProcess from 'node:child_process';

import { runNoRejectOnBadExit } from '@-xun/run';
import escapeStringRegExp from 'escape-string-regexp~4';
import clone from 'lodash.clone';
import cloneDeepWith from 'lodash.clonedeepwith';
import deepMerge from 'lodash.mergewith';
import semver from 'semver';

import { interpolateTemplate, toSentenceCase } from 'multiverse+cli-utils:util.ts';

import {
  analyzeProjectStructure,
  isRootPackage,
  WorkspaceAttribute
} from 'multiverse+project-utils';

import {
  documentationDirPackageBase,
  srcDirPackageBase,
  testDirPackageBase,
  toRelativePath,
  Tsconfig,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger } from 'multiverse+rejoinder';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';
import { __read_file_sync } from 'universe:util.ts';

import type {
  XchangelogCommit,
  XchangelogConfig,
  XchangelogSpec
} from '@-xun/changelog' with { 'resolution-mode': 'import' };

import type { EmptyObject } from 'type-fest';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:conventional`
});

// @ts-expect-error: part of a hack
globalThis.previousSpawnChild ||= undefined as undefined | typeof childProcess.spawn;
// @ts-expect-error: part of a hack
globalThis.previousProxy ||= undefined as undefined | typeof Proxy;

const proxiedTargets = new WeakMap<InstanceType<typeof Proxy>, object>();

debug('conventional.config.cjs was freshly imported, running patchers...');
patchProxy();
patchSpawnChild();

/**
 * The Git pathspecs that should be ignored (excluded) when not considering the
 * root package. Pathspecs should be relative to _project_ root.
 *
 * ! DO _NOT_ PREFIX ENTRIES IN THIS ARRAY WITH A LEADING DOT (.) OR ./
 */
const rootPackageExcludedDirectories = [
  'docs',
  'src',
  'test',
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'tsc.package.*'
] as RelativePath[];

/**
 * The location of the handlebars templates in relation to this file's location
 * on disk.
 */
const templateDirectory = '../template/conventional-changelog';

/**
 * Matches a valid GitHub username with respect to the following:
 *  - Avoids matching scoped package names (e.g. @xunnamius/package).
 *  - Avoids matching scoped package names with dashes in them.
 *  - Will match multiple usernames separated by slash (e.g. @user1/@user2).
 */
const usernamePattern =
  /\B@([\da-z](?:[\da-z]|-(?=[\da-z])){0,38})\b(?!(?:\/(?!@))|-|\w)/gi;

/**
 * Used to normalize the aesthetic of revert changelog entries.
 */
const revertPrefixPattern = /^Revert\s+/;

/**
 * Used when a regexp is required that will never match anything ever.
 */
const neverMatchAnythingPattern = /(?!)/;

/**
 * @internal
 * @see {@link patchSpawnChild}
 */
const specialArgumentMarkerForFlags = '_flags_';

/**
 * @internal
 * @see {@link patchSpawnChild}
 */
const specialArgumentMarkerForPaths = '_paths_';

/**
 * @internal
 * @see {@link patchSpawnChild}
 */
const specialArgumentRegExp = new RegExp(
  `^-?-(${specialArgumentMarkerForFlags}|${specialArgumentMarkerForPaths})=?(.*)`
);

export type Context = EmptyObject;

/**
 * The inline image HTML element appended to links leading to external
 * repositories. This value is also duplicated in the commit.hbs template file.
 */
export const inlineExternalImageElement = /*html*/ `
  <img alt="external reference" title="(this issue is from a different repository)" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==" />
`
  .replaceAll(/\s/g, ' ')
  .trim();

/**
 * The default text that headlines the "breaking changes" section in
 * the changelog file.
 */
export const noteTitleForBreakingChange = 'BREAKING CHANGES';

/**
 * The preamble prefixed to any generated the changelog file.
 */
export const defaultChangelogTopmatter =
  `# Changelog\n\n` +
  `All notable changes to this project will be documented in this auto-generated\n` +
  `file. The format is based on [Conventional Commits](https://conventionalcommits.org);\n` +
  `this project adheres to [Semantic Versioning](https://semver.org).`;

// TODO: this should go into xpipeline's README.md
/**
 * This regular expression matches well-known xpipeline command strings that may
 * appear as commands in commit headers and is used to remove said commands so
 * they do not appear in the changelog.
 *
 * Matches against `commandHeaderPattern` should return two matching groups, the
 * first containing the input string without the command string(s) or a trailing
 * space and the second containing the command string(s) without its surrounding
 * brackets or space prefix.
 *
 * ### Xpipline commands
 *
 * Xpipline commands expand on the [conventional commits
 * specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
 * to include a new "command" structure in addition to "type", "scope",
 * "description" (alias of "subject"), "header" (combination of type + scope +
 * description + command), "body", and "footer".
 *
 * ```text
 * <type>[scope][!]: <description/subject> [command]
 *
 * [body]
 *
 * [footer(s)]
 * ```
 *
 * #### Expanded specification
 *
 * - A command MAY be provided; if provided, it MUST be after the description.
 * - A header MUST have exactly zero or one commands.
 * - A command MUST consist of a space followed by an opening bracket ("[")
 *   followed by one or more well-known command strings followed by a closing
 *   bracket ("]"). The closing bracket MUST be the final character of the
 *   header.
 * - A well-known command string MUST be lowercase alphanumeric and MAY contain
 *   spaces or dashes. It MUST NOT contain any other characters.
 * - A command MAY consist of one or more well-known command strings. Each
 *   command string beyond the first MUST be separated from the previous
 *   well-known command string by a comma (",") and OPTIONAL space.
 *
 * Examples:
 *
 * ```text
 * type(scope): description [skip ci]
 * ```
 *
 * ```text
 * type!: description [skip ci, skip cd]
 * ```
 *
 * ```text
 * type: subject [skip ci,skip cd]
 * ```
 *
 * #### Xpipeline footers
 *
 * Xpipeline also acknowledges well-known command strings via "xpipeline
 * footers", which are simply [spec-compliant
 * footers](https://www.conventionalcommits.org/en/v1.0.0/#specification) of the
 * form `xpipeline: command string` or `xpipeline: command string 1, command
 * string 2, etc`, or the `xpipe: ...`/`x: ...`.
 *
 * Both commands and footers can be used simultaneously.
 *
 * Examples:
 *
 * ```text
 * type(scope): description
 *
 * This is a really detailed commit message body.
 *
 * xpipeline: skip ci
 * xpipe: skip cd
 * x: some-other-command, yet-another-command, a-5th-command
 * ```
 */
// TODO: import these from @-xun/pipeline instead
export const commandHeaderPattern = /^(.*) \[([^\]]*)]$/is;

/**
 * The character(s) used to reference issues by number on GitHub.
 */
export const defaultIssuePrefixes = ['#'];

/**
 * These are the only conventional commit types supported by xscripts-based
 * pipelines and are therefore considered "well known".
 *
 * Commit types corresponding to entries with `{ hidden: false }` will appear in
 * the generated the changelog file. Commit types with `{ hidden: true }` will
 * not appear in the changelog file _unless the commit is marked "BREAKING" in
 * some way_.
 *
 * Multiple commit types can have the same `section`, which means commits of
 * that type will be combined together under said section.
 *
 * Note that the order of values in this array is significant. Commits, having
 * been grouped (sectioned) by type, will appear in the changelog in the order
 * they appear in this array. Unknown types, i.e. types that are not listed in
 * `wellKnownCommitTypes`, will appear _after_ any well-known sections if they
 * are set to appear at all (e.g. if they are marked as breaking changes).
 *
 * Also note that `@-xun/changelog` has internal lists of "well-known commit
 * types" (conventional, angular, etc) that this type will be merged on top of;
 * the implication being: not overwriting an internal type's configuration can
 * lead to that type (feat, fix, ci) being included even if it is not present in
 * the below array.
 *
 * Valid commit types are alphanumeric and may contain an underscore (_) or dash
 * (-). Using characters other than these will lead to undefined behavior.
 */
export const wellKnownCommitTypes: NonNullable<XchangelogSpec['types']> = [
  { type: 'feat', section: '✨ Features', hidden: false },
  { type: 'fix', section: '🪄 Fixes', hidden: false },
  { type: 'perf', section: '⚡️ Optimizations', hidden: false },
  { type: 'build', section: '⚙️ Build system', hidden: false },
  { type: 'docs', section: '📚 Documentation', hidden: true },
  { type: 'style', section: '💎 Aesthetics', hidden: true },
  { type: 'ci', section: '🏭 CI/CD', hidden: true },
  { type: 'cd', section: '🏭 CI/CD', hidden: true },
  { type: 'refactor', section: '🧙🏿 Refactored', hidden: true },
  { type: 'test', section: '⚗️ Test system', hidden: true },
  { type: 'chore', section: '🗄️ Miscellaneous', hidden: true },
  { type: 'revert', section: '🔥 Reverted', hidden: false }
];

/**
 * Handlebars template data (not processed by our custom configuration).
 */
export const defaultTemplates = {
  commit: __read_file_sync(require.resolve(`${templateDirectory}/commit.hbs`)),
  footer: __read_file_sync(require.resolve(`${templateDirectory}/footer.hbs`)),
  header: __read_file_sync(require.resolve(`${templateDirectory}/header.hbs`)),
  template: __read_file_sync(require.resolve(`${templateDirectory}/template.hbs`)),
  // TODO: should these be passed in the "partials" core configs?
  // ? Handlebars partials for property substitutions using commit context
  partials: {
    owner: '{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}',
    host: '{{~@root.host}}',
    repository:
      '{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'
  }
};

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:conventional'
});*/

const { moduleExport } = require('@-xun/scripts/assets/config/${name}');
module.exports = moduleExport({
  // * Your customizations here
});

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});

/**
 * The value populating the XSCRIPTS_SPECIAL_INITIAL_COMMIT environment variable
 * when there was no special initialization commit reference found.
 */
// TODO: migrate this into xpipeline
export const noSpecialInitialCommitIndicator = 'N/A';

/**
 * This function returns a `@-xun/changelog` configuration preset. See the
 * documentation for details.
 *
 * `configOverrides`, if an object or undefined, is recursively merged into a
 * partially initialized {@link XchangelogConfig} object (overwriting same keys)
 * using `lodash.mergeWith`.
 *
 * If `configOverrides` is a function, it will be passed said partially
 * initialized {@link XchangelogConfig} object and must return a an object of
 * the same type.
 *
 * If you are consuming this configuration object with the intent to invoke
 * `@-xun/changelog` directly (i.e. via its Node.js API), such as in the
 * `src/commands/build/changelog.ts` file, **you should call
 * {@link patchSpawnChild} as soon as possible** upon entering the handler and
 * call {@link unpatchSpawnChild} towards the end of the same scope.
 *
 * This function also modifies the global `Proxy` class so that it returns the
 * object its proxying as a property on the proxy object accessible via the
 * {@link $proxiedTarget} symbol. This is used to hack our way around some
 * questionable attempts at implementing immutable commit objects in
 * conventional-commits-writer.
 */
export function moduleExport(
  configOverrides:
    | ((config: XchangelogConfig) => XchangelogConfig)
    | Partial<XchangelogConfig> = {}
) {
  const specialInitialCommit = process.env.XSCRIPTS_SPECIAL_INITIAL_COMMIT;
  debug('specialInitialCommit: %O', specialInitialCommit);

  assert(
    specialInitialCommit && typeof specialInitialCommit === 'string',
    ErrorMessage.MissingXscriptsEnvironmentVariable('XSCRIPTS_SPECIAL_INITIAL_COMMIT')
  );

  // ? Later on we'll be keep'n reverter commits but discarding reverted commits
  const revertedCommitHashesSet = new Set<string>();
  // ? When issuePrefix is updated in one config area, we use this to update it
  // ? in both parserOpts and in finalConfig itself simultaneously
  let sharedIssuePrefixes = defaultIssuePrefixes;

  const { cwdPackage } = analyzeProjectStructure.sync({ useCached: true });
  const cwdPackageName = cwdPackage.json.name;

  assert(cwdPackageName);

  const intermediateConfig: XchangelogConfig = {
    // * Core configuration keys * \\
    context: { packageName: cwdPackageName },
    // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#options
    options: { tagPrefix: `${cwdPackageName}@` },

    // ? gitRawCommitsOpts key is redefined below
    gitRawCommitsOpts: {
      // ! Order here is important; specialArgumentMarkerForFlags goes first!
      // ? Flags passed to git log; used to ignore changes at/before init commit
      // ? See: https://github.com/sindresorhus/dargs#usage
      [specialArgumentMarkerForFlags]:
        specialInitialCommit !== noSpecialInitialCommitIndicator
          ? [`^${specialInitialCommit}`]
          : [],
      // ? Pathspecs passed to git log; used to ignore changes in other packages
      // ? See: https://github.com/sindresorhus/dargs#usage
      [specialArgumentMarkerForPaths]: getExcludedPathsRelativeToProjectRoot()
    },

    // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#options
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([^)]*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\(([^)]*)\))?!: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      mergePattern: /^Merge pull request #(\d+) from (.*)$/,
      mergeCorrespondence: ['id', 'source'],
      revertPattern: /^revert:?\s"?([\S\s]*?)"?\s*this reverts commit (\w*)\.?/i,
      revertCorrespondence: ['header', 'hash'],
      // ? Expanding on the spec a bit: https://www.conventionalcommits.org/en/v1.0.0/#specification
      noteKeywords: [
        'BREAKING CHANGE',
        'BREAKING-CHANGE',
        'BREAKING',
        noteTitleForBreakingChange
      ],
      // ? Used to synchronize the value of issuePrefixes across config objects
      get issuePrefixes() {
        return sharedIssuePrefixes;
      },
      set issuePrefixes(value) {
        sharedIssuePrefixes = value;
      }
    },

    // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#options
    writerOpts: {
      mainTemplate: defaultTemplates.template,
      // * headerPartial and commitPartial sub-keys are defined below
      footerPartial: defaultTemplates.footer,
      groupBy: 'type',
      commitsSort: ['scope', 'subject'],
      noteGroupsSort: 'title',
      // ? We'll handle ignoring reverts on our own
      ignoreReverted: false,
      // ! Currently, the transformer used to filter out revert commits expects
      // ! commits to arrive in chronological order. If this is somehow not the
      // ! case, then invert this value. This should never be necessary.
      reverse: false,
      // ? Commit message groupings (e.g. Features) are sorted by their
      // ? importance. Unlike the original version, this is a stable sort algo!
      // ? See: https://v8.dev/features/stable-sort
      commitGroupsSort(groupA, groupB) {
        const a = commitSectionOrder.indexOf(groupA.title || '');
        const b = commitSectionOrder.indexOf(groupB.title || '');
        return a === -1 || b === -1 ? b - a : a - b;
      },
      // ? Note that in recent versions of conventional-commits, the commit
      // ? object is now "immutable" (i.e. a Proxy); we do away with that below:
      transform(commit_, context) {
        assert(proxiedTargets.has(commit_), ErrorMessage.GuruMeditation());

        const commit = safeDeepClone(proxiedTargets.get(commit_) as typeof commit_);

        const debug_ = debug.extend('writerOpts:transform');
        debug_('pre-transform commit: %O', commit);

        // ? Scope should always be lowercase (or undefined)
        commit.scope = commit.scope?.toLowerCase();

        let discard = true as boolean;
        const issueReferencesInSubject: string[] = [];
        const typeKey = (commit.revert ? 'revert' : (commit.type ?? '')).toLowerCase();

        const typeEntry = finalConfig.types?.find(
          ({ type, scope }) => type === typeKey && (!scope || scope === commit.scope)
        );

        const commandStringSubjectMatch = commit.subject?.match(commandHeaderPattern);
        const commandStringHeaderMatch = commit.header?.match(commandHeaderPattern);

        // ? Delete xpipeline command suffixes from the subjects of commits
        if (commandStringSubjectMatch?.[2]) {
          const [, subject, commandStrings] = commandStringSubjectMatch;

          debug_(
            'updated commit subject; removed potential xpipeline command: %O',
            commandStrings
          );

          commit.subject = subject;
        }

        // ? Delete xpipeline command suffixes from the headers of commits
        if (commandStringHeaderMatch?.[2]) {
          const [, header, commandStrings] = commandStringHeaderMatch;

          debug_(
            'updated commit header; removed potential xpipeline command: %O',
            commandStrings
          );

          commit.header = header;
        }

        // * Xpipeline command suffixes in commit bodies are deleted later

        // ? Ignore any commits that have been reverted...
        if (commit.hash) {
          // TODO: only keep reverter commits that reverted build/feat/fix/perf
          // TODO: et cetera
          // ? ... but keep reverter commits...
          if (revertedCommitHashesSet.has(commit.hash)) {
            debug_('decision: commit discarded (reverted)');
            return null;
          }

          if (commit.revert) {
            // ? (there may be duplicate headers so ignore them here)
            if (commit.revert.hash) {
              revertedCommitHashesSet.add(commit.revert.hash);
            }

            // ? ... unless the reverter is reverting something irrelevant
            if (
              !commit.revert.header ||
              isHeaderOfIrrelevantCommit(commit.revert.header)
            ) {
              debug_('decision: commit discarded (probably irrelevant reverter)');
              return null;
            }
          }
        }

        addBangNotes(commit);

        // ? NEVER ignore non-reverted breaking changes. For multi-line notes,
        // ? collapse them down into one line. Also note that BC notes are
        // ? always sentence-cased.
        commit.notes.forEach((note) => {
          if (note.text) {
            debug_('saw BC notes for this commit; will likely keep commit');

            note.text = note.text.trim();
            const commandStringSubjectMatch = note.text.match(commandHeaderPattern);

            // ? Delete xpipeline command suffixes from breaking change notes.
            // ? They typically get there when commits use the "!" scope
            // ? modifier in conventional commits.
            if (commandStringSubjectMatch?.[2]) {
              const [, updatedNoteText, commandStrings] = commandStringSubjectMatch;
              debug_(
                'updated commit note; removed potential xpipeline command: %O',
                commandStrings
              );

              note.text = updatedNoteText;
            }

            const paragraphs = note.text
              .split('\n\n')
              .map((paragraph) => toSentenceCase(paragraph.replaceAll('\n', ' ')));

            // ? Never discard breaking changes
            discard = false;
            note.title = noteTitleForBreakingChange;
            note.text = paragraphs.join('\n\n') + '\n';
          }
        });

        // ? Discard entries of unknown or hidden types if discard === true
        if (discard && (typeEntry === undefined || typeEntry.hidden)) {
          debug_(
            `decision: commit discarded (${typeEntry === undefined ? 'unknown' : 'hidden'} type)`
          );

          return null;
        } else debug_('decision: commit NOT discarded');

        if (typeEntry) commit.type = typeEntry.section;
        if (commit.scope === '*') commit.scope = '';
        if (commit.hash) commit.shortHash = commit.hash.slice(0, 7);

        // ? Badly crafted reverts are all header and no subject
        if (typeKey === 'revert' && !commit.subject) {
          commit.subject = commit.header?.replace(revertPrefixPattern, '');

          // ? Attempt to fix them up
          if (commit.subject) {
            if (!commit.subject.startsWith('"')) {
              commit.subject = `"${commit.subject}`;
            }

            if (!commit.subject.endsWith('"')) {
              commit.subject += '"';
            }
          }
        }

        const { host, owner, repository } = context;

        // ? Linkify issues (e.g. #123) and usernames (e.g. @Xunnamius) in
        // ? commit subjects and in breaking change notes
        if (host && owner && repository) {
          const { issueUrlFormat, userUrlFormat } = finalConfig;

          const linkificationContext = {
            host,
            owner,
            repository
          };

          if (issueUrlFormat) {
            const [updatedSubject, seenIssues] = linkifyIssueReferences(
              issueUrlFormat,
              commit.subject,
              linkificationContext
            );

            commit.subject = updatedSubject;
            issueReferencesInSubject.push(...seenIssues);
          }

          if (userUrlFormat) {
            commit.subject = linkifyUsernames(
              userUrlFormat,
              commit.subject,
              linkificationContext
            );
          }

          commit.notes.forEach((note) => {
            if (note.text) {
              if (issueUrlFormat) {
                [note.text] = linkifyIssueReferences(
                  issueUrlFormat,
                  note.text,
                  linkificationContext
                );
              }

              if (userUrlFormat) {
                note.text = linkifyUsernames(
                  userUrlFormat,
                  note.text,
                  linkificationContext
                );
              }
            }
          });
        }

        if (commit.subject) {
          // ? Make scope-less commit subjects sentence case
          if (!commit.scope) commit.subject = toSentenceCase(commit.subject);

          // ? Italicize reverts
          if (typeKey === 'revert') commit.subject = `*${commit.subject}*`;
        }

        // ? Remove references that already appear in the subject
        commit.references = commit.references.filter(
          ({ prefix, issue }) => !issueReferencesInSubject.includes(`${prefix}${issue}`)
        );

        debug_('transformed commit: %O', commit);
        return commit;
      },
      generateOn(commit) {
        const debug_ = debug.extend('writerOpts:generateOn');
        debug_(`saw version: ${commit.version ?? 'N/A'}`);

        const decision = !!(
          commit.version &&
          semver.valid(commit.version) &&
          !semver.prerelease(commit.version)
        );

        debug_('version block decision: %O', decision ? 'NEW block' : 'same block');
        return decision;
      }
    },

    // * Spec-compliant configuration keys * \\
    // ? See: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md

    types: wellKnownCommitTypes,
    commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
    compareUrlFormat:
      '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
    issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
    userUrlFormat: '{{host}}/{{user}}',
    // ? Used to synchronize the value of issuePrefixes across config objects
    get issuePrefixes() {
      return sharedIssuePrefixes;
    },
    set issuePrefixes(value) {
      sharedIssuePrefixes = value;
    }
  };

  intermediateConfig.recommendedBumpOpts = {
    tagPrefix: intermediateConfig.options.tagPrefix,
    parserOpts: intermediateConfig.parserOpts,
    whatBump: (commits) => {
      const debug_ = debug.extend('writerOpts:whatBump');

      let level = 2; // ? 0 = major, 1 = minor, 2 = patch (default)
      let breakings = 0;
      let features = 0;

      commits.forEach((commit) => {
        addBangNotes(commit);

        if (commit.notes.length > 0) {
          breakings += commit.notes.length;
          level = 0; // ? -> major
        } else if (commit.type === 'feat' || commit.type === 'feature') {
          features += 1;

          if (level === 2) {
            level = 1; // ? patch -> minor
          }
        }
      });

      // ? If release <1.0.0 and we were gonna do a major/minor bump, do a
      // ? minor/patch (respectively) bump instead
      if (intermediateConfig.preMajor && level < 2) {
        debug_('preMajor release detected; restricted to minor and patch bumps');
        level++;
      }

      const recommendation = {
        level,
        reason: `There ${breakings === 1 ? 'is' : 'are'} ${breakings} breaking change${
          breakings === 1 ? '' : 's'
        } and ${features} feature${features === 1 ? '' : 's'}`
      };

      debug_('recommendation: %O', recommendation);
      return recommendation;
    }
  } as typeof intermediateConfig.recommendedBumpOpts;

  debug('intermediate config: %O', intermediateConfig);

  const finalConfig =
    typeof configOverrides === 'function'
      ? configOverrides(intermediateConfig)
      : // ? We do a custom merge instead of relying on asset merge because our
        // ? objects have getters and setters that won't copy over properly
        deepMerge(intermediateConfig, configOverrides, mergeCustomizer);

  const commitSectionOrder = Array.from(
    new Set(finalConfig.types?.map(({ section }) => section) ?? [])
  );

  const nonHiddenKnownTypesPartialPattern = finalConfig.types
    ?.filter(({ hidden }) => !hidden)
    .map(({ type }) => escapeStringRegExp(type))
    .join('|');

  // TODO: should probably just reuse breakingHeaderPattern, no?
  const relevantHeaderPattern = new RegExp(
    `(^(${nonHiddenKnownTypesPartialPattern ?? 'feat|fix'})\\W)|(^[^!(:]*(\\([^)]*\\))?!:)`,
    'i'
  );

  const issuePattern = finalConfig.issuePrefixes
    ? new RegExp(
        `(?:\\b([a-z0-9_.-]+)\\/([a-z0-9_.-]+))?(${finalConfig.issuePrefixes.map((str) => escapeStringRegExp(str)).join('|')})([0-9]+)`,
        'gi'
      )
    : neverMatchAnythingPattern;

  debug('commitSectionOrder: %O', commitSectionOrder);
  debug('relevantHeaderPattern: %O', relevantHeaderPattern);
  debug('issuePattern: %O', issuePattern);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (finalConfig.writerOpts) {
    debug('finalizing writerOpts');

    if (!finalConfig.writerOpts.headerPartial && finalConfig.compareUrlFormat) {
      finalConfig.writerOpts.headerPartial = interpolateTemplate(
        defaultTemplates.header,
        {
          compareUrlFormat: interpolateTemplate(finalConfig.compareUrlFormat, {
            host: defaultTemplates.partials.host,
            owner: defaultTemplates.partials.owner,
            repository: defaultTemplates.partials.repository
          })
        }
      );
    }

    if (
      !finalConfig.writerOpts.commitPartial &&
      finalConfig.commitUrlFormat &&
      finalConfig.issueUrlFormat
    ) {
      finalConfig.writerOpts.commitPartial = interpolateTemplate(
        defaultTemplates.commit,
        {
          inlineExternalImageElement,
          commitUrlFormat: interpolateTemplate(finalConfig.commitUrlFormat, {
            host: defaultTemplates.partials.host,
            owner: defaultTemplates.partials.owner,
            repository: defaultTemplates.partials.repository
          }),
          issueUrlFormat: interpolateTemplate(finalConfig.issueUrlFormat, {
            host: defaultTemplates.partials.host,
            owner: defaultTemplates.partials.owner,
            repository: defaultTemplates.partials.repository,
            id: '{{this.issue}}',
            prefix: '{{this.prefix}}'
          })
        }
      );
    }
  }

  debug('final config: %O', finalConfig);
  return finalConfig;

  /**
   * Adds additional breaking change notes for the special case
   * `test(system)!: hello world` but with no `BREAKING CHANGE:` footer.
   */
  function addBangNotes({ header, notes }: XchangelogCommit) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const { breakingHeaderPattern } = finalConfig.parserOpts ?? {};

    if (breakingHeaderPattern) {
      const match = header?.match(breakingHeaderPattern);

      if (match && notes.length === 0) {
        const noteText = match[3]; // ? Commit subject becomes BC note text
        notes.push({ text: noteText, title: noteTitleForBreakingChange });
      }
    }
  }

  /**
   * Returns `true` if `header` describes an unremarkable commit.
   */
  function isHeaderOfIrrelevantCommit(header: string) {
    return !relevantHeaderPattern.test(header);
  }

  /**
   * Replace issue references (e.g. #123, other-owner/other-repo#456) with URIs.
   */
  function linkifyIssueReferences<T extends string | null | undefined>(
    issueUrlFormat: string,
    text: T,
    context: Record<string, string> & { owner: string; repository: string }
  ): [text: T, seenIssues: string[]] {
    const seenIssues: string[] = [];
    return [
      text?.replaceAll(
        issuePattern,
        (
          _,
          issueOwner = context.owner,
          issueRepository = context.repository,
          issuePrefix: string,
          issueNumber: string
        ) => {
          const issueStr = `${issuePrefix}${issueNumber}`;
          const isExternal =
            issueOwner !== context.owner || issueRepository !== context.repository;

          const url = interpolateTemplate(issueUrlFormat, {
            ...context,
            id: issueNumber,
            prefix: issuePrefix,
            owner: issueOwner,
            repository: issueRepository
          });

          seenIssues.push(issueStr);
          return `[${issueStr}${isExternal ? inlineExternalImageElement : ''}](${url})`;
        }
      ) as T,
      seenIssues
    ];
  }

  /**
   * Replace username references (e.g. @Xunnamius, @Xunn/@Sui) with URIs.
   */
  function linkifyUsernames<T extends string | null | undefined>(
    userUrlFormat: string,
    text: T,
    context: Record<string, string>
  ) {
    return text?.replaceAll(
      // * https://github.com/shinnn/github-username-regex
      usernamePattern,
      (_, user: string) => {
        const usernameUrl = interpolateTemplate(userUrlFormat, {
          ...context,
          user
        });

        return `[@${user}](${usernameUrl})`;
      }
    ) as T;
  }
}

/**
 * Return directories that should be excluded from consideration depending on
 * the project structure and the current working directory.
 *
 * This function takes into account {@link WorkspaceAttribute.Shared} packages.
 *
 * Useful for narrowing the scope of `@-xun/changelog` and semantic-release
 * -based tooling like xchangelog and xrelease.
 */
export function getExcludedPathsRelativeToProjectRoot() {
  const { cwdPackage, rootPackage, subRootPackages } = analyzeProjectStructure.sync({
    useCached: true
  });

  const { root: projectRoot } = rootPackage;
  const isCwdPackageTheRootPackage = isRootPackage(cwdPackage);
  const excludedPathsRelativeToProjectRoot: RelativePath[] = [];

  if (!isCwdPackageTheRootPackage) {
    excludedPathsRelativeToProjectRoot.push(...rootPackageExcludedDirectories);
  }

  if (subRootPackages) {
    for (const {
      root: packageRoot,
      attributes: packageAttributes
    } of subRootPackages.values()) {
      if (
        packageRoot !== cwdPackage.root &&
        !packageAttributes[WorkspaceAttribute.Shared]
      ) {
        excludedPathsRelativeToProjectRoot.push(toRelativePath(projectRoot, packageRoot));
      }
    }
  }

  debug('excludedPathsRelativeToProjectRoot: %O', excludedPathsRelativeToProjectRoot);

  const result = excludedPathsRelativeToProjectRoot.flatMap((path) => {
    const excludeTargets =
      path === ''
        ? [
            srcDirPackageBase,
            testDirPackageBase,
            documentationDirPackageBase,
            Tsconfig.PackageDocumentation,
            Tsconfig.PackageLint,
            Tsconfig.PackageTypes,
            ...(rootPackage.json.files || [])
          ]
        : [path];

    return excludeTargets.map((p) => `:(exclude,top)${p}`);
  });

  debug('result: %O', result);
  return result;
}

/**
 * Return the commit-ish (SHA hash) of the most recent commit containing the
 * Xpipeline command suffix `[INIT]`, or {@link noSpecialInitialCommitIndicator}
 * if no such commit could be found.
 */
// TODO: migrate this into xpipeline
export async function getLatestCommitWithXpipelineInitCommandSuffix() {
  const { stdout: reference_ } = await runNoRejectOnBadExit('git', [
    'log',
    '-1',
    '--pretty=format:%H',
    '--grep',
    String.raw`\[INIT]$`
  ]);

  const reference = reference_ || noSpecialInitialCommitIndicator;
  debug('latest commit with Xpipeline "[INIT]" command: %O', reference);

  return reference;
}

/**
 * Custom lodash merge customizer that causes successive `undefined` source
 * values to unset (delete) the destination property if it exists, and to
 * completely overwrite the destination property if the source property is an
 * array.
 *
 * @see https://lodash.com/docs/4.17.15#mergeWith
 */
function mergeCustomizer(
  _objValue: unknown,
  srcValue: unknown,
  key: string,
  object: Record<string, unknown> | undefined,
  source: Record<string, unknown> | undefined
) {
  if (object && source) {
    if (srcValue === undefined && key in source) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete object[key];
    } else if (Array.isArray(srcValue)) {
      return srcValue;
    }
  }

  return undefined;
}

/**
 * A smarter more useful cloning algorithm based on "structured clone" that
 * passes through as-is items that cannot be cloned.
 */
// TODO: export this as part of js-utils (@-xun/js) shared with bfe
function safeDeepClone<T>(o: T): T {
  return cloneDeepWith(o, (value) => {
    const attempt = clone(value);

    if (attempt && typeof attempt === 'object' && Object.keys(attempt).length === 0) {
      return value;
    }

    return undefined;
  });
}

/**
 * Part of a hack to work around conventional-commits and its strange attempt at
 * making commits immutable.
 *
 * @internal
 */
function patchProxy() {
  //@ts-expect-error: part of a hack
  if (globalThis.previousProxy) {
    debug('global Proxy class was already patched in this runtime');
    return;
  }

  //@ts-expect-error: part of a hack
  const OldProxy = (globalThis.previousProxy = globalThis.Proxy);

  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  globalThis.Proxy = class WrappedProxy {
    constructor(...args: ConstructorParameters<typeof Proxy>) {
      const result = new OldProxy(...args);
      proxiedTargets.set(result, args[0]);
      return result;
    }

    static revocable(...args: Parameters<typeof Proxy.revocable>) {
      const result = OldProxy.revocable(...args);
      proxiedTargets.set(result.proxy, args[0]);
      return result;
    }
  } as typeof Proxy;

  debug('patched globalThis.Proxy');
}

/**
 * Part of a hack to get conventional-commits to accept our flags/paths for `git
 * log`.
 *
 * @internal
 */
function patchSpawnChild() {
  //@ts-expect-error: part of a hack
  if (globalThis.previousSpawnChild) {
    debug('global spawn function was already patched in this runtime');
    return;
  }

  //@ts-expect-error: part of a hack
  const spawn = (globalThis.previousSpawnChild = childProcess.spawn);
  childProcess.spawn = function wrappedSpawnChild(...args: Parameters<typeof spawn>) {
    if (Array.isArray(args[1])) {
      const spawnArgs = args[1] as string[];
      let alreadySawPathsMarker = false;

      // eslint-disable-next-line unicorn/prevent-abbreviations
      for (const [index, arg] of spawnArgs.entries()) {
        const [, id, value] = arg.match(specialArgumentRegExp) || [];

        if (id && value) {
          if (id === specialArgumentMarkerForFlags || alreadySawPathsMarker) {
            spawnArgs[index] = value;
          } else {
            alreadySawPathsMarker = true;
            spawnArgs[index] = '--';
            spawnArgs.splice(index + 1, 0, value);
          }
        }
      }
    }

    return spawn(...args);
  } as typeof spawn;

  debug('patched child_process.spawn');
}
