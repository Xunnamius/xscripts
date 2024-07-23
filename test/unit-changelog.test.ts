/* eslint-disable no-await-in-loop */
import assert from 'node:assert';

import conventionalChangelogCore from 'conventional-changelog-core';

import { moduleExport } from 'universe/assets/config/_conventional.config.js';

import {
  dummyNpmPackageFixture,
  type FixtureContext,
  gitRepositoryFixture,
  withMockedFixture,
  type WithMockedFixtureOptions
} from 'testverse/setup';

import type { Merge, Promisable } from 'type-fest';

const TEST_IDENTIFIER = 'unit-changelog';

// TODO: Split up tests that are testing more than 1 thing (sometimes secretly).
// TODO: For instance, test capitalization

it('should work if there is no semver tag', async () => {
  expect.hasAssertions();

  await withMockedFixtureWrapper(
    {
      async test() {
        const [changelog] = (
          await conventionalChangelogCore({
            config: moduleExport({})
          }).toArray()
        ).map((item) => String(item));

        expect(changelog).toInclude('1.2.3');
        expect(changelog).toInclude('First build setup');
        expect(changelog).toInclude('**travis:** add TravisCI pipeline');
        expect(changelog).toInclude('Continuously integrated.');
        expect(changelog).toInclude('Amazing new module');
        expect(changelog).toInclude('**compile:** avoid a bug');
        expect(changelog).toInclude('make it faster');

        expect(changelog).toInclude(
          '<sup>closes [#1](https://github.com/fake-user/fake-repo/issues/1), [#2](https://github.com/fake-user/fake-repo/issues/2)</sup>'
        );

        expect(changelog).toInclude('New build system.');
        expect(changelog).toInclude('Not backward compatible.');
        expect(changelog).toInclude('The Change is huge.');
        expect(changelog).toInclude('Build system');
        expect(changelog).toInclude('CI/CD');
        expect(changelog).toInclude('Features');
        expect(changelog).toInclude('Fixes');
        expect(changelog).toInclude('Optimizations');
        expect(changelog).toInclude('Reverted');
        expect(changelog).toInclude('"feat(headstrong): bad commit"');
        expect(changelog).toInclude('BREAKING CHANGE');

        expect(changelog).not.toInclude('ci');
        expect(changelog).not.toMatch(/feat(?!\()/);
        expect(changelog).not.toInclude('fix');
        expect(changelog).not.toInclude('Fix ');
        expect(changelog).not.toInclude('perf');
        expect(changelog).not.toInclude('revert');
        expect(changelog).not.toInclude('***:**');
        expect(changelog).not.toInclude(': Not backward compatible.');

        // ? CHANGELOG should group sections in order of importance:

        expect(changelog.indexOf('BREAKING CHANGE')).toBeLessThan(
          changelog.indexOf('Features')
        );

        expect(changelog.indexOf('Features')).toBeLessThan(changelog.indexOf('Fixes'));

        expect(changelog.indexOf('Fixes')).toBeLessThan(
          changelog.indexOf('Optimizations')
        );

        expect(changelog.indexOf('Optimizations')).toBeLessThan(
          changelog.indexOf('Reverted')
        );
      }
    },
    generatePatchesForEnvironment1()
  );
});

// TODO: complete
void generatePatchesForEnvironment11;
/* it('should not list breaking change twice if ! is used', function (done) {
  preparing(1);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).not.toMatch(/\* First build setup\r?\n/);
        done();
      })
    );
});

it('should allow additional "types" configuration to be provided', function (done) {
  preparing(1);

  gitDummyCommit(['mytype: new type from @Xunnamius']);

  conventionalChangelogCore({
    config: getPreset({
      types: [{ type: 'mytype', section: 'FAKE TYPE SECTION', hidden: false }]
    })
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('1.2.3');
        expect(changelog).toInclude('First build setup');
        expect(changelog).toInclude('**travis:** add TravisCI pipeline');
        expect(changelog).toInclude('Continuously integrated.');
        expect(changelog).toInclude('Amazing new module');
        expect(changelog).toInclude('**compile:** avoid a bug');
        expect(changelog).toInclude('make it faster');
        expect(changelog).toInclude('New build system.');
        expect(changelog).toInclude('Not backward compatible.');
        expect(changelog).toInclude('The Change is huge.');
        expect(changelog).toInclude('Build system');
        expect(changelog).toInclude('CI/CD');
        expect(changelog).toInclude('Features');
        expect(changelog).toInclude('Fixes');
        expect(changelog).toInclude('Optimizations');
        expect(changelog).toInclude('Reverted');
        expect(changelog).toInclude('"feat(headstrong): bad commit"');
        expect(changelog).toInclude('BREAKING CHANGE');
        expect(changelog).toInclude('FAKE TYPE SECTION');
        expect(changelog).toInclude('New type from');

        expect(changelog).not.toInclude('ci');
        expect(changelog).not.toMatch(/feat(?!\()/);
        expect(changelog).not.toInclude('fix');
        expect(changelog).not.toInclude('Fix ');
        expect(changelog).not.toInclude('perf');
        expect(changelog).not.toInclude('revert');
        expect(changelog).not.toInclude('***:**');
        expect(changelog).not.toInclude(': Not backward compatible.');

        // CHANGELOG should group sections in order of importance:
        expect(
          changelog.indexOf('BREAKING CHANGE') < changelog.indexOf('Features') &&
            changelog.indexOf('Features') < changelog.indexOf('Fixes') &&
            changelog.indexOf('Fixes') < changelog.indexOf('Optimizations') &&
            changelog.indexOf('Optimizations') < changelog.indexOf('Reverted') &&
            changelog.indexOf('Reverted') < changelog.indexOf('FAKE TYPE SECTION')
        ).to.equal(true);

        done();
      })
    );
});

it('should allow "types" to be overridden using callback form', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset((config) => (config.types = []))
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('First build setup');
        expect(changelog).toInclude('**travis:** add TravisCI pipeline');
        expect(changelog).toInclude('Continuously integrated.');
        expect(changelog).toInclude('Amazing new module');
        expect(changelog).toInclude('**compile:** avoid a bug');

        expect(changelog.toLowerCase()).not.toInclude('make it faster');
        expect(changelog).not.toInclude('Reverted');
        done();
      })
    );
});

it('should allow "types" to be overridden using second callback form', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset((_, config) => (config.types = []))
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('First build setup');
        expect(changelog).toInclude('**travis:** add TravisCI pipeline');
        expect(changelog).toInclude('Continuously integrated.');
        expect(changelog).toInclude('Amazing new module');
        expect(changelog).toInclude('**compile:** avoid a bug');

        expect(changelog.toLowerCase()).not.toInclude('make it faster');
        expect(changelog).not.toInclude('Reverted');
        done();
      })
    );
});

it('should allow matching "scope" to configuration', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset((config) => {
      config.types = [{ type: 'chore', scope: 'deps', section: 'Dependencies' }];
    })
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('### Dependencies');
        expect(changelog).toInclude('**deps:** upgrade example from 1 to 2');

        expect(changelog.toLowerCase()).not.toInclude('release 0.0.0');
        done();
      })
    );
});

it('should properly format external repository issues', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude(
          '[#1](https://github.com/fake-user/fake-repo/issues/1)'
        );
        expect(changelog).toInclude('[#358<img');
        done();
      })
    );
});

it('should properly format external repository issues given an `issueUrlFormat`', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset({
      issuePrefixes: ['#', 'GH-'],
      issueUrlFormat: 'issues://{{repository}}/issues/{{id}}'
    })
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('[#1](issues://fake-repo/issues/1)');
        expect(changelog).to.match(
          /\[#358<img .*? \/>]\(issues:\/\/fake-repo\/issues\/358\)/g
        );
        expect(changelog).toInclude('[GH-1](issues://fake-repo/issues/1)');
        done();
      })
    );
});

it('should properly format issues in external issue tracker given an `issueUrlFormat` with `prefix`', function (done) {
  preparing(1);
  conventionalChangelogCore({
    config: getPreset({
      issueUrlFormat: 'https://example.com/browse/{{prefix}}{{id}}',
      issuePrefixes: ['EXAMPLE-']
    })
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('[EXAMPLE-1](https://example.com/browse/EXAMPLE-1)');
        done();
      })
    );
});

it('should replace #[0-9]+ with GitHub format issue URL by default', function (done) {
  preparing(2);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude(
          '[#133](https://github.com/fake-user/fake-repo/issues/133)'
        );
        done();
      })
    );
});

it('should remove the issues that already appear in the subject', function (done) {
  preparing(3);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude(
          '[#88](https://github.com/fake-user/fake-repo/issues/88)'
        );
        expect(changelog.toLowerCase()).not.toInclude(
          'closes [#88](https://github.com/fake-user/fake-repo/issues/88)'
        );
        done();
      })
    );
});

it('should replace @user with configured userUrlFormat', function (done) {
  preparing(4);

  conventionalChangelogCore({
    config: getPreset({
      userUrlFormat: 'https://foo/{{user}}'
    })
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('[@bcoe](https://foo/bcoe)');
        done();
      })
    );
});

it('should not discard commit if there is BREAKING CHANGE', function (done) {
  preparing(5);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('CI/CD');
        expect(changelog).toInclude('Build system');
        expect(changelog).toInclude('Documentation');
        expect(changelog).toInclude('Aesthetics');
        expect(changelog).toInclude('Refactored');
        expect(changelog).toInclude('Test system');

        done();
      })
    );
});

it('should omit optional ! in breaking commit', function (done) {
  preparing(5);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).to.match(/^#{4} \S+ Test system$/m);
        expect(changelog).toInclude('* More tests');

        done();
      })
    );
});

it('should work if there is a semver tag', function (done) {
  preparing(6);
  let index = 0;

  conventionalChangelogCore({
    config: getPreset(),
    outputUnreleased: true
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(
        function (changelog, _, callback) {
          changelog = changelog.toString();

          expect(changelog).toInclude('Some more feats');
          expect(changelog).not.toInclude('BREAKING');

          index++;
          callback();
        },
        function () {
          expect(index).to.equal(1);
          done();
        }
      )
    );
});

it('should treat "feature" as a perfect alias for "feat"', function (done) {
  preparing(7);
  let index = 0;

  conventionalChangelogCore({
    config: getPreset(),
    outputUnreleased: true
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(
        function (changelog, _, callback) {
          changelog = changelog.toString();

          expect(changelog).toInclude('* Some more features');
          expect(changelog).not.toInclude('BREAKING');

          index++;
          callback();
        },
        function () {
          expect(index).to.equal(1);
          done();
        }
      )
    );
});

// TODO: this test is broken by upstream, investigate what to do about it
it('should work with unknown host', function (done) {
  preparing(7);
  let index = 0;

  conventionalChangelogCore({
    config: getPreset({
      commitUrlFormat: 'http://unknown/commit/{{hash}}',
      compareUrlFormat: 'http://unknown/compare/{{previousTag}}...{{currentTag}}'
    }),
    pkg: {
      path: path.join(__dirname, 'fixtures/_unknown-host.json')
    }
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(
        function (changelog, _, callback) {
          changelog = changelog.toString();

          expect(changelog).toInclude('(http://unknown/compare');
          expect(changelog).toInclude('](http://unknown/commit/');

          index++;
          callback();
        },
        function () {
          expect(index).to.equal(1);
          done();
        }
      )
    );
});

it('should work specifying where to find a package.json using conventional-changelog-core', function (done) {
  preparing(8);
  let index = 0;

  conventionalChangelogCore({
    config: getPreset(),
    pkg: {
      path: path.join(__dirname, 'fixtures/_known-host.json')
    }
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(
        function (changelog, _, callback) {
          changelog = changelog.toString();

          expect(changelog).toInclude('(https://github.com/fake-repo/example/compare');
          expect(changelog).toInclude('](https://github.com/fake-repo/example/commit/');
          expect(changelog).toInclude('](https://github.com/fake-repo/example/issues/');

          index++;
          callback();
        },
        function () {
          expect(index).to.equal(1);
          done();
        }
      )
    );
});

it('should fallback to the closest package.json when not providing a location for a package.json', function (done) {
  preparing(8);
  let index = 0;

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      console.info(error);
      done(error);
    })
    .pipe(
      through(
        function (changelog, _, callback) {
          changelog = changelog.toString();

          expect(changelog).toInclude('(https://github.com/fake-user/fake-repo/compare');
          expect(changelog).toInclude('](https://github.com/fake-user/fake-repo/commit/');
          expect(changelog).toInclude('](https://github.com/fake-user/fake-repo/issues/');

          index++;
          callback();
        },
        function () {
          expect(index).to.equal(1);
          done();
        }
      )
    );
});

it('should support non public GitHub repository locations', function (done) {
  preparing(8);

  conventionalChangelogCore({
    config: getPreset(),
    pkg: {
      path: path.join(__dirname, 'fixtures/_ghe-host.json')
    }
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog).toInclude('(https://github.internal.example.com/dlmr');
        expect(changelog).toInclude(
          '(https://github.internal.example.com/fake-repo/internal/compare'
        );
        expect(changelog).toInclude(
          '](https://github.internal.example.com/fake-repo/internal/commit/'
        );
        expect(changelog).toInclude(
          '5](https://github.internal.example.com/fake-repo/internal/issues/5'
        );
        expect(changelog).toInclude(
          '<sup>closes [#10](https://github.internal.example.com/fake-repo/internal/issues/10)'
        );

        done();
      })
    );
});

it('should only replace with link to user if it is a username', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();

        expect(changelog.toLowerCase()).not.toInclude('(https://github.com/5');
        expect(changelog).toInclude('(https://github.com/username');

        expect(changelog.toLowerCase()).not.toInclude(
          '[@dummy](https://github.com/dummy)/package'
        );
        expect(changelog).toInclude('bump @dummy/package from');
        expect(changelog).toInclude('[@Xunnamius](https://github.com/Xunnamius),');
        expect(changelog).toInclude('[@suimannux](https://github.com/suimannux) ');
        expect(changelog).toInclude(
          '[@user1](https://github.com/user1)/[@user2](https://github.com/user2),'
        );
        expect(changelog).toInclude('[@user3](https://github.com/user3)/@+u%+(#bad');
        expect(changelog).toInclude(
          'from [@merchanz039f9](https://github.com/merchanz039f9))'
        );

        expect(changelog).not.toInclude('[@aol');
        done();
      })
    );
});

it('should support multiple lines of footer information', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('closes [#99]');
        expect(changelog).toInclude('[#100]');
        expect(changelog).toInclude('* This completely changes the API');
        done();
      })
    );
});

it('should not require that types are case sensitive', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('incredible new flag');
        done();
      })
    );
});

it('should populate breaking change notes if ! is present', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        // TODO: next version should sweep the rest of the document for links
        // TODO: and transform them
        expect(changelog).toInclude('Incredible new flag FIXES: #33\n');
        done();
      })
    );
});

it('should bold the first line and indent the following lines on multi-line breaking change notes', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('* **The Change is huge. Big. Really big.**\n');
        expect(changelog).toInclude(
          '\n  Really. Like super big. Wow! Here are some extra details!\n'
        );
        done();
      })
    );
});

it('should lowercase scope strings in non-breaking commits', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('Complex new feature');
        done();
      })
    );
});

it('should remove scope strings in breaking commits', function (done) {
  preparing(9);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('incredible new flag');
        done();
      })
    );
});

it('should parse default, customized, and malformed revert commits', function (done) {
  preparing(10);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('*"feat: default revert format"*');
        expect(changelog).toInclude('*Feat: custom revert format*');
        expect(changelog).toInclude('*"Feat(two): custom revert format 2"*');
        expect(changelog).toInclude('*"feat(X): broken-but-still-supported revert"*');

        done();
      })
    );
});

it('should discard ALL commits with skip commands in the subject', function (done) {
  preparing(11);

  conventionalChangelogCore({
    config: getPreset()
  })
    .on('error', function (error) {
      done(error);
    })
    .pipe(
      through(function (changelog) {
        changelog = changelog.toString();
        expect(changelog).toInclude('include1');
        expect(changelog).not.toInclude('BREAKING');
        expect(changelog).not.toInclude('skip1');
        expect(changelog).not.toInclude('skip2');
        expect(changelog).not.toInclude('skip3');

        done();
      })
    );
}); */

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
  incomingConfig: Pick<WithMockedFixtureOptions, 'test'> &
    Partial<Omit<WithMockedFixtureOptions, 'test'>>,
  environmentPatches: TestEnvironmentPatch[]
) {
  const { test: customFn } = incomingConfig;
  const config = getBaseEnvironmentConfig(incomingConfig);

  config.options.initialFileContents['package.json'] = JSON.stringify({
    name: 'fake-pkg',
    version: '1.2.3',
    description: 'fake',
    repository: {
      type: 'git',
      url: 'https://github.com/fake-user/fake-repo.git',
      lens: 'cjs'
    }
  });

  return withMockedFixture({
    ...config,
    async test(context) {
      const { git, fs, root } = context;
      assert(git, 'expected git instance to be defined');

      for (const { messages, callback } of environmentPatches) {
        await callback?.({ messages, context } as Parameters<typeof callback>[0]);

        if (messages.length) {
          await createBasicCommits(messages, { git, fs, root });
        }
      }

      return customFn(context);
    }
  });
}

