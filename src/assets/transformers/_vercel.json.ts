import { vercelConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { AssetPreset, makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset: targetAssetsPreset } = context;

  if (targetAssetsPreset && targetAssetsPreset !== AssetPreset.Nextjs) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        // TODO:
        path: toProjectAbsolutePath(vercelConfigProjectBase),
        generate: () => JSON.stringify({})
      }
    ];
  });
});
