/* eslint-disable no-await-in-loop */
import { setTimeout as delay } from 'node:timers/promises';

import { runNoRejectOnBadExit } from '@-xun/run';
import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';
import { softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { isRootPackage } from 'multiverse+project-utils:analyze/common.ts';

import {
  gatherPackageBuildTargets,
  gatherProjectFiles,
  ProjectAttribute,
  type Package
} from 'multiverse+project-utils:analyze.ts';

import {
  jestConfigProjectBase,
  testDirPackageBase,
  toPath,
  toRelativePath,
  Tsconfig,
  tstycheConfigProjectBase
} from 'multiverse+project-utils:fs.ts';

import { SHORT_TAB } from 'multiverse+rejoinder';

import { baseConfig } from 'universe:assets/config/_jest.config.mjs.ts';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  checkArrayNotEmpty,
  checkIsNotNegative,
  runGlobalPreChecks,
  withGlobalBuilder
} from 'universe:util.ts';

// TODO: delete me when you see me (unless test-utils is still under packages/)
// {@xscripts/notExtraneous simple-git}

// ! Cannot use the global (g) flag
const tstycheTargetRegExp = /(^|\/)type-.*\.test\.(m|c)?tsx?$/;
const tstycheVacuousSuccessMessage =
  'Tstyche tests vacuously succeeded: no "type-*.test.tsx?" files were found';

/**
 * Which kind of test to run.
 */
export enum Test {
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
   * Include all possible test from the chosen scope.
   *
   * Will also include code coverage results by default.
   */
  All = 'all'
}

export enum _TesterScope {
  /**
   * Limit the command to relevant _transpiled_ tests (aka "intermediates")
   * within `./.transpiled` (with respect to the current working directory).
   */
  ThisPackageIntermediates = 'this-package-intermediates'
}

/**
 * The context in which to search for test files.
 */
export type TesterScope = DefaultGlobalScope | _TesterScope;

/**
 * The context in which to search for test files.
 */
export const TesterScope = { ...DefaultGlobalScope, ..._TesterScope } as const;

/**
 * @see {@link Test}
 */
export const tests = Object.values(Test);

/**
 * @see {@link TesterScope}
 */
export const testerScopes = Object.values(TesterScope);

