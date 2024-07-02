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

export type CustomCliArguments = GlobalCliArguments & {
  // TODO
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
    // TODO (no dot imports outside lib directory)
    // TODO (bring in lint code from projector)
    // TODO (add depcheck package (maybe), browserslist (update caniuse first), attw, and others into the mix)
    // TODO (test dir cannot appear under src, directly under lib, or under external-scripts)
    // TODO (latest versions of all files being used, including lint-staged et al)
    // TODO (ensure all imported packages in dist are)
    // TODO (lint project structure)
    // TODO (lint engines.node with browserslist 'maintained node versions, current node' with flag for allowing lower bound drop off (i.e. allow lower versions than given to be missing))
    // TODO (two linting stages: "early lint" (the usual) and "late lint" (that checks all prod deps resolvable, no extraneous deps or dev deps, no missing deps))
    // TODO (npx update-browserslist-db@latest (non-match doesn't cause error only warning))
  });

  return {
    builder,
    description: 'Run linters (e.g. eslint, remark) across all relevant files',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Linting project...');

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
