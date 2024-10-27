/**
 * @typedef {{settings?: import('mdast-util-to-markdown').Options, plugins?:
 * import('unified-engine/lib/configuration').PluggableList |
 * import('unified-engine/lib/configuration').PluginIdList}} Config
 */
const debug = (await import('debug')).default('xscripts:config:remark');

/**
 * {@xscripts/notExtraneous
 *   - remark-cli
 * }
 */

export const noUndefinedReferencesPlugin = [
  // {@xscripts/notExtraneous remark-lint-no-undefined-references}
  'remark-lint-no-undefined-references',
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
  plugins: [
    'gfm', // {@xscripts/notExtraneous remark-gfm}
    noUndefinedReferencesPlugin
  ]
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
    // {@xscripts/notExtraneous remark-ignore}
    'ignore',
    // {@xscripts/notExtraneous remark-frontmatter}
    'frontmatter',
    // {@xscripts/notExtraneous remark-gfm}
    'gfm',
    // {@xscripts/notExtraneous remark-lint}
    'lint',
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
    'remark-lint-list-item-style',
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
    // {@xscripts/notExtraneous remark-ignore}
    'remark-ignore',
    // {@xscripts/notExtraneous remark-frontmatter}
    'remark-frontmatter',
    // {@xscripts/notExtraneous remark-gfm}
    'remark-gfm',
    // {@xscripts/notExtraneous remark-tight-comments}
    'remark-tight-comments',
    // {@xscripts/notExtraneous remark-capitalize-headings}
    ['remark-capitalize-headings', { excludeHeadingLevel: { h1: true } }],
    // {@xscripts/notExtraneous remark-remove-unused-definitions}
    'remark-remove-unused-definitions',
    // {@xscripts/notExtraneous remark-remove-url-trailing-slash}
    'remark-remove-url-trailing-slash',
    ...(process.env.XSCRIPTS_FORMAT_RENUMBER_REFERENCES === 'true'
      ? // {@xscripts/notExtraneous remark-renumber-references}
        ['remark-renumber-references']
      : // {@xscripts/notExtraneous remark-reference-links}
        ['remark-reference-links']),
    // {@xscripts/notExtraneous remark-sort-definitions}
    'sort-definitions'
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
