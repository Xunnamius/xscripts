import { CliError, type ChildConfiguration } from '@black-flag/core';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { runNoRejectOnBadExit, type run, type Subprocess } from 'multiverse/run';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';

import {
  checkAllChoiceIfGivenIsByItself,
  checkChoicesNotEmpty,
  findProjectFiles,
  runGlobalPreChecks
} from 'universe/util';

export enum Linter {
  Tsc = 'tsc',
  Eslint = 'eslint',
  Remark = 'remark',
  All = 'all'
}

export const linters = Object.values(Linter);

export const limitedScopeDirectories = ['types', 'lib', 'src', 'external-scripts'];

export type CustomCliArguments = GlobalCliArguments & {
  linter: Linter[];
  scope: 'limited' | 'all';
  remarkSkipIgnored: boolean;
  ignoreWarnings: boolean;
  runToCompletion: boolean;
};

export default function command({
  log,
  debug_,
  state,
  runtimeContext: runtimeContext_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    linter: {
      alias: 'linters',
      array: true,
      choices: linters,
      description: 'Which linters to run',
      default: [Linter.All],
      check: [
        checkChoicesNotEmpty('--linter'),
        checkAllChoiceIfGivenIsByItself(Linter.All, 'linter value')
      ]
    },
    scope: {
      choices: ['limited', 'all'],
      description: 'Limit linting to transpilation targets or include all source files',
      default: 'limited'
    },
    'remark-skip-ignored': {
      boolean: true,
      description: 'Ignore files listed in .prettierignore when running remark linter',
      default: true
    },
    'run-to-completion': {
      boolean: true,
      description: 'Do not exit until all linters have finished running',
      default: false
    },
    'ignore-warnings': {
      boolean: true,
      description: 'Ignore linter warnings (and tsc errors) but not errors',
      default: false
    }
  });

  return {
    builder,
    description: 'Run linters (e.g. eslint, remark) across all relevant files',
    usage: withStandardUsage(
      `$1.\n\nPassing --scope=limited will exclude from linting (by eslint) all files that are not under the following directories: ${limitedScopeDirectories.join(', ')}. For tsc, the scope of linted files is always determined by the "includes" and "excludes" directives in the relevant tsconfig file.\n\nNote that remark is configured to respect .remarkignore files only when run by "xscripts lint"; when executing "xscripts format", .remarkignore files are always disregarded. This means you can use .remarkignore files to prevent certain paths from being linted by "xscripts lint" without preventing them from being formatted by "xscripts format".`
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      linter: linters,
      scope,
      remarkSkipIgnored: skipIgnored,
      ignoreWarnings,
      runToCompletion,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { runtimeContext } = await runGlobalPreChecks({ debug_, runtimeContext_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Linting project...');

      debug('linters: %O', linters);
      debug('scope: %O', scope);
      debug('skipIgnored: %O', skipIgnored);
      debug('ignoreWarnings: %O', ignoreWarnings);
      debug('runToCompletion: %O', runToCompletion);

      let aborted = false;

      const {
        project: {
          // ? This does NOT end in a slash and this must be taken into account!
          root: rootDir
        }
      } = runtimeContext;

      debug('rootDir: %O', rootDir);

      const allLinters = linters.includes(Linter.All);
      debug('allLinters: %O', allLinters);

      // ? Widen the aperture to all lintable files if it is demanded
      const tsconfigFilePath =
        scope === 'all' ? `tsconfig.eslint.json` : `tsconfig.lint.json`;

      debug('tsconfigFilePath: %O', tsconfigFilePath);
      genericLogger.newline([LogTag.IF_NOT_QUIETED]);

      const promisedLinters: Promise<unknown>[] = [];
      const linterSubprocesses: Subprocess[] = [];

      if (allLinters || linters.includes(Linter.Tsc)) {
        debug(ignoreWarnings ? 'running tsc (ignoring errors)' : 'running tsc');
        promisedLinters.push(
          // ! tsc must always be the first linter in the promisedLinters array
          runLinter('npx', ['tsc', '--pretty', '--project', tsconfigFilePath])
        );
      }

      if (allLinters || linters.includes(Linter.Eslint)) {
        debug('running eslint');
        promisedLinters.push(
          runLinter('npx', [
            'eslint',
            '--color',
            `--parser-options=project:${tsconfigFilePath}`,
            '--no-error-on-unmatched-pattern',
            ...(ignoreWarnings ? [] : ['--max-warnings=0']),
            ...(scope === 'all' ? ['.'] : limitedScopeDirectories)
          ])
        );
      }

      if (allLinters || linters.includes(Linter.Remark)) {
        debug('running remark');
        const { mdFiles } = await findProjectFiles(runtimeContext, { skipIgnored });

        promisedLinters.push(
          runLinter(
            'npx',
            [
              'remark',
              ...(isHushed ? ['--quiet'] : []),
              '--color',
              ...(ignoreWarnings ? [] : ['--frail']),
              '--no-stdout',
              '--ignore',
              '--silently-ignore',
              `--rc-path=${rootDir}/.remarkrc.mjs`,
              ...mdFiles
            ],
            {
              env: { NODE_ENV: 'lint' }
            }
          )
        );
      }

      debug('waiting for linters to finish running...');

      if (runToCompletion) {
        debug.message('linters will run to completion even if an error occurs');

        const results = await Promise.allSettled(promisedLinters);

        if (
          results.some((result, index) => {
            return result.status !== 'fulfilled' && (index !== 0 || !ignoreWarnings);
          })
        ) {
          throw new CliError(ErrorMessage.LintingFailed());
        }
      } else {
        await Promise.all(promisedLinters);
      }

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      async function runLinter(
        ...[exec, args = [], options = {}]: Parameters<typeof run>
      ) {
        const { stdout, stderr, exitCode } = await runNoRejectOnBadExit(exec, args, {
          ...options,
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
          if (stdout) {
            process.stdout.write(stdout + (stdout.endsWith('\n') ? '' : '\n'));
          }

          if (stderr) {
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
              throw new CliError(ErrorMessage.LintingFailed(), {
                dangerouslyFatal: true
              });
            }
          }
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
