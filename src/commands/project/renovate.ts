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
    description: 'Bring a project into compliance with latest best practices',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, runtimeContext_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Renovating project...');

      // TODO (like init, can generate missing configs and doesn't overwrite existing configs)
      // TODO (is idempotent)
      // TODO (--interactive to trigger an interactive fix of anything from project lint that is fixable (also offer to overwrite/replace, merge, etc; similar to apt))
      // TODO: (needs to delete the remark-link ignore comment from all Markdown files coming from src/assets/template)
      // TODO (--deprecate and --undeprecate to automate deprecation and undeprecation process described in "project lint")
      // TODO (--regenerate-aliases to (re)generate project aliases)
      //
      // TODO: Automatically update project dependencies in an xo-like way
      // TODO: unless --no-dependency-updates passed (--dependency-updates=true
      // TODO: by default). By default, collects all dependencies together
      // TODO: by their name and if multiple packages depend on the same
      // TODO: dependency, that is evident (drop down) and all can be updated
      // TODO: simultaneously.
      // TODO:
      // TODO:   1. Manually select deps (dep, dev dep, etc; never include peer deps) to attempt to update (takes into account .ncurc.js and unselects any matching deps)
      // TODO:   2. For all deps: update package.json for that single package via npm install (with --force if --dependency-updates-forced=true), run tests (--dependency-update-test unit-only (default) or unit-and-integration), if all is successful (including "npm install" itself) add dep to success list otherwise add to fail list
      // TODO:   3. Afterwards, present user with options: #1 update package.json with working updates but don't install anything, #2 update package.json AND install working updates (each individual update to package.json and package-lock.json after each call to npm install is committed as chore/dev-deps and build/other-deps) and re-output the names of the failing ones at the end, don't do anything (repo left at its initial state), #3 manually select which deps to update (same as the end selections made in #1 but with failing deps unselected and clearly labeled as failing) and then choose between installing them (same as option #2) or not installing anything (same as option #1) (perhaps the installation choice goes at the top before the xo-like list of packages)
      //
      // TODO (--clone-remote-wiki to clone the GitHub wiki (if it exists) into .wiki, reconfigure the local branch from master to main)
      // TODO (--regenerate-gpg-key regenerates the project-specific GPG key and automatically find and delete the old one from the appropriate account, all automatically)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
