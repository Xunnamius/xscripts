import { type ChildConfiguration } from '@black-flag/core';
// ? Patches global Proxy and spawn functions; see documentation for details
import '@-xun/scripts/assets/config/conventional.config.cjs';

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
  parallel: boolean;
  rebuildChangelog: boolean;
  skipPrereleaseTasks: boolean;
  skipPostreleaseTasks: boolean;
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
      description: 'Override various safety checks',
      default: false
    },
    parallel: {
      boolean: true,
      default: true,
      describe: 'Run release tasks concurrently when possible'
    },
    'rebuild-changelog': {
      boolean: true,
      description: 'Completely rebuild the changelog before release',
      default: true
    },
    'skip-prerelease-tasks': {
      boolean: true,
      description: 'Skip all prerelease tasks',
      default: !!process.env.TURBO_HASH,
      defaultDescription: 'true if run using Turbo, false otherwise'
    },
    'skip-postrelease-tasks': {
      boolean: true,
      description: 'Skip all postrelease tasks',
      default: false
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
$1 according to the release procedure described in the MAINTAINING.md file and at length in the xscripts wiki: https://github.com/Xunnamius/xscripts/wiki. The procedure is essentially composed of ten tasks:

1. Validate environment variables
⠀⠀2. [prerelease task] Run npm ci (only if \`--ci=true\`)
⠀⠀⠀⠀3. [prerelease task] [npm run format] xscripts format
⠀⠀⠀⠀⠀⠀4. [prerelease task] [npm run lint:package:source or npm run lint] xscripts lint --scope=this-package-source
⠀⠀⠀⠀⠀⠀5. [prerelease task] [npm run build] xscripts build distributables
⠀⠀⠀⠀⠀⠀⠀⠀7. [prerelease task] [npm run test:package:all or npm run test] xscripts test --coverage
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀8. xscripts project renovate --scope this-package --task synchronize-interdependencies
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀9. Run xchangelog (rebuild CHANGELOG.md) and xrelease (publish new release)
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀10. [postrelease task] Upload coverage results to Codecov
⠀⠀⠀⠀⠀⠀6. [prerelease task] [npm run build:docs] xscripts build documentation

Tasks at the same indentation level will be run concurrently unless --no-parallel is provided, in which case they will be run in serial task order.

Provide --ci (--continuous-integration) to enable useful functionality for CI execution environments. Specifically: run task #2, run xrelease in CI mode, and facilitate package provenance if the runtime environment supports it. If running the release procedure by hand instead of via CI/CD, use --no-ci to disable CI-specific functionality. --no-ci (\`--ci=false\`) is the default when the NODE_ENV environment variable is undefined or "development," otherwise --ci (\`--ci=true\`) is the default.

Provide --rebuild-changelog to set the XSCRIPTS_RELEASE_UPDATE_CHANGELOG environment variable in the current execution environment. This will be picked up by xrelease, causing it to rebuild the changelog using \`xscripts build changelog\`. Provide --no-rebuild-changelog to prevent this behavior.

Running \`xscripts release\` will usually execute the tasks listed above. Provide --skip-prerelease-tasks to skip running tasks #2-7, also known as the "prerelease tasks". This is useful for task scheduling tools like Turbo that decide out-of-band if/when/how to run specific prerelease tasks; such a tool only calls \`xscripts release\` when it's ready to trigger xrelease. Therefore, \`--skip-prerelease-tasks=true\` becomes the default when Turbo is detected in the runtime environment (by checking for the existence of \`process.env.TURBO_HASH\`).

Similarly, provide --skip-postrelease-tasks to skip running tasks after #9, known as the "postrelease tasks," though this is typically unnecessary.

If the package's package.json file is missing the NPM script associated with a task, this command will exit with an error unless \`--skip-missing-tasks\` is provided, in which case any missing scripts (except "release", which must be defined) are noted in a warning but otherwise ignored.

The only available scope is "${ReleaseScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be eligible for release. Use Npm's workspace features, or Turbo's, if your goal is to potentially release multiple packages.

Provide --synchronize-interdependencies to run the equivalent of \`xscripts project renovate --scope this-package --task synchronize-interdependencies\` as a pre-release task. Defaults to \`--synchronize-interdependencies=true\`.

Uploading test coverage data to Codecov (a postrelease task) is only performed if any coverage data exists. An error will be thrown if no coverage data exists. Coverage data can be generated using \`xscripts test --coverage\` (which is prerelease task #7). When uploading coverage data, the package's name is used to derive a flag (https://docs.codecov.com/docs/flags). Codecov uses flags to map reports to specific packages in its UI and coverage badges.

Provide --dry-run to ensure no changes are made, no release is cut, and no publishing or git write operations occur. Use --dry-run to test what would happen if you were to cut a release.

Note: the minimum package version this command will release will always be 1.0.0. This is because xrelease does not officially support packages with versions below semver 1.0.0. If you attempt to release a package with a version below 0.0.1, it will be released as a 1.0.0 (breaking change) instead. It is not wise to use experimental package versions with xrelease or xscripts.

WARNING: this command is NOT DESIGNED TO HANDLE CONCURRENT EXECUTION ON THE SAME GIT REPOSITORY IN A SAFE MANNER. DO NOT run multiple instances of this command on the same repository or project. If using a tool like Turbo, ensure it runs all NPM "release" scripts serially (and ideally topologically).
`.trim()
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      ci,
      dryRun,
      force,
      parallel,
      rebuildChangelog,
      skipPrereleaseTasks,
      skipPostreleaseTasks,
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
      debug('parallel: %O', parallel);
      debug('rebuildChangelog: %O', rebuildChangelog);
      debug('skipPrereleaseTasks: %O', skipPrereleaseTasks);
      debug('skipPostreleaseTasks: %O', skipPostreleaseTasks);
      debug('skipMissingTasks: %O', skipMissingTasks);
      debug('synchronizeInterdependencies: %O', synchronizeInterdependencies);

      // TODO: format first -> lint, build:dist, build:docs concurrently -> test -> release
      // TODO: the above ordering is also true for Turbo (delete this todo only after turbo is configured)

      // TODO: disallow release if the repository is in a dirty state unless --force (give solution in error message)

      // TODO: --skip-prerelease-task [...2-7] vs --skip-prerelease-tasks (all of them) and these two options conflict

      // TODO: --skip-postrelease-task [10] vs --skip-postrelease-tasks (all of them) and these two options conflict

      // TODO: only use basic npm scripts and not nested (":") scripts

      // TODO: check that all required environment variables are defined and valid

      // TODO: execute tasks #1-8 wrt --ci, --rebuild-changelog, and --skip-prerelease-tasks

      // {@xscripts/notExtraneous dotenv}

      // TODO: set these before xrelease runs
      void process.env.XSCRIPTS_RELEASE_REBUILD_CHANGELOG;
      void process.env.XSCRIPTS_SPECIAL_INITIAL_COMMIT;

      // TODO: execute task #9 wrt --synchronize-interdependencies

      // TODO: execute task #10 (xrelease, maybe with --ci)
      // TODO: provenance via https://docs.npmjs.com/generating-provenance-statements
      // TODO: simultaneously publish to GitHub Packages and NPM?
      // TODO: simultaneously publish to NPM and JSR
      // TODO: do not allow packages below version 1.0.0 to be published (error early in plugin)

      // TODO: do codecov upload last; CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) codecov; use codecov flags to determine which flags to send to codecov when uploading test results

      // TODO: DO NOT upload codecov information if we're not on the main branch... unless we can use codecov's flags to address this issue? Maybe we can!

      // TODO: DO NOT USE npx codecov, we need to download the binary (to a consistent location based on its filename) if it isn't in path and use it instead

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
