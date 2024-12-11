import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function ({
  asset,
  toProjectAbsolutePath
}) {
  return [
    {
      path: toProjectAbsolutePath(asset),
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
