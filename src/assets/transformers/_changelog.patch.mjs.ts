import { changelogPatchConfigPackageBase } from 'multiverse+project-utils:fs.ts';

import { generateRootOnlyAssets, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(changelogPatchConfigPackageBase),
        generate: () => /*js*/ `
// @ts-check

/**
 * @type {import('@-xun/scripts/commands/build/changelog').ChangelogPatches}
 */
export default [
  ///// ? Oops
  //[/ --file /g, ' --files '],
  //['--output-file', '--changelog-file'],
];
`
      }
    ];
  });
});
