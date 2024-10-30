import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  UnlimitedGlobalScope as ProjectInfoScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

/**
 * @see {@link ProjectInfoScope}
 */
export const projectInfoScopes = Object.values(ProjectInfoScope);

export type CustomCliArguments = GlobalCliArguments<ProjectInfoScope> & {
  // TODO
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    // TODO
    scope: { choices: projectInfoScopes, default: ProjectInfoScope.Unlimited }
  });

  return {
    builder,
    description: 'Gather and report information about this project',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Analyzing project...');

      debug('scope (unused): %O', scope);

      // TODO (what is the next version gonna be, if any?)
      // TODO (report on which vscode settings are used via .vscode, but also warn that in a vscode multi-root workspace, options are ignored in favor of the options in said workspace's configuration file directly)

      genericLogger([LogTag.IF_NOT_QUIETED], 'Preparing report...');

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
