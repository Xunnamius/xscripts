import { join as joinPath, resolve as toAbsolutePath } from 'node:path';

import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';
import { hardAssert } from 'multiverse#cli-utils error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';

import {
  gatherProjectFiles,
  isRootPackage,
  type ProjectMetadata
} from 'multiverse#project-utils';

import {
  isAccessible,
  readJsonc,
  Tsconfig,
  type AbsolutePath
} from 'multiverse#project-utils fs/index.ts';

import { runNoRejectOnBadExit, type run, type Subprocess } from 'multiverse#run';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { ErrorMessage } from 'universe error.ts';

import {
  checkAllChoiceIfGivenIsByItself,
  checkArrayNotEmpty,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe util.ts';

export enum Linter {
  Tsc = 'tsc',
  Eslint = 'eslint',
  Remark = 'remark',
  All = 'all'
}

export enum LinterScope_ {
  /**
   * Limit the command to _source_ files contained within the current package
   * (as determined by the current working directory), excluding non-source
   * files and the files of any other (named) workspace packages. "Source files"
   * includes Markdown files.
   *
   * This is the default scope for the `lint` command.
   */
  ThisPackageSource = 'this-package-source',
  /**
   * Do not limit or exclude any _source_ files by default when running the
   * command. "Source files" includes Markdown files.
   *
   * This is useful, for instance, when attempting to manually lint an entire
   * monorepo's source files at once; e.g. `npx xscripts lint
   * --scope=unlimited-source`.
   */
  UnlimitedSource = 'unlimited-source'
}

/**
 * The context in which to search for files to lint.
 */
export type LinterScope = DefaultGlobalScope | LinterScope_;

/**
 * The context in which to search for files to lint.
 */
export const LinterScope = { ...DefaultGlobalScope, ...LinterScope_ } as const;

/**
 * @see {@link Linter}
 */
export const linters = Object.values(Linter);

/**
 * @see {@link LinterScope}
 */
export const linterScopes = Object.values(LinterScope);

export type CustomCliArguments = GlobalCliArguments<LinterScope> & {
  linter: Linter[];
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
  const defaultScope = await determineDefaultScope();

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: {
      choices: linterScopes,
      default: defaultScope
    },
    linter: {
      alias: 'linters',
      array: true,
      choices: linters,
      description: 'Which linters to run',
      default: [Linter.All],
      check: [
        checkArrayNotEmpty('--linter'),
        checkAllChoiceIfGivenIsByItself(Linter.All, 'linter value')
      ]
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
    },
    'allow-warning-comments': {
      boolean: true,
      description: 'Do not trigger linter warnings for "TODO"-style comments',
      default: true
    }
  });

  return {
    builder,
    description: 'Run linters (e.g. eslint, remark) across all relevant files',
    usage: withGlobalUsage(
      `$1.

Passing \`--scope=${LinterScope.ThisPackage}\` will lint all files in the package (determined by ./${Tsconfig.PackageLintUnlimited}), including any Markdown files. Passing \`--scope=${LinterScope.ThisPackageSource}\` will lint all _source_ files (determined by ./${Tsconfig.PackageLintSource}) and all Markdown files in the package. Passing \`--scope=${LinterScope.Unlimited}\` will lint all possible files under the package root (determined by ./${Tsconfig.ProjectLintUnlimited} or ./${Tsconfig.PackageLintUnlimited}) even if they belong to another package. Passing \`--scope=${LinterScope.UnlimitedSource}\` will lint all possible _source_ files (determined by ./${Tsconfig.ProjectLintSource} or ./${Tsconfig.PackageLintSource}), including any Markdown files, under the package root even if they belong to another package.

The default value for --scope is determined by the first of the following tsconfig files that exists in the current working directory:

  - ./${scopeToTsconfigFilePath(LinterScope.ThisPackageSource)} (${LinterScope.ThisPackageSource})
  - ./${scopeToTsconfigFilePath(LinterScope.UnlimitedSource)} (${LinterScope.UnlimitedSource})
  - ./${scopeToTsconfigFilePath(LinterScope.ThisPackage)} (${LinterScope.ThisPackage})
  - ./${scopeToTsconfigFilePath(LinterScope.Unlimited)} (${LinterScope.Unlimited})

The default value for --scope in the current project is${defaultScope ? `: ${defaultScope}` : ' not resolvable (xscripts seems not to be running in a project repository)'}.

Note that the remark linter is configured to respect .remarkignore files only when run by "xscripts lint"; when executing "xscripts format", .remarkignore files are always disregarded. This means you can use .remarkignore files to prevent certain paths from being linted by "xscripts lint" without preventing them from being formatted by "xscripts format".

Provide --allow-warning-comments to set the XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS environment variable in the testing environment. This will be picked up by linters, causing them to ignore any warning comments. This includes warnings about relative imports of @-xun/* packages from /node_modules/.`
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      linter: linters,
      scope,
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
      genericLogger([LogTag.IF_NOT_QUIETED], 'Linting project...');

      debug('linters: %O', linters);
      debug('scope: %O', scope);
      debug('skipIgnored: %O', skipIgnored);
      debug('ignoreWarnings: %O', ignoreWarnings);
      debug('allowWarningComments: %O', allowWarningComments);
      debug('runToCompletion: %O', runToCompletion);

      let aborted = false;
      let firstOutput = true;
      let hadOutput = false as boolean;

      const allLinters = linters.includes(Linter.All);
      debug('allLinters: %O', allLinters);

      const tsconfigFilePath = scopeToTsconfigFilePath(
        scope,
        projectMetadata
      ) as AbsolutePath;

      debug('tsconfigFilePath: %O', tsconfigFilePath);

      const { cwdPackage } = projectMetadata;

      const promisedLinters: Promise<unknown>[] = [];
      const linterSubprocesses: Subprocess[] = [];

      if (allLinters || linters.includes(Linter.Tsc)) {
        debug(ignoreWarnings ? 'running tsc (ignoring bad exit code)' : 'running tsc');
        promisedLinters.push(
          // ! tsc must always be the first linter in the promisedLinters array
          runLinter('npx', ['tsc', '--pretty', '--project', tsconfigFilePath])
        );
      }

      if (allLinters || linters.includes(Linter.Eslint)) {
        debug(
          ignoreWarnings ? 'running eslint (ignoring warnings only)' : 'running eslint'
        );

        const { exclude: excludePatterns = [], include: includePatterns = [] } =
          await readJsonc<{ include?: string[]; exclude?: string[] }>({
            path: tsconfigFilePath
          });

        debug('tsconfig include patterns: %O', includePatterns);
        debug('tsconfig exclude patterns: %O', excludePatterns);

        promisedLinters.push(
          runLinter(
            'npx',
            [
              'eslint',
              '--color',
              `--parser-options=project:${tsconfigFilePath}`,
              '--no-error-on-unmatched-pattern',
              '--no-warn-ignored',
              ...(ignoreWarnings ? [] : ['--max-warnings=0']),
              ...excludePatterns.map((pattern) => `--ignore-pattern=${pattern}`),
              ...(scope === LinterScope.ThisPackageSource ||
              scope === LinterScope.UnlimitedSource
                ? includePatterns
                : ['.'])
            ],
            {
              env: {
                XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS: allowWarningComments.toString()
              }
            }
          )
        );
      }

      if (allLinters || linters.includes(Linter.Remark)) {
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
          skipPrettierIgnored: skipIgnored
        });

        const targetFiles =
          scope === LinterScope.Unlimited || scope === LinterScope.UnlimitedSource
            ? allMarkdownFiles
            : isRootPackage(cwdPackage)
              ? rootMarkdownFiles
              : perPackageMarkdownFiles.get(cwdPackage.id);

        hardAssert(targetFiles, ErrorMessage.GuruMeditation());

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
              ...targetFiles
            ],
            {
              env: {
                NODE_ENV: 'lint',
                XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS: allowWarningComments.toString()
              }
            }
          )
        );
      }

      debug('waiting for linters to finish running...');

      if (runToCompletion) {
        debug.message('linters will run to completion even if an error occurs');

        const results = await Promise.allSettled(promisedLinters);

        debug('%O linters have run to completion: %O', results.length, results);

        if (
          results.some((result, index) => {
            // ? This logic relies on tsc being the first linter in the results!
            return result.status !== 'fulfilled' && (index !== 0 || !ignoreWarnings);
          })
        ) {
          throw new CliError(ErrorMessage.LintingFailed());
        }
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

  async function determineDefaultScope(): Promise<LinterScope | undefined> {
    if (projectMetadata_) {
      const {
        cwdPackage: { root: packageRoot }
      } = projectMetadata_;

      if (await isAccessible({ path: `${packageRoot}/${Tsconfig.PackageLintSource}` })) {
        return LinterScope.ThisPackageSource;
      }

      if (await isAccessible({ path: `${packageRoot}/${Tsconfig.ProjectLintSource}` })) {
        return LinterScope.UnlimitedSource;
      }

      if (
        await isAccessible({ path: `${packageRoot}/${Tsconfig.PackageLintUnlimited}` })
      ) {
        return LinterScope.ThisPackage;
      }

      if (
        await isAccessible({ path: `${packageRoot}/${Tsconfig.ProjectLintUnlimited}` })
      ) {
        return LinterScope.Unlimited;
      }
    }

    return undefined;
  }

  function scopeToTsconfigFilePath(
    scope: LinterScope | undefined,
    /**
     * If undefined, returned paths will be relative instead of absolute!
     */
    projectMetadata?: ProjectMetadata
  ) {
    return scope === LinterScope.ThisPackageSource
      ? fromCwdRoot(Tsconfig.PackageLintSource, projectMetadata)
      : scope === LinterScope.ThisPackage
        ? fromCwdRoot(Tsconfig.PackageLintUnlimited, projectMetadata)
        : scope === LinterScope.UnlimitedSource
          ? fromProjectRoot(Tsconfig.ProjectLintSource, projectMetadata)
          : scope === LinterScope.Unlimited
            ? fromProjectRoot(Tsconfig.ProjectLintUnlimited, projectMetadata)
            : fromProjectRoot(Tsconfig.ProjectBase, projectMetadata);
  }

  function fromProjectRoot(path: string, projectMetadata: ProjectMetadata | undefined) {
    return projectMetadata ? joinPath(projectMetadata.rootPackage.root, path) : path;
  }

  function fromCwdRoot(path: string, projectMetadata: ProjectMetadata | undefined) {
    return projectMetadata ? toAbsolutePath(path) : path;
  }
}
