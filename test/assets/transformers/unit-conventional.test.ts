/* eslint-disable no-await-in-loop */
// * These tests ensure changelog-related asset exports function as expected.

import assert from 'node:assert';

import { toSentenceCase } from 'multiverse+cli-utils:util.ts';

import {
  dummyNpmPackageFixture,
  gitRepositoryFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested,
  withMockedFixture,
  type FixtureContext,
  type WithMockedFixtureOptions
} from 'multiverse+test-utils';

import {
  moduleExport,
  noSpecialInitialCommitIndicator,
  noteTitleForBreakingChange,
  wellKnownCommitTypes
} from 'universe:assets/transformers/_conventional.config.cjs.ts';

import { fixtureToProjectMetadata } from 'testverse+project-utils:helpers/dummy-repo.ts';

import type {
  XchangelogConfig,
  XchangelogOptions
} from '@-xun/changelog' with { 'resolution-mode': 'import' };

import type { Merge, Promisable, SetParameterType } from 'type-fest';

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true });

const TEST_IDENTIFIER = 'unit-changelog';

const commitTypeSections: Record<
  string,
  { section: string; hidden: boolean | undefined } | undefined
> = Object.fromEntries(
  wellKnownCommitTypes
    .map(({ type, section, hidden }) => {
      return section ? [type, { section, hidden }] : undefined;
    })
    .filter((item) => !!item)
);

// TODO: need to do monorepo tests too

const dummyPackageJson = {
  name: 'fake-pkg',
  version: '0.0.0',
  description: 'fake',
  repository: {
    type: 'git',
    url: 'https://github.com/fake-user/fake-repo.git'
  }
};

const dummyModuleExportConfig = {
  configOverrides: {},
  projectMetadata: fixtureToProjectMetadata('goodPolyrepo'),
  specialInitialCommit: noSpecialInitialCommitIndicator
} as Parameters<typeof moduleExport>[0];

dummyModuleExportConfig.projectMetadata.cwdPackage.json = dummyPackageJson;
dummyModuleExportConfig.projectMetadata.rootPackage.json = dummyPackageJson;

it('matches changelog snapshot when there are no semver tags in the repo', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config);
        expect(changelog).toMatchSnapshot();
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('matches changelog snapshot when there are semver tags in the repo', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
        expect(changelog).toMatchSnapshot();
      }
    },
    generatePatchesForEnvironment11()
  );
});

it('appends commit short-hash and repo link to the end of commits of non-hidden types with each formatted commit scope/subject appearing after its section header', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test({ git }) {
        const config = moduleExport(dummyModuleExportConfig);

        const changelog = await runConventionalChangelog(config, {
          makeReplacements: false
        });

        const commits = await git.log({ multiLine: true });

        commits.all.forEach(({ hash, body: bodyAndFooter }) => {
          const isBreaking = bodyAndFooter.includes('BREAKING');
          const urlStart = ` ([${hash.slice(0, 7)}`;
          const urlEnd = `/commit/${hash}))`;

          const messageSplit = bodyAndFooter.split(':');
          const messageSplit_ = messageSplit[0].split('(');

          const [type, scope] = [
            messageSplit_.at(0)?.trim() ?? '',
            messageSplit_.at(1)?.trim().slice(0, -1)
          ];

          const sectionHeading = isBreaking
            ? `# 💥 ${noteTitleForBreakingChange} 💥`
            : `# ${commitTypeSections[type]?.section ?? ''}\n`;

          const subject_ = messageSplit.slice(1).join(':').trim().split('\n')[0];
          const subject = type === 'revert' ? `*${subject_}*` : subject_;

          const bullet =
            scope && scope !== '*'
              ? `* **${scope.toLowerCase()}:** ${subject}`
              : toSentenceCase(subject);

          if (!isBreaking && commitTypeSections[type]?.hidden !== false) {
            if (sectionHeading) {
              expect(changelog).not.toInclude(sectionHeading);
            }

            if (bullet) {
              expect(changelog).not.toInclude(bullet);
            }

            expect(changelog).not.toInclude(urlStart);
            expect(changelog).not.toInclude(urlEnd);
          } else {
            expect(changelog).toInclude(sectionHeading);

            expect(changelog).toInclude(bullet);
            expect(changelog.indexOf(sectionHeading)).toBeLessThan(
              changelog.indexOf(bullet)
            );

            expect(changelog).toInclude(urlStart);
            expect(changelog.indexOf(bullet)).toBeLessThan(changelog.indexOf(urlStart));

            expect(changelog).toInclude(urlEnd);
            expect(changelog.indexOf(urlStart)).toBeLessThan(changelog.indexOf(urlEnd));
          }
        });
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('translates each semver tag into a super-section link prefixed with package name and suffixed with commit date', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test({ git }) {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
        const tags = await git.tags();

        tags.all.forEach((tag) => {
          expect(changelog).toInclude(
            `fake-pkg[@${tag.slice(9)}](https://github.com/fake-user/fake-repo/compare/`
          );
        });
      }
    },
    generatePatchesForEnvironment11()
  );
});

