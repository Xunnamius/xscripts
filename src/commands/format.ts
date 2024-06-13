import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  log: genericLogger,
  debug_,
  state
}: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    // TODO (skip docs)
    // TODO (do not run renumbering unless given flag for it; add flag to deploy)
  });

  return {
    builder,
    description: 'Run formatters (e.g. prettier, remark) across all relevant files',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function () {
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log: genericLogger, startTime });

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
