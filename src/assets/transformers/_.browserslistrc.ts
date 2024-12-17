import { browserslistrcConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { AssetPreset, makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset: targetAssetsPreset } = context;

  // * Do not generate any files when using the "wrong" preset
  if (
    targetAssetsPreset &&
    [AssetPreset.LibWeb, AssetPreset.React, AssetPreset.Nextjs].includes(
      targetAssetsPreset
    )
  ) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(browserslistrcConfigProjectBase),
        generate: () => `
[production]
last 2 versions
>0.2%
not dead

[development]
last 2 versions
>0.2%
not dead

[test]
current node
`
      }
    ];
  });
});
