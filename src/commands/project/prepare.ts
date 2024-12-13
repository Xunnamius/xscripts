import { runWithInheritedIo } from '@-xun/run';
import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { isRootPackage } from 'multiverse+project-utils:analyze.ts';

import {
  postNpmInstallPackageBase,
  toAbsolutePath
} from 'multiverse+project-utils:fs.ts';

import {
  UnlimitedGlobalScope as PreparationScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

/**
 * @see {@link PreparationScope}
 */
export const preparationScopes = Object.values(PreparationScope);

export type CustomCliArguments = GlobalCliArguments<PreparationScope> & {
  force: boolean;
  parallel: boolean;
  runToCompletion: boolean;
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: preparationScopes, default: PreparationScope.Unlimited },
    force: {
      boolean: true,
      default: false,
      describe: 'Run all possible initialization tasks regardless of environment/context'
    },
    parallel: {
      boolean: true,
      default: true,
      describe: 'Run initialization tasks concurrently'
    },
    'run-to-completion': {
      boolean: true,
      description: 'Do not exit until all tasks have finished running',
      default: true
    }
  });

  return {
    builder,
    description: 'Run project-level initialization tasks across all roots',
    usage: withGlobalUsage(
      `$1.

The project-level initialization tasks executed by this command are, in order:

1. If executing in a CI or non-development environment (see below), exit immediately
2. If the current working directory is the project root, run \`npx husky\`
3. If the npm_command environment variable is not "install", exit immediately
3. If the current working directory contains a post-npm-install script, run that script
4. If the current working directory _is not_ the project root, exit immediately
5. If the current working directory is the project root and the project is a monorepo, search each package root for a post-npm-install script and run them as they are found (with cwd set to each respective package's root)

The ${postNpmInstallPackageBase} file, when present at a package root, is recognized as a post-npm-install script. Each package in a project (including the root package) can contain at most one post-npm-install script.

Typically, this command should not be executed manually but by your package manager automatically at "install time," i.e. when running \`npm install\` locally. With respect to NPM, this command should be run whenever NPM would run its "prepare" life cycle operation. Therefore, note that post-npm-install scripts MUST BE IDEMPOTENT, as they _will_ be invoked multiple times over the lifetime of long-lived projects, including at odd times like during package publication/release. See https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-operation-order for details.

This command exits immediately (becomes a no-op) when the CI environment variable is defined, or when the NODE_ENV environment variable is NOT either undefined or equal to "development". Provide --force to force this command to perform project initialization without regard for any environment variables.

This command runs Husky along with any post-npm-install scripts asynchronously and concurrently. To force serial invocation, provide --no-parallel. This command also "runs to completion," in that task-level errors will not interrupt its execution. To fail on the first encountered error, provide --no-run-to-completion`
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      force,
      parallel,
      runToCompletion
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Preparing project...');

      debug('scope (unused): %O', scope);
      debug('force: %O', force);
      debug('parallel: %O', parallel);
      debug('runToCompletion: %O', runToCompletion);

      const {
        rootPackage: { root: projectRoot },
        cwdPackage,
        subRootPackages
      } = projectMetadata;

      const { root: cwdPackageRoot } = cwdPackage;
      const isCwdTheProjectRoot = isRootPackage(cwdPackage);
      const isInCiEnvironment = !!process.env.CI;
      const isInDevelopmentEnvironment =
        process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';
      const isRunningNpmInstallCommand = process.env.npm_command === 'install';

      debug('projectRoot: %O', projectRoot);
      debug('cwdPackageRoot: %O', cwdPackageRoot);
      debug('isCwdTheProjectRoot: %O', isCwdTheProjectRoot);
      debug('isInCiEnvironment: %O', isInCiEnvironment);
      debug('isInDevelopmentEnvironment: %O', isInDevelopmentEnvironment);
      debug('isRunningNpmInstallCommand: %O', isRunningNpmInstallCommand);

      if (runToCompletion) {
        debug.message(
          'preparation tasks will run to completion even if an error occurs'
        );
      }

      if (force || (!isInCiEnvironment && isInDevelopmentEnvironment)) {
        const errors: [identifier: string, error: unknown][] = [];

        const tasks: Promise<unknown>[] = [
          runWithInheritedIo('npx', ['husky'], { cwd: projectRoot }).catch(
            (error: unknown) => errors.push(['husky executable', error])
          )
        ];

        if (force || isRunningNpmInstallCommand) {
          const roots = [
            projectRoot,
            ...(subRootPackages?.all.map(({ root }) => root) || [])
          ];

          for (const root of roots) {
            const postNpmInstallPath = toAbsolutePath(root, postNpmInstallPackageBase);
            debug('postNpmInstallPath: %O', postNpmInstallPath);

            genericLogger(
              [LogTag.IF_NOT_HUSHED],
              'Executing post-npm-install script at: %O',
              postNpmInstallPath
            );

            tasks.push(
              import(postNpmInstallPath)
                .then(() => {
                  debug(
                    'post-install script execution successful: %O',
                    postNpmInstallPath
                  );
                })
                .catch((error: unknown) => {
                  debug.error('execution attempt failed catastrophically: %O', error);
                  errors.push([postNpmInstallPath, error]);

                  throw new CliError(
                    ErrorMessage.BadPostNpmInstallScript(postNpmInstallPath),
                    { cause: error }
                  );
                })
            );
          }
        }

        // TODO: use this in eventual task-runner API factorization along with
        // TODO: what's in renovate, release, etc

        if (parallel) {
          debug.message('running tasks in parallel...');
          await Promise.all(
            tasks.map(async (task) => {
              try {
                await task;
              } catch (error) {
                if (!runToCompletion) {
                  throw error;
                }
              }
            })
          );
        } else {
          debug.message('running tasks serially...');
          for (const task of tasks) {
            try {
              // ? Order matters
              // eslint-disable-next-line no-await-in-loop
              await task;
            } catch (error) {
              if (!runToCompletion) {
                throw error;
              }
            }
          }
        }

        if (errors.length) {
          genericLogger.newline([LogTag.IF_NOT_SILENCED], 'alternate');

          for (const [description, error] of errors) {
            log.error(
              [LogTag.IF_NOT_SILENCED],
              'Preparation task %O experienced a fatal execution error:\n%O',
              description,
              error
            );
          }

          throw new CliError(ErrorMessage.PreparationRunnerExecutionFailed());
        }

        genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
      } else {
        genericLogger([LogTag.IF_NOT_QUIETED], 'Skipped project preparation');
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
