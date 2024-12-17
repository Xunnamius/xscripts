/* eslint-disable unicorn/filename-case */
import {
  markdownArchitectureProjectBase,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { compileTemplate, libAssetPresets, makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, assetPreset: targetAssetsPreset } = context;

  // * Do not generate any files when using the "wrong" preset
  if (!libAssetPresets.includes(targetAssetsPreset)) {
    return [];
  }

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(markdownArchitectureProjectBase),
        generate: () => compileTemplate('ARCHITECTURE.md' as RelativePath, context)
      }
    ];
  });
});
