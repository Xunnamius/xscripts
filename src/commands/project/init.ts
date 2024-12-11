import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  UnlimitedGlobalScope as ProjectInitScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import {
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

/**
 * @see {@link ProjectInitScope}
 */
export const projectInitScopes = Object.values(ProjectInitScope);

export type CustomCliArguments = GlobalCliArguments<ProjectInitScope> & {
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
    scope: { choices: projectInitScopes, default: ProjectInitScope.Unlimited }
  });

  return {
    builder,
    description: 'Create a brand new project from one of several templates',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Initializing new project...');

      debug('scope (unused): %O', scope);

      // TODO: (select either: create a new directory at custom path OR use cwd)
      // ! v
      // TODO: is idempotent and NEVER overwrites things that already exist
      // ! ^
      // TODO: if handlebar notation suffixed by \n\n, replace suffix with \n (or is this handled via prettier already?)
      // TODO: (includes the lenses: cli, next.js, react, library)
      // TODO: (launch and task examples in vscode are materialized)
      // TODO: (can init new monorepo packages with proper setup including tsconfig files and what not)
      // TODO: (needs to delete the remark-link ignore comment from all Markdown files coming from src/assets/templates)
      // TODO ("xscripts project init --from-template next" et al)
      // TODO ("xscripts project init --with-lib newLibA" which regenerates aliases)
      // TODO ("xscripts project init --with-package newMonorepoPackage" which has the ability to turn a polyrepo into a monorepo if it isn't already (also regenerates aliases))
      // TODO (enable private vulnerability reporting and secret scanning for GitHub repositories)
      // TODO (each project gets its own personal GPG key added to the appropriate account automatically upon creation)
      // TODO (need to handle assetverse aliasing concerns (example in quiz-euphoriareign))
      // TODO (set special version of renovate command depending on preset used: basic, cli, lib, lib-esm, react, next)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
