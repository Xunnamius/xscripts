import { getRunContext } from '@projector-js/core/project';
import deepMerge from 'lodash.mergewith';
import semver from 'semver';

import { hardAssert, softAssert } from 'multiverse/@-xun/cli-utils/error';
import { interpolateTemplate, toSentenceCase } from 'multiverse/@-xun/cli-utils/util';
import { createDebugLogger } from 'multiverse/rejoinder';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { globalDebuggerNamespace } from 'universe/constant';
import { ErrorMessage } from 'universe/error';
import { __read_file_sync } from 'universe/util';

import type { Config as ConventionalChangelogConfigSpecOptions } from 'conventional-changelog-config-spec';
import type { Options as ConventionalChangelogCoreOptions } from 'conventional-changelog-core';
import type { Commit } from 'conventional-commits-parser';
import type { EmptyObject } from 'type-fest';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:conventional`
});

/**
 * The location of the handlebars templates in relation to this file's location
 * on disk.
 */
const templateDirectory = '../template/conventional-changelog';

/**
 * Characters that must never appear in a custom regular expression.
 */
const illegalRegExpCharacters = [
  '.',
  '*',
  '+',
  '?',
  '^',
  '$',
  '{',
  '}',
  '(',
  ')',
  '|',
  '[',
  ']',
  '\\'
];

/**
 * Matches a valid GitHub username with respect to the following:
 *  - Avoids matching scoped package names (e.g. @xunnamius/package).
 *  - Will match multiple usernames separated by slash (e.g. @user1/@user2).
 */
const usernameRegex = /\B@([\da-z](?:[\da-z]|-(?=[\da-z])){0,38})\b(?!\/(?!@))/gi;

/**
 * Used to normalize the aesthetic of revert changelog entries.
 */
const revertPrefixRegex = /^Revert\s+/;

/**
 * What seems to be the shape of a conventional changelog configuration file
 * with some custom additions. Note that this type is a best effort and may not
 * be perfectly accurate.
 */
export type ConventionalChangelogCliConfig = ConventionalChangelogConfigSpecOptions &
  ConventionalChangelogCoreOptions.Config.Object & {
    /**
     * This string is prepended to all generated `CHANGELOG.md` files.
     */
    changelogTopmatter: string;
    /**
     * Strings that will be removed from the end of each commit message when
     * they are encountered. These are the CI/CD commands recognized by
     * `@-xun/cicd-utils` and `@-xun/pipeline`.
     */
    xpipelineCommands: string[];
    /**
     * Conventional Changelog Core options.
     */
    // TODO: Last time I scanned its source, it seemed this key was required, so
    // TODO: it is included here for now.Verify that this key is still
    // TODO: necessary.
    conventionalChangelog: ConventionalChangelogCoreOptions.Config.Object;
  };

/**
 * The default text that headlines the "breaking changes" section in
 * `CHANGELOG.md`.
 */
export const noteTitleForBreakingChange = 'BREAKING CHANGES';

/**
 * The preamble prefixed to any generated `CHANGELOG.md` file.
 */
export const defaultChangelogTopmatter =
  `# Changelog\n\n` +
  `All notable changes to this project will be documented in this auto-generated\n` +
  `file. The format is based on [Conventional Commits](https://conventionalcommits.org);\n` +
  `this project adheres to [Semantic Versioning](https://semver.org).`;

/**
 * These are xpipeline commands that may appear at the end of commit subjects.
 * They should not be printed to the changelog.
 */
// TODO: import these from @-xun/pipeline instead
export const wellKnownXpipelineCommands = [
  '[skip ci]',
  '[ci skip]',
  '[skip cd]',
  '[cd skip]'
].map((cmd) => cmd.toLowerCase());

/**
 * The character(s) used to reference issues by number on GitHub.
 */
export const defaultIssuePrefixes = ['#'];

/**
 * These are the only conventional commit types supported by xscripts-based
 * pipelines and are therefore considered "well known".
 *
 * Commit types corresponding to entries with `{ hidden: false }` will appear in
 * the generated `CHANGELOG.md` file. Commit types with `{ hidden: true }` will
 * not appear in `CHANGELOG.md` _unless the commit is marked "BREAKING" in some
 * way_.
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
 * Also note that conventional-changelog-* have internal lists of "well-known
 * commit types" that this type will be merged on top of; the implication being:
 * not overwriting an internal type's configuration can lead to that type (feat,
 * fix, ci) being included even if it is not present in the below array.
 *
 * Valid commit types are alphanumeric and may contain an underscore (_) or dash
 * (-). Using characters other than these will lead to undefined behavior.
 */
