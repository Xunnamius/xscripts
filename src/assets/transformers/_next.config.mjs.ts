import { nextjsConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { AssetPreset, makeTransformer } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export function moduleExport() {
  return {
    // TODO
  };
}

export const { transformer } = makeTransformer(function (context) {
  const { asset, toProjectAbsolutePath, assetPreset: targetAssetsPreset } = context;

  if (targetAssetsPreset && targetAssetsPreset !== AssetPreset.Nextjs) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(nextjsConfigProjectBase),
        generate: () => /*js*/ `
// @ts-check
'use strict';

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/${asset}';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:next' });*/

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
