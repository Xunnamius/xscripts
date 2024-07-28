/* eslint-disable no-await-in-loop */
import assert from 'node:assert';

import conventionalChangelogCore, {
  type Options as ConventionalChangelogOptions
} from 'conventional-changelog-core';

import { toSentenceCase } from 'multiverse/@-xun/cli-utils/util';

import {
  moduleExport,
  noteTitleForBreakingChange,
  wellKnownCommitTypes
} from 'universe/assets/config/_conventional.config.js';

import {
  dummyNpmPackageFixture,
  gitRepositoryFixture,
  withMockedFixture,
  type FixtureContext,
  type WithMockedFixtureOptions
} from 'testverse/setup';

import type { Merge, Promisable, SetParameterType } from 'type-fest';

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

it('matches changelog snapshot when there are semver tags in the repo', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport();
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
        expect(changelog).toMatchSnapshot();
      }
    },
    generatePatchesForEnvironment11()
  );
});

it('matches changelog snapshot when there are no semver tags in the repo', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport({});
        const changelog = await runConventionalChangelog(config);
        expect(changelog).toMatchSnapshot();
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('appends commit short-hash and repo link to the end of commits of non-hidden types with each formatted commit scope/subject appearing after its section header', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test({ git }) {
        const config = moduleExport();

        const changelog = await runConventionalChangelog(config, {
          makeReplacements: false
        });

        const commits = await git.log({ multiLine: true });

        commits.all.forEach(({ hash, body }) => {
          const isBreaking = body.includes('BREAKING');
          const urlStart = ` ([${hash.slice(0, 7)}`;
          const urlEnd = `/commit/${hash}))`;

          const messageSplit = body.split(':');
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

it('translates each semver tag into a super-section link suffixed with commit date', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test({ git }) {
        const config = moduleExport();
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });
        const tags = await git.tags();

        tags.all.forEach((tag) => {
          expect(changelog).toInclude(
            `[${tag.slice(1)}](https://github.com/fake-user/fake-repo/compare/`
          );
        });
      }
    },
    generatePatchesForEnvironment11()
  );
});

it('adds a data image to external repository links', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport();
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          /\[#358<img .*? \/>]\(https:\/\/github\.com\/other-fake-user\/other-fake-repo\/issues\/358\)/
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('groups types sections by default order', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test(context) {
        const config = moduleExport();

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

        expect(changelog.indexOf(' CI/CD\n')).toBeLessThan(changelog.indexOf('Reverted'));
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
          types: [{ type: 'mytype', section: 'FAKE TYPE SECTION', hidden: false }]
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
        const config = moduleExport((config) => ({
          ...config,
          types: [{ type: 'mytype', section: 'FAKE TYPE SECTION', hidden: false }]
        }));

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
        const config = moduleExport((config) => ({
          ...config,
          types: [
            ...(config.types ?? []),
            { type: 'mytype', section: wellKnownCommitTypes[0].section, hidden: false }
          ]
        }));

        await createBasicCommit('mytype: new type from Xunnamius', context);
        await createBasicCommit('mytype(some-scope): new type from Xunnamius', context);
        const changelog = await runConventionalChangelog(config);

        expect(changelog).toMatch(
          new RegExp(
            `# ${wellKnownCommitTypes[0].section!}\n+[^#]+\\* Amazing new module[^#]+\\* New type from Xunnamius[^#]+\\* \\*\\*some-scope:\\*\\* new type from Xunnamius`
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
          const config = moduleExport((config) => ({
            ...config,
            types: [
              { type: 'chore', scope: 'deps', section: 'Dependencies', hidden: false },
              ...(config.types ?? [])
            ]
          }));

          const changelog = await runConventionalChangelog(config);
          expect(changelog).toMatch(regexp);
          expect(changelog).not.toInclude('release 0.0.0');
        }

        {
          const config = moduleExport((config) => ({
            ...config,
            types: [
              { type: 'chore', scope: 'reps', section: 'Dependencies', hidden: false },
              ...(config.types ?? [])
            ]
          }));

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
        const config = moduleExport();
        const changelog = await runConventionalChangelog(config, { releaseCount: 0 });

        expect(changelog).toMatch(/## \[0.2.0][^#]+\n### /);
        expect(changelog).toMatch(/### \[0.2.1][^#]+\n#### /);
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
        const config = moduleExport();
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
        const config = moduleExport();
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
        const config = moduleExport();
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
          const config = moduleExport();
          const changelog = await runConventionalChangelog(config);
          expect(changelog).not.toInclude('*"feat: this commit is gonna get reverted!"*');
          expect(changelog).toInclude('* This commit is gonna get reverted!');
        }

        await git.revert('HEAD');

        {
          const config = moduleExport();
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
          const config = moduleExport();
          const changelog = await runConventionalChangelog(config);

          expect(changelog).not.toInclude('*"feat: this commit is gonna get reverted!"*');
          expect(changelog).toInclude('* A breaking change.');
          expect(changelog).toInclude('* This commit is gonna get reverted!');
        }

        await git.revert('HEAD');

        {
          const config = moduleExport();
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
          const config = moduleExport();
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
});

it('does not list breaking change twice if "!" is used', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const config = moduleExport();
        const changelog = await runConventionalChangelog(config);
        expect(changelog).not.toMatch(/\* First build setup\r?\n/);
      }
    },
    generatePatchesForEnvironment1()
  );
});

it('omits optional "!" in breaking commit lines', async () => {
  expect.hasAssertions();
});

it('outputs as one line all lines of multi-line breaking change notes with each line in sentence case', async () => {
  expect.hasAssertions();
});

it('outputs unreleased commits as expected', async () => {
  expect.hasAssertions();
  void generatePatchesForEnvironment12;
});

it('properly formats external repository issues by default', async () => {
  expect.hasAssertions();
});

it('properly formats external repository issues given an issueUrlFormat', async () => {
  expect.hasAssertions();
});

it('properly formats issues in external issue tracker given an issueUrlFormat with prefix', async () => {
  expect.hasAssertions();
});

it('replaces issues text with GitHub format issue URL by default', async () => {
  expect.hasAssertions();
});

it('removes issues that already appear in the subject', async () => {
  expect.hasAssertions();
});

it('replaces @user with configured userUrlFormat', async () => {
  expect.hasAssertions();
});

it('only replaces @user string if it is a username', async () => {
  expect.hasAssertions();
});

it('works with unknown host', async () => {
  expect.hasAssertions();
});

it('supports non public GitHub repository locations', async () => {
  expect.hasAssertions();
});

it('parses default, customized, and malformed revert commits', async () => {
  expect.hasAssertions();
});

it('supports multiple lines of footer information', async () => {
  expect.hasAssertions();
});

it('works specifying where to find a package.json using conventional-changelog-core', async () => {
  expect.hasAssertions();
});

it('falls back to the closest package.json when not providing a location for a package.json', async () => {
  expect.hasAssertions();
});

it('removes xpipeline command suffixes from commit subjects', async () => {
  expect.hasAssertions();
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

  config.options.initialFileContents['package.json'] = JSON.stringify({
    name: 'fake-pkg',
    version: '0.0.0',
    description: 'fake',
    repository: {
      type: 'git',
      url: 'https://github.com/fake-user/fake-repo.git'
    }
  });

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
  config: ConventionalChangelogOptions['config'],
  {
    makeReplacements = true,
    ...options
  }: { makeReplacements?: boolean } & Omit<ConventionalChangelogOptions, 'config'> = {}
) {
  // * Note that options.outputUnreleased is used to determine config.writerOps.doFlush
  const result = (await conventionalChangelogCore({ config, ...options }).toArray()).join(
    ''
  );

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
        'Feat: amazing new module\n\nBREAKING CHANGES: Not backward compatible.',
        'Fix(compile): avoid a bug\nBREAKING CHANGE: The Change is huge.',
        'perf(ngOptions): make it faster\n closes #1, #2',
        'fix(changelog): proper issue links\n\nsee #1, other-fake-user/other-fake-repo#358',
        'revert(ngOptions): "feat(headstrong): bad commit"',
        'fix(*): oops',
        'fix(changelog): proper issue links',
        ' see GH-1',
        'feat(awesome): address EXAMPLE-1',
        'chore(deps): upgrade example from 1 to 2',
        'chore(release): release 0.0.0'
      ]
    }
  ];
}

