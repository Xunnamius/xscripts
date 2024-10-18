import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';

import {
  ThisPackageGlobalScope as ReleaseScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe util.ts';

/**
 * @see {@link ReleaseScope}
 */
export const releaseScopes = Object.values(ReleaseScope);

export type CustomCliArguments = GlobalCliArguments<ReleaseScope>;

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: releaseScopes }
  });

  return {
    builder,
    description: 'Pack and release existing production-ready distributables',
    usage: withGlobalUsage(
      `
$1 according to the release procedure described in this project's MAINTAINING.md file.

The only available scope is "${ReleaseScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be eligible for release. Use Npm's workspace features, or Turbo's, if your goal is to potentially release multiple packages.`.trim()
    ),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Releasing project...');

      debug('scope (unused): %O', scope);

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
      // TODO (sanity check built files to ensure all require() paths are valid)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
