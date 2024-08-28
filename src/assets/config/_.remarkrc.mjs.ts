import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { globalDebuggerNamespace } from 'universe/constant';

import type { Options as MdastUtilToMarkdownOptions } from 'mdast-util-to-markdown';
import type { EmptyObject } from 'type-fest';
import type { Options as UnifiedEngineOptions } from 'unified-engine' with { 'resolution-mode': 'import' };

export type RemarkConfig = {
  settings?: MdastUtilToMarkdownOptions;
  plugins?: UnifiedEngineOptions['plugins'];
};

/**
 * Remark configuration loaded when `NODE_ENV === 'lint'`. The goal here is to
 * check for things that will not be corrected by prettier or remark during a
 * formatting pass (see below).
 */
function lintConfig(): RemarkConfig {
  return {
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
      'lint-no-undefined-references',
      'lint-ordered-list-marker-value',
      ['lint-strikethrough-marker', '~~'],
      // ? Prettier will reformat list markers UNLESS they precede checkboxes
      ['lint-unordered-list-marker-style', '-'],
      'validate-links'
    ]
  };
}

/**
 * Remark configuration loaded when `NODE_ENV === 'format'`. The goal here is to
 * correct things that will not be taken care of by prettier.
 */
function formatConfig(shouldRenumberReferences: boolean): RemarkConfig {
  return {
    plugins: [
      'ignore',
      'frontmatter',
      'gfm',
      'tight-comments',
      ['capitalize-headings', { excludeHeadingLevel: { h1: true } }],
      'remove-unused-definitions',
      'remove-url-trailing-slash',
      ...(shouldRenumberReferences
        ? ['renumber-references']
        : ['remark-reference-links']),
      'sort-definitions'
    ]
  };
}

export function moduleExport(
  mode: 'lint' | 'format',
  shouldRenumberReferences: boolean
): RemarkConfig {
  const { settings, plugins } =
    mode === 'lint' ? lintConfig() : formatConfig(shouldRenumberReferences);

  return {
    settings: {
      bullet: '-',
      emphasis: '_',
      fences: true,
      listItemIndent: 'one',
      rule: '-',
      strong: '*',
      tightDefinitions: true,
      ...settings
    },
    plugins
  };
}

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check

// TODO: publish latest rejoinder package first, then update configs to use it
/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:remarkrc'
});*/

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/config/.remarkrc.mjs';

const mode = process.env.NODE_ENV;
const shouldRenumberReferences =
  process.env.SHOULD_RENUMBER_REFERENCES === 'true';

if (!['lint', 'format'].includes(mode)) {
  throw new Error('remark expects NODE_ENV to be one of either: lint, format');
}

const config = deepMergeConfig(moduleExport(mode, shouldRenumberReferences), {
  // Any custom configs here will be deep merged with moduleExport
});

export default config;

/*debug('lintConfig: %O', lintConfig);
debug('formatConfig: %O', formatConfig);
debug('exported config: %O', config);*/
`.trimStart()
    };
  }
});