export type CustomCliArguments = GlobalCliArguments<TesterScope> & {
  tests: Test[];
  testerOptions: string[];
  nodeOptions: string[];
  baseline: boolean;
  repeat: number;
  collectCoverage: boolean;
  skipSlowTests: number;
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
      blackFlag.parserConfiguration({ 'unknown-options-as-args': true });

      const allActualTests = tests.filter((test) => test !== Test.All);

      return {
        scope: {
          choices: testerScopes,
          default: TesterScope.ThisPackage
        },
        tests: {
          alias: 'test',
          array: true,
          choices: tests,
          description: 'Which kinds of test to run',
          default: allActualTests,
          check: checkArrayNotEmpty('--tests'),
          coerce(tests: Test[]) {
            return Array.from(
              new Set(
                [tests].flat().flatMap((test) => {
                  switch (test) {
                    case Test.All: {
                      return allActualTests;
                    }

                    default: {
                      return test;
                    }
                  }
                })
              )
            );
          },
          subOptionOf: {
            tests: {
              when: (tests: Test[]) => tests.includes(Test.Type),
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  conflicts: { scope: TesterScope.ThisPackageIntermediates }
                };
              }
            },
            baseline: {
              when: (baseline) => baseline,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  demandThisOption: true,
                  // ? Either Jest or Tstyche run in baseline mode, but not both
                  check: [oldOptionConfig.check || []]
                    .flat()
                    .concat(function checkTypeChoiceIfGivenIsByItself(
                      currentArgument: Test[]
                    ) {
                      const includesType = currentArgument.includes(Test.Type);

                      return (
                        !includesType ||
                        currentArgument.length === 1 ||
                        ErrorMessage.OptionValueMustBeAloneWhenBaseline(
                          Test.Type,
                          'test option'
                        )
                      );
                    })
                };
              }
            }
          }
        },
        'tester-options': {
          alias: 'options',
          array: true,
          description: 'Command-line arguments passed directly to testers',
          default: []
        },
        baseline: {
          alias: ['base', 'bare'],
          boolean: true,
          description: 'Execute a single tester alone without an execution plan',
          default: false,
          conflicts: 'scope'
        },
        repeat: {
          number: true,
          description:
            'Repeat entire Jest (not Tstyche) test suite --repeat times after initial run',
          default: 0,
          conflicts: [{ tests: Test.Type }, { tests: Test.All }],
          check: checkIsNotNegative('repeat')
        },
        'collect-coverage': {
          alias: 'coverage',
          boolean: true,
          description: 'Instruct Jest (not Tstyche) to collect coverage information',
          defaultDescription: 'false unless --tests=all and --scope=unlimited',
          default: false,
          subOptionOf: {
            tests: {
              when: (tests: Test[], { scope }) =>
                tests.includes(Test.All) && scope === TesterScope.Unlimited,
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
          description: 'Options passed to the Node runtime via NODE_OPTIONS',
          default: ['--no-warnings --experimental-vm-modules']
        }
      };
    }
  );

  return {
    builder,
    description: 'Run available type, unit, integration, and/or e2e tests',
    usage: `Usage: $000 [options] [extra-arguments-passed-to-underlying-runner]

$1.

Currently, "type" (\`--tests=type\`) tests are executed by the Tstyche test runner while all others are executed by the Jest test runner. Therefore, all test files should be appropriately named (e.g. "\${type}-\${name}.test.ts") and exist under a package's ./test directory.

Any unrecognized flags/arguments provided after the --tester-options flag are always passed through directly to each tester. For Jest, they are inserted after computed arguments but before test path patterns, e.g. \`--reporters=... --testPathIgnorePatterns=... <your extra args> -- testPathPattern1 testPathPattern2\`. For Tstyche, they are inserted after all other arguments, e.g. \`--computed-arg-1=... computed-arg-2 <your extra args>\`.

By default, this command constructs an execution plan (i.e. the computed arguments and path patterns passed to each tester's CLI) based on project metadata and provided options, namely --scope and --tests. When \`--scope=${TesterScope.ThisPackage}\` (the default), tests will be run from the current package and any packages it imports files from. Passing \`--scope=${TesterScope.Unlimited}\` will execute all runnable tests in the project. Both options are conditioned on --tests.

Alternatively, you can provide --baseline when you want to construct your own custom execution plan but still wish to make use of the runtime environment provided by this tool. When --baseline is provided, only one tester can be run at a time.

Also by default (if the CI environment variable is not defined), this command prevents the value of the DEBUG environment variable, if given, from propagating down into tests since this can cause strange output-related problems. Provide --propagate-debug-env to allow the value of DEBUG to be seen by test files and the rest of the test environment, including tests.

Provide --collect-coverage to instruct Jest to collect coverage information. --collect-coverage is false by default unless \`--scope=${TesterScope.Unlimited}\` and \`--tests=${Test.All}\`, in which case it will be true by default. Note that Tstyche never provides coverage information; this flag only affects Jest.

For detecting flakiness in tests, which is almost always a sign of deep developer error, provide --repeat; e.g. \`--repeat 100\`. Note that this flag cannot be used when running Tstyche "type" tests.

For running "intermediate" test files transpiled by \`xscripts build\`, provide \`--scope=${TesterScope.ThisPackageIntermediates}\` to set the XSCRIPTS_TEST_JEST_TRANSPILED environment variable in the testing environment. This will be picked up by Jest and other relevant tooling causing them to reconfigure themselves to run any transpiled tests under the ./.transpiled directory.

Provide --skip-slow-tests (or -x) to set the XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS environment variable in the testing environment. This will activate the \`reconfigureJestGlobalsToSkipTestsInThisFileIfRequested\` function of the @-xun/jest library, which will force Jest to skip by default all tests within files where said function was invoked. Providing --skip-slow-tests twice (or -xx) has the same effect, with the addition that test files that have "-slow." in their name are skipped entirely (not even looked at by Jest or executed by Node). This can be used in those rare instances where even the mere execution of a test file is too slow, such as a test file with hundreds or even thousands of generated tests that must be skipped. Note, however, that --skip-slow-tests has no bearing on the Tstyche runtime.`,
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      tests,
      testerOptions,
      nodeOptions,
      baseline,
      collectCoverage,
      skipSlowTests,
      propagateDebugEnv,
      repeat,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger(
        [LogTag.IF_NOT_QUIETED],
        `Testing ${scope === DefaultGlobalScope.ThisPackage ? 'this package' : 'the entire project'}...`
      );

      debug('scope: %O', scope);
      debug('tests: %O', tests);
      debug('baseline: %O', baseline);
      debug('testerOptions: %O', testerOptions);
      debug('nodeOptions: %O', nodeOptions);
      debug('collectCoverage: %O', collectCoverage);
      debug('skipSlowTests: %O', skipSlowTests);
      debug('repeat: %O', repeat);
      debug('propagateDebugEnv: %O', propagateDebugEnv);

      const { rootPackage, cwdPackage, subRootPackages } = projectMetadata;

      const packageRoot = cwdPackage.root;
      const projectRoot = rootPackage.root;

      debug('projectRoot: %O', projectRoot);
      debug('packageRoot: %O', packageRoot);

      const isRepeating = repeat > 0;

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
        ...(nodeOptions.length
          ? {
              // eslint-disable-next-line unicorn/no-array-reduce
              NODE_OPTIONS: nodeOptions.reduce(
                (previous, current) => (previous + ' ' + current).trim(),
                ''
              )
            }
          : {})
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
      const jestTestPathPatterns: string[] = [];
      const testPathIgnorePatterns: string[] = baseConfig().testPathIgnorePatterns;
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

      const buildTargetPackages = new Set<Package>();
      const buildExtraneousPackages = new Set<Package>();

      if (!baseline) {
        if (scope !== TesterScope.Unlimited) {
          const {
            targets: { external: externalBuildTargets }
          } = await gatherPackageBuildTargets(cwdPackage, {
            useCached: true
          });

          const allPackagesExceptCwd = Array.from(
            (subRootPackages?.values() || []).filter(
              ({ root }) => root !== cwdPackage.root
            ) as Package[]
          ).concat(
            !isCwdTheProjectRoot && rootPackage.attributes[ProjectAttribute.Hybridrepo]
              ? [rootPackage]
              : []
          );

          debug('allPackagesExceptCwd: %O', allPackagesExceptCwd);

          for (const package_ of allPackagesExceptCwd) {
            buildExtraneousPackages.add(package_);
          }

          for (const buildTargetPath of externalBuildTargets) {
            const buildTargetPackage = allPackagesExceptCwd.find((package_) => {
              const relativeRoot = toRelativePath(projectRoot, package_.root);

              return relativeRoot === ''
                ? !buildTargetPath.startsWith('packages/')
                : buildTargetPath.startsWith(relativeRoot);
            });

            if (buildTargetPackage) {
              buildTargetPackages.add(buildTargetPackage);
              buildExtraneousPackages.delete(buildTargetPackage);
            }
          }
        }

        // * When scope is set to Intermediate, that's handled in
        // * jest.config.mjs, which is aware of the
        // * XSCRIPTS_TEST_JEST_TRANSPILED environment variable.

        if (tests.includes(Test.Unit)) {
          // ? These sorts of patterns match at any depth (leading / isn't root)
          jestTestPathPatterns.push(String.raw`/test(/.*)?/unit(-.*)?\.test\.tsx?`);
        }

        if (tests.includes(Test.Integration)) {
          jestTestPathPatterns.push(
            String.raw`/test(/.*)?/integration(-.*)?\.test\.tsx?`
          );
        }

        if (tests.includes(Test.EndToEnd)) {
          jestTestPathPatterns.push(String.raw`/test(/.*)?/e2e(-.*)?\.test\.tsx?`);
        }

        // ? These are all the paths (mostly package roots) that should NOT have
        // ? their tests run; note that they are in Jest-style and should have
        // ? leading or trailing / (which will be inserted later when no
        // ? necessary)
        const testIgnorePathSegments = buildExtraneousPackages
          .values()
          .map((package_) => {
            return isRootPackage(package_)
              ? toPath(projectRoot.slice(1), testDirPackageBase)
              : toRelativePath(projectRoot, package_.root);
          });

        testPathIgnorePatterns.push(...testIgnorePathSegments.map((root) => `/${root}/`));

        if (testPathIgnorePatterns.length) {
          npxJestArguments.push(
            `--testPathIgnorePatterns=${testPathIgnorePatterns.map((p) => `(${p})`).join('|')}`
          );
        }
      }

      debug('buildTargetPackages: %O', buildTargetPackages);
      debug('buildExtraneousPackages: %O', buildExtraneousPackages);

      // ? Jest's CLI array intake ability is trash, so all array-taking
      // ? args need to be followed by another arg (i.e. --something)
      npxJestArguments.push('--inject-globals');

      if (isRepeating) {
        npxJestArguments.push('--reporters=jest-silent-reporter');
      }

      // ? Order matters, so keep these here due to how Jest CLI handles arrays.
      // ? E.g. the user might add extra array arguments, so they have to be
      // ? followed by a non-array argument since we append file paths (below)
      npxJestArguments.push(
        ...testerOptions,
        `--config=${projectRoot}/${jestConfigProjectBase}`
      );

      let hasTstycheTargets = false;

      if (!baseline) {
        const tstycheTargetAbsolutePaths = await gatherProjectFiles(projectMetadata, {
          useCached: true
        }).then(({ typescriptTestFiles }) => {
          if (scope === TesterScope.ThisPackage) {
            const ownFiles = isCwdTheProjectRoot
              ? typescriptTestFiles.inRootTest
              : typescriptTestFiles.inWorkspaceTest.get(cwdPackage.id)!;

            return ownFiles.concat(
              buildTargetPackages
                .values()
                .flatMap((package_) => {
                  return isRootPackage(package_)
                    ? typescriptTestFiles.inRootTest
                    : typescriptTestFiles.inWorkspaceTest.get(package_.id)!;
                })
                .toArray()
            );
          }

          return typescriptTestFiles.all;
        });

        const tstycheTargetRelativePaths = tstycheTargetAbsolutePaths
          .filter(
            (path) => path.startsWith(packageRoot + '/') && tstycheTargetRegExp.test(path)
          )
          .map((path) => toRelativePath(packageRoot, path) as string);

        debug('tstycheTargetRelativePaths: %O', tstycheTargetRelativePaths);

        hasTstycheTargets = !!tstycheTargetRelativePaths.length;
        npxTstycheArguments.push(...tstycheTargetRelativePaths);
      }

      npxTstycheArguments.push(...testerOptions);

      if (jestTestPathPatterns.length) {
        const jestPrefix = isCwdTheProjectRoot
          ? ''
          : '/' + toRelativePath(projectRoot, packageRoot);

        const finalJestTestPathPatterns =
          scope === TesterScope.ThisPackage
            ? // ? Assumes all patterns start with a slash (/)
              jestTestPathPatterns.map((pattern) => jestPrefix + pattern)
            : jestTestPathPatterns;

        npxJestArguments.push(...finalJestTestPathPatterns);
      }

      debug('npxTstycheArguments: %O', npxTstycheArguments);
      debug('npxJestArguments: %O', npxJestArguments);

      const shouldRunTstycheTests = tests.includes(Test.Type);
      const shouldRunJestTests = tests.length > 1 || !shouldRunTstycheTests;

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
          shouldRunTstycheTests
            ? // ? Always run tstyche if custom tester options were given
              hasTstycheTargets || testerOptions.length
              ? // {@xscripts/notExtraneous tstyche}
                runNoRejectOnBadExit('npx', npxTstycheArguments, {
                  all: true,
                  env,
                  cwd: projectRoot
                })
              : Promise.resolve({
                  all: `${SHORT_TAB}(${tstycheVacuousSuccessMessage.toLowerCase()})`,
                  exitCode: 0
                })
            : Promise.resolve({
                all: `${SHORT_TAB}(tstyche tests were skipped)`,
                exitCode: 0
              }),
          shouldRunJestTests
            ? runNoRejectOnBadExit('npx', npxJestArguments, {
                env,
                cwd: projectRoot,
                stdout: isHushed ? 'ignore' : 'inherit',
                stderr: isQuieted ? 'ignore' : 'inherit'
              })
            : Promise.resolve({
                all: `${SHORT_TAB}(jest tests were skipped)`,
                exitCode: 0
              })
        ]);

        const { all: tstycheOutput_, exitCode: tstycheExitCode } = tstycheResult;
        const tstycheOutput = [tstycheOutput_ || ''].flat().join('\n');

        const isTstycheError =
          tstycheExitCode !== 0 &&
          !tstycheOutput.includes(
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

        if (!isHushed && jestResult.all) {
          genericLogger.newline();

          // ? The only output will be if Jest is skipped
          process.stdout.write(String(jestResult.all) + '\n');
        }

        if (isTstycheError || jestResult.exitCode !== 0) {
          genericLogger.newline([LogTag.IF_NOT_HUSHED]);
          softAssert(ErrorMessage.TestingFailed());
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
