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

import {
  isRootPackage,
  ProjectAttribute
} from 'multiverse+project-utils:analyze/common.ts';

import { gatherProjectFiles } from 'multiverse+project-utils:analyze.ts';
import { ProjectError } from 'multiverse+project-utils:error.ts';

import {
  jestConfigProjectBase,
  toRelativePath,
  Tsconfig,
  tstycheConfigProjectBase
} from 'multiverse+project-utils:fs.ts';

import { runNoRejectOnBadExit } from 'multiverse+run';

import { baseConfig } from 'universe:assets/config/_jest.config.mjs.ts';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  checkAllChoiceIfGivenIsByItself,
  checkArrayNotEmpty,
  checkIsNotNegative,
  runGlobalPreChecks,
  withGlobalBuilder
} from 'universe:util.ts';

// ! Cannot use the global (g) flag
const tstycheTargetRegExp = /(^|\/)type-.*\.test\.(m|c)?tsx?$/;
const tstycheVacuousSuccessMessage =
  'Tstyche tests vacuously succeeded: no "type-*.test.tsx?" files were found';

/**
 * Which type of test to run.
 */
export enum TestType {
  /**
   * Include type tests from the chosen scope.
   */
  Type = 'type',
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
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    (blackFlag) => {
      blackFlag.strict(false);
      blackFlag.parserConfiguration({ 'unknown-options-as-args': true });

      return {
        scope: {
          choices: testerScopes,
          default: TesterScope.ThisPackage
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
          ],
          subOptionOf: {
            type: {
              when: (type: TestType) => type === TestType.Type,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  conflicts: { scope: TesterScope.ThisPackageIntermediates }
                };
              }
            },
            baseline: {
              when: (baseline: boolean) => baseline,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  // ? Do not run type-only tests when --baseline is given. Note
                  // ? also how --baseline and --type conflict (see below)
                  default: [TestType.Unit, TestType.Integration, TestType.EndToEnd]
                };
              }
            }
          }
        },
        repeat: {
          number: true,
          description:
            'Repeat entire Jest (not Tstyche) test suite --repeat times after initial run',
          default: 0,
          conflicts: [{ type: TestType.Type }, { type: TestType.All }],
          check: checkIsNotNegative('repeat')
        },
        'collect-coverage': {
          alias: 'coverage',
          boolean: true,
          description: 'Instruct Jest (not Tstyche) to collect coverage information',
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
          description: 'Make the DEBUG environment variable visible to Jest/Tstyche',
          default: !!process.env.CI,
          defaultDescription: 'true if in a CI environment, false otherwise'
        },
        'skip-slow-tests': {
          alias: 'x',
          count: true,
          description: 'Instruct Jest (not Tstyche) to skip tests marked slow',
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
          description: 'Executing Jest alone without any added scope/type args/patterns',
          default: false,
          conflicts: ['type', 'scope']
        }
      };
    }
  );

  return {
    builder,
    description: 'Run available type, unit, integration, and/or e2e tests',
    usage: `Usage: $000 [options] [extra-arguments-passed-to-underlying-runner]

$1.

Currently, "type" (\`--type="type"\`) tests are executed by the Tstyche test runner while all others are executed by the Jest test runner. Therefore, all test files should be appropriately named (e.g. "\${type}-\${name}.test.ts") and exist under a package's ./test directory.

Any extra arguments passed to this command, including file globs and unrecognized flags, are always passed through directly to Jest (not Tstyche). They are inserted after computed args but before test path patterns, i.e. \`--reporters=... --testPathIgnorePatterns=... <your extra args> -- testPathPattern1 testPathPattern2\`.

By default, this command constructs an execution plan (i.e. the computed arguments and path patterns passed to Tstyche/Jest's CLI) based on project metadata and provided options. Alternatively, you can provide --baseline when you want to construct your own custom Jest execution plan but still wish to make use of the runtime environment provided by this tool. Note that using --baseline will disable Tstyche "type" tests.

Also by default (if the CI environment variable is not defined), this command prevents the value of the DEBUG environment variable, if given, from propagating down into tests since this can cause strange output-related problems. Provide --propagate-debug-env to allow the value of DEBUG to be seen by test files and the rest of the test environment, including tests.

Provide --collect-coverage to instruct Jest to collect coverage information. --collect-coverage is false by default unless \`--scope=${TesterScope.Unlimited}\` and \`--type=${TestType.All}\`, in which case it will be true by default. Note that Tstyche never provides coverage information; this flag only affects Jest.

For detecting flakiness in tests, which is almost always a sign of deep developer error, provide --repeat; e.g. \`--repeat 100\`. Note that this flag cannot be used when running Tstyche "type" tests.

For running "intermediate" test files transpiled by \`xscripts build\`, provide \`--scope=${TesterScope.ThisPackageIntermediates}\` to set the XSCRIPTS_TEST_JEST_TRANSPILED environment variable in the testing environment. This will be picked up by Jest and other relevant tooling causing them to reconfigure themselves to run any transpiled tests under the ./.transpiled directory.

Provide --skip-slow-tests (or -x) to set the XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS environment variable in the testing environment. This will activate the \`reconfigureJestGlobalsToSkipTestsInThisFileIfRequested\` function of the @-xun/jest library, which will force Jest to skip by default all tests within files where said function was invoked. Providing --skip-slow-tests twice (or -xx) has the same effect, with the addition that test files that have "-slow." in their name are skipped entirely (not even looked at by Jest or executed by Node). This can be used in those rare instances where even the mere execution of a test file is too slow, such as a test file with hundreds or even thousands of generated tests that must be skipped. Note, however, that --skip-slow-tests has no bearing on the Tstyche runtime.`,
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
        rootPackage: { root: projectRoot },
        cwdPackage
      } = projectMetadata;

      const packageRoot = cwdPackage.root;

      debug('projectRoot: %O', projectRoot);
      debug('packageRoot: %O', packageRoot);

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

      // ! Test path patterns should begin with a slash (/)
      const testPathPatterns: string[] = [];
      const { testPathIgnorePatterns = [] } = baseConfig;
      const isMonorepo = projectMetadata.type === ProjectAttribute.Monorepo;
      const isCwdTheProjectRoot = isRootPackage(cwdPackage);
      const npxJestArguments = ['jest'];

      const npxTstycheArguments = [
        'tstyche',
        '--config',
        `${projectRoot}/${tstycheConfigProjectBase}`,
        '--tsconfig',
        `${projectRoot}/${Tsconfig.ProjectBase}`
      ];

      if (collectCoverage) {
        npxJestArguments.push('--coverage');
      }

      if (!baseline) {
        // * When scope is set to Intermediate, that's handled in
        // * jest.config.mjs, which is aware of the
        // * XSCRIPTS_TEST_JEST_TRANSPILED environment variable.

        if (allTypes || types.includes(TestType.Unit)) {
          // ? These sorts of patterns match at any depth (leading / isn't root)
          testPathPatterns.push(String.raw`/test(/.*)?/unit(-.*)?\.test\.tsx?`);
        }

        if (allTypes || types.includes(TestType.Integration)) {
          testPathPatterns.push(String.raw`/test(/.*)?/integration(-.*)?\.test\.tsx?`);
        }

        if (allTypes || types.includes(TestType.EndToEnd)) {
          testPathPatterns.push(String.raw`/test(/.*)?/e2e(-.*)?\.test\.tsx?`);
        }

        if (isMonorepo && scope === TesterScope.ThisPackage && isCwdTheProjectRoot) {
          testPathIgnorePatterns.push('/packages/');
        }

        if (testPathIgnorePatterns.length) {
          npxJestArguments.push(
            `--testPathIgnorePatterns=${testPathIgnorePatterns.map((p) => `(${p})`).join('|')}`
          );
        }
      }

      if (isRepeating) {
        // ? Jest's CLI array intake ability is trash, so all array-taking
        // ? args need to be followed by another arg (i.e. --something)
        npxJestArguments.push('--reporters=jest-silent-reporter');
      }

      // ? Order matters, so keep this here due to how Jest CLI handles arrays.
      // ? E.g. the user might add extra array arguments, so they have to be
      // ? followed by a non-array argument since we append file paths (below)
      npxJestArguments.push(
        ...extraArguments,
        `--config=${projectRoot}/${jestConfigProjectBase}`
      );

      const relativePackageRoot = toRelativePath(projectRoot, packageRoot);
      debug('relativePackageRoot: %O', relativePackageRoot);

      const tstycheTargetAbsolutePaths = await gatherProjectFiles(projectMetadata, {
        useCached: true
      }).then(({ typescriptTestFiles }) =>
        scope === TesterScope.ThisPackage
          ? isCwdTheProjectRoot
            ? typescriptTestFiles.inRootTest
            : typescriptTestFiles.inWorkspaceTest.get(cwdPackage.id)!
          : typescriptTestFiles.all
      );

      const tstycheTargetRelativePaths = tstycheTargetAbsolutePaths
        .filter(
          (path) => path.startsWith(packageRoot + '/') && tstycheTargetRegExp.test(path)
        )
        .map((path) => toRelativePath(packageRoot, path) as string);

      debug('tstycheTargetRelativePaths: %O', tstycheTargetRelativePaths);

      npxTstycheArguments.push(...tstycheTargetRelativePaths);

      if (testPathPatterns) {
        const jestPrefix = isCwdTheProjectRoot ? '' : '/' + relativePackageRoot;

        const finalJestTestPathPatterns =
          scope === TesterScope.ThisPackage
            ? // ? Assumes all patterns start with a slash (/)
              testPathPatterns.map((pattern) => jestPrefix + pattern)
            : testPathPatterns;

        npxJestArguments.push(...finalJestTestPathPatterns);
      }

      debug('npxTstycheArguments: %O', npxTstycheArguments);
      debug('npxJestArguments: %O', npxJestArguments);

      const shouldRunTstycheTests = types.includes(TestType.Type);
      const shouldRunJestTests = types.length > 1 || !shouldRunTstycheTests;

      debug('will run tstyche tests: %O', shouldRunTstycheTests);
      debug('will run jest tests: %O', shouldRunJestTests);

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

        const [tstycheResult, jestResult] = await Promise.all([
          allTypes || shouldRunTstycheTests
            ? tstycheTargetRelativePaths.length
              ? // {@xscripts/notExtraneous tstyche}
                runNoRejectOnBadExit('npx', npxTstycheArguments, {
                  all: true,
                  env,
                  cwd: projectRoot
                })
              : Promise.resolve({
                  all: `(${tstycheVacuousSuccessMessage.toLowerCase()})`,
                  exitCode: 0
                })
            : Promise.resolve({ all: '(tstyche tests were skipped)', exitCode: 0 }),
          shouldRunJestTests
            ? runNoRejectOnBadExit('npx', npxJestArguments, {
                env,
                cwd: projectRoot,
                stdout: isHushed ? 'ignore' : 'inherit',
                stderr: isQuieted ? 'ignore' : 'inherit'
              })
            : Promise.resolve({ all: '(jest tests were skipped)', exitCode: 0 })
        ]);

        const { all: tstycheOutput_, exitCode: tstycheExitCode } = tstycheResult;
        const tstycheOutput = [tstycheOutput_ || ''].flat().join('\n');

        const isTstycheError =
          tstycheExitCode !== 0 &&
          !tstycheOutput?.includes(
            'No test files were selected using current configuration'
          );

        if (!isRepeating) {
          debug('tstycheOutput: %O', tstycheOutput);
          debug('isTstycheError: %O', isTstycheError);
          debug('tstycheExitCode: %O', tstycheExitCode);

          if (isTstycheError) {
            if (shouldRunJestTests) {
              genericLogger.newline([LogTag.IF_NOT_QUIETED]);
            }

            if (!isQuieted) {
              if (tstycheOutput) {
                process.stderr.write(tstycheOutput + '\n');
              } else {
                genericLogger.error(
                  [LogTag.IF_NOT_QUIETED],
                  '%O returned exit code %O but generated no output',
                  'tstyche',
                  tstycheExitCode
                );
              }
            }
          } else if (!isHushed) {
            if (shouldRunJestTests) {
              genericLogger.newline();
            }

            if (tstycheExitCode !== 0) {
              genericLogger([LogTag.IF_NOT_HUSHED], tstycheVacuousSuccessMessage);
            } else {
              process.stdout.write(tstycheOutput + '\n');
            }
          }
        }

        if (isTstycheError || jestResult.exitCode !== 0) {
          genericLogger.newline([LogTag.IF_NOT_HUSHED]);
          throw new ProjectError(ErrorMessage.TestingFailed());
        }

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
