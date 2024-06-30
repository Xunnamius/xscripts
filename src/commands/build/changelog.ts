import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { globalPreChecks } from 'universe/util';

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

export type CustomCliArguments = GlobalCliArguments & {
  skipTitle: boolean;
};

export default function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'skip-topmatter': {
      boolean: true,
      description: 'Do not prepend topmatter when compiling output',
      default: false,
      implies: { 'format-changelog': false },
      looseImplications: true
    },
    'format-changelog': {
      boolean: true,
      description: 'Run the "format" command on compiled output',
      default: true
    }
  });

  return {
    builder,
    description: 'Compile a changelog from conventional commits',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Compiling changelog...');

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
