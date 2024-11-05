// {@xscripts/notExtraneous dotenv}
import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  ThisPackageGlobalScope as ReleaseScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

/**
 * @see {@link ReleaseScope}
 */
export const releaseScopes = Object.values(ReleaseScope);

export type CustomCliArguments = GlobalCliArguments<ReleaseScope> & {
  ci: boolean;
  dryRun: boolean;
  force: boolean;
  rebuildChangelog: boolean;
  skipPrereleaseTasks: boolean;
  skipMissingTasks: boolean;
  synchronizeInterdependencies: boolean;
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: releaseScopes },
    ci: {
      alias: 'continuous-integration',
      boolean: true,
      description: 'Enable functionality for CI execution environments',
      default:
        process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== 'development'
    },
    'dry-run': {
      boolean: true,
      description:
        "Go through the motions of cutting a release but don't actually do anything",
      default: false,
      conflicts: 'force'
    },
    force: {
      boolean: true,
      description: "Dangerously take ownership of the project's concurrency lock",
      default: false
    },
    'rebuild-changelog': {
      boolean: true,
      description: 'Completely rebuild the changelog before release',
      default: true
    },
    'skip-prerelease-tasks': {
      boolean: true,
      description: 'Only run semantic-release and related tooling',
      default: !!process.env.TURBO_HASH,
      defaultDescription: 'true if run using Turbo, false otherwise'
    },
    'skip-missing-tasks': {
      boolean: true,
      description: 'Skip any tasks with missing NPM scripts instead of throwing an error',
      default: false
    },
    'synchronize-interdependencies': {
      boolean: true,
      description:
        'Pull latest package.json dependency versions from other packages in this project',
      default: true
    }
  });

  return {
    builder,
    description: 'Pack and release existing production-ready distributables',
    usage: withGlobalUsage(
      `
$1 according to the release procedure described in the MAINTAINING.md file and at length in the xscripts wiki: https://github.com/Xunnamius/xscripts/wiki. Said release procedure is essentially composed of ten tasks:

1. Validate environment variables
2. [prerelease task] Run npm ci
3. [prerelease task] [npm run lint] xscripts lint --scope=this-package-source
4. [prerelease task] [npm run build] xscripts build distributables
5. [prerelease task] [npm run format] xscripts format
6. [prerelease task] [npm run build:docs] xscripts build documentation
7. [prerelease task] [npm run test] xscripts test --coverage
8. xscripts project renovate --synchronize-interdependencies (affects this package only)
9. Run semantic-release and regenerate CHANGELOG.md
10. Upload coverage results to Codecov

Provide --ci (--continuous-integration) to enable useful functionality for CI execution environments. Specifically: run task #2, run semantic-release in CI mode, and facilitate package provenance if the runtime environment supports it. If running the release procedure by hand instead of via CI/CD, use --no-ci to disable CI-specific functionality. --no-ci (\`--ci=false\`) is the default when the NODE_ENV environment variable is undefined or "development," otherwise --ci (\`--ci=true\`) is the default.

Provide --rebuild-changelog to set the XSCRIPTS_RELEASE_UPDATE_CHANGELOG environment variable in the current execution environment. This will be picked up by semantic-release, causing it to rebuild the changelog using \`xscripts build changelog\`. Provide --no-rebuild-changelog to prevent this behavior.

Running \`xscripts release\` will usually execute the tasks listed above. Provide --skip-prerelease-tasks to skip running tasks #2-7, also known as the "prerelease tasks". This is useful for task scheduling tools like Turbo that decide out-of-band if/when/how to run specific prerelease tasks; such a tool only calls \`xscripts release\` when it's ready to trigger semantic-release. Therefore, \`--skip-prerelease-tasks=true\` becomes the default when Turbo is detected in the runtime environment (by checking for the existence of \`process.env.TURBO_HASH\`).

If the package's package.json file is missing the NPM script associated with a task, this command will exit with an error unless \`--skip-missing-tasks\` is provided, in which case any missing scripts (except "release", which must be defined) are noted in a warning but otherwise ignored.

The only available scope is "${ReleaseScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be eligible for release. Use Npm's workspace features, or Turbo's, if your goal is to potentially release multiple packages.

Provide --synchronize-interdependencies to run a version of \`xscripts project renovate --synchronize-interdependencies\`, except the renovation is limited to the current package's package.json rather than every package's package.json across the entire project.

This command was designed to handle concurrent execution in a safe manner. A simple file-based locking mechanism is used to ensure only one instance of this command is performing Git operations and/or running semantic-release at any given moment. If a new instance of this command begins executing before another instance has finished, the new instance will backoff and try again later. If for some reason a deadlock occurs that prevents this command from running, providing --force will forcefully and _dangerously_ take ownership of any existing locks associated with this project. If used recklessly, --force could result in a deeply and unpredictably broken release process.

Uploading test coverage data to Codecov is only performed if any coverage data exists. A warning will be issued if no coverage data exists. Coverage data can be generated using \`xscripts test --coverage\` (which is prerelease task #7). When uploading coverage data, the package's name is used to derive a flag (https://docs.codecov.com/docs/flags). Codecov uses flags to map reports to specific packages in its UI and coverage badges.

Provide --dry-run to ensure no changes are made, no release is cut, and no publishing or git write operations occur. Use --dry-run to test what would happen if you were to cut a release.

Note: this command will refuse to release a package version below 1.0.0. This is because semantic-release does not officially support packages with versions below semver 1.0.0.`.trim()
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      ci,
      dryRun,
      force,
      rebuildChangelog,
      skipPrereleaseTasks,
      skipMissingTasks,
      synchronizeInterdependencies
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Releasing project...');

      debug('scope (unused): %O', scope);
      debug('ci: %O', ci);
      debug('dryRun: %O', dryRun);
      debug('force: %O', force);
      debug('rebuildChangelog: %O', rebuildChangelog);
      debug('skipPrereleaseTasks: %O', skipPrereleaseTasks);
      debug('skipMissingTasks: %O', skipMissingTasks);
      debug('synchronizeInterdependencies: %O', synchronizeInterdependencies);

      // TODO: only use basic npm scripts and not nested (":") scripts

      // TODO: ensure simultaneous releases are supported (backoff if locked)

      // TODO: check that all required environment variables are defined and valid

      // TODO: execute tasks #1-8 wrt --ci, --rebuild-changelog, and --skip-prerelease-tasks

      void process.env.XSCRIPTS_RELEASE_REBUILD_CHANGELOG;

      // TODO: execute task #9 wrt --synchronize-interdependencies

      // TODO: execute task #10 (semantic-release, maybe with --ci)
      // TODO: provenance via https://docs.npmjs.com/generating-provenance-statements
      // TODO: simultaneously publish to GitHub Packages and NPM?
      // TODO: simultaneously publish to NPM and JSR?
      // TODO: do not allow packages below version 1.0.0 to be published (error early in plugin)

      // TODO: do codecov upload last; CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) codecov; use codecov flags to determine which flags to send to codecov when uploading test results

      // TODO: DO NOT USE npx codecov, we need to download the binary (to a consistent location based on its filename) if it isn't in path and use it instead

      // TODO: change it so that even polyrepo root packages are released using the name@version tag syntax instead of the vversion tag syntax. For backwards compat, the olf vversion syntax will interpreted as root-pkg@version

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
