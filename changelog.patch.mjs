// @ts-check
/**
 * @type {import('@-xun/scripts/commands/build/changelog').ChangelogPatches}
 */
export default [
  // ? Oops
  [/ --file /g, ' --files '],
  ['`import-section-file`', '`--import-section-file`'],
  ['--output-file', '--changelog-file'],
  ['et al', 'etc'],
  // ? Shoulda been a refactor
  [/^.+commit initial version of "test" command.+$\n/im, ''],
  // ? Too late to fixup/merge
  [
    /^.*(?<!actually )fix incorrect semantic-release plugin order during publish flow.+$\n/gim,
    ''
  ]
];
