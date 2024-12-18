import { browserslistrcConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import {
  AssetPreset,
  generateRootOnlyAssets,
  makeTransformer
} from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset } = context;

  // * Do not generate any files when using the "wrong" preset
  if (
    assetPreset &&
    [AssetPreset.LibWeb, AssetPreset.React, AssetPreset.Nextjs].includes(assetPreset)
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
