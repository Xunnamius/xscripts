import escapeStringRegExp from 'escape-string-regexp~4';

import {
  analyzeProjectStructure,
  type Package,
  type ProjectMetadata
} from 'multiverse+project-utils:analyze.ts';

import { ProjectError } from 'multiverse+project-utils:error.ts';
import { createDebugLogger } from 'multiverse+rejoinder';

import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';

import type { Options as MdastUtilToMarkdownOptions } from 'mdast-util-to-markdown' with { 'resolution-mode': 'import' };
import type { Options as UnifiedEngineOptions } from 'unified-engine' with { 'resolution-mode': 'import' };

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:remark`
});

export type PluggableListSupportingSpecifiers = Extract<
  RemarkConfig['plugins'],
  unknown[]
>[number];

export type RemarkConfig = {
  settings?: MdastUtilToMarkdownOptions;
  plugins?: UnifiedEngineOptions['plugins'];
};

/**
 * We track these so that we may prevent mdast-util-markdown from mangling them
 * with an escape character, which sometimes does not render properly on GitHub
 * or with GFM-compatible tooling.
 *
 * @see https://github.com/orgs/community/discussions/16925
 */
export const wellKnownGithubAlerts = [
  '[!NOTE]',
  '[!TIP]',
  '[!IMPORTANT]',
  '[!WARNING]',
  '[!CAUTION]'
] as const;

/**
 * An array of NODE_ENV values recognized by this configuration file.
 */
export const wellKnownNodeEnvValues = ['lint', 'lint-no-undef', 'format'] as const;

export const noUndefinedReferencesPlugin: PluggableListSupportingSpecifiers = [
  // {@xscripts/notExtraneous remark-lint-no-undefined-references}
  'remark-lint-no-undefined-references',
  { allow: [/![A-Z]+/] }
] as const;

/**
 * Remark configuration loaded when `NODE_ENV === 'lint-no-undef'`. The goal
 * here is to check for undefined references. This would normally be something
 * to do ad hoc on the CLI, but we need to pass remark a regular expression to
 * do this optimally, which means we need to load the configuration via JS.
 */
function lintConfigNoUndef(): RemarkConfig {
  return {
    plugins: [
      'gfm', // {@xscripts/notExtraneous remark-gfm}
      noUndefinedReferencesPlugin
    ]
  };
}

/**
 * Remark configuration loaded when `NODE_ENV === 'lint'`. The goal here is to
 * check for things that will not be corrected by prettier or remark during a
 * formatting pass (see below).
 */
function lintConfig(allowWarningComments: boolean): RemarkConfig {
  const config: RemarkConfig = {
    plugins: [
      // {@xscripts/notExtraneous remark-ignore}
      'remark-ignore',
      // {@xscripts/notExtraneous remark-frontmatter}
      'remark-frontmatter',
      // {@xscripts/notExtraneous remark-gfm}
      'remark-gfm',
      // {@xscripts/notExtraneous remark-lint}
      'remark-lint',
      // {@xscripts/notExtraneous remark-lint-definition-case}
      'remark-lint-definition-case',
      // {@xscripts/notExtraneous remark-lint-fenced-code-flag}
      'remark-lint-fenced-code-flag',
      // {@xscripts/notExtraneous remark-lint-fenced-code-flag-case}
      'remark-lint-fenced-code-flag-case',
      // {@xscripts/notExtraneous remark-lint-file-extension}
      'remark-lint-file-extension',
      // {@xscripts/notExtraneous remark-lint-first-heading-level}
      'remark-lint-first-heading-level',
      // {@xscripts/notExtraneous remark-lint-heading-increment}
      'remark-lint-heading-increment',
      // {@xscripts/notExtraneous remark-lint-heading-whitespace}
      'remark-lint-heading-whitespace',
      // {@xscripts/notExtraneous remark-lint-list-item-style}
      ['remark-lint-list-item-style', { checkPunctuation: false }],
      // {@xscripts/notExtraneous remark-lint-no-duplicate-defined-urls}
      'remark-lint-no-duplicate-defined-urls',
      // {@xscripts/notExtraneous remark-lint-no-duplicate-headings-in-section}
      'remark-lint-no-duplicate-headings-in-section',
      // {@xscripts/notExtraneous remark-lint-no-empty-sections}
      'remark-lint-no-empty-sections',
      // {@xscripts/notExtraneous remark-lint-no-empty-url}
      'remark-lint-no-empty-url',
      // {@xscripts/notExtraneous remark-lint-heading-word-length}
      'remark-lint-heading-word-length',
      // {@xscripts/notExtraneous remark-lint-no-heading-like-paragraph}
      'remark-lint-no-heading-like-paragraph',
      // {@xscripts/notExtraneous remark-lint-no-heading-punctuation}
      'remark-lint-no-heading-punctuation',
      // {@xscripts/notExtraneous remark-lint-no-literal-urls}
      'remark-lint-no-literal-urls',
      // {@xscripts/notExtraneous remark-lint-no-multiple-toplevel-headings}
      'remark-lint-no-multiple-toplevel-headings',
      // {@xscripts/notExtraneous remark-lint-no-reference-like-url}
      'remark-lint-no-reference-like-url',
      // {@xscripts/notExtraneous remark-lint-no-shell-dollars}
      'remark-lint-no-shell-dollars',
      // {@xscripts/notExtraneous remark-lint-no-shortcut-reference-image}
      'remark-lint-no-shortcut-reference-image',
      // {@xscripts/notExtraneous remark-lint-no-shortcut-reference-link}
      'remark-lint-no-shortcut-reference-link',
      // {@xscripts/notExtraneous remark-lint-no-tabs}
      'remark-lint-no-tabs',
      noUndefinedReferencesPlugin,
      // {@xscripts/notExtraneous remark-lint-ordered-list-marker-value}
      'remark-lint-ordered-list-marker-value',
      // {@xscripts/notExtraneous remark-lint-strikethrough-marker}
      ['remark-lint-strikethrough-marker', '~~'],
      // {@xscripts/notExtraneous remark-lint-unordered-list-marker-style}
      // ? Prettier will reformat list markers UNLESS they precede checkboxes
      ['remark-lint-unordered-list-marker-style', '-'],
      // {@xscripts/notExtraneous remark-lint-final-newline}
      'remark-lint-final-newline',
      // {@xscripts/notExtraneous remark-lint-hard-break-spaces}
      'remark-lint-hard-break-spaces',
      // {@xscripts/notExtraneous remark-lint-no-blockquote-without-marker}
      'remark-lint-no-blockquote-without-marker',
      // {@xscripts/notExtraneous remark-lint-no-duplicate-definitions}
      'remark-lint-no-duplicate-definitions',
      // {@xscripts/notExtraneous remark-lint-no-heading-content-indent}
      'remark-lint-no-heading-content-indent',
      // {@xscripts/notExtraneous remark-lint-no-unused-definitions}
      // TODO: this package seems broken, perhaps submit a bug fix?
      //'remark-lint-no-unused-definitions',
      // {@xscripts/notExtraneous remark-lint-ordered-list-marker-style}
      'remark-lint-ordered-list-marker-style',
      // {@xscripts/notExtraneous remark-validate-links}
      'remark-validate-links'
    ]
  };

  if (allowWarningComments) {
    // TODO: add no-warning-comments to unified-utils and add pub to dependencies
    //config.plugins.push('no-warning-comments');
  }

  return config;
}

/**
 * Remark configuration loaded when `NODE_ENV === 'format'`. The goal here is to
 * correct things that will not be taken care of by prettier.
 */
function formatConfig(
  shouldRenumberReferences: boolean,
  { rootPackage, subRootPackages }: ProjectMetadata
): RemarkConfig {
  return {
    plugins: [
      // {@xscripts/notExtraneous remark-ignore}
      'remark-ignore',
      // {@xscripts/notExtraneous remark-frontmatter}
      'remark-frontmatter',
      // {@xscripts/notExtraneous remark-gfm}
      'remark-gfm',
      // {@xscripts/notExtraneous remark-tight-comments}
      'remark-tight-comments',
      // {@xscripts/notExtraneous remark-capitalize-headings}
      [
        'remark-capitalize-headings',
        {
          excludeHeadingLevel: { h1: true },
          // ? Do not capitalize any of our package names
          excludeHeadingText: ((subRootPackages?.all || []) as Package[])
            .concat(rootPackage)
            .map(({ json: { name } }) => (name ? escapeStringRegExp(name) : undefined))
            .filter(Boolean)
        }
      ],
      // {@xscripts/notExtraneous remark-remove-unused-definitions}
      'remark-remove-unused-definitions',
      // {@xscripts/notExtraneous remark-remove-url-trailing-slash}
      'remark-remove-url-trailing-slash',
      ...(shouldRenumberReferences
        ? // {@xscripts/notExtraneous remark-renumber-references}
          ['remark-renumber-references']
        : // {@xscripts/notExtraneous remark-reference-links}
          ['remark-reference-links']),
      // {@xscripts/notExtraneous remark-sort-definitions}
      'sort-definitions'
    ]
  };
}

/**
 * @see {@link assertEnvironment}
 */
export function moduleExport({
  mode,
  shouldRenumberReferences,
  allowWarningComments,
  projectMetadata
}: {
  mode: 'lint' | 'lint-no-undef' | 'format';
  shouldRenumberReferences: boolean;
  allowWarningComments: boolean;
  projectMetadata: ProjectMetadata;
}): RemarkConfig {
  debug('mode: %O', mode);
  debug('shouldRenumberReferences: %O', shouldRenumberReferences);
  debug('allowWarningComments: %O', allowWarningComments);
  debug('projectMetadata: %O', projectMetadata);

  if (mode === 'lint-no-undef') {
    return lintConfigNoUndef();
  }

  const { settings, plugins } =
    mode === 'lint'
      ? lintConfig(allowWarningComments)
      : formatConfig(shouldRenumberReferences, projectMetadata);

  return {
    settings: {
      bullet: '-',
      emphasis: '_',
      fences: true,
      listItemIndent: 'one',
      rule: '-',
      strong: '*',
      tightDefinitions: true,

      // ? Prevent mdast-util-markdown from mangling GFM alerts with an
      // ? unneeded escape character "\" which causes problems on GitHub
      handlers: {
        text: (node, _, state, info) => {
          const ancestry = state.stack.slice(-3).join('<-');
          const value = node.value;

          return ancestry === 'blockquote<-paragraph<-phrasing' &&
            wellKnownGithubAlerts.includes(value)
            ? (value as string)
            : state.safe(value, info);
        }
      },

      ...settings
    },
    plugins
  };
}

/**
 * @see {@link moduleExport}
 */
export async function assertEnvironment(): Promise<Parameters<typeof moduleExport>[0]> {
  const mode = (process.env.NODE_ENV ||
    '(undefined)') as (typeof wellKnownNodeEnvValues)[number];

  const shouldRenumberReferences =
    process.env.XSCRIPTS_FORMAT_RENUMBER_REFERENCES === 'true';

  const allowWarningComments =
    process.env.XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS === 'true';

  if (!wellKnownNodeEnvValues.includes(mode)) {
    throw new ProjectError(
      ErrorMessage.ConfigAssetEnvironmentValidationFailed(
        'remark',
        mode,
        wellKnownNodeEnvValues
      )
    );
  }

  const projectMetadata = await analyzeProjectStructure({ useCached: true });

  return { mode, shouldRenumberReferences, allowWarningComments, projectMetadata };
}

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => /*js*/ `
// @ts-check

import { deepMergeConfig } from '@-xun/scripts/assets';

import {
  moduleExport,
  assertEnvironment
} from '@-xun/scripts/assets/${asset}';

// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:remarkrc' });*/

const config = deepMergeConfig(
  moduleExport(await assertEnvironment()),
  /**
   * @type {import('@-xun/scripts/assets/${asset}').RemarkConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport
  }
);

export default config;

/*debug('exported config: %O', config);*/
`
    }
  ];
});
