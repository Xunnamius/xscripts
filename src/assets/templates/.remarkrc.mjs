// @ts-check
import assert from 'node:assert';

import config from '../../../.remarkrc.mjs';

// TODO: use rejoinder instead
const debug = (await import('debug')).default('xscripts:config:remark:asset-templates');

/**
 * * The goal of this file is to disable remark-validate-links for template
 * * files to prevent false positives during linting.
 */

/**
 * @type {import('@-xun/scripts/assets/.remarkrc.mjs').RemarkConfig}
 */
const subConfig = { ...config };

assert(
  Array.isArray(subConfig.plugins),
  `.remarkrc.mjs (at project root) config's exported "plugins" property must be an array`
);

subConfig.plugins = subConfig.plugins.filter(
  (plugin) => typeof plugin !== 'string' || plugin !== 'remark-validate-links'
);

export default subConfig;

debug('augmented project root .remarkrc.mjs default config export: %O', subConfig);
