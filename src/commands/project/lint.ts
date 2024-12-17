import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  UnlimitedGlobalScope as ProjectLinterScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import {
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

/**
 * @see {@link ProjectLinterScope}
 */
export const projectLinterScopes = Object.values(ProjectLinterScope);

export type CustomCliArguments = GlobalCliArguments<ProjectLinterScope> & {
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
    scope: { choices: projectLinterScopes, default: ProjectLinterScope.Unlimited }
  });

  return {
    builder,
    description: 'Verify project-wide structural compliance with latest best practices',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Verifying structural compliance...');

      debug('scope (unused): %O', scope);

      // TODO (ensure all test files have the proper naming convention and are located in the correct place.)
      // TODO (bring in lint code from the old projector project (plugin-lint I think it was called... see the old "lost" commits for project-utils))
      // TODO (add depcheck package (maybe), browserslist (update caniuse first), attw, and others into the mix)
      // TODO (test dir cannot appear under src)
      // TODO (latest versions of all files being used, including lint-staged etc)
      // TODO (ensure all imported packages in ./dist/ are in deps; all other package imports are in dev deps; no extraneous entries in deps or dev deps; warn if source deps are different than ./dist/ deps; error if any ./dist/ deps are unresolvable)
      // TODO (lint project structure like no more lib/external-scripts and src/assets becomes packages/assets and src/components becomes packages/components)
      // TODO (lint engines.node with browserslist 'maintained node versions, current node' with flag for allowing lower bound drop off (i.e. allow lower versions than given to be missing))
      // TODO (npx update-browserslist-db@latest (non-match doesn't cause error only warning))
      // TODO (monorepo packages need their own local versions of some of the config files (such as the tsconfig.x.json files))
      // TODO (no dot imports outside lib directory; all dot imports inside packages within lib directory must not reach outside those packages)
      // TODO (error when ./dist dir is not available for scanning (prompt to build dist first))
      // TODO (warn when using --experimental-vm-modules and jest's `transformIgnorePatterns: []` together!)
      // TODO (warn when copyright dates, like with LICENSE, are out of date)
      // TODO (warn when launch.example and task.example diverge from expected launch and task files in .vscode)
      // TODO (new flag: --run-to-completion (default: true) for finishing all linting then error/success; also update the task and example task to use this new flag)
      // TODO (check to ensure all breaking commits in the repository are in `type(scope)!: subject` form (specifically focusing on the "!" since our changelog generator needs to know if a commit is breaking just by looking at the subject alone))
      // TODO (must verify that "repository" url in package.json is correct (see current package.json for an example of it being correct) for provenance reasons)
      // TODO (diff generated config files versus on-disk config files and warn (but don't error) when different)
      // TODO (warn if a remark-link ignore comment exists at the beginning of a Markdown file's references section (means a template was copied incorrectly))
      // TODO (ensure package.json core-js version matches version in babelConfigProjectBase and elsewhere)
      // TODO (also lint the GitHub repository itself, including all its settings (branch protection on main and canary, adding xunn-bot/ergo-bot/nhscc-bot as collabs, disabling wiki/etc, adding sponsorship/funding links and all that, etc) and everything else (check past notes))
      // TODO (allow linting of all github repositories (via GitHub api) to check for various things (ensure repo metadata is correct including correct checkmarks marked and that tags are not missing and that the repo description does not have any of those :emoji: things in them and instead uses real unicode emojis; also ensure dependabot has not been deactivated and warn if it is); see MAINTAINING.md for the details of what is expected)
      // TODO (similar to the above, allow linting all known owned npm packages (via GitHub and NPM api) to check for various things (ensure published package.json does not contain deprecated old-style projector configs, etc); see MAINTAINING.md for the details of what is expected)
      // TODO (test/setup.ts must exist, and if it does, it should not export anything; test/index.ts must exist, and it is the place where shared test stuff can go)
      // TODO (types/index file not allowed)
      // TODO (package ids should be alphanumeric only (plus hyphens); this should be enforced by project-utils as well; warn if the package id is longer than 20 characters and give a reason why (it's used in imports and should be shorter for better DX))
      // TODO (warn for every line in .ncurc.cjs, if it exists, that this should be an aliased install instead (); this warning can be disabled via a flag; also warn if there are any package aliases that do not follow the tilde convention of "package-name~version" where "version" is some combination of numbers and periods)
      // TODO (warn when a monorepo root package.json is missing "private: true", though this can be disabled with --disable-warning or the env var that disables all warnings)
      // TODO (warn about .prettierignore files that aren't at the project root)
      // TODO (warn about peer dependencies that aren't semver ranges)
      // TODO (https://github.com/JamieMason/syncpack, https://www.npmjs.com/package/@manypkg/cli, https://www.npmjs.com/package/sherif)
      // TODO (warnings can be disabled using Node.js-style flags like --disable-warning=... or by defining XSCRIPTS_LINT_NO_WARNINGS as not 0/false)
      // TODO (no `bin` package.json entries should have non-string values, if the `bin` is given at all)
      // TODO (warn when xunn.at packages are not pinned to a specific version)
      // TODO (warn when GitHub metadata description lacks an emoji prefix)
      // TODO (ensure private vulnerability reporting and secret scanning are enabled for all GitHub repositories)
      // TODO (ensure x-link references all point to proper places in Markdown docs)
      // TODO (nested workspaces are not supported)
      // TODO (warn on package dependencies or devdependencies that are not ranges)
      // TODO (flag unknown files (files that aren't supposed to exist or are not recognized or are old names for things that have since been moved) and also provide a flag to allow files based on regexp)

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
