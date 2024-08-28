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
    description: 'Create a brand new project from one of several templates',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, runtimeContext_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Initializing new project...');

      // TODO: (select either: create a new directory at custom path OR use cwd)
      // ! v
      // TODO: is idempotent and NEVER overwrites things that already exist
      // ! ^
      // TODO: if handlebar notation suffixed by \n\n, replace suffix with \n (or is this handled via prettier already?)
      // TODO: (includes the lenses: cli, next.js, react, library)
      // TODO: (launch and task examples in vscode are materialized)
      // TODO: (can init new monorepo packages with proper setup including tsconfig files and what not)
      // TODO: (needs to delete the remark-link ignore comment from all Markdown files coming from src/assets/template)
      // TODO ("xscripts project init --from-template next" et al)
      // TODO ("xscripts project init --with-lib newLibA" which regenerates aliases)
      // TODO ("xscripts project init --with-package newMonorepoPackage" which has the ability to turn a polyrepo into a monorepo if it isn't already (also regenerates aliases))
      // TODO (enable private vulnerability reporting and secret scanning for GitHub repositories)
      // TODO (each project gets its own personal GPG key added to the appropriate account automatically upon creation)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
