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

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';

export type CustomCliArguments = GlobalCliArguments;

// TODO: npx update-browserslist-db@latest (non-match doesn't cause error only warning)

export default function command({ log, debug_, state }: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    // TODO (no dot imports outside lib directory)
    // TODO (bring in lint code from projector)
    // TODO (add depcheck package, browserslist, attw, and others into the mix)
  });

  return {
    builder,
    description: 'Run linters (e.g. eslint, remark) across all relevant files',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