function generatePatchesForEnvironment2(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment1().concat([
    {
      messages: ['feat(awesome): addresses the issue brought up in #133']
    }
  ]);
}

function generatePatchesForEnvironment3(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment2().concat([
    {
      messages: ['feat(awesome): fix #88']
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

        return git.addAnnotatedTag('v0.1.0', 'v0.1.0');
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

        return git.addAnnotatedTag('v0.2.0', 'v0.2.0');
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

        return git.addAnnotatedTag('v0.2.1', 'v0.2.1');
      }
    }
  ]);
}

function generatePatchesForEnvironment9(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment8().concat([
    {
      messages: [
        'fix: use npm@5 (@username)',
        'build(deps): bump @dummy/package from 7.1.2 to 8.0.0 (thanks @Xunnamius, @suimannux @user1/@user2, @user3/@+u%+(#bad email@aol.com with help from @merchanz039f9)\n\nBREAKING CHANGE: The Change is huge. Big. Really big.\n\nReally. Like super big. Wow! Here are some extra details!',
        'feat: complex new feature\n\nThis is a complex new feature with many reviewers\nReviewer: @hutson\nFixes: #99\nRefs: #100\n\nBREAKING CHANGE: this completely changes the API',
        'FEAT(FOO)!: incredible new flag FIXES: #33'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '1.0.0'
          })
        });

        return git.addAnnotatedTag('v1.0.0', 'v1.0.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment10(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment9().concat([
    {
      messages: [
        'Revert feat: default revert format"\nThis reverts commit 1234.',
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

        return git.addAnnotatedTag('v1.1.0', 'v1.1.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment11(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment10().concat([
    {
      messages: [
        'refactor(code): big bigly big change skip1! [skip ci]\n\nBREAKING CHANGE: the change is bigly luxurious 5-stars everybody is saying',
        'feat: something else skip2 [cd skip]',
        'fix: something other skip3 [CI SKIP][skip ci][sKiP cd][cd skip]',
        'revert: "build(bore): include1 [skipcd]'
      ],
      async callback({ context: { git, fs } }) {
        await fs.writeFile({
          path: 'package.json',
          data: JSON.stringify({
            ...JSON.parse(await fs.readFile({ path: 'package.json' })),
            version: '1.1.1'
          })
        });

        return git.addAnnotatedTag('v1.1.1', 'v1.1.1');
      }
    }
  ]);
}

function generatePatchesForEnvironment12(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment11().concat([
    {
      messages: ['feat(code): new feature', 'feat: another new feature', 'fix: a new fix']
    }
  ]);
}
