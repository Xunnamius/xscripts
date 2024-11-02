/* eslint-disable no-await-in-loop */
import { setTimeout as delay } from 'node:timers/promises';

import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { ProjectAttribute } from 'multiverse+project-utils:analyze/common.ts';
import { jestConfigProjectBase } from 'multiverse+project-utils:fs.ts';
import { run } from 'multiverse+run';

import { baseConfig } from 'universe:assets/config/_jest.config.mjs.ts';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import {
  checkAllChoiceIfGivenIsByItself,
  checkArrayNotEmpty,
  checkIsNotNegative,
  runGlobalPreChecks,
  withGlobalBuilder
} from 'universe:util.ts';

/**
 * Which type of test to run.
 */
export enum TestType {
  /**
   * Include unit tests from the chosen scope.
   */
  Unit = 'unit',
  /**
   * Include integration tests from the chosen scope.
   */
  Integration = 'integration',
  /**
   * Include end-to-end tests from the chosen scope.
   */
  EndToEnd = 'end-to-end',
  /**
   * Include all test types from the chosen scope.
   *
   * Will also include code coverage results by default.
   */
  All = 'all'
}

export enum TestScope_ {
  /**
   * Limit the command to relevant _transpiled_ files (aka "intermediates")
   * within `./.transpiled` (with respect to the current working directory).
   */
  ThisPackageIntermediates = 'this-package-intermediates'
}

/**
 * The context in which to search for test files.
 */
export type TesterScope = DefaultGlobalScope | TestScope_;

/**
 * The context in which to search for test files.
 */
export const TesterScope = { ...DefaultGlobalScope, ...TestScope_ } as const;

/**
 * @see {@link TestType}
 */
export const testTypes = Object.values(TestType);

/**
 * @see {@link TesterScope}
 */
export const testerScopes = Object.values(TesterScope);

