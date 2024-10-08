import { type ChildConfiguration } from '@black-flag/core';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { runGlobalPreChecks } from 'universe/util';

export type CustomCliArguments = GlobalCliArguments & {
  // TODO
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
    // TODO
  });

  return {
    builder,
    description: 'Gather and report information about this project',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, runtimeContext_ });
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
