import { CliError, type ChildConfiguration } from '@black-flag/core';

import { LogTag, logStartTime } from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { type AsStrictExecutionContext } from 'multiverse#bfe';
import { runWithInheritedIo } from 'multiverse#run';
import {
  gatherProjectFiles,
  ProjectAttribute,
  WorkspaceAttribute
} from 'multiverse#project-utils';

import { ErrorMessage } from 'universe error.ts';

import {
  withGlobalBuilder,
  withGlobalUsage,
  runGlobalPreChecks,
  hasExitCode
} from 'universe util.ts';

import {
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

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
    }
  );

  return {
    builder,
    description: 'Run a CLI or deploy a local production environment, if applicable',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, _: args_ }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });

      const args = args_.map((a) => a.toString());
      debug('additional (passthrough) args: %O', args);

      const { attributes } = projectMetadata.project;
      const {
        mainBinFiles: { atProjectRoot, atWorkspaceRoot }
      } = await gatherProjectFiles(projectMetadata);

      const passControlMessage = (runtime: string) =>
        `--- control passed to ${runtime} runtime ---`;

      try {
        // ? If we're in a package sub-root, let's see if it's a CLI first
        if (
          projectMetadata.package?.attributes[WorkspaceAttribute.Cli] &&
          atWorkspaceRoot.has(projectMetadata.package.id)
        ) {
          genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('CLI (package)'));
          await runWithInheritedIo(
            atWorkspaceRoot.get(projectMetadata.package.id)!,
            args
          );
        }
        // ? Otherwise, check if the project root is a CLI
        else if (attributes[ProjectAttribute.Cli] && atProjectRoot) {
          genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('CLI (root)'));
          await runWithInheritedIo(atProjectRoot, args);
        }
        // ? Otherwise, if we're not a CLI, check if we're a Next.js project
        else if (attributes[ProjectAttribute.Next]) {
          genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('Next.js'));
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
