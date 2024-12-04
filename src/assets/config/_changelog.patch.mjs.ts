import { makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  transform({ asset }) {
    return {
      [asset]: `
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
    };
  }
});
