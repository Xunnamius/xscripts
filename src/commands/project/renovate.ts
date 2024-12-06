import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  DefaultGlobalScope as ProjectRenovateScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

/**
 * @see {@link ProjectRenovateScope}
 */
export const projectRenovateScopes = Object.values(ProjectRenovateScope);

export type CustomCliArguments = GlobalCliArguments & {
  // TODO
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    // TODO
    scope: { choices: projectRenovateScopes, default: ProjectRenovateScope.Unlimited }
  });

  return {
    builder,
    description: 'Bring a project into compliance with latest best practices',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger(
        [LogTag.IF_NOT_QUIETED],
        `Renovating ${scope === ProjectRenovateScope.ThisPackage ? 'this package' : 'the entire project'}...`
      );

      debug('scope: %O', scope);

      // ! Must NEVER proceed if the repo is dirty

      // !
      // TODO: all -operations are tasks, which are sub-arguments of --tasks
      // TODO: (alias --task)
      // !
      // TODO: all potentially destructive activities require --force or for the
      // TODO: user to type the package's name for confirmation
      // !
      // TODO (is idempotent)
      // TODO (allows only renovating a subset of files)
      //
      //
      //
      //
      // TODO (--deprecate --force (requires --force))
      // TODO (like init, can generate missing configs and doesn't overwrite existing configs)
      // TODO (--interactive (default) to trigger an interactive fix of anything from project lint that is fixable (also offer to overwrite/replace, merge, etc; similar to apt) or --no-interactive to do the same but fail if any problem is not automatically resolvable; can also call --no-interactive --force to do the same but force through any changes and overwrite existing configs without regard for their contents (SUPER DANGEROUS))
      // TODO (does nothing if called without at least one "Task Options" (--tasks) argument; i.e. must specify each thing that you want done
      // TODO (--task X where X includes: modernize (run tasks that bring the repo up to date, deprecate (automate deprecation described in docs), undeprecate (opposite of "deprecate"))
      // TODO (--task regenerate-aliases to (re)generate project aliases; also has the sub-option --with-alias X:Y which defines a new base alias (aliases cannot contain colons or dollar signs))
      //
      // TODO: Automatically update project dependencies in an xo-like way if
      // TODO: --task dependency-updates provided. Works kinda like "doctor" mode:
      // TODO:
      // TODO:   1. Manually select deps (dep, dev dep, etc; never include peer deps) to attempt to update (takes into account .ncurc.cjs and unselects any matching deps)
      // TODO:   2. For all deps: update package.json for that single package via npm install (with --force if --dependency-updates-forced=true), run tests (--dependency-update-test unit-only (default) or unit-and-integration), if all is successful (including "npm install" itself) add dep to success list otherwise add to fail list
      // TODO:   3. Afterwards, present user with options: #1 update package.json with working updates but don't install anything, #2 update package.json AND install working updates (each individual update to package.json and package-lock.json after each call to npm install is committed as chore/dev-deps and build/other-deps) and re-output the names of the failing ones at the end, don't do anything (repo left at its initial state), #3 manually select which deps to update (same as the end selections made in #1 but with failing deps unselected and clearly labeled as failing) and then choose between installing them (same as option #2) or not installing anything (same as option #1) (perhaps the installation choice goes at the top before the xo-like list of packages)
      //
      // TODO (--task clone-remote-wiki to clone the GitHub wiki (if it exists) into .wiki; --task kill-master to reconfigure the local and remote (GitHub) branch from master to main)
      // TODO (need to handle assetverse aliasing concerns (example in quiz-euphoriareign))
      // TODO (xscripts project renovate --task synchronize-interdependencies (alias "sync-deps") (if monorepo, update all package.json dependencies with latest versions from other packages in the monorepo))
      // TODO: https://gist.github.com/Xunnamius/7f6cd12e09bd46fb59af91a63ddd4dd7
      // TODO: --tasks can have aliases; if both are given, dedup occurs

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
