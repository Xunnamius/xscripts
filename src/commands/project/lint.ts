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
import { globalPreChecks } from 'universe/util';

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
    // TODO
  });

  return {
    builder,
    description: 'Verify project-wide structural compliance with latest best practices',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Verifying structural compliance...');

      // TODO: ensure all test files have the proper naming convention and are
      // TODO: located in the correct place.
      //
      // TODO (bring in lint code from projector)
      // TODO (add depcheck package (maybe), browserslist (update caniuse first), attw, and others into the mix)
      // TODO (test dir cannot appear under src, directly under lib, or under external-scripts)
      // TODO (latest versions of all files being used, including lint-staged et al)
      // TODO (ensure all imported packages in ./dist/ are in deps; all other package imports are in dev deps; no extraneous entries in deps or dev deps; warn if source deps are different than ./dist/ deps; error if any ./dist/ deps are unresolvable)
      // TODO (lint project structure)
      // TODO (lint engines.node with browserslist 'maintained node versions, current node' with flag for allowing lower bound drop off (i.e. allow lower versions than given to be missing))
      // TODO (npx update-browserslist-db@latest (non-match doesn't cause error only warning))
      // TODO (monorepo packages need their own local versions of some of the config files (such as the tsconfig.x.json files))
      // TODO (no dot imports outside lib directory; all dot imports inside packages within lib directory must not reach outside those packages)
      //
      // TODO (error when ./dist dir is not available for scanning (prompt to build dist first))
      // TODO (warn when using --experimental-vm-modules and jest's `transformIgnorePatterns: []` together!)
      // TODO (warn when copyright dates, like with LICENSE, are out of date)
      // TODO (warn when launch.example and task.example diverge from expected launch and task files in .vscode)
      // TODO: (new flag: --run-to-completion for finishing all linting then error/success; also update the task and example task to use this new flag)
      // TODO: (check to ensure all breaking commits in the repository are in `type(scope)!: subject` form (specifically focusing on the "!" since our changelog generator needs to know if a commit is breaking just by looking at the subject alone))
      // TODO (must verify that "repository" url in package.json is correct (see current package.json for an example of it being correct) for provenance reasons)
      // TODO (diff generated config files versus on-disk config files and warn (but don't error) when different)
      // TODO (warn if a remark-link ignore comment exists at the beginning of a Markdown file's references section (means a template was copied incorrectly))
      // TODO (ensure package.json core-js version matches version in babel.config.js and elsewhere)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
