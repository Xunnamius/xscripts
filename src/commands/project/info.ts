import { type ChildConfiguration } from '@black-flag/core';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { type AsStrictExecutionContext } from 'multiverse#bfe';

import { withGlobalBuilder, withGlobalUsage, runGlobalPreChecks } from 'universe util.ts';

import {
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

export type CustomCliArguments = GlobalCliArguments & {
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
  });

  return {
    builder,
    description: 'Gather and report information about this project',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Analyzing project...');

      // TODO (what is the next version gonna be, if any?)
      // TODO (report on which vscode settings are used via .vscode, but also warn that in a vscode multi-root workspace, options are ignored in favor of the options in said workspace's configuration file directly)

      genericLogger([LogTag.IF_NOT_QUIETED], 'Preparing report...');

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
