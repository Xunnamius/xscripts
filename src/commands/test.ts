import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { globalPreChecks } from 'universe/util';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import { withStandardBuilder } from 'multiverse/@-xun/cli-utils/extensions';
import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';

/**
 * Which type of test to run.
 */
enum TestTarget {
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
enum TestScope {
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

const testTargets = Object.values(TestTarget);
const testScopes = Object.values(TestScope);

export type CustomCliArguments = GlobalCliArguments & {
  target: TestTarget[];
  scope: TestScope[];
  repeat: number;
  collectCoverage: boolean;
  nodeOptions: string[];
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
      target: {
        array: true,
        choices: testTargets,
        description: 'Which test types to run',
        default: [TestTarget.All],
        check: checkAllIsGivenByItself
      },
      scope: {
        array: true,
        choices: testScopes,
        description: 'The context in which test types are discovered and run',
        default: [TestTarget.All],
        check: checkAllIsGivenByItself
      },
      repeat: {
        boolean: true,
        description: 'Repeat entire test suite --repeat times after initial run',
        default: 0
      },
      'collect-coverage': {
        boolean: true,
        description: 'Instruct Jest to collect coverage information',
        default: false,
        subOptionOf: {
          target: {
            when: (target: TestTarget[]) => target.includes(TestTarget.All),
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
      }
    };
  });

  return {
    builder,
    description: 'Run available unit, integration, and/or e2e tests',
    usage: `Usage: $000 [options] [extra-jest-arguments]\n\n$1.\n\nAny "extra" arguments passed to this command, including file globs and unrecognized flags, will be passed through directly to Jest.\n\nFor detecting flakiness in tests, which is almost always a sign of deep developer error, use --repeat; e.g. \`--repeat 100\`.`,
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Testing project...');

      // TODO (include JEST_TRANSPILED when relevant (Intermediate scope))
      // TODO (each test target should include externals and lib)
      // TODO (split nodeOptions entries by space and flatten array)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}

function checkAllIsGivenByItself(choices: (TestTarget | TestScope)[]) {
  const includesAll = choices.includes(TestTarget.All) || choices.includes(TestScope.All);

  return !includesAll || choices.length === 1 || ErrorMessage.AllScopeMustBeAlone();
}
