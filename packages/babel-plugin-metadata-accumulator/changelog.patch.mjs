// @ts-check
import packageJson from './package.json' with { type: 'json' };

const { name: packageName } = packageJson;

/**
 * @type {import('@-xun/scripts/commands/build/changelog').ChangelogPatcherFunction}
 */
export default function changelogPatcher(changelog, patcher) {
  // ? Fixup old-style gac photogenic commits
  const targetStrings = [
    `**${packageName}:** `,
    `**${packageName.replace('@-xun/', 'packages/')}:** `
  ];

  while (targetStrings.some((target) => changelog.includes(target))) {
    for (const target of targetStrings) {
      const targetStartIndex = changelog.indexOf(target);
      const targetEndIndex = targetStartIndex + target.length;

      if (targetStartIndex !== -1) {
        changelog =
          changelog.slice(0, targetStartIndex) +
          (changelog.at(targetEndIndex)?.toLocaleUpperCase() || '') +
          changelog.slice(targetEndIndex + 1);
      }
    }
  }

  return patcher(changelog, [
    // ? From the before-fore
    [/^- \*\*packages\/[a-z0-9-]+:\*\* .*$\n/gm, ''],
    [/^- \*\*project-utils:\*\* .*$\n/gm, '']
  ]);
}
