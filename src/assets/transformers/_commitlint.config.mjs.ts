import { commitlintConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { wellKnownCommitTypes } from 'universe:assets/transformers/_conventional.config.cjs.ts';
import { makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

// {@xscripts/notExtraneous @commitlint/cli @commitlint/config-conventional}

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

export function moduleExport() {
  return {
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
  } as const;
}

export const { transformer } = makeTransformer(function (context) {
  const { asset, toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(commitlintConfigProjectBase),
        generate: () => /*js*/ `
// @ts-check
'use strict';

import { deepMergeConfig } = from '@-xun/scripts/assets';
import { moduleExport } = from '@-xun/scripts/assets/${asset}';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } = from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:commitlint' });*/

const config = deepMergeConfig(moduleExport(), {
  // Any custom configs here will be deep merged with moduleExport's result
});

export default config;

/*debug('exported config: %O', config);*/
`
      }
    ];
  });
});