export type CustomCliArguments = GlobalCliArguments<TesterScope> & {
  type: TestType[];
  repeat: number;
  collectCoverage: boolean;
  skipSlowTests: number;
  nodeOptions: string[];
  baseline: boolean;
  propagateDebugEnv: boolean;
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const defaultScope = determineDefaultScope();

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    (blackFlag) => {
      blackFlag.strict(false);
      blackFlag.parserConfiguration({ 'unknown-options-as-args': true });

      return {
        scope: {
          choices: testerScopes,
          default: defaultScope
        },
        type: {
          alias: 'types',
          array: true,
          choices: testTypes,
          description: 'Which test type(s) to run',
          default: [TestType.All],
          check: [
            checkArrayNotEmpty('--type'),
            checkAllChoiceIfGivenIsByItself(TestType.All, 'test type')
          ]
        },
        repeat: {
          number: true,
          description: 'Repeat entire test suite --repeat times after initial run',
          default: 0,
          check: checkIsNotNegative('repeat')
        },
        'collect-coverage': {
          alias: 'coverage',
          boolean: true,
          description: 'Instruct Jest to collect coverage information',
          defaultDescription: 'false unless --type=all and --scope=unlimited',
          default: false,
          subOptionOf: {
            type: {
              when: (type: TestType[], { scope }) =>
                type.includes(TestType.All) && scope === TesterScope.Unlimited,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  default: true
                };
              }
            }
          }
        },
        'propagate-debug-env': {
          alias: 'debug',
          boolean: true,
          description: 'Make the DEBUG environment variable visible to Jest',
          default: false
        },
        'skip-slow-tests': {
          alias: 'x',
          count: true,
          description: 'Instruct Jest to skip tests marked slow',
          default: false
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
          description: 'Do not use computed scope/type args/patterns when executing Jest',
          default: false,
          conflicts: ['type', 'scope']
        }
      };
    }
  );

  return {
    builder,
    description: 'Run available unit, integration, and/or e2e tests',
    usage: `Usage: $000 [options] [extra-jest-arguments]

$1.

Any extra arguments passed to this command, including file globs and unrecognized flags, are always passed through directly to Jest. They are inserted after computed args but before test path patterns, i.e. \`--reporters=... --testPathIgnorePatterns=... <your extra args> -- testPathPattern1 testPathPattern2\`.

By default, this command constructs an execution plan (i.e. the computed arguments and path patterns passed to Jest's CLI) based on project metadata and provided options. Alternatively, you can provide --baseline when you want to construct your own custom Jest execution plan but still wish to make use of the runtime environment provided by this tool.

Also by default, this command prevents the value of the DEBUG environment variable, if given, from propagating down into tests since this can cause strange output-related problems. Provide --propagate-debug-env to allow the value of DEBUG to be seen by Jest and the rest of the test environment, including tests.

Provide --collect-coverage to instruct Jest to collect coverage information. --collect-coverage is false by default unless \`--scope=${TesterScope.Unlimited}\` and \`--type=${TestType.All}\`, in which case it will be true by default.

For detecting flakiness in tests, which is almost always a sign of deep developer error, provide --repeat; e.g. \`--repeat 100\`.

For running "intermediate" test files transpiled by \`xscripts build\`, provide \`--scope=${TesterScope.ThisPackageIntermediates}\` to set the XSCRIPTS_TEST_JEST_TRANSPILED environment variable in the testing environment. This will be picked up by jest and other relevant tooling causing them to reconfigure themselves to run any transpiled tests under the ./.transpiled directory. Otherwise, the default value for --scope in the current project is${defaultScope ? `: ${defaultScope}` : ' not resolvable (xscripts seems not to be running in a project repository)'}.

Provide --skip-slow-tests (or -x) to set the XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS environment variable in the testing environment. This will activate the \`reconfigureJestGlobalsToSkipTestsInThisFileIfRequested\` function of the @-xun/jest library, which will force Jest to skip by default all tests within files where said function was invoked. Providing --skip-slow-tests twice (or -xx) has the same effect, with the addition that test files that have "-slow." in their name are skipped entirely (not even looked at by Jest or executed by Node). This can be used in those rare instances where even the mere execution of a test file is too slow, such as a test file with hundreds or even thousands of generated tests that must be skipped.`,
    handler: withGlobalHandler(async function ({
      _: _extraArguments,
      $0: scriptFullName,
      scope,
      collectCoverage,
      skipSlowTests,
      nodeOptions,
      propagateDebugEnv,
      repeat,
      type: types,
      baseline,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Testing project...');

      debug('collectCoverage: %O', collectCoverage);
      debug('skipSlowTests: %O', skipSlowTests);
      debug('nodeOptions: %O', nodeOptions);
      debug('repeat: %O', repeat);
      debug('propagateDebugEnv: %O', propagateDebugEnv);
      debug('test scope: %O', scope);
      debug('test type: %O', types);
      debug('baseline: %O', baseline);

      const extraArguments = _extraArguments.map(String);

      debug('extraArguments: %O', extraArguments);

      const {
        rootPackage: { root: projectRoot }
      } = projectMetadata;

      debug('projectRoot: %O', projectRoot);

      const allTypes = types.includes(TestType.All);
      const isRepeating = repeat > 0;

      debug('allTypes: %O', allTypes);

      if (isRepeating) {
        genericLogger.message(
          [LogTag.IF_NOT_QUIETED],
          `Entire test suite will run once then repeat ${repeat} additional times`
        );
      }

      const env: Record<string, string | undefined> = {
        DEBUG: undefined,
        DEBUG_COLORS: 'false',
        NODE_ENV: 'test',
        // eslint-disable-next-line unicorn/no-array-reduce
        NODE_OPTIONS: nodeOptions.reduce(
          (previous, current) => (previous + ' ' + current).trim(),
          ''
        )
      };

      if (scope === TesterScope.ThisPackageIntermediates) {
        env.XSCRIPTS_TEST_JEST_TRANSPILED = 'true';
      }

      if (skipSlowTests) {
        env.XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS = skipSlowTests.toString();
      }

      if (isRepeating) {
        env.JEST_SILENT_REPORTER_SHOW_WARNINGS = 'true';
      }

      if (propagateDebugEnv) {
        env.DEBUG = process.env.DEBUG;
      }

      debug('env: %O', env);

      const testPathPatterns: string[] = [];
      const { testPathIgnorePatterns = [] } = baseConfig;
      const isMonorepo = projectMetadata.type === ProjectAttribute.Monorepo;
      const npxArguments = ['jest'];
      const isCwdTheProjectRoot =
        projectMetadata.cwdPackage === projectMetadata.rootPackage;

      if (collectCoverage) {
        npxArguments.push('--coverage');
      }

      if (!baseline) {
        // * When scope is set to Intermediate, that's handled in
        // * jest.config.mjs, which is aware of the
        // * XSCRIPTS_TEST_JEST_TRANSPILED environment variable.

        if (allTypes || types.includes(TestType.Unit)) {
          testPathPatterns.push(String.raw`/test(/.*)?/unit(-.*)?\.test\.tsx?`);
        }

        if (allTypes || types.includes(TestType.Integration)) {
          testPathPatterns.push(String.raw`/test(/.*)?/integration(-.*)?\.test\.tsx?`);
        }

        if (allTypes || types.includes(TestType.EndToEnd)) {
          testPathPatterns.push(String.raw`/test(/.*)?/e2e(-.*)?\.test\.tsx?`);
        }

        if (scope === TesterScope.ThisPackage && isCwdTheProjectRoot && isMonorepo) {
          testPathIgnorePatterns.push('/packages/');
        }

        if (testPathIgnorePatterns.length) {
          npxArguments.push(
            `--testPathIgnorePatterns=${testPathIgnorePatterns.map((p) => `(${p})`).join('|')}`
          );
        }
      }

      if (isRepeating) {
        // ? Jest's CLI array intake ability is trash, so all array-taking
        // ? args need to be followed by another arg (i.e. --something)
        npxArguments.push('--reporters=jest-silent-reporter');
      }

      npxArguments.push(
        `--config=${projectRoot}/${jestConfigProjectBase}`,
        ...extraArguments
      );

      if (testPathPatterns) {
        npxArguments.push(...testPathPatterns);
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
          cwd: projectRoot,
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

  function determineDefaultScope(): TesterScope | undefined {
    if (projectMetadata_) {
      const { cwdPackage, rootPackage } = projectMetadata_;
      const isCwdTheProjectRoot = cwdPackage === rootPackage;

      return isCwdTheProjectRoot && rootPackage.attributes[ProjectAttribute.Hybridrepo]
        ? TesterScope.ThisPackage
        : TesterScope.Unlimited;
    }

    return undefined;
  }
}