it('groups types sections by default order', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const config = moduleExport(dummyModuleExportConfig);

        await createBasicCommit('mytype: new type from @Xunnamius', context);
        const changelog = await runConventionalChangelog(config);

        expect(changelog.indexOf(' BREAKING CHANGES\n')).toBeLessThan(
          changelog.indexOf(' Features')
        );

        expect(changelog.indexOf(' Features\n')).toBeLessThan(
          changelog.indexOf(' Fixes')
        );

        expect(changelog.indexOf(' Fixes\n')).toBeLessThan(
          changelog.indexOf(' Optimizations')
        );

        expect(changelog.indexOf(' Optimizations\n')).toBeLessThan(
          changelog.indexOf(' Build system')
        );

        expect(changelog.indexOf(' Build system\n')).toBeLessThan(
          changelog.indexOf(' CI/CD')
        );

        expect(changelog.indexOf(' CI/CD\n')).toBeLessThan(
          changelog.indexOf('Reverted')
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('can overwrite types using object override form', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const config = moduleExport({
          ...dummyModuleExportConfig,
          configOverrides: {
            types: [{ type: 'mytype', section: 'FAKE TYPE SECTION', hidden: false }]
          }
        });

        await createBasicCommit('mytype: new type from Xunnamius', context);
        await createBasicCommit('mytype(some-scope): new type from Xunnamius', context);
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          /# FAKE TYPE SECTION\n+\* New type from Xunnamius \S+\n\* \*\*some-scope:\*\* new type from Xunnamius \S+\n/
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('can overwrite types using callback override form', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const config = moduleExport({
          ...dummyModuleExportConfig,
          configOverrides: (config) => ({
            ...config,
            types: [{ type: 'mytype', section: 'FAKE TYPE SECTION', hidden: false }]
          })
        });

        await createBasicCommit('mytype: new type from Xunnamius', context);
        await createBasicCommit('mytype(some-scope): new type from Xunnamius', context);
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          /# FAKE TYPE SECTION\n+\* New type from Xunnamius \S+\n\* \*\*some-scope:\*\* new type from Xunnamius \S+\n/
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('handles aliased types with the same section name', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const config = moduleExport({
          ...dummyModuleExportConfig,
          configOverrides: (config) => ({
            ...config,
            types: [
              ...(config.types ?? []),
              { type: 'mytype', section: wellKnownCommitTypes[0].section, hidden: false }
            ]
          })
        });

        await createBasicCommit('mytype: new type from Xunnamius', context);
        await createBasicCommit('mytype(some-scope): new type from Xunnamius', context);
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          new RegExp(
            `### ${wellKnownCommitTypes[0].section!}\n+.+\\* New type from Xunnamius[^#]+\\* \\*\\*some-scope:\\*\\* new type from Xunnamius[^#]+### ${wellKnownCommitTypes[1].section!}\n`,
            'vs'
          )
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('recognizes scope setting with multiple matching types in types configuration', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const regexp = /### Dependencies\n+\* \*\*deps:\*\* upgrade example from 1 to 2/;

        {
          const config = moduleExport({
            ...dummyModuleExportConfig,
            configOverrides: (config) => ({
              ...config,
              types: [
                { type: 'chore', scope: 'deps', section: 'Dependencies', hidden: false },
                ...(config.types ?? [])
              ]
            })
          });

          const changelog = await runConventionalChangelog(config);
          expect(changelog).toMatch(regexp);
          expect(changelog).not.toInclude('release 0.0.0');
        }

        {
          const config = moduleExport({
            ...dummyModuleExportConfig,
            configOverrides: (config) => ({
              ...config,
              types: [
                { type: 'chore', scope: 'reps', section: 'Dependencies', hidden: false },
                ...(config.types ?? [])
              ]
            })
          });

          const changelog = await runConventionalChangelog(config);
          expect(changelog).not.toMatch(regexp);
          expect(changelog).not.toInclude('release 0.0.0');
        }
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('indents majors with h2, minors with h3, and adjusts section heading level as required', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

        expect(changelog).toMatch(/## fake-pkg\[@0.2.0][^#]+\n### /);
        expect(changelog).toMatch(/### fake-pkg\[@0.2.1][^#]+\n#### /);
      }
    },
    generatePatchesForEnvironment8()
  );
});

it('makes bold, lowercases, and appends colon for scope strings in non-breaking commits', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config);
        expect(changelog).toInclude('\n* **ngoptions:** make it faster ([X]');
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('removes scope strings in and capitalizes first letter of breaking commits', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 2 });
        expect(changelog).toInclude('\n* This completely changes the API\n');
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('capitalizes commit subject if no scope present', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config);
        expect(changelog).toInclude('\n* Amazing new module ([X]');
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('discards commits that have been reverted', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const { git } = context;
        await createBasicCommit('feat: this commit is gonna get reverted!', context);

        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config);
          expect(changelog).not.toInclude(
            '*"feat: this commit is gonna get reverted!"*'
          );
          expect(changelog).toInclude('* This commit is gonna get reverted!');
        }

        await git.revert('HEAD');

        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config);
          expect(changelog).toInclude('*"feat: this commit is gonna get reverted!"*');
          expect(changelog).not.toInclude('* This commit is gonna get reverted!');
        }
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('discards commits that have been reverted even if they contain breaking changes', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const { git } = context;
        await createBasicCommit(
          'chore!: this commit is gonna get reverted!\n\nBREAKING: A breaking change.',
          context
        );

        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config);

          expect(changelog).not.toInclude(
            '*"feat: this commit is gonna get reverted!"*'
          );
          expect(changelog).toInclude('* A breaking change.');
          expect(changelog).toInclude('* This commit is gonna get reverted!');
        }

        await git.revert('HEAD');

        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config);

          expect(changelog).toInclude('*"chore!: this commit is gonna get reverted!"*');
          expect(changelog).not.toInclude('* A breaking change.');
          expect(changelog).not.toInclude('* This commit is gonna get reverted!');
        }
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('discards revert commits that seem to target unknown/hidden non-breaking commits', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const { git } = context;

        await createBasicCommit('feat: this commit is gonna get reverted 1', context);
        await git.revert('HEAD');

        await createBasicCommit('feat!: this commit is gonna get reverted 2', context);
        await git.revert('HEAD');

        await createBasicCommit(
          'feat(scope): this commit is gonna get reverted 3',
          context
        );

        await git.revert('HEAD');

        await createBasicCommit(
          'feat(scope)!: this commit is gonna get reverted 4',
          context
        );

        await git.revert('HEAD');

        await createBasicCommit('chore: this commit is gonna get reverted 5', context);
        await git.revert('HEAD');

        await createBasicCommit('chore!: this commit is gonna get reverted 6', context);
        await git.revert('HEAD');

        await createBasicCommit(
          'chore(scope): this commit is gonna get reverted 7',
          context
        );

        await git.revert('HEAD');

        await createBasicCommit(
          'chore(scope)!: this commit is gonna get reverted 8',
          context
        );

        await git.revert('HEAD');

        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config);

          expect(changelog).toInclude('*"feat: this commit is gonna get reverted 1"*');
          expect(changelog).toInclude('*"feat!: this commit is gonna get reverted 2"*');

          expect(changelog).toInclude(
            '*"feat(scope): this commit is gonna get reverted 3"*'
          );

          expect(changelog).toInclude(
            '*"feat(scope)!: this commit is gonna get reverted 4"*'
          );

          expect(changelog).toInclude('*"chore!: this commit is gonna get reverted 6"*');

          expect(changelog).toInclude(
            '*"chore(scope)!: this commit is gonna get reverted 8"*'
          );

          expect(changelog).not.toInclude(
            '*"chore: this commit is gonna get reverted 5"*'
          );

          expect(changelog).not.toInclude(
            '*"chore(scope): this commit is gonna get reverted 7"*'
          );

          expect(changelog).not.toInclude('* This commit is gonna get reverted');

          expect(changelog).not.toInclude(
            '* **scope**: this commit is gonna get reverted'
          );
        }
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('populates breaking change notes if "!" is present', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 2 });
        expect(changelog).toInclude('* Incredible new flag FIXES: [#33](');
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('does not list breaking change twice if "!" is used', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config);
        expect(changelog).toInclude('* New build system.\n');
        expect(changelog).not.toInclude('* First build setup\n');
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('outputs as one line all lines of multi-line breaking change notes with each line in sentence case', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config, { releaseCount: 2 });
        expect(changelog).toInclude(
          '* The Change is huge. Big. Really big.\n\nReally. Like super big. Wow!\n\nHere are some extra details!'
        );
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('linkifies all external issue references in and adds a data image to subjects and breaking notes', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport(dummyModuleExportConfig);
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          /\[#358<img .*? \/>]\(https:\/\/github\.com\/other-fake-user\/other-fake-repo\/issues\/358\)/
        );

        expect(changelog).toMatch(
          /\[#853<img .*? \/>]\(https:\/\/github\.com\/other-fake-user\/other-fake-repo\/issues\/853\)/
        );

        expect(changelog).toMatch(
          /\[#331<img .*? \/>]\(https:\/\/github\.com\/owner\/repo\/issues\/331\)/
        );

        expect(changelog).toMatch(
          /\[#441<img .*? \/>]\(https:\/\/github\.com\/owner\/repo\/issues\/441\)/
        );
      }
    },
    generatePatchesForEnvironment2()
  );
});

