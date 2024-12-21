import { runNoRejectOnBadExit, type run, type Subprocess } from '@-xun/run';
import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';
import { hardAssert, softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  gatherPackageBuildTargets,
  gatherPackageFiles,
  gatherProjectFiles,
  isRootPackage
} from 'multiverse+project-utils';

import {
  directorySrcPackageBase,
  directoryTestPackageBase,
  isAccessible,
  toPath,
  toRelativePath,
  Tsconfig
} from 'multiverse+project-utils:fs.ts';

import {
  DefaultGlobalScope as LinterScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  checkArrayNotEmpty,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

export enum Linter {
  Tsc = 'tsc',
  Eslint = 'eslint',
  Remark = 'remark',
  All = 'all'
}

/**
 * @see {@link Linter}
 */
export const linters = Object.values(Linter);

/**
 * @see {@link LinterScope}
 */
export const linterScopes = Object.values(LinterScope);

export type CustomCliArguments = GlobalCliArguments & {
  linters: Linter[];
  linterOptions: string[];
  nodeOptions: string[];
  baseline: boolean;
  remarkSkipIgnored: boolean;
  ignoreWarnings: boolean;
  allowWarningComments: boolean;
  runToCompletion: boolean;
};

export default async function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    (blackFlag) => {
      blackFlag.parserConfiguration({ 'unknown-options-as-args': true });

      const allActualLinters = linters.filter((linter) => linter !== Linter.All);

      return {
        scope: {
          choices: linterScopes,
          default: LinterScope.ThisPackage
        },
        linters: {
          alias: 'linter',
          array: true,
          choices: linters,
          description: 'Which linters to run',
          default: allActualLinters,
          check: checkArrayNotEmpty('--linters'),
          coerce(linters: Linter | Linter[]) {
            return Array.from(
              new Set(
                [linters].flat().flatMap((linter) => {
                  switch (linter) {
                    case Linter.All: {
                      return allActualLinters;
                    }

                    default: {
                      return linter;
                    }
                  }
                })
              )
            );
          },
          subOptionOf: {
            baseline: {
              when: (baseline) => baseline,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  demandThisOption: true,
                  // ? Only one linter way run
                  check: [oldOptionConfig.check || []]
                    .flat()
                    .concat(function checkChoiceIsGivenByItself(
                      currentArgument: Linter[]
                    ) {
                      return (
                        currentArgument.length === 1 ||
                        ErrorMessage.OptionValueMustBeAloneWhenBaseline(
                          currentArgument[0],
                          'linter'
                        )
                      );
                    })
                };
              }
            }
          }
        },
        'linter-options': {
          alias: 'options',
          array: true,
          description: 'Command-line arguments passed directly to linters',
          default: []
        },
        baseline: {
          alias: ['base', 'bare'],
          boolean: true,
          description: 'Execute a single linter alone without an execution plan',
          default: false,
          conflicts: 'scope'
        },
        'remark-skip-ignored': {
          boolean: true,
          description:
            'Ignore files listed in .prettierignore when running remark linter',
          default: true
        },
        'run-to-completion': {
          boolean: true,
          description: 'Do not exit until all linters have finished running',
          default: true
        },
        'ignore-warnings': {
          boolean: true,
          description: 'Ignore linter warnings (and tsc errors) but not errors',
          default: false
        },
        'allow-warning-comments': {
          boolean: true,
          description: 'Do not trigger linter warnings for "TODO"-style comments',
          default: true
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
    description: 'Run linters (e.g. eslint, remark) across all relevant files',
    usage: withGlobalUsage(
      `$1.

Any unrecognized flags/arguments provided after the --linter-options flag are always passed through directly to each linter. They are inserted after all other arguments, e.g. \`--computed-arg-1=... computed-arg-2 <your extra args>\`.

By default, this command constructs an execution plan (i.e. the computed arguments and path patterns passed to each linter's CLI) based on project metadata and provided options, namely --scope and --linters. Passing --scope=${LinterScope.ThisPackage} (the default) will lint all source files in this package and any lintable files imported by them, even if they belong to another package; all of this package's Markdown files are also linted. Passing --scope=${LinterScope.Unlimited} will lint all lintable files in the project.

Alternatively, you can provide --baseline when you want to construct your own custom execution plan but still wish to make use of the runtime environment provided by this tool. When --baseline is provided, only one linter can be run at a time.

Note that the tsc linter always chooses its paths using the relevant tsconfig file regardless of execution plan (i.e. the first of: "${Tsconfig.PackageLint}" at the current package root, or "${Tsconfig.ProjectLint}" or "${Tsconfig.ProjectBase}" at the project root).

Also note that the remark linter is configured to respect .remarkignore files only when run by "xscripts lint"; when executing "xscripts format", .remarkignore files are always disregarded. This means you can use .remarkignore files to prevent certain paths from being linted by "xscripts lint" without preventing them from being formatted by "xscripts format".

Provide --allow-warning-comments to set the XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS environment variable in the runtime environment. This will be picked up by linters, causing them to ignore any warning comments. This includes warnings about relative imports of @-xun/* packages from /node_modules/.`
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      linters,
      linterOptions,
      nodeOptions,
      baseline,
      remarkSkipIgnored: skipIgnored,
      ignoreWarnings,
      allowWarningComments,
      runToCompletion,
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
        `Linting ${scope === LinterScope.ThisPackage ? 'this package and its dependencies' : 'the entire project'}...`
      );

      debug('scope: %O', scope);
      debug('linters: %O', linters);
      debug('baseline: %O', baseline);
      debug('linterOptions: %O', linterOptions);
      debug('nodeOptions: %O', nodeOptions);
      debug('runToCompletion: %O', runToCompletion);
      debug('skipIgnored: %O', skipIgnored);
      debug('ignoreWarnings: %O', ignoreWarnings);
      debug('allowWarningComments: %O', allowWarningComments);

      let aborted = false;
      let firstOutput = true;
      let hadOutput = false as boolean;

      const {
        cwdPackage,
        rootPackage: { root: projectRoot }
      } = projectMetadata;

      const { root: packageRoot } = cwdPackage;

      const baseTsconfigFilePath = toPath(projectRoot, Tsconfig.ProjectBase);
      const projectTsconfigFilePath = toPath(projectRoot, Tsconfig.ProjectLint);
      const packageTsconfigFilePath = toPath(packageRoot, Tsconfig.PackageLint);

      debug('baseTsconfigFilePath: %O', baseTsconfigFilePath);
      debug('projectTsconfigFilePath: %O', projectTsconfigFilePath);
      debug('packageTsconfigFilePath: %O', packageTsconfigFilePath);

      softAssert(
        await isAccessible(baseTsconfigFilePath, { useCached: true }),
        ErrorMessage.MissingConfigurationFile(baseTsconfigFilePath)
      );

      // ? Should always be the largest possible scope (narrowed by path args)
      const eslintTsconfigFilePath = (await isAccessible(projectTsconfigFilePath, {
        useCached: true
      }))
        ? projectTsconfigFilePath
        : baseTsconfigFilePath;

      // ? Should always be limited to this package and its imports if scope is
      // ? limited to this package (falling back on the largest possible scope)
      const tscTsconfigFilePath =
        scope === LinterScope.ThisPackage &&
        (await isAccessible(packageTsconfigFilePath, {
          useCached: true
        }))
          ? packageTsconfigFilePath
          : eslintTsconfigFilePath;

      debug('eslintTsconfigFilePath: %O', eslintTsconfigFilePath);
      debug('tscTsconfigFilePath: %O', tscTsconfigFilePath);

      const promisedLinters: Promise<unknown>[] = [];
      const linterSubprocesses: Subprocess[] = [];

      if (linters.includes(Linter.Tsc)) {
        debug(ignoreWarnings ? 'running tsc (ignoring bad exit code)' : 'running tsc');
        promisedLinters.push(
          // ! tsc must always be the first linter in the promisedLinters array
          runLinter('npx', ['tsc', '--pretty', '--project', tscTsconfigFilePath])
        );
      }

      if (linters.includes(Linter.Eslint)) {
        debug(
          ignoreWarnings ? 'running eslint (ignoring warnings only)' : 'running eslint'
        );

        const npxEslintArguments = [
          'eslint',
          '--color',
          `--parser-options=project:${eslintTsconfigFilePath}`,
          '--no-warn-ignored',
          '--no-error-on-unmatched-pattern'
        ];

        if (!ignoreWarnings) {
          npxEslintArguments.push('--max-warnings=0');
        }

        if (!baseline) {
          if (scope === LinterScope.ThisPackage) {
            const [
              { other: cwdPackageOtherFiles },
              {
                targets: { external: externalBuildTargets }
              }
            ] = await Promise.all([
              gatherPackageFiles(cwdPackage, { useCached: true }),
              gatherPackageBuildTargets(cwdPackage, { useCached: true })
            ]);

            npxEslintArguments.push(
              ...externalBuildTargets.normal,
              ...externalBuildTargets.typeOnly,
              ...cwdPackageOtherFiles.map((path) => toRelativePath(projectRoot, path)),
              toPath(packageRoot, directorySrcPackageBase),
              toPath(packageRoot, directoryTestPackageBase)
            );
          } else {
            npxEslintArguments.push('.');
          }
        }

        // * Debug args output and adding linter options is done in runLinter

        promisedLinters.push(
          runLinter('npx', npxEslintArguments, {
            cwd: projectRoot,
            env: {
              XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS: allowWarningComments.toString()
            }
          })
        );
      }

      if (linters.includes(Linter.Remark)) {
        debug(
          ignoreWarnings ? 'running remark (ignoring warnings only)' : 'running remark'
        );

        const {
          markdownFiles: {
            all: allMarkdownFiles,
            inRoot: rootMarkdownFiles,
            inWorkspace: perPackageMarkdownFiles
          }
        } = await gatherProjectFiles(projectMetadata, {
          skipPrettierIgnored: skipIgnored,
          useCached: true
        });

        const npxRemarkArguments = [
          // {@xscripts/notExtraneous remark-cli}
          'remark',
          ...(isHushed ? ['--quiet'] : []),
          '--color',
          ...(ignoreWarnings ? [] : ['--frail']),
          '--no-stdout',
          '--ignore',
          '--silently-ignore'
        ];

        if (!baseline) {
          const targetFiles =
            scope === LinterScope.Unlimited
              ? allMarkdownFiles
              : isRootPackage(cwdPackage)
                ? rootMarkdownFiles
                : perPackageMarkdownFiles.get(cwdPackage.id);

          hardAssert(targetFiles, ErrorMessage.GuruMeditation());
          npxRemarkArguments.push(...targetFiles);
        }

        // * Debug args output and adding linter options is done in runLinter

        // TODO: gain noticeable speedups by switching to node-only API instead
        // TODO: of calling out via execa runners
        promisedLinters.push(
          runLinter('npx', npxRemarkArguments, {
            env: {
              NODE_ENV: 'lint',
              XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS: allowWarningComments.toString()
            }
          })
        );
      }

      debug('waiting for linters to finish running...');

      if (runToCompletion) {
        debug.message('linters will run to completion even if an error occurs');

        const results = await Promise.allSettled(promisedLinters);

        debug(
          '%O/%O linters have run to completion: %O',
          results.length,
          results.length,
          results
        );

        softAssert(
          results.every((result, index) => {
            // ? This logic relies on tsc being the first linter in the results!
            return result.status === 'fulfilled' || (index === 0 && ignoreWarnings);
          }),
          ErrorMessage.LintingFailed()
        );
      } else {
        await Promise.all(promisedLinters);
      }

      if (hadOutput) {
        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      async function runLinter(
        ...[exec, args = [], options = {}]: Parameters<typeof run>
      ) {
        args = args.concat(linterOptions);
        debug('new runner invocation: %O %O', exec, args);

        const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(exec, args, {
          ...options,
          env: {
            ...options.env,
            ...(nodeOptions.length
              ? {
                  // eslint-disable-next-line unicorn/no-array-reduce
                  NODE_OPTIONS: nodeOptions.reduce(
                    (previous, current) => (previous + ' ' + current).trim(),
                    ''
                  )
                }
              : {})
          },
          stdout: isHushed ? 'ignore' : 'pipe',
          stderr: isQuieted ? 'ignore' : 'pipe',
          killSignal: 'SIGKILL',
          useIntermediate(subprocess) {
            debug(
              `tracking ${exec === 'npx' ? args[0] || 'unknown' : exec} linter subprocess`
            );

            linterSubprocesses.push(subprocess);
          }
        });

        if (!aborted) {
          if ((stdout || stderr) && firstOutput) {
            firstOutput = false;
            genericLogger.newline([LogTag.IF_NOT_QUIETED]);
          }

          if (stdout) {
            hadOutput = true;
            process.stdout.write(stdout + (stdout.endsWith('\n') ? '' : '\n'));
          }

          if (stderr) {
            hadOutput = true;
            process.stderr.write(stderr + (stderr.endsWith('\n') ? '' : '\n'));
          }

          if (exitCode !== 0) {
            debug.error('a linter exited with a non-zero exit code');
            debug.error('failing linter stdout: %O', stdout);
            debug.error('failing linter stderr: %O', stderr);

            if (!runToCompletion) {
              aborted = true;
              linterSubprocesses.forEach((subprocess) => subprocess.kill('SIGKILL'));

              genericLogger.newline([LogTag.IF_NOT_QUIETED]);
            }

            throw new CliError(ErrorMessage.LintingFailed(), {
              dangerouslyFatal: true
            });
          }
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
