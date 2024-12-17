/* eslint-disable unicorn/filename-case */

import {
  markdownLicensePackageBase,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import { compileTemplate, libAssetPresets, makeTransformer } from 'universe:assets.ts';
import { generatePerPackageAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { assetPreset: targetAssetsPreset } = context;

  // * Do not generate any files when using the "wrong" preset
  if (!libAssetPresets.includes(targetAssetsPreset)) {
    return [];
  }

  // * Every package gets these files, including non-hybrid monorepo roots
  return generatePerPackageAssets(
    context,
    async function ({ toPackageAbsolutePath }) {
      return [
        {
          path: toPackageAbsolutePath(markdownLicensePackageBase),
          generate: () => compileTemplate('LICENSE' as RelativePath, { ...context })
        }
      ];
    },
    { includeRootPackageInNonHybridMonorepo: true }
  );
});
