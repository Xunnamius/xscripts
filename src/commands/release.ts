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

export type CustomCliArguments = GlobalCliArguments;

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
    description: 'Pack and release existing production-ready distributables',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, runtimeContext_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Releasing project...');

      // TODO (skip reinstalling node_modules if dir exists unless --force-reinstall)
      // TODO (run "early lint" first, then "late lint" (that checks all prod deps resolvable, no extraneous deps or dev deps, no missing deps) after build completes)
      // TODO (need flag for updating changelog or not updating changelog that also is compat with UPDATE_CHANGELOG)
      // TODO (use changelog.patch.?(cm)js if available)
      // TODO (do codecov upload last)
      // TODO (tests run WITHOUT --no-warnings !!!)
      // TODO (releases use npm provenance attestation features if --with-provenance flag is given; see https://docs.npmjs.com/generating-provenance-statements)
      // TODO (create as an issue to note for later: simultaneously publish to GitHub Packages and NPM)
      // TODO (check early that all required environment variables are defined and valid)
      // TODO (ensure simultaneous releases are supported)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