it('linkifies all internal issue references in subjects and breaking notes', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude(
            '[#133](https://github.com/fake-user/fake-repo/issues/133)'
          );

          expect(changelog).toInclude(
            '[#233](https://github.com/fake-user/fake-repo/issues/233)'
          );

          expect(changelog).toInclude(
            '[#55](https://github.com/fake-user/fake-repo/issues/55)'
          );

          expect(changelog).toInclude(
            '[#66](https://github.com/fake-user/fake-repo/issues/66)'
          );

          expect(changelog).toInclude(
            '[#77](https://github.com/fake-user/fake-repo/issues/77)'
          );

          expect(changelog).toInclude(
            '[#33](https://github.com/fake-user/fake-repo/issues/33)'
          );

          expect(changelog).toInclude(
            '[#22](https://github.com/fake-user/fake-repo/issues/22)'
          );
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('linkifies all internal and external issues in subjects and breaking notes given custom issueUrlFormat and prefix', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport({
            ...dummyModuleExportConfig,
            configOverrides(config) {
              return {
                ...config,
                issuePrefixes: ['#', 'GH-'],
                issueUrlFormat: 'issues://{{repository}}/issues/{{id}}'
              };
            }
          });

          const changelog = await runConventionalChangelog(config);

          expect(changelog).toInclude('[#1](issues://fake-repo/issues/1)');
          expect(changelog).toInclude('[GH-1](issues://fake-repo/issues/1)');
          expect(changelog).toInclude('[GH-2](issues://fake-repo/issues/2)');
          expect(changelog).toInclude('[GH-3](issues://fake-repo/issues/3)');

          expect(changelog).toMatch(
            /\[#358<img .*? \/>]\(issues:\/\/other-fake-repo\/issues\/358\)/
          );

          expect(changelog).toMatch(
            /\[#853<img .*? \/>]\(issues:\/\/other-fake-repo\/issues\/853\)/
          );
        }

        {
          const config = moduleExport({
            ...dummyModuleExportConfig,
            configOverrides(config) {
              return {
                ...config,
                issueUrlFormat: 'https://example.com/browse/{{prefix}}{{id}}',
                issuePrefixes: ['EXAMPLE-']
              };
            }
          });

          const changelog = await runConventionalChangelog(config);

          expect(changelog).toInclude(
            '[EXAMPLE-1](https://example.com/browse/EXAMPLE-1)'
          );

          expect(changelog).toInclude(
            '[EXAMPLE-2](https://example.com/browse/EXAMPLE-2)'
          );
        }
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('linkifies issue references as internal even when they are given using external syntax in subjects and breaking notes', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
          expect(changelog).toInclude(
            '[#551](https://github.com/fake-user/fake-repo/issues/551)'
          );
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('removes issue refs from superscript that already appear in the subject', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude(
            '[#88](https://github.com/fake-user/fake-repo/issues/88)'
          );

          expect(changelog.toLowerCase()).not.toInclude(
            'see [#88](https://github.com/fake-user/fake-repo/issues/88)'
          );
        }
      }
    },
    generatePatchesForEnvironment3()
  );
});

