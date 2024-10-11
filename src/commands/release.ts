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

export type CustomCliArguments = GlobalCliArguments;

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
    description: 'Pack and release existing production-ready distributables',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Releasing project...');

      // TODO (leave turbo's tasks to turbo, only focus on releasing!)
      // TODO (skip reinstalling node_modules if dir exists unless --force-reinstall)
      // TODO (run "early lint" first, then "late lint" (that checks all prod deps resolvable, no extraneous deps or dev deps, no missing deps) after build completes)
      // TODO (need flag for updating changelog or not updating changelog that also is compat with XSCRIPTS_RELEASE_UPDATE_CHANGELOG)
      // TODO (use changelog.patch.?(cm)js if available)
      // TODO (do codecov upload last)
      // TODO (tests run WITHOUT --no-warnings !!!)
      // TODO (releases use npm provenance attestation features if --with-provenance flag is given; see https://docs.npmjs.com/generating-provenance-statements)
      // TODO (create as an issue to note for later: simultaneously publish to GitHub Packages and NPM)
      // TODO (check early that all required environment variables are defined and valid)
      // TODO (ensure simultaneous releases are supported)
      // TODO (--codecov-flags to determine which flags to send to codecov when uploading test results)
      // TODO (configure this command by configuring the appropriate npm scripts at the expected "well-known" names (same with all commands honestly))
      // TODO (do not allow packages below version 1.0.0 to be published (semantic-release incompatibility))
      // TODO (GPG keys generated during each major must be set to never expire... however previously active keys must be revoked (only if they maintain their "verified" status on GitHub though))
      // TODO (need to do codecov stuff in here: CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) npx codecov)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