function generatePatchesForEnvironment1(): TestEnvironmentPatch[] {
  return [
    {
      messages: [
        'build!: first build setup\nBREAKING CHANGE: New build system.',
        'ci(travis): add TravisCI pipeline\nBREAKING CHANGE: Continuously integrated.',
        'Feat: amazing new module\nBREAKING CHANGE: Not backward compatible.',
        'Fix(compile): avoid a bug\nBREAKING CHANGE: The Change is huge.',
        'perf(ngOptions): make it faster\n closes #1, #2',
        'fix(changelog): proper issue links\nsee #1, fake-user/fake-repo#358',
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
        'build(npm): edit build script\nBREAKING CHANGE: The Change is huge.',
        'ci(travis): setup travis\nBREAKING CHANGE: The Change is huge.',
        'docs(readme): make it clear\nBREAKING CHANGE: The Change is huge.',
        'style(whitespace): make it easier to read\nBREAKING CHANGE: The Change is huge.',
        'refactor(code): change a lot of code\nBREAKING CHANGE: The Change is huge.',
        'test(*)!: more tests\nBREAKING CHANGE: The Change is huge.'
      ]
    }
  ]);
}

function generatePatchesForEnvironment6(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment5().concat([
    {
      messages: ['feat: some more feats'],
      callback({ context: { git } }) {
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
        'feature: some more features',
        'feat: even more features'
      ],
      callback({ context: { git } }) {
        return git.addAnnotatedTag('v0.2.0', 'v0.2.0');
      }
    }
  ]);
}

