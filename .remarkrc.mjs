/**
 * @typedef {{settings?: import('mdast-util-to-markdown').Options, plugins?:
 * import('unified-engine/lib/configuration').PluggableList |
 * import('unified-engine/lib/configuration').PluginIdList}} Config
 */
const debug = (await import('debug')).default('xscripts:config:remark');

export const noUndefinedReferencesPlugin = [
  'lint-no-undefined-references',
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
const lintNoUndefConfig = { plugins: ['gfm', noUndefinedReferencesPlugin] };

/**
 * Remark configuration loaded when `NODE_ENV === 'lint'`. The goal here is to
 * check for things that will not be corrected by prettier or remark during a
 * formatting pass (see below).
 *
 * @type {Config}
 */
const lintConfig = {
  plugins: [
    'ignore',
    'frontmatter',
    'gfm',
    'lint',
    'lint-definition-case',
    'lint-fenced-code-flag',
    'lint-fenced-code-flag-case',
    'lint-file-extension',
    'lint-first-heading-level',
    'lint-heading-increment',
    'lint-heading-whitespace',
    'lint-list-item-style',
    'lint-no-duplicate-defined-urls',
    'lint-no-duplicate-headings-in-section',
    'lint-no-empty-sections',
    'lint-no-empty-url',
    'lint-heading-word-length',
    'lint-no-heading-like-paragraph',
    'lint-no-heading-punctuation',
    'lint-no-inline-padding',
    'lint-no-literal-urls',
    'lint-no-multiple-toplevel-headings',
    'lint-no-reference-like-url',
    'lint-no-shell-dollars',
    'lint-no-shortcut-reference-image',
    'lint-no-shortcut-reference-link',
    'lint-no-tabs',
    noUndefinedReferencesPlugin,
    'lint-ordered-list-marker-value',
    ['lint-strikethrough-marker', '~~'],
    // ? Prettier will reformat list markers UNLESS they precede checkboxes
    ['lint-unordered-list-marker-style', '-'],
    'validate-links'
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
    'ignore',
    'frontmatter',
    'gfm',
    'tight-comments',
    ['capitalize-headings', { excludeHeadingLevel: { h1: true } }],
    'remove-unused-definitions',
    'remove-url-trailing-slash',
    ...(process.env.XSCRIPTS_FORMAT_RENUMBER_REFERENCES === 'true'
      ? ['renumber-references']
      : ['remark-reference-links']),
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
