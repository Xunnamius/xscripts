/**
 * @typedef {{settings?: import('mdast-util-to-markdown').Options, plugins?:
 * import('unified-engine/lib/configuration').PluggableList |
 * import('unified-engine/lib/configuration').PluginIdList}} Config
 */

import capitalizeHeadings from 'remark-capitalize-headings';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkIgnore from 'remark-ignore';
import remarkLint from 'remark-lint';
import remarkLintDefinitionCase from 'remark-lint-definition-case';
import remarkLintFencedCodeFlag from 'remark-lint-fenced-code-flag';
import remarkLintFencedCodeFlagCase from 'remark-lint-fenced-code-flag-case';
import remarkLintFileExtension from 'remark-lint-file-extension';
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level';
import remarkLintHeadingIncrement from 'remark-lint-heading-increment';
import remarkLintHeadingWhitespace from 'remark-lint-heading-whitespace';
import remarkLintHeadingWordLength from 'remark-lint-heading-word-length';
import remarkLintListItemStyle from 'remark-lint-list-item-style';
import remarkLintNoDuplicateDefinedUrls from 'remark-lint-no-duplicate-defined-urls';
import remarkLintNoDuplicateHeadingsInSection from 'remark-lint-no-duplicate-headings-in-section';
import remarkLintNoEmptySections from 'remark-lint-no-empty-sections';
import remarkLintNoEmptyUrl from 'remark-lint-no-empty-url';
import remarkLintNoHeadingLikeParagraph from 'remark-lint-no-heading-like-paragraph';
import remarkLintNoHeadingPunctuation from 'remark-lint-no-heading-punctuation';
import remarkLintNoInlinePadding from 'remark-lint-no-inline-padding';
import remarkLintNoLiteralUrls from 'remark-lint-no-literal-urls';
import remarkLintNoMultipleToplevelHeadings from 'remark-lint-no-multiple-toplevel-headings';
import remarkLintNoReferenceLikeUrl from 'remark-lint-no-reference-like-url';
import remarkLintNoShellDollars from 'remark-lint-no-shell-dollars';
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image';
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link';
import remarkLintNoTabs from 'remark-lint-no-tabs';
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references';
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value';
import remarkLintStrikethroughMarker from 'remark-lint-strikethrough-marker';
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style';
import remarkReferenceLinks from 'remark-reference-links';
import removeUnusedDefinitions from 'remark-remove-unused-definitions';
import removeUrlTrailingSlash from 'remark-remove-url-trailing-slash';
import renumberReferences from 'remark-renumber-references';
import sortDefinitions from 'remark-sort-definitions';
import tightComments from 'remark-tight-comments';
import remarkValidateLinks from 'remark-validate-links';

const debug = (await import('debug')).default('xscripts:config:remark');

export const remarkLintNoUndefinedReferences_preconfigured = [
  remarkLintNoUndefinedReferences,
  { allow: [/![A-Z]+/] }
];

/**
 * Remark configuration loaded when `NODE_ENV === 'lint-no-undef'`. The goal
 * here is to check for undefined references. This would normally be something
 * to do ad hoc on the CLI, but we need to pass remark a regular expression to
 * do this optimally, which means we need to load the configuration via JS.
 *
 * @type {Config}
 */
const lintNoUndefConfig = {
  plugins: [remarkGfm, remarkLintNoUndefinedReferences_preconfigured]
};

/**
 * Remark configuration loaded when `NODE_ENV === 'lint'`. The goal here is to
 * check for things that will not be corrected by prettier or remark during a
 * formatting pass (see below).
 *
 * @type {Config}
 */
const lintConfig = {
  plugins: [
    remarkIgnore,
    remarkFrontmatter,
    remarkGfm,
    remarkLint,
    remarkLintDefinitionCase,
    remarkLintFencedCodeFlag,
    remarkLintFencedCodeFlagCase,
    remarkLintFileExtension,
    remarkLintFirstHeadingLevel,
    remarkLintHeadingIncrement,
    remarkLintHeadingWhitespace,
    remarkLintListItemStyle,
    remarkLintNoDuplicateDefinedUrls,
    remarkLintNoDuplicateHeadingsInSection,
    remarkLintNoEmptySections,
    remarkLintNoEmptyUrl,
    remarkLintHeadingWordLength,
    remarkLintNoHeadingLikeParagraph,
    remarkLintNoHeadingPunctuation,
    remarkLintNoInlinePadding,
    remarkLintNoLiteralUrls,
    remarkLintNoMultipleToplevelHeadings,
    remarkLintNoReferenceLikeUrl,
    remarkLintNoShellDollars,
    remarkLintNoShortcutReferenceImage,
    remarkLintNoShortcutReferenceLink,
    remarkLintNoTabs,
    remarkLintNoUndefinedReferences_preconfigured,
    remarkLintOrderedListMarkerValue,
    [remarkLintStrikethroughMarker, '~~'],
    // ? Prettier will reformat list markers UNLESS they precede checkboxes
    [remarkLintUnorderedListMarkerStyle, '-'],
    remarkValidateLinks
  ]
};

if (process.env.XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS !== 'true') {
  // TODO: add no-warning-comments to unified-utils and add pub to dependencies
  //lintConfig.plugins.push('no-warning-comments');
}

/**
 * Remark configuration loaded when `NODE_ENV === 'format'`. The goal here is to
 * correct things that will not be taken care of by prettier.
 *
 * @type {Config}
 */
const formatConfig = {
  plugins: [
    remarkIgnore,
    remarkFrontmatter,
    remarkGfm,
    tightComments,
    [capitalizeHeadings, { excludeHeadingLevel: { h1: true } }],
    removeUnusedDefinitions,
    removeUrlTrailingSlash,
    ...(process.env.XSCRIPTS_FORMAT_RENUMBER_REFERENCES === 'true'
      ? [renumberReferences]
      : [remarkReferenceLinks]),
    sortDefinitions
  ]
};

debug('saw process.env.NODE_ENV: %O', process.env.NODE_ENV);

if (!['lint', 'lint-no-undef', 'format'].includes(process.env.NODE_ENV)) {
  throw new Error(
    'remark expects NODE_ENV to be one of either: lint, lint-no-undef, format'
  );
}

/**
 * @type {Config}
 */
const config =
  process.env.NODE_ENV === 'lint-no-undef'
    ? lintNoUndefConfig
    : {
        settings: {
          bullet: '-',
          emphasis: '_',
          fences: true,
          listItemIndent: 'one',
          rule: '-',
          strong: '*',
          tightDefinitions: true,
          ...(process.env.NODE_ENV === 'lint'
            ? lintConfig.settings
            : formatConfig.settings)
        },
        plugins: [
          ...(process.env.NODE_ENV === 'lint' ? lintConfig.plugins : formatConfig.plugins)
        ]
      };

debug('lintConfig: %O', lintConfig);
debug('lintNoUndefConfig: %O', lintNoUndefConfig);
debug('formatConfig: %O', formatConfig);
debug('export config: %O', config);

export default config;