it('linkifies @user with configured userUrlFormat', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport({
            ...dummyModuleExportConfig,
            configOverrides: (config) => ({
              ...config,
              userUrlFormat: 'https://foo/{{user}}'
            })
          });

          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude('[@bcoe](https://foo/bcoe)');
          expect(changelog).toInclude('[@dlmr](https://foo/dlmr)');
          expect(changelog).toInclude('[@username](https://foo/username)');
          expect(changelog).toInclude('[@Xunnamius](https://foo/Xunnamius)');
          expect(changelog).toInclude('[@suimannux](https://foo/suimannux)');
          expect(changelog).toInclude('[@user1](https://foo/user1)');
          expect(changelog).toInclude('[@user2](https://foo/user2)');
          expect(changelog).toInclude('[@user3](https://foo/user3)');
          expect(changelog).toInclude('[@merchanz039f9](https://foo/merchanz039f9)');
          expect(changelog).not.toInclude('@hutson');
          expect(changelog).not.toInclude('[@aol');
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('does not linkify @string if it is a scoped package (including with hyphens)', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        {
          const config = moduleExport(dummyModuleExportConfig);

          await createBasicCommit(
            'fix: update @typescript-eslint/some-pkg and @-xun/scripts and @eslint/js@5 and npm@beta',
            context
          );

          const changelog = await runConventionalChangelog(config, {
            releaseCount: 0,
            outputUnreleased: true
          });

          expect(changelog).toInclude(
            '* Update @typescript-eslint/some-pkg and @-xun/scripts and @eslint/js@5 and npm@beta'
          );

          expect(changelog).not.toInclude('(https://github.com/5');
          expect(changelog).toInclude('bump @dummy/package from');
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('parses default, customized, and malformed revert commits', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude('*"feat: default revert format"*');
          expect(changelog).toInclude('*"feat: default revert format"*');
          expect(changelog).toInclude('*Feat: custom revert format*');
          expect(changelog).toInclude('*"Feat(two): custom revert format 2"*');
          expect(changelog).toInclude('*"feat(X): broken-but-still-supported revert"*');
        }
      }
    },
    generatePatchesForEnvironment10()
  );
});

