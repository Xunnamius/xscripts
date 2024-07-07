// @ts-check
/**
 * @type {import('@-xun/scripts/commands/build/changelog.js').ChangelogPatches}
 */
export default [
  // ? Oops
  [/ --file /g, ' --files '],
  // ? Shoulda been a refactor
  [/\n[^\n]+commit initial version of "test" command[^\n]+\n/, '\n']
];
