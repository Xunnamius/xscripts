/* eslint-disable no-await-in-loop */
import { setTimeout as delay } from 'node:timers/promises';

import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import {
  checkAllChoiceIfGivenIsByItself,
  checkIsNonNegative,
  globalPreChecks
} from 'universe/util';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import { withStandardBuilder } from 'multiverse/@-xun/cli-utils/extensions';
import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { run } from 'multiverse/run';

/**
 * Which type of test to run.
 */
export enum TestType {
  /**
   * Include unit tests from the chosen scope
   */
  Unit = 'unit',
  /**
   * Include integration tests from the chosen scope
   */
  Integration = 'integration',
  /**
   * Include end-to-end tests from the chosen scope
   */
  EndToEnd = 'end-to-end',
  /**
   * Include all test types from the chosen scope.
   *
   * Will also include code coverage results by default.
   */
  All = 'all'
}

/**
 * The context in which to search for tests to run.
 */
export enum TestScope {
  /**
   * Run tests under the ./tests directory except `External`
   */
  Source = 'source',
  /**
   * Run tests under the ./lib directory
   */
  Library = 'library',
  /**
   * Run tests under the ./tests directory except `Source`
   */
  External = 'external',
  /**
   * Run tests under the ./.transpiled directory
   */
  Intermediate = 'intermediate',
  /**
   * Run tests across all scopes except `Intermediate`.
   */
  All = 'all'
}

const testTypes = Object.values(TestType);
const testScopes = Object.values(TestScope);

export type CustomCliArguments = GlobalCliArguments & {
  type: TestType[];
  scope: TestScope[];
  repeat: number;
  collectCoverage: boolean;
  nodeOptions: string[];
  baseline: boolean;
};

