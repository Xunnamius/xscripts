import { vercelConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import {
  AssetPreset,
  generateRootOnlyAssets,
  makeTransformer
} from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset } = context;

  if (assetPreset && assetPreset !== AssetPreset.Nextjs) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        // TODO:
        path: toProjectAbsolutePath(vercelConfigProjectBase),
        generate: () => JSON.stringify({}, undefined, 2)
      }
    ];
  });
});