export const wellKnownCommitTypes: ConventionalChangelogConfigSpecOptions.Type[] = [
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

/**
 * This function returns an "unconventional" conventional-changelog
 * configuration preset. See the documentation for details on the differences
 * between this and the official `conventional-changelog-conventionalcommits`
 * package.
 *
 * `configOverrides`, if an object or undefined, is recursively merged into a
 * partially initialized {@link ConventionalChangelogCliConfig} object
 * (overwriting same keys) using `lodash.mergeWith`.
 *
 * If `configOverrides` is a function, it will be passed said partially
 * initialized {@link ConventionalChangelogCliConfig} object and must return a
 * an object of the same type.
 */
export function moduleExport(
  configOverrides:
    | ((config: ConventionalChangelogCliConfig) => ConventionalChangelogCliConfig)
    | Partial<ConventionalChangelogCliConfig> = {}
) {
  // ? Later on we'll be keep'n reverter commits but discarding reverted commits
  const revertedCommitHashesSet = new Set<string>();

  const intermediateConfig: ConventionalChangelogCliConfig = {
    // * Custom configuration keys * \\
    changelogTopmatter: defaultChangelogTopmatter,
    xpipelineCommands: wellKnownXpipelineCommands,

    // * Core configuration keys * \\
    // ? conventionalChangelog and recommendedBumpOpts keys are redefined below
    conventionalChangelog: {},
    gitRawCommitsOpts: {},

    // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#options
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([^)]*)\))?!?: (.*)$/,
      breakingHeaderPattern: /^(\w*)(?:\(([^)]*)\))?!: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      mergePattern: /^Merge pull request #(\d+) from (.*)$/,
      mergeCorrespondence: ['id', 'source'],
      revertPattern: /^revert:?\s"?([\S\s]*?)"?\s*this reverts commit (\w*)\.?/i,
      revertCorrespondence: ['header', 'hash'],
      noteKeywords: ['BREAKING CHANGE', noteTitleForBreakingChange, 'BREAKING'],
      // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#warn
      // eslint-disable-next-line no-console
      warn: console.warn.bind(console),
      issuePrefixes: defaultIssuePrefixes
    },

    // ? See: https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#options
    writerOpts: {
      generateOn(commit) {
        const debug_ = debug.extend('writerOpts:generateOn');
        let decision = false;

        debug_(`saw version: ${commit.version!}`);

        if (commit.version) {
          const { context, package: pkg } = getRunContext();

          if (context === 'monorepo') {
            debug_('monorepo context detected');
            softAssert(pkg, ErrorMessage.CannotRunOutsideRoot());

            const {
              json: { name: pkgName }
            } = pkg;

            softAssert(pkgName, ErrorMessage.BadProjectNameInPackageJson());

            debug_(`monorepo package: ${pkgName}`);

            if (new RegExp(`^${pkgName}@.{5,}$`).test(commit.version)) {
              // ? Remove the package name from the version string
              commit.version = commit.version.split('@').at(-1)!;
              debug_(`using version: ${commit.version}`);
            }
          }

          decision = !!semver.valid(commit.version) && !semver.prerelease(commit.version);
        }

        debug_(`decision: ${decision ? 'NEW block' : 'same block'}`);
        return decision;
      },
      mainTemplate: defaultTemplates.template,
      // * headerPartial and commitPartial sub-keys are defined below
      footerPartial: defaultTemplates.footer,
      groupBy: 'type',
      commitsSort: ['scope', 'subject'],
      noteGroupsSort: 'title',
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
      // ? We'll handle ignoring reverts on our own
      ignoreReverted: false,
      transform(commit, context) {
        const debug_ = debug.extend('writerOpts:transform');
        debug_('pre-transform commit: %O', commit);

        // ? Scope should always be lowercase (or undefined)
        commit.scope = commit.scope?.toLowerCase();

        let discard = true as boolean;
        const issues: string[] = [];
        const typeKey = (commit.revert ? 'revert' : (commit.type ?? '')).toLowerCase();

        const typeEntry = finalConfig.types?.find(
          ({ type, scope }) => type === typeKey && (!scope || scope === commit.scope)
        );

        const commandStringSubjectMatch = commit.subject?.match(
          commandStringParserRegexp
        );
        const commandStringHeaderMatch = commit.header?.match(commandStringParserRegexp);

        // ? Delete xpipeline command suffixes from the subjects of commits
        if (commandStringSubjectMatch?.[2]) {
          const [, subject, commands] = commandStringSubjectMatch;
          debug_(
            'updated commit subject; removed xpipeline command string: %O',
            commands
          );

          commit.subject = subject;
        }

        // ? Delete xpipeline command suffixes from the headers of commits
        if (commandStringHeaderMatch?.[2]) {
          const [, header, commands] = commandStringHeaderMatch;
          debug_('updated commit header; removed xpipeline command string: %O', commands);

          commit.header = header;
        }

        // ? Ignore any commits that have been reverted...
        if (commit.hash) {
          // ? ... but keep reverter commits...
          if (revertedCommitHashesSet.has(commit.hash)) {
            debug_('decision: commit discarded (reverted)');
            return false;
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
              return false;
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

            const paragraphs = note.text
              .trim()
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

          return false;
        } else debug_('decision: commit NOT discarded');

        if (typeEntry) commit.type = typeEntry.section;
        if (commit.scope === '*') commit.scope = '';
        if (typeof commit.hash === 'string') commit.shortHash = commit.hash.slice(0, 7);

        // ? Badly crafted reverts are all header and no subject
        if (typeKey === 'revert' && !commit.subject) {
          commit.subject = commit.header?.replace(revertPrefixRegex, '');
        }

        if (typeof commit.subject === 'string') {
          const { host, owner, repository } = context;

          if (host && owner && repository) {
            if (intermediateConfig.issuePrefixes && intermediateConfig.issueUrlFormat) {
              const { issueUrlFormat } = intermediateConfig;
              // ? Replace issue refs with URIs
              const issueRegex = new RegExp(
                `(${intermediateConfig.issuePrefixes.join('|')})([0-9]+)`,
                'g'
              );

              commit.subject = commit.subject.replace(
                issueRegex,
                (_, prefix: string, issue: string) => {
                  const issueStr = `${prefix}${issue}`;
                  const url = interpolateTemplate(issueUrlFormat, {
                    host,
                    owner,
                    repository,
                    id: issue,
                    prefix: prefix
                  });

                  issues.push(issueStr);
                  return `[${issueStr}](${url})`;
                }
              );
            }

            if (intermediateConfig.userUrlFormat) {
              const { userUrlFormat } = intermediateConfig;
              // ? Replace user refs with URIs
              commit.subject = commit.subject.replaceAll(
                // * https://github.com/shinnn/github-username-regex
                usernameRegex,
                (_, user: string) => {
                  const usernameUrl = interpolateTemplate(userUrlFormat, {
                    host,
                    owner,
                    repository,
                    user
                  });

                  return `[@${user}](${usernameUrl})`;
                }
              );
            }
          }

          // ? Make scope-less commit subjects sentence case
          if (!commit.scope) commit.subject = toSentenceCase(commit.subject);

          // ? Italicize reverts
          if (typeKey === 'revert') commit.subject = `*${commit.subject}*`;
        }

        // ? Remove references that already appear in the subject
        commit.references = commit.references.filter(
          ({ prefix, issue }) => !issues.includes(`${prefix}${issue}`)
        );

        debug_('transformed commit: %O', commit);
        return commit;
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
    issuePrefixes: defaultIssuePrefixes
  };

  // TODO: is this still necessary?
  intermediateConfig.conventionalChangelog = {
    parserOpts: intermediateConfig.parserOpts,
    writerOpts: intermediateConfig.writerOpts
  };

  intermediateConfig.recommendedBumpOpts = {
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
      : deepMerge(intermediateConfig, configOverrides, mergeCustomizer);

  const commitSectionOrder = Array.from(
    new Set(finalConfig.types?.map(({ section }) => section) ?? [])
  );

  const nonHiddenKnownTypesPartialRegexp = finalConfig.types
    ?.filter(({ hidden }) => !hidden)
    .map(({ type }) => type)
    .join('|');

  // TODO: should probably just reuse breakingHeaderPattern, no?
  const relevantHeaderRegexp = new RegExp(
    `(^(${nonHiddenKnownTypesPartialRegexp ?? 'feat|fix'})\\W)|(^[^!(:]*(\\([^)]*\\))?!:)`,
    'i'
  );

  const commandStringPartialRegexp = finalConfig.xpipelineCommands
    // ? Escape all RegExp characters (taken from MDN)
    .map((cmd) => cmd.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`))
    .join(String.raw`\s*|\s*`);

  const commandStringParserRegexp = new RegExp(
    `^(.*?)\\s*?((?:${commandStringPartialRegexp})+)$`,
    'i'
  );

  debug('commitSectionOrder: %O', commitSectionOrder);
  debug('relevantHeaderRegexp: %O', relevantHeaderRegexp);
  debug('commandStringParserRegex: %O', commandStringParserRegexp);

  if (finalConfig.issuePrefixes) {
    debug('validating finalConfig.issuePrefixes');
    hardAssert(
      illegalRegExpCharacters.every(
        (char) => !finalConfig.issuePrefixes?.join('').includes(char)
      ),
      ErrorMessage.IssuePrefixContainsIllegalCharacters()
    );
  }

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
   * `test(system)!: hello world` but with no `BREAKING CHANGE` in body.
   */
  function addBangNotes({ header, notes }: Commit) {
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
    return !relevantHeaderRegexp.test(header);
  }
}

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
'use strict';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug-extended');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:conventional'
});*/

const { moduleExport } = require('@-xun/scripts/assets/config/conventional.config.js');
module.exports = moduleExport({
  // * Your customizations here
});

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});

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
