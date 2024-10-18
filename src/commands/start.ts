import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';
import { logStartTime, LogTag } from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';

import {
  gatherProjectFiles,
  ProjectAttribute,
  WorkspaceAttribute
} from 'multiverse#project-utils';

import { runWithInheritedIo } from 'multiverse#run';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { ErrorMessage } from 'universe error.ts';

import {
  hasExitCode,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe util.ts';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    (blackFlag) => {
      blackFlag.strict(false);
      return { scope: { default: DefaultGlobalScope.Unlimited } };
    }
  );

  return {
    builder,
    description: 'Run a CLI or deploy a local production environment, if applicable',
    usage: withGlobalUsage(
      `$1.

If this command is run with \`--scope=unlimited\` (the default) in a monorepo, and the package at the current working directory is not CLI-enabled nor a Next.js project, this command will search the project for the first available CLI starting from the root package.`
    ),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope, _: args_ }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });

      debug('scope: %O', scope);

      const args = args_.map((a) => a.toString());
      debug('additional (passthrough) args: %O', args);

      const { attributes } = projectMetadata.project;
      const {
        mainBinFiles: { atProjectRoot, atWorkspaceRoot, atAnyRoot }
      } = await gatherProjectFiles(projectMetadata);

      const passControlMessage = (runtime: string) =>
        `--- control passed to ${runtime} runtime ---`;

      try {
        // ? If we're in a package sub-root, let's see if it's a CLI first
        if (
          projectMetadata.package?.attributes[WorkspaceAttribute.Cli] &&
          atWorkspaceRoot.has(projectMetadata.package.id)
        ) {
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            passControlMessage('CLI (current package)')
          );
          await runWithInheritedIo(
            atWorkspaceRoot.get(projectMetadata.package.id)!,
            args
          );
        }
        // ? Otherwise, check if the project root is a CLI
        else if (attributes[ProjectAttribute.Cli] && atProjectRoot) {
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            passControlMessage('CLI (root package) (current package)')
          );
          await runWithInheritedIo(atProjectRoot, args);
        }
        // ? Otherwise, if scope is unlimited, find the first available CLI
        else if (scope === DefaultGlobalScope.Unlimited && atAnyRoot.length) {
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            passControlMessage(`CLI (first CLI-enabled sub-root package)`)
          );
          await runWithInheritedIo(atAnyRoot[0], args);
        }
        // ? Otherwise, if no CLIs available, check if we're a Next.js project
        else if (attributes[ProjectAttribute.Next]) {
          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            passControlMessage('Next.js (root package) (current package)')
          );
          await runWithInheritedIo('next', ['start', ...args]);
        }
        // ? Otherwise, invoking this command makes no sense!
        else {
          throw new CliError(ErrorMessage.UnsupportedCommand());
        }
      } catch (error) {
        throw hasExitCode(error)
          ? new CliError('', { suggestedExitCode: error.exitCode })
          : error;
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
