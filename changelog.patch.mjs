// @ts-check
/**
 * @type {import('@-xun/scripts/commands/build/changelog').ChangelogPatches}
 */
export default [
  // ? Oops
  [/ --file /g, ' --files '],
  ['`import-section-file`', '`--import-section-file`'],
  ['--output-file', '--changelog-file'],
  // ? Shoulda been a refactor
  [/\n[^\n]+commit initial version of "test" command[^\n]+\n/, '\n']
];