it('does not take the type/scope case into consideration (always lowercased)', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
          expect(changelog).toInclude('* **foo:** incredible new flag');
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('supports multiple lines of footer information', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude('see [#99]');
          expect(changelog).toInclude('[#100]');
          expect(changelog).toInclude('* This completely changes the API');
        }
      }
    },
    generatePatchesForEnvironment9()
  );
});

it('removes xpipeline command suffixes from commit subjects', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        {
          const config = moduleExport(dummyModuleExportConfig);
          const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

          expect(changelog).toInclude('* Something else skip1\n');
          expect(changelog).toInclude('* **scope:** something else skip1 ([X]');
          expect(changelog).toInclude('* Something else skip2 ([X]');
          expect(changelog).toInclude(
            '* Something other skip3 [CI SKIP][skip ci][sKiP cd][cd skip] ([X]'
          );
          expect(changelog).toInclude('* Something other skip4 ([X]');
          expect(changelog).toInclude('*"build(bore): include1 [skip cd]"*');
        }
      }
    },
    generatePatchesForEnvironment11()
  );
});

function getBaseEnvironmentConfig({
  testIdentifier,
  options
}: Partial<Pick<WithMockedFixtureOptions, 'testIdentifier' | 'options'>>) {
  return {
    testIdentifier: testIdentifier ?? TEST_IDENTIFIER,
    options: {
      performCleanup: true,
      initialFileContents: {
        'package.json': JSON.stringify({
          name: 'dummy-pkg'
        })
      },
      use: [dummyNpmPackageFixture(), gitRepositoryFixture()],
      ...options
    }
  };
}

async function createBasicCommit(
  message: string,
  { git, fs, root }: Required<Pick<FixtureContext, 'git' | 'fs' | 'root'>>
) {
  const path = 'dummy.txt';
  const ownMemory = createBasicCommit as { counter?: number };
  ownMemory.counter ??= 0;

  await fs.writeFile({ path, data: `${ownMemory.counter++}` });
  return git.add(root + '/' + path).then(() => git.commit(message, ['--no-gpg-sign']));
}

