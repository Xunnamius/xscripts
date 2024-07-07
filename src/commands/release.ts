import { type ChildConfiguration } from '@black-flag/core';

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
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';

export type CustomCliArguments = GlobalCliArguments;

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
    // TODO
  });

  return {
    builder,
    description: 'Pack and release existing production-ready distributables',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Releasing project...');

      // TODO (skip reinstalling node_modules if dir exists unless --force-reinstall)
      // TODO (run "early lint" first, then "late lint" (that checks all prod deps resolvable, no extraneous deps or dev deps, no missing deps) after build completes)
      // TODO (need flag for updating changelog or not updating changelog that also is compat with UPDATE_CHANGELOG)
      // TODO (use changelog.patch.?(cm)js if available)
      // TODO (do codecov upload last)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