function generatePatchesForEnvironment8(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment7().concat([
    {
      messages: ['feat(*): implementing #5 by @dlmr\n closes #10']
    }
  ]);
}

function generatePatchesForEnvironment9(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment8().concat([
    {
      messages: [
        'fix: use npm@5 (@username)\nbuild(deps): bump @dummy/package from 7.1.2 to 8.0.0 (thanks @Xunnamius, @suimannux @user1/@user2, @user3/@+u%+(#bad email@aol.com with help from @merchanz039f9)\nBREAKING CHANGE: The Change is huge. Big. Really big.\nReally. Like super big. Wow! Here are some extra details!',
        'feat: complex new feature\nthis is a complex new feature with many reviewers\nReviewer: @hutson\nFixes: #99\nRefs: #100\nBREAKING CHANGE: this completely changes the API',
        'FEAT(FOO)!: incredible new flag FIXES: #33'
      ]
    }
  ]);
}

function generatePatchesForEnvironment10(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment9().concat([
    {
      messages: [
        'Revert feat: default revert format"\nThis reverts commit 1234.',
        'revert: feat: custom revert format\nThis reverts commit 5678.',
        'revert: "Feat(two): custom revert format 2"\nThis reverts commit 9101112.',
        'revert: "feat(X): broken-but-still-supported revert"'
      ]
    }
  ]);
}

function generatePatchesForEnvironment11(): TestEnvironmentPatch[] {
  return generatePatchesForEnvironment10().concat([
    {
      messages: [
        'refactor(code): big bigly big change skip1! [skip ci]\nBREAKING CHANGE: the change is bigly luxurious 5-stars everybody is saying',
        'feat: something else skip2 [cd skip]',
        'fix: something other skip3 [CI SKIP]',
        'revert: "build(bore): include1 [skipcd]'
      ],
      callback({ context: { git } }) {
        return git.addAnnotatedTag('v0.3.0', 'v0.3.0');
      }
    }
  ]);
}
