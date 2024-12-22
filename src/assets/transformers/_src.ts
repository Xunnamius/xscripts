import { directorySrcPackageBase, isAccessible } from 'multiverse+project-utils:fs.ts';

import { generatePerPackageAssets, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, forceOverwritePotentiallyDestructive: force } = context;

  // * Every package gets these files except non-hybrid monorepo roots
  return generatePerPackageAssets(context, async function ({ toPackageAbsolutePath }) {
    const outputDir = toPackageAbsolutePath(directorySrcPackageBase);

    // TODO: For cli projects, add black-flag boilerplate and also for
    // TODO: package.json (add BF, BFE, xcli packages to dependencies)

    // ? Only create this file if its parent directory does not already exist
    if (force || !(await isAccessible(outputDir, { useCached: true }))) {
      return [
        {
          path: toProjectAbsolutePath(outputDir, 'index.ts'),
          generate: () => /*js*/ `export {};`
        }
      ];
    }
  });
});
