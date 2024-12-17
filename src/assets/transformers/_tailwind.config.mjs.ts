import { tailwindConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { makeTransformer, reactAssetPresets } from 'universe:assets.ts';
import { globalDebuggerNamespace } from 'universe:constant.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export function moduleExport() {
  return {
    // TODO
  };
}

export const { transformer } = makeTransformer(function (context) {
  const { asset, toProjectAbsolutePath, assetPreset: targetAssetsPreset } = context;

  if (!reactAssetPresets.includes(targetAssetsPreset)) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(tailwindConfigProjectBase),
        generate: () => /*js*/ `
// @ts-check
'use strict';

import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/${asset}';
// TODO: publish latest rejoinder package first, then update configs to use it
//import { createDebugLogger } from 'rejoinder';

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:tailwind' });*/

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