async function createBasicCommits(
  messages: string[],
  context: Parameters<typeof createBasicCommit>[1]
) {
  for (const message of messages) {
    await createBasicCommit(message, context);
  }
}

type TestEnvironmentPatch = {
  messages: string[];
  callback?: (config: {
    messages: string[];
    context: Merge<FixtureContext, { git: NonNullable<FixtureContext['git']> }>;
  }) => Promisable<unknown>;
};

async function withMockedFixtureWrapper(
  incomingConfig: {
    test: SetParameterType<
      WithMockedFixtureOptions['test'],
      [
        context: Merge<
          Parameters<WithMockedFixtureOptions['test']>[0],
          { git: NonNullable<Parameters<WithMockedFixtureOptions['test']>[0]['git']> }
        >
      ]
    >;
  } & Partial<Omit<WithMockedFixtureOptions, 'test'>>,
  environmentPatches: TestEnvironmentPatch[]
) {
  const { test: customFn } = incomingConfig;
  const config = getBaseEnvironmentConfig(incomingConfig);

  config.options.initialFileContents['package.json'] = JSON.stringify(dummyPackageJson);

  return withMockedFixture({
    ...config,
    async test(context) {
      const { git, fs, root } = context;
      assert(git, 'expected git instance to be defined');

      process.chdir(root);

      for (const { messages, callback } of environmentPatches) {
        if (messages.length) {
          await createBasicCommits(messages, { git, fs, root });
        }

        await callback?.({ messages, context } as Parameters<typeof callback>[0]);
      }

      return customFn(context as Parameters<typeof customFn>[0]);
    }
  });
}

async function runConventionalChangelog(
  config: XchangelogConfig,
  {
    makeReplacements = true,
    ...optionsOverrides
  }: { makeReplacements?: boolean } & Omit<XchangelogOptions, 'config'> = {}
) {
  const { default: makeChangelogSectionStream } = await import('@-xun/changelog');
  const { options, parserOpts, writerOpts, context, gitRawCommitsOpts } = config;
  // * Note that options.outputUnreleased determines config.writerOps.doFlush
  const result = (
    await makeChangelogSectionStream(
      { config, ...options, ...optionsOverrides },
      context,
      gitRawCommitsOpts,
      parserOpts,
      writerOpts,
      {}
    ).toArray()
  ).join('');

  const changelog = makeReplacements
    ? result
        // ? Replace (xxxx-xx-xx) with (date)
        .replaceAll(/^(#?## \S+ \()\S+(\))$/gm, '$1date$2')
        // ? Replace hashes in commit urls with X's
        .replaceAll(/(\(\[)[\da-f]{7}(]\(\S+\/)[\da-f]{40}(\)\))/gi, '$1X$2X$3')
        // ? Replace hashes elsewhere with X's
        .replaceAll(/(\b)[\da-f]{40}(\b)/gi, '$1X$2')
    : result;

  return changelog;
}

// * Note that any commits below with breaking changes that do not also include
// * "!" after the scope are not technically xpipeline compliant. However, we
// * still test these types of commits here for posterity.

function generatePatchesForEnvironment1(): TestEnvironmentPatch[] {
  return [
    {
      messages: [
        'build!: first build setup\n\nBREAKING: New build system.',
        'ci(travis): add TravisCI pipeline\n\nBREAKING CHANGE: Continuously integrated.',
        'Feat: amazing new module\n\nBREAKING CHANGES: Not backwards compatible (GH-2) (GH-3).\n\nthis is due to other-fake-user/other-fake-repo#1234.',
        'Fix(compile): avoid a bug\nBREAKING CHANGE: changes #55 #66, and #77 are huge.',
        'perf(ngOptions): make it faster\n closes #1, #2',
        'fix(changelog): proper issue links 1\n\nsee #1, other-fake-user/other-fake-repo#358, other-fake-user/other-fake-repo#853',
        'revert(ngOptions): "feat(headstrong): bad commit"',
        'fix(*): oops',
        'fix(changelog): proper issue links 2\n\nsee GH-1',
        'feat(awesome): address EXAMPLE-1 EXAMPLE-2',
        'chore(deps): upgrade example from 1 to 2',
        'chore(release): release 0.0.0'
      ]
    }
  ];
}

function generatePatchesForEnvironment2(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment1().concat([
    {
      messages: [
        'feat(awesome1): addresses the issue brought up in #133, #233',
        'feat(awesome2): owner/repo#331, owner/repo#441, and fake-user/fake-repo#551'
      ]
    }
  ]);
}

function generatePatchesForEnvironment3(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment2().concat([
    {
      messages: ['feat(awesome): fix #88\n\ncloses #88']
    }
  ]);
}

function generatePatchesForEnvironment4(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment3().concat([
    {
      messages: ['feat(awesome): issue brought up by @bcoe! on Friday']
    }
  ]);
}

function generatePatchesForEnvironment5(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment4().concat([
    {
      messages: [
        'build(npm): edit build script\n\nBREAKING CHANGE: The Change is huge.',
        'ci(travis): setup travis\n\nBREAKING CHANGE: The Change is huge.',
        'docs(readme): make it clear\n\nBREAKING CHANGE: The Change is huge.',
        'style(whitespace): make it easier to read\n\nBREAKING CHANGE: The Change is huge.',
        'refactor(code): change a lot of code\n\nBREAKING CHANGE: The Change is huge.',
        'test(*)!: more tests\n\nBREAKING CHANGE: The Change is huge.'
      ]
    }
  ]);
}

function generatePatchesForEnvironment6(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment5().concat([
    {
      messages: ['feat: some more feats'],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '0.1.0'
          })
        });

        return git.addAnnotatedTag('fake-pkg@0.1.0', 'fake-pkg@0.1.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment7(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment6().concat([
    {
      messages: [
        'feat(another): more features',
        'feat: some more features',
        'feat: even more features'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '0.2.0'
          })
        });

        return git.addAnnotatedTag('fake-pkg@0.2.0', 'fake-pkg@0.2.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment8(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment7().concat([
    {
      messages: ['feat(*): implementing #5 by @dlmr\n closes #10'],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '0.2.1'
          })
        });

        return git.addAnnotatedTag('fake-pkg@0.2.1', 'fake-pkg@0.2.1');
      }
    }
  ]);
}

