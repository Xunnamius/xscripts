import { wellKnownCommitTypes } from 'universe assets/config/_conventional.config.js.ts';

import {
  assertIsExpectedTransformerContext,
  makeTransformer
} from 'universe assets/index.ts';

import { globalDebuggerNamespace } from 'universe constant.ts';

import type { EmptyObject } from 'type-fest';

/**
 * @see https://github.com/conventional-changelog/commitlint/blob/master/docs/reference/rules-configuration.md
 */
export enum ErrorLevel {
  Disabled = 0,
  Warn = 1,
  Error = 2
}

/**
 * @see https://github.com/conventional-changelog/commitlint/blob/master/docs/reference/rules-configuration.md
 */
export enum Applicable {
  FailIfEncountered = 'always',
  FailIfNotEncountered = 'never'
}

export const moduleExport = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-case': [ErrorLevel.Warn, Applicable.FailIfEncountered, 'sentence-case'],
    'body-full-stop': [ErrorLevel.Warn, Applicable.FailIfEncountered],
    'header-trim': [ErrorLevel.Warn, Applicable.FailIfEncountered],
    'body-leading-blank': [ErrorLevel.Error, Applicable.FailIfEncountered],
    'footer-leading-blank': [ErrorLevel.Error, Applicable.FailIfEncountered],
    'type-enum': [
      ErrorLevel.Error,
      Applicable.FailIfEncountered,
      wellKnownCommitTypes.map(({ type }) => type)
    ]
  }
};

export type Context = EmptyObject;

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
  namespace: '${globalDebuggerNamespace}:config:commitlint'
});*/

const { moduleExport } = require('@-xun/scripts/assets/config/${name}');
module.exports = moduleExport;

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});
