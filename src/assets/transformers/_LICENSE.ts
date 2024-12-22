/* eslint-disable unicorn/filename-case */

import {
  markdownLicensePackageBase,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  compileTemplate,
  generatePerPackageAssets,
  libAssetPresets,
  makeTransformer
} from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { assetPreset } = context;

  // * Do not generate any files when using the "wrong" preset
  if (!libAssetPresets.includes(assetPreset)) {
    return [];
  }

  // * Every package gets these files, including non-hybrid monorepo roots
  return generatePerPackageAssets(
    context,
    async function ({ toPackageAbsolutePath, contextWithCwdPackage }) {
      return [
        {
          path: toPackageAbsolutePath(markdownLicensePackageBase),
          generate: () =>
            compileTemplate('LICENSE' as RelativePath, contextWithCwdPackage)
        }
      ];
    },
    { includeRootPackageInNonHybridMonorepo: true }
  );
});