function generatePatchesForEnvironment9(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment8().concat([
    {
      messages: [
        'fix: use npm@5 (@username)',
        'build(deps): bump @dummy/package from 7.1.2 to 8.0.0 (thanks @Xunnamius, @suimannux @user1/@user2, @user3/@+u%+(#bad email@aol.com with help from @merchanz039f9)\n\nBREAKING CHANGE: The Change is huge. Big. Really big.\n\nReally. Like super big.\nWow!\n\nHere\nare\nsome\nextra details!',
        'feat: complex new feature\n\nThis is a complex new feature with many reviewers\nReviewer: @hutson\nFixes: #99\nRefs: #100\n\nBREAKING CHANGE: this completely changes the API',
        'FEAT(FOO)!: incredible new flag FIXES: #33-#22'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '1.0.0'
          })
        });

        return git.addAnnotatedTag('fake-pkg@1.0.0', 'fake-pkg@1.0.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment10(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment9().concat([
    {
      messages: [
        'Revert feat: default revert format"\nThis reverts commit 1234.',
        'Revert "feat: default revert format\nThis reverts commit 1234.',
        'revert: feat: custom revert format\n\nThis reverts commit 5678.',
        'revert: "Feat(two): custom revert format 2"\nThis reverts commit 9101112.',
        'revert: "feat(X): broken-but-still-supported revert"'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '1.1.0'
          })
        });

        return git.addAnnotatedTag('fake-pkg@1.1.0', 'fake-pkg@1.1.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment11(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment10().concat([
    {
      messages: [
        'refactor(code): big bigly big change skip1! [skip ci]\n\nBREAKING CHANGE: the change is bigly luxurious 5-stars everybody is saying',
        'feat(scope)!: something else skip1 [cd skip]',
        'feat: something else skip2 [cd skip]',
        'fix: something other skip3 [CI SKIP][skip ci][sKiP cd][cd skip]',
        'fix: something other skip4 [CI SKIP, skip ci, sKiP cd, cd skip]',
        'revert: "build(bore): include1 [skip cd]"'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '1.1.1'
          })
        });

        return git.addAnnotatedTag('fake-pkg@1.1.1', 'fake-pkg@1.1.1');
      }
    }
  ]);
}