export default function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >((blackFlag) => {
    blackFlag.strict(false);

    return {
      type: {
        alias: 'types',
        array: true,
        choices: testTypes,
        description: 'Which test type(s) to run',
        default: [TestType.All],
        check: checkAllChoiceIfGivenIsByItself(TestType.All, 'test type')
      },
      scope: {
        alias: 'scopes',
        array: true,
        choices: testScopes,
        description: 'The context(s) in which test types are discovered and run',
        default: [TestType.All],
        check: checkAllChoiceIfGivenIsByItself(TestScope.All, 'test scope')
      },
      repeat: {
        number: true,
        description: 'Repeat entire test suite --repeat times after initial run',
        default: 0,
        check: checkIsNonNegative('repeat')
      },
      'collect-coverage': {
        alias: 'coverage',
        boolean: true,
        description: 'Instruct Jest to collect coverage information',
        defaultDescription: 'false unless --type and --scope are both "all"',
        default: false,
        subOptionOf: {
          type: {
            when: (type: TestType[], { scope }) =>
              type.includes(TestType.All) && scope.includes(TestScope.All),
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                default: true
              };
            }
          }
        }
      },
      'node-options': {
        string: true,
        array: true,
        description: 'The options passed to the Node runtime via NODE_OPTIONS',
        default: ['--no-warnings --experimental-vm-modules']
      },
      baseline: {
        alias: ['base', 'bare'],
        boolean: true,
        description: 'Do not add scope- or type- based paths to the execution plan',
        default: false,
        conflicts: ['type', 'scope']
      }
    };
  });

  return {
    builder,
    description: 'Run available unit, integration, and/or e2e tests',
    usage: `Usage: $000 [options] [extra-jest-arguments]\n\n$1.\n\nFor detecting flakiness in tests, which is almost always a sign of deep developer error, use --repeat; e.g. \`--repeat 100\`.\n\nAny "extra" arguments passed to this command, including file globs and unrecognized flags, are always passed through directly to Jest. Therefore, use --baseline when you want to construct your own custom Jest execution plan but still wish to make use of the standard environmental setup provided by this tool.`,
    handler: withStandardHandler(async function ({
      _: _extraArguments,
      $0: scriptFullName,
      collectCoverage,
      nodeOptions,
      repeat,
      scope: scopes,
      type: types,
      baseline,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Testing project...');

      debug('collectCoverage: %O', collectCoverage);
      debug('nodeOptions: %O', nodeOptions);
      debug('repeat: %O', repeat);
      debug('test scope: %O', scopes);
      debug('test type: %O', types);
      debug('baseline: %O', baseline);

      const extraArguments = _extraArguments.map(String);

      debug('extraArguments: %O', extraArguments);

      const {
        project: {
          // ? This does NOT end in a slash and this must be taken into account!
          root: rootDir
        }
      } = runtimeContext;

      debug('rootDir: %O', rootDir);

      const allTypes = types.includes(TestType.All);
      const allScopes = scopes.includes(TestScope.All);
      const isRepeating = repeat > 0;

      if (isRepeating) {
        genericLogger.message(
          [LogTag.IF_NOT_QUIETED],
          `Entire test suite will run once then repeat ${repeat} additional times`
        );
      }

      debug('allTypes: %O', allTypes);
      debug('allScopes: %O', allScopes);

      // eslint-disable-next-line unicorn/prevent-abbreviations
      const env: Record<string, string> = {
        DEBUG_COLORS: 'false',
        NODE_ENV: 'test',
        // eslint-disable-next-line unicorn/no-array-reduce
        NODE_OPTIONS: nodeOptions.reduce(
          (previous, current) => (previous + current).trim(),
          ''
        )
      };

      if (scopes.includes(TestScope.Intermediate)) {
        env['JEST_TRANSPILED'] = 'true';
      }

      if (scopes.includes(TestScope.External)) {
        env['JEST_EXTERNALS'] = 'true';
      }

      if (isRepeating) {
        env['JEST_SILENT_REPORTER_SHOW_WARNINGS'] = 'true';
      }

      debug('env: %O', env);

      const prefixDirectories = new Set<string>();
      const testPaths: string[] = [];
      const npxArguments = ['jest', `--config=${rootDir}/jest.config.js`];

      if (collectCoverage) {
        npxArguments.push('--coverage');
      }

      if (!baseline) {
        // * When scope includes Intermediate/External, that's handled in
        // * jest.config.js, which is aware of the JEST_TRANSPILED and
        // * JEST_EXTERNALS environment variables.

        if (
          allScopes ||
          scopes.includes(TestScope.Intermediate) ||
          scopes.includes(TestScope.External) ||
          scopes.includes(TestScope.Source)
        ) {
          prefixDirectories.add('test');
        }

        if (
          allScopes ||
          scopes.includes(TestScope.Intermediate) ||
          scopes.includes(TestScope.Library)
        ) {
          prefixDirectories.add('lib');
        }

        // TODO: construct paths in a monorepo-aware way

        if (allTypes || types.includes(TestType.Unit)) {
          prefixDirectories.forEach((prefix) =>
            testPaths.push(`${prefix}(/.*)?/unit(-.*)?\\.test\\.tsx?`)
          );
        }

        if (allTypes || types.includes(TestType.Integration)) {
          prefixDirectories.forEach((prefix) =>
            testPaths.push(`${prefix}(/.*)?/integration(-.*)?\\.test\\.tsx?`)
          );
        }

        if (allTypes || types.includes(TestType.EndToEnd)) {
          prefixDirectories.forEach((prefix) =>
            testPaths.push(`${prefix}(/.*)?/e2e(-.*)?\\.test\\.tsx?`)
          );
        }
      }

      npxArguments.push(...testPaths, ...extraArguments);

      if (isRepeating) {
        // ? Has to be last due to how Jest's CLI processes array arguments
        npxArguments.push('--reporters=jest-silent-reporter');
      }

      debug('npxArguments: %O', npxArguments);

      // TODO: replace this and the rest with listr2

      for (let iteration = 0, max = repeat + 1; iteration < max; ++iteration) {
        if (isRepeating) {
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            `Repeating test suite [run ${iteration + 1}/${max}]...`
          );
        } else {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
        }

        await run('npx', npxArguments, {
          env,
          cwd: rootDir,
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        });

        if (isRepeating) {
          genericLogger([LogTag.IF_NOT_QUIETED], 'Run succeeded!');
          // ? Give the OS and filesystem some breathing room...
          await delay(150);
        }
      }

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
