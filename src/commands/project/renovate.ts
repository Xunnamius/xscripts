/* eslint-disable unicorn/prevent-abbreviations */
import { CliError, type ChildConfiguration } from '@black-flag/core';
import libsodium from 'libsodium-wrappers';
import getInObject from 'lodash.get';

import {
  getInvocableExtendedHandler,
  type AsStrictExecutionContext,
  type BfeBuilderObject,
  type BfeBuilderObjectValue,
  type BfeCheckFunction,
  type BfeStrictArguments
} from 'multiverse+bfe';

import { hardAssert, softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { type Package, type XPackageJson } from 'multiverse+project-utils:analyze.ts';

import {
  markdownArchitectureProjectBase,
  markdownReadmePackageBase,
  packageJsonConfigPackageBase,
  toPath
} from 'multiverse+project-utils:fs.ts';

import {
  SHORT_TAB,
  SINGLE_SPACE,
  type ExtendedDebugger,
  type ExtendedLogger,
  type UnextendableInternalLogger
} from 'multiverse+rejoinder';

import { version as packageVersion } from 'rootverse:package.json';

import {
  retrieveAllRelevantConfigAssets,
  type IncomingTransformerContext
} from 'universe:assets.ts';

import {
  default as format,
  type CustomCliArguments as FormatCliArguments
} from 'universe:commands/format.ts';

import {
  $executionContext,
  DefaultGlobalScope,
  DefaultGlobalScope as ProjectRenovateScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  determineRepoWorkingTreeDirty,
  getRelevantDotEnvFilePaths,
  loadDotEnv,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage,
  writeFile
} from 'universe:util.ts';

import type { RestEndpointMethodTypes } from '@octokit/rest' with { 'resolution-mode': 'import' };
import type { CamelCasedProperties, KeysOfUnion, Merge } from 'type-fest';

type NewRuleset = Merge<
  RestEndpointMethodTypes['repos']['createRepoRuleset']['parameters'],
  { owner?: undefined; repo?: undefined }
>;

type ExistingRuleset =
  RestEndpointMethodTypes['repos']['getRepoRuleset']['response']['data'];

/**
 * The number of minutes the "pause ruleset" renovation will "pause" for
 */
const RULESET_PROTECTION_PAUSE_MINUTES = 5;

const defaultDescriptionEmoji = '⚡';
const homepagePrefix = 'https://npm.im/';

const standardProtectRuleset: NewRuleset = {
  name: 'standard-protect',
  target: 'branch',
  enforcement: 'active',
  conditions: {
    ref_name: {
      // * https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository#using-fnmatch-syntax
      include: [
        // ? Protect the default branch
        '~DEFAULT_BRANCH',
        // ? Protect any maintenance branches
        'refs/heads/**.x'
      ],
      // ! The types are lying; this is required!
      exclude: []
    }
  },
  rules: [
    { type: 'deletion' },
    { type: 'non_fast_forward' },
    { type: 'required_signatures' }
  ],
  bypass_actors: []
};

const canaryProtectRuleset: NewRuleset = {
  name: 'canary-protect',
  target: 'branch',
  enforcement: 'active',
  conditions: {
    ref_name: {
      // * https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository#using-fnmatch-syntax
      include: [
        // ? Protect the canary branch
        'refs/heads/canary'
      ],
      // ! The types are lying; this is required!
      exclude: []
    }
  },
  rules: [
    { type: 'deletion' },
    { type: 'non_fast_forward' },
    { type: 'required_signatures' }
  ],
  bypass_actors: []
};

/**
 * @see {@link ProjectRenovateScope}
 */
export const projectRenovateScopes = Object.values(ProjectRenovateScope);

// TODO: unify task runners in this command, in release, and elsewhere into
// TODO: src/task-runner.ts

/**
 * The context passed to each individual task.
 */
export type RenovationTaskContext = {
  self: RenovationTask;
  log: ExtendedLogger;
  debug: ExtendedDebugger;
};

export type RenovationTaskArgv = BfeStrictArguments<
  CustomCliArguments,
  GlobalExecutionContext
>;

export type RenovationTask = Omit<
  BfeBuilderObjectValue<Record<string, unknown>, GlobalExecutionContext>,
  'alias' | 'demandThisOptionOr'
> & {
  /**
   * The name of the task.
   */
  taskName: string;
  /**
   * The alternative names of the task.
   *
   * @see {@link BfeBuilderObjectValue.alias}
   */
  taskAliases: string[];
  /**
   * A symbol that will be placed before xscripts output text concerning this
   * task.
   */
  emoji: string;
  /**
   * The description reported to the user when the task is run.
   *
   * @default `Running task ${taskName}`
   */
  actionDescription: string;
  /**
   * The description reported to the user when `--help` is called (via usage).
   */
  longHelpDescription: string;
  /**
   * The description reported to the user when `--help` is called (via option).
   */
  shortHelpDescription: string;
  /**
   * If `true`, `--force` must be given on the command line alongside this task.
   */
  requiresForce: boolean;
  /**
   * Which {@link ProjectRenovateScope}s are allowed when attempting this
   * renovation.
   */
  supportedScopes: ProjectRenovateScope[];
  /**
   * Suboptions of this task are only relevant when this task's flag is given
   * on the CLI.
   */
  subOptions: Record<
    string,
    Omit<
      BfeBuilderObjectValue<Record<string, unknown>, GlobalExecutionContext>,
      'requires' | `demand${string}`
    > & {
      requires?: Extract<
        BfeBuilderObjectValue<
          Record<string, unknown>,
          GlobalExecutionContext
        >['requires'],
        Record<string, unknown>
      >;
    }
  >;
  /**
   * A function called when the task is triggered.
   */
  run: (argv: unknown, taskContextPartial: RenovationTaskContext) => Promise<void>;
};

/**
 * These presets each represent a list of assets from `src/assets/config`. By
 * specifying a preset, only the assets it represents will be renovated and all
 * others will be ignored.
 *
 * @see {@link renovationPresetAssets}
 */
export enum RenovationPreset {
  /**
   * Represents the minimum possible configuration necessary for xscripts to be
   * at least semi-functional.
   *
   * This preset is only useful when working on a project that does not use
   * xscripts, or for which xscripts has been bolted-on after the fact (such as
   * the case with `xchangelog` and `xrelease`).
   *
   * @see {@link renovationPresetAssets}
   */
  Minimal = 'minimal',
  /**
   * Represents the most basic asset configuration necessary for xscripts to be
   * fully functional.
   *
   * This preset is the basis for all others (except `RenovationPreset.Minimal`)
   * and can be used on any xscripts-compliant project when only a subset of
   * renovations are desired, such as when regenerating aliases.
   *
   * @see {@link renovationPresetAssets}
   */
  Basic = 'basic',
  /**
   * Represents the standard asset configuration for an xscripts-compliant
   * command-line interface project (such as `@black-flag/core`-powered tools
   * like `xscripts` itself).
   *
   * @see {@link renovationPresetAssets}
   */
  Cli = 'cli',
  /**
   * Represents the standard asset configuration for an xscripts-compliant
   * library project built for both CJS and ESM consumers (such as the case with
   * `@black-flag/core`) and potentially also browser and other consumers as
   * well.
   *
   * @see {@link renovationPresetAssets}
   */
  Lib = 'lib',
  /**
   * Represents the standard asset configuration for an xscripts-compliant
   * library project built exclusively for ESM and ESM-compatible consumers
   * (such as the case with the `unified-utils` monorepo).
   *
   * @see {@link renovationPresetAssets}
   */
  LibEsm = 'lib-esm',
  /**
   * Represents the standard asset configuration for an xscripts-compliant
   * library project built exclusively for ESM consumers operating in a
   * browser-like runtime (such as the case with the `next-utils` monorepo).
   *
   * @see {@link renovationPresetAssets}
   */
  LibWeb = 'lib-web',
  /**
   * Represents the standard asset configuration for an xscripts-compliant React
   * project.
   *
   * @see {@link renovationPresetAssets}
   */
  React = 'react',
  /**
   * Represents the standard asset configuration for an xscripts-compliant
   * Next.js + React project.
   *
   * @see {@link renovationPresetAssets}
   */
  Nextjs = 'nextjs'
}

/**
 * @see {@link RenovationPreset}
 */
export const renovationPresets = Object.values(RenovationPreset);

export type CustomCliArguments = GlobalCliArguments & {
  force: boolean;
  parallel: boolean;
  runToCompletion: boolean;
} & CamelCasedProperties<
    Record<keyof typeof renovationTasks, boolean> &
      Partial<
        Record<
          KeysOfUnion<
            (typeof renovationTasks)[keyof typeof renovationTasks]['subOptions']
          >,
          unknown
        >
      >
  >;

export default function command(
  executionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  const { log, debug_, state, projectMetadata: projectMetadata_ } = executionContext;

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: {
      choices: projectRenovateScopes,
      default: ProjectRenovateScope.Unlimited,
      description: 'Whether to renovate the current package or the entire project'
    },
    force: {
      boolean: true,
      description: 'Disregard all safety checks',
      default: false
    },
    parallel: {
      boolean: true,
      default: true,
      describe: 'Run renovation tasks concurrently'
    },
    'run-to-completion': {
      boolean: true,
      description: 'Do not exit until all tasks have finished running',
      default: true
    },
    ...renovationTasksToBlackFlagOptions(debug_.extend('builder'))
  });

  return {
    builder,
    description: 'Bring a project into compliance with latest best practices',
    usage:
      withGlobalUsage(`$1 via the execution of one or more renovation "tasks". A task is executed by specifying its renovation "task flag", e.g. --an-example-task-flag. The following task flags are available:

${printRenovationTasks()}

This command must be invoked with at least one task flag. Tasks are run concurrently unless --no-parallel is given, and are all run to completion even if one of the tasks fails unless \`--run-to-completion=false\` is given.

Environment variables are loaded into process.env from the following file(s), if they exist and depending on scope, with the variables in latter files overwriting those in the former:

${SHORT_TAB}- ${getRelevantDotEnvFilePaths(projectMetadata_).join(`\n${SHORT_TAB}- `)}

When \`--scope=${ProjectRenovateScope.Unlimited}\`, package-specific .env and .env.default files are ignored.

Renovations are performed on the entire project by default, and typically involve overwriting/deleting obsolete versions of certain configuration files, but several renovation tasks can be limited to the current package via \`--scope=${ProjectRenovateScope.ThisPackage}\`.

If this command is invoked in a repository with an unclean working directory, it will fail unless --force is given. Similarly, tasks with potentially destructive or permanent consequences must be manually authorized via --force. That said, all renovation tasks are idempotent: running the same renovations back-to-back on an otherwise-unchanged project/package is essentially a no-op.

When renovating a Markdown file using an asset template that is divided into replacer regions via the magic comments "<!-- xscripts-renovate-region-start -->", "<!-- xscripts-renovate-region-end -->", and potentially "<!-- xscripts-renovate-region-definitions -->"; and if the existing renovation target has corresponding replacer regions defined; this command will perform so-called "regional replacements," where only the content within the renovation regions (i.e. between the "start" and "end" comments) will be modified. Regional replacements can be used to allow ultimate flexibility and customization of Markdown assets while still maintaining a consistent look and feel across xscripts-powered projects. This benefit is most evident in each package's ${markdownReadmePackageBase} file, and each project's ${markdownArchitectureProjectBase} file, among others.

When attempting to renovate a Markdown file without replacer regions when its corresponding asset template does have replacer regions, the entire file will be overwritten like normal.

Currently, this command only functions with origin repositories hosted on GitHub.`),
    handler: withGlobalHandler(async function (argv) {
      const { $0: scriptFullName, scope, parallel, force, runToCompletion } = argv;

      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });

      genericLogger(
        [LogTag.IF_NOT_QUIETED],
        `Renovating ${scope === ProjectRenovateScope.ThisPackage ? projectMetadata.cwdPackage.json.name : 'the entire project'}...`
      );

      genericLogger.newline([LogTag.IF_NOT_HUSHED]);

      debug('argv: %O', argv);

      const { isDirty } = await determineRepoWorkingTreeDirty();

      softAssert(
        !isDirty || force,
        ErrorMessage.ActionAttemptedWithADirtyRepo('renovation')
      );

      debug('processing tasks');

      // TODO: generalize this task algo along with what's in renovate and init

      try {
        const renovationTasksEntries = Object.entries(renovationTasks) as [
          keyof CamelCasedProperties<typeof renovationTasks>,
          Omit<RenovationTask, 'taskName'>
        ][];

        debug(
          'processing %O renovation tasks: %O',
          renovationTasksEntries.length,
          renovationTasks
        );

        const taskPromiseFunctions = renovationTasksEntries
          .map(([taskName, task]) => {
            if (!argv[taskName]) {
              return undefined;
            }

            return async function () {
              const { actionDescription, emoji, run: taskRunner } = task;

              const dbg = debug.extend(taskName);
              const taskLogger = genericLogger.extend(taskName);

              dbg('preparing to run task %O', taskName);
              taskLogger([LogTag.IF_NOT_HUSHED], `${emoji} ${actionDescription}`);

              dbg('entering runner function');

              await taskRunner(argv, {
                log: taskLogger,
                debug: dbg,
                self: task as unknown as RenovationTask
              });

              taskLogger([LogTag.IF_NOT_HUSHED], '✅');
            };
          })
          .filter((fn) => !!fn);

        debug(
          'running %O/%O renovation tasks %O',
          taskPromiseFunctions.length,
          renovationTasksEntries.length,
          parallel ? 'concurrently' : 'serially'
        );

        debug('waiting for renovation tasks to finish running...');

        if (parallel) {
          const promises = taskPromiseFunctions.map((p) => p());

          if (runToCompletion) {
            debug.message(
              'renovation tasks will run to completion even if an error occurs'
            );

            const results = await Promise.allSettled(promises);

            for (const result of results) {
              if (result.status === 'fulfilled') {
                debug("a renovation task runner's promise has fulfilled");
              } else {
                throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed(), {
                  cause: result.reason
                });
              }
            }
          } else {
            try {
              await Promise.all(promises);
            } catch (error) {
              throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed(), {
                cause: error
              });
            }
          }
        } else {
          let firstError = undefined as unknown;

          for (const taskPromiseFunction of taskPromiseFunctions) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await taskPromiseFunction();
            } catch (error) {
              if (runToCompletion) {
                firstError ||= error;
              } else {
                throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed(), {
                  cause: error
                });
              }
            }
          }

          if (firstError) {
            throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed(), {
              cause: firstError
            });
          }
        }
      } finally {
        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}

function renovationTasksToBlackFlagOptions(
  debug: ExtendedDebugger
): BfeBuilderObject<CustomCliArguments, GlobalExecutionContext> {
  const renovationTaskNames = Object.keys(renovationTasks);
  return Object.fromEntries(
    Object.entries(
      renovationTasks as Record<
        keyof typeof renovationTasks,
        Omit<RenovationTask, 'taskName'>
      >
    ).flatMap(
      ([
        taskName,
        {
          subOptions,
          taskAliases,
          shortHelpDescription,
          emoji,
          supportedScopes,
          requiresForce,
          longHelpDescription: _,
          run: __,
          actionDescription: ___,
          ...blackFlagOptions
        }
      ]) => {
        return [
          [
            taskName,
            {
              boolean: true,
              description: `${emoji} ${shortHelpDescription}`,
              default: false,
              ...blackFlagOptions,
              alias: taskAliases,
              demandThisOptionOr: renovationTaskNames,
              check: [
                isUsingSupportedScope(taskName, supportedScopes, debug),
                isUsingForceIfRequired(taskName, requiresForce, debug),
                ...[blackFlagOptions.check || []].flat()
              ]
            }
          ],
          ...Object.entries(subOptions).map(([optionName, subOption]) => [
            optionName,
            {
              group: 'Task-dependent Options:',
              ...subOption,
              requires: { ...subOption.requires, [taskName]: true }
            }
          ])
        ];
      }
    )
  );
}

function isUsingSupportedScope(
  taskName: string,
  supportedScopes: ProjectRenovateScope[],
  checkDebug: ExtendedDebugger
): BfeCheckFunction<CustomCliArguments, GlobalExecutionContext> {
  return function (currentArgumentValue, { scope }) {
    checkDebug('taskName: %O', taskName);
    checkDebug('currentArgumentValue: %O', currentArgumentValue);
    checkDebug('scope: %O', scope);
    checkDebug('supportedScopes: %O', supportedScopes);

    return (
      !currentArgumentValue ||
      supportedScopes.includes(scope) ||
      ErrorMessage.UnsupportedRenovationScope(taskName, scope, supportedScopes)
    );
  };
}

function isUsingForceIfRequired(
  taskName: string,
  requiresForce: boolean,
  checkDebug: ExtendedDebugger
): BfeCheckFunction<CustomCliArguments, GlobalExecutionContext> {
  return function (currentArgumentValue, { force }) {
    checkDebug('taskName: %O', taskName);
    checkDebug('currentArgumentValue: %O', currentArgumentValue);
    checkDebug('force: %O', force);
    checkDebug('requiresForce: %O', requiresForce);

    return (
      !currentArgumentValue ||
      !requiresForce ||
      force ||
      ErrorMessage.DangerousRenovationRequiresForce(taskName)
    );
  };
}

function printRenovationTasks() {
  let tasksString = '';

  for (const [
    taskName,
    {
      emoji,
      requiresForce,
      longHelpDescription,
      subOptions,
      taskAliases,
      supportedScopes
    }
  ] of Object.entries(renovationTasks)) {
    const subOptionNames = Object.keys(subOptions);
    hardAssert(supportedScopes.length, ErrorMessage.GuruMeditation());

    tasksString += `Renovation task:${SINGLE_SPACE} --${taskName} ${emoji}${requiresForce ? ` (requires --force)` : ''}${
      taskAliases.length
        ? `\nTask aliases:${SINGLE_SPACE.repeat(4)} --${taskAliases.join(', --')}`
        : ''
    }${
      subOptionNames.length
        ? `\nRelated options:${SINGLE_SPACE} --${subOptionNames.join(', --')}`
        : ''
    }
Supported scopes: ${supportedScopes.join(', ')}

${longHelpDescription.trim()}\n\n=====\n\n`;
  }

  return tasksString.trim();
}

function checkRuntimeIsReadyForGithub(argv: RenovationTaskArgv, log: ExtendedLogger) {
  const {
    scope,
    force,
    [$executionContext]: { projectMetadata }
  } = argv;

  loadDotEnv(['GITHUB_TOKEN'], {
    log,
    dotEnvFilePaths: getRelevantDotEnvFilePaths(
      projectMetadata,
      scope === ProjectRenovateScope.Unlimited ? 'project-only' : 'both'
    ),
    force,
    failInstructions: 'Skip this check with --force',
    onFail() {
      softAssert(ErrorMessage.RenovateEnvironmentValidationFailed());
    }
  });
}

function checkRuntimeIsReadyForNpm(argv: RenovationTaskArgv, log: ExtendedLogger) {
  const {
    scope,
    force,
    [$executionContext]: { projectMetadata }
  } = argv;

  loadDotEnv(['NPM_TOKEN'], {
    log,
    dotEnvFilePaths: getRelevantDotEnvFilePaths(
      projectMetadata,
      scope === ProjectRenovateScope.Unlimited ? 'project-only' : 'both'
    ),
    force,
    failInstructions: 'Skip this check with --force',
    onFail() {
      softAssert(ErrorMessage.RenovateEnvironmentValidationFailed());
    }
  });
}

let allowOctokitOutput = true;

function wrapLogger(
  logger: ExtendedDebugger | ExtendedLogger | UnextendableInternalLogger
) {
  return function (...args: Parameters<typeof logger>) {
    if (allowOctokitOutput) {
      logger.apply(undefined, args);
    }
  };
}

async function makeOctokit({
  debug,
  log
}: {
  debug: ExtendedDebugger;
  log: ExtendedLogger;
}) {
  const { Octokit } = await import('@octokit/rest');
  const { retry } = await import('@octokit/plugin-retry');
  const { throttling } = await import('@octokit/plugin-throttling');

  Octokit.plugin(retry, throttling);
  const ghLog = log.extend('gh');

  return new Octokit({
    userAgent: `Xunnamius/xscripts@${packageVersion}`,
    auth: process.env.GITHUB_TOKEN,
    log: {
      debug: debug.extend('gh'),
      info: wrapLogger(ghLog),
      warn: wrapLogger(ghLog.message),
      error: wrapLogger(ghLog.warn)
    },
    throttle: {
      onRateLimit: (retryAfter, options, _octokit, retryCount) => {
        debug.warn(
          `Transient rate limit detected for request ${options.method} ${options.url}`
        );

        if (retryCount < 3) {
          log.message(`Retrying after ${retryAfter} seconds...`);
          return true;
        }
      },
      onSecondaryRateLimit: (_retryAfter, options) => {
        debug.error(
          `Fatal rate limit detected for request ${options.method} ${options.url}`
        );
      }
    }
  });
}

const githubUrlRegExp = /github.com\/([^/]+)\/([^/]+?)(?:\.git)?$/;

function parsePackageJsonRepositoryIntoOwnerAndRepo({ repository, name }: XPackageJson) {
  if (repository) {
    const target = typeof repository === 'string' ? repository : repository.url;
    const match = target.match(githubUrlRegExp);

    if (match) {
      const [, owner, repo] = match;
      return { owner, repo };
    }
  }

  softAssert(ErrorMessage.BadRepositoryInCwdPackageJson(name));
}

/**
 * @see {@link RenovationTask}
 */
export const renovationTasks = {
  'github-reconfigure-repo': {
    emoji: '🎚️',
    taskAliases: [],
    actionDescription: 'Reconfiguring origin repository settings',
    shortHelpDescription: '(Re-)configure the origin GitHub repository settings',
    longHelpDescription: `This renovation will apply a standard configuration preset to the origin repository. Specifically, this renovation will:

- Update the repository's metadata
${SHORT_TAB} - Set description to package.json::description only if not already set
${SHORT_TAB}${SHORT_TAB} - With default emoji prefix: ${defaultDescriptionEmoji}
${SHORT_TAB} - Set homepage to "${homepagePrefix}pkg-name" only if not already set
${SHORT_TAB} - Enable ambient repository-wide secret scanning
${SHORT_TAB} - Enable scanning pushes for secrets
${SHORT_TAB} - Enable issues
${SHORT_TAB} - Enable projects
${SHORT_TAB} - Enable squash merging for pull requests
${SHORT_TAB} - Disable normal merging for pull requests
${SHORT_TAB} - Enable rebase merging for pull requests
${SHORT_TAB} - Disable branch deletion on successful pull request merge
${SHORT_TAB} - Enable suggesting forced-synchronization of pull request branches
${SHORT_TAB} - Set topics to lowercased package.json::keywords
- Set the repository to "starred" by the current user
- Set the repository to "watched" (via "all activity") by the current user
- Create/enable the "standard-protect" and "canary-protect" rulesets
${SHORT_TAB} - If the rulesets already exist and --force was given, they're deleted, recreated, then enabled
${SHORT_TAB} - If the rulesets already exist and --force wasn't given, they're enabled
${SHORT_TAB} - A warning is issued if any other ruleset is encountered
${SHORT_TAB} - A warning is issued if a legacy "classic branch protection" setting is encountered for well-known branches
- Upload missing GitHub Actions environment secrets (encrypted)
${SHORT_TAB} - Only secrets that do not already exist will be uploaded
${SHORT_TAB} - If --force was given, all existing secrets will be deleted before the upload
${SHORT_TAB} - Secrets will be sourced from the package and project .env files
${SHORT_TAB}${SHORT_TAB} - Empty/unset variables in .env files will be ignored

Due to the current limitations of GitHub's REST API, the following renovations are not able to be automated and should be configured manually:

* Include "Releases" and remove "Packages" and "Deployments" sidebar sections
* Enable sponsorships
* Enable repository preservation (arctic code vault)
* Enable discussions
- Enable "private vulnerability reporting"
- Enable "dependency graph"
- Enable "dependabot" (i.e. "dependabot alerts" and "dependabot security updates")

By default, this command will preserve the origin repository's pre-existing configuration. Run this command with --force to overwrite any pre-existing configuration EXCEPT the origin repository's description and homepage, which can never be overwritten by this renovation.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      const {
        force,
        parallel,
        [$executionContext]: { projectMetadata }
      } = argv;

      hardAssert(projectMetadata, ErrorMessage.GuruMeditation());

      const {
        cwdPackage: { json },
        subRootPackages
      } = projectMetadata;

      const {
        description = '(package.json::description is missing)',
        keywords = [],
        name: packageName,
        homepage
      } = json;

      const github = await makeOctokit({ debug, log });
      const ownerAndRepo = parsePackageJsonRepositoryIntoOwnerAndRepo(json);

      const { data: incomingRepoData } = await github.repos.get({ ...ownerAndRepo });

      const outgoingRepoData: NonNullable<
        RestEndpointMethodTypes['repos']['update']['parameters']
      > = {
        ...ownerAndRepo
      };

      if (!incomingRepoData.description) {
        outgoingRepoData.description = `${defaultDescriptionEmoji} ${description}`;
      }

      if (!incomingRepoData.homepage) {
        if (subRootPackages) {
          if (homepage) {
            outgoingRepoData.homepage = `${homepage}/tree/main/packages`;
          }
        } else {
          outgoingRepoData.homepage = `https://npm.im/${packageName}`;
        }
      }

      if (force || !incomingRepoData.security_and_analysis?.secret_scanning?.status) {
        outgoingRepoData.security_and_analysis ||= {};
        outgoingRepoData.security_and_analysis.secret_scanning = {
          status: 'enabled'
        };
      }

      if (
        force ||
        !incomingRepoData.security_and_analysis?.secret_scanning_push_protection?.status
      ) {
        outgoingRepoData.security_and_analysis ||= {};
        outgoingRepoData.security_and_analysis.secret_scanning_push_protection = {
          status: 'enabled'
        };
      }

      if (force) {
        outgoingRepoData.has_issues = true;
        outgoingRepoData.has_projects = true;
        outgoingRepoData.allow_squash_merge = true;
        outgoingRepoData.allow_merge_commit = false;
        outgoingRepoData.allow_rebase_merge = true;
        outgoingRepoData.allow_auto_merge = true;
        outgoingRepoData.delete_branch_on_merge = false;
        outgoingRepoData.allow_update_branch = true;
      }

      const subtaskPromiseFunctions: (() => Promise<void>)[] = [
        async function () {
          debug('outgoingRepoData: %O', outgoingRepoData);

          if (Object.keys(outgoingRepoData).length > 2) {
            await github.repos.update({
              ...outgoingRepoData
            });
          }

          logMetadataReplacement('description', 'package.json::description');
          logMetadataReplacement('homepage', 'value derived from package.json::name');
          logMetadataReplacement(
            'security_and_analysis.secret_scanning.status',
            'hardcoded value'
          );
          logMetadataReplacement(
            'security_and_analysis.secret_scanning_push_protection.status',
            'hardcoded value'
          );
          logMetadataReplacement('has_issues', 'hardcoded value');
          logMetadataReplacement('has_projects', 'hardcoded value');
          logMetadataReplacement('allow_squash_merge', 'hardcoded value');
          logMetadataReplacement('allow_merge_commit', 'hardcoded value');
          logMetadataReplacement('allow_rebase_merge', 'hardcoded value');
          logMetadataReplacement('allow_auto_merge', 'hardcoded value');
          logMetadataReplacement('delete_branch_on_merge', 'hardcoded value');
          logMetadataReplacement('allow_update_branch', 'hardcoded value');
        },
        async function () {
          const updatedValues = keywords.map((word) => word.toLocaleLowerCase());
          const shouldReplace =
            !!keywords.length && (force || !incomingRepoData.topics?.length);

          debug('updatedValues: %O', updatedValues);
          debug('shouldReplace: %O', shouldReplace);

          if (shouldReplace) {
            await github.repos.replaceAllTopics({
              ...ownerAndRepo,
              names: updatedValues
            });
          }

          logReplacement({
            wasReplaced: shouldReplace,
            replacedDescription: 'Replaced topics with package.json::keywords',
            skippedDescription: 'replacing topics',
            previousValue: JSON.stringify(incomingRepoData.topics),
            updatedValue: JSON.stringify(updatedValues)
          });
        },
        async function () {
          await github.activity.starRepoForAuthenticatedUser({ ...ownerAndRepo });

          logReplacement({
            replacedDescription:
              'This repository was starred by the authenticated user 🌟'
          });
        },
        async function () {
          await github.activity.setRepoSubscription({
            ...ownerAndRepo,
            subscribed: true
          });

          logReplacement({
            replacedDescription:
              "Updated authenticated user's subscriptions: all repository activity is now watched 👀"
          });
        },
        async function () {
          const [
            currentRulesets,
            masterProtectionRules,
            mainProtectionRules,
            canaryProtectionRules
          ] = await Promise.all([
            github.paginate(github.repos.getRepoRulesets, {
              ...ownerAndRepo
            }),
            github.repos
              .getBranchProtection({
                ...ownerAndRepo,
                branch: 'master'
              })
              .catch(rethrowErrorIfNotStatus404),
            github.repos
              .getBranchProtection({
                ...ownerAndRepo,
                branch: 'main'
              })
              .catch(rethrowErrorIfNotStatus404),
            github.repos
              .getBranchProtection({
                ...ownerAndRepo,
                branch: 'canary'
              })
              .catch(rethrowErrorIfNotStatus404)
          ]);

          debug('currentRulesets: %O', currentRulesets);
          debug('masterProtectionRules: %O', masterProtectionRules);
          debug('mainProtectionRules: %O', mainProtectionRules);
          debug('canaryProtectionRules: %O', canaryProtectionRules);

          let existingStandardRuleset = undefined as ExistingRuleset | undefined;
          let existingCanaryRuleset = undefined as ExistingRuleset | undefined;

          for (const ruleset of currentRulesets) {
            if (ruleset.name === standardProtectRuleset.name) {
              existingStandardRuleset = ruleset;
            } else if (ruleset.name === canaryProtectRuleset.name) {
              existingCanaryRuleset = ruleset;
            } else {
              log.warn(
                [LogTag.IF_NOT_QUIETED],
                ErrorMessage.RenovationRepositoryExtraneousRuleset(ruleset.name)
              );
            }
          }

          debug('existingStandardRuleset: %O', existingStandardRuleset);
          debug('existingCanaryRuleset: %O', existingCanaryRuleset);

          if (masterProtectionRules) {
            log.warn(
              ErrorMessage.RenovationEncounteredObsoleteProtectionRules('master')
            );
          }

          if (mainProtectionRules) {
            log.warn(ErrorMessage.RenovationEncounteredObsoleteProtectionRules('main'));
          }

          if (canaryProtectionRules) {
            log.warn(
              ErrorMessage.RenovationEncounteredObsoleteProtectionRules('canary')
            );
          }

          await Promise.all([
            createOrUpdateRuleset(existingStandardRuleset, standardProtectRuleset),
            createOrUpdateRuleset(existingCanaryRuleset, canaryProtectRuleset)
          ]);

          logReplacement({
            replacedDescription: 'Configured branch protection rulesets',
            previousValue: `${
              existingStandardRuleset ? existingStandardRuleset.enforcement : 'missing'
            } standard-protect, ${
              existingCanaryRuleset ? existingCanaryRuleset.enforcement : 'missing'
            } canary-protect`,
            updatedValue: 'active standard-protect, active canary-protect'
          });
        },
        async function () {
          const [
            {
              data: { secrets: existingSecrets }
            },
            {
              data: { key_id: publicKeyId, key: publicKeyBase64 }
            }
          ] = await Promise.all([
            github.actions.listRepoSecrets({ ...ownerAndRepo }),
            github.actions.getRepoPublicKey({ ...ownerAndRepo })
          ]);

          debug('existingSecrets: %O', existingSecrets);
          debug('publicKeyId: %O', publicKeyId);
          debug('publicKeyBase64: %O', publicKeyBase64);

          if (force) {
            await Promise.all(
              existingSecrets.map(({ name: secret_name }) =>
                github.actions.deleteRepoSecret({ ...ownerAndRepo, secret_name })
              )
            );

            log.message(
              'Because this command was invoked with --force, all origin repository actions secrets were just cleared'
            );
          }

          debug('waiting for libsodium to get ready');

          // ? Wait for libsodium to be ready (probably gathering random)
          await libsodium.ready;

          debug.message('libsodium is ready!');

          const publicKeyUint8Array = libsodium.from_base64(
            publicKeyBase64,
            libsodium.base64_variants.ORIGINAL
          );

          const updatedSecrets: Merge<
            RestEndpointMethodTypes['actions']['createOrUpdateRepoSecret']['parameters'],
            { owner?: undefined; repo?: undefined; key_id?: undefined }
          >[] = Object.entries(
            loadDotEnv({
              dotEnvFilePaths: getRelevantDotEnvFilePaths(
                projectMetadata,
                'project-only'
              ),
              updateProcessEnv: false
            })
          )
            .filter(function ([variable, value]) {
              const eligible = value && !['GITHUB_TOKEN', 'GH_TOKEN'].includes(variable);

              if (eligible) {
                if (force) {
                  return true;
                }

                const isSecretAlreadyUploaded = existingSecrets.some(
                  ({ name }) => name === variable
                );

                if (!isSecretAlreadyUploaded) {
                  return true;
                }

                log([LogTag.IF_NOT_HUSHED], 'EXISTING secret: %O', variable);
                return false;
              }

              log([LogTag.IF_NOT_HUSHED], 'IGNORING secret: %O', variable);
              return false;
            })
            .map(([variable, value]) => ({
              secret_name: variable,
              encrypted_value: libsodium.to_base64(
                libsodium.crypto_box_seal(
                  libsodium.from_string(value),
                  publicKeyUint8Array
                ),
                libsodium.base64_variants.ORIGINAL
              )
            }));

          debug('updatedSecrets: %O', updatedSecrets);

          await Promise.all(
            updatedSecrets.map(function (secret) {
              log([LogTag.IF_NOT_HUSHED], 'UPLOADING secret: %O', secret.secret_name);

              return github.actions.createOrUpdateRepoSecret({
                ...ownerAndRepo,
                ...secret,
                key_id: publicKeyId
              });
            })
          );

          logReplacement({
            replacedDescription: `${force ? 'Deleted existing secrets and uploaded all' : 'Uploaded any missing'} secrets sourced from .env files`,
            previousValue: `${existingSecrets.length} existing secrets${
              force ? ' (cleared)' : ''
            }`,
            updatedValue: `${updatedSecrets.length} missing secrets uploaded`
          });
        }
      ];

      // TODO: include this algo/case in the eventual task runner implementation

      try {
        if (parallel) {
          const results = await Promise.allSettled(
            subtaskPromiseFunctions.map((fn) => fn())
          );

          const { reason: firstError } =
            results.find((result) => result.status !== 'fulfilled') || {};

          if (firstError) {
            throw firstError;
          }
        } else {
          let firstError = undefined;

          for (const subtaskPromiseFunction of subtaskPromiseFunctions) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await subtaskPromiseFunction();
            } catch (error) {
              firstError ||= error;
            }
          }

          if (firstError) {
            throw firstError as Error;
          }
        }
      } catch (error) {
        // ? Disable further output from Octokit
        allowOctokitOutput = false;
        throw error;
      }

      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;

      function logMetadataReplacement(
        propertyPath:
          | keyof typeof incomingRepoData
          | `${keyof typeof incomingRepoData}.${string}`,
        description: string
      ) {
        const previousValue = getInObject(incomingRepoData, propertyPath);
        const updatedValue = getInObject(outgoingRepoData, propertyPath);

        logReplacement({
          wasReplaced: updatedValue !== undefined,
          replacedDescription: `Replaced ${propertyPath} with ${description}`,
          skippedDescription: `replacing ${propertyPath}`,
          previousValue: previousValue,
          updatedValue: updatedValue
        });
      }

      function logReplacement(
        input:
          | {
              wasReplaced?: undefined;
              replacedDescription: string;
              skippedDescription?: undefined;
              previousValue?: unknown;
              updatedValue?: unknown;
            }
          | {
              wasReplaced: boolean;
              replacedDescription: string;
              skippedDescription: string;
              previousValue?: unknown;
              updatedValue?: unknown;
            }
      ) {
        const {
          wasReplaced = true,
          replacedDescription,
          skippedDescription = ''
        } = input;

        if (wasReplaced) {
          log([LogTag.IF_NOT_QUIETED], `✅ ${replacedDescription}`);

          if ('previousValue' in input) {
            log(
              [LogTag.IF_NOT_HUSHED],
              `Original value:  ${String(input.previousValue)}`
            );
          }

          if ('updatedValue' in input) {
            log(
              [LogTag.IF_NOT_HUSHED],
              `Committed value: ${String(input.updatedValue)}`
            );
          }
        } else {
          log([LogTag.IF_NOT_QUIETED], `✖️ Skipped ${skippedDescription}`);
        }
      }

      async function createOrUpdateRuleset(
        targetRuleset: ExistingRuleset | undefined,
        replacementRuleset: NewRuleset
      ) {
        const rulesetName = replacementRuleset.name;

        if (targetRuleset && !force) {
          if (targetRuleset.enforcement !== 'active') {
            await github.repos.updateRepoRuleset({
              ...ownerAndRepo,
              ruleset_id: targetRuleset.id,
              enforcement: 'active'
            });

            log([LogTag.IF_NOT_HUSHED], `Existing ${rulesetName} ruleset was activated`);
          } else {
            log(
              [LogTag.IF_NOT_HUSHED],
              `Existing ${rulesetName} ruleset already activated`
            );
          }
        } else {
          const shouldOverwrite = targetRuleset && force;

          if (shouldOverwrite) {
            await github.repos.deleteRepoRuleset({
              ...ownerAndRepo,
              ruleset_id: targetRuleset.id
            });
          }

          await github.repos.createRepoRuleset({
            ...ownerAndRepo,
            ...replacementRuleset
          });

          if (shouldOverwrite) {
            log.message(
              [LogTag.IF_NOT_HUSHED],
              `Existing ${rulesetName} ruleset was overwritten!`
            );
          } else {
            log([LogTag.IF_NOT_HUSHED], `new ${rulesetName} ruleset created`);
          }
        }
      }
    }
  },
  'github-rename-repo': {
    emoji: '🧬',
    taskAliases: [],
    actionDescription:
      'Updating origin repository name and synchronizing local configuration',
    shortHelpDescription:
      'Rename the origin repository and update git remotes accordingly',
    longHelpDescription: `This renovation will rename the origin repository, rename (move) the repository directory on the local filesystem, and update the remotes in .git/config accordingly.\n\nIf the origin repository cannot be renamed, the rename attempt will be aborted and no local changes will occur.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'new-name': {
        string: true,
        description: "The repository's new name",
        subOptionOf: {
          'github-rename-repo': {
            when: (superOptionValue) => superOptionValue,
            update(oldOptionConfig) {
              return { ...oldOptionConfig, demandThisOption: true };
            }
          }
        }
      }
    },
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO:
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'github-pause-rulesets': {
    emoji: '🛸',
    taskAliases: [],
    actionDescription: `Pausing ruleset protections for ${RULESET_PROTECTION_PAUSE_MINUTES} minutes`,
    shortHelpDescription: `Temporarily deactivate origin repository ruleset protections`,
    longHelpDescription: `This renovation will temporarily deactivate all rulesets in the repository for ${RULESET_PROTECTION_PAUSE_MINUTES} minutes, after which this command will reactivate them.\n\nUpon executing this renovation, you will be presented with a countdown until protections will be reactivated. You may press any key to immediately reactivate protections and exit the program.\n\nIf this renovation does not exit cleanly, re-running it (or --github-reconfigure-repo) will reactivate any erroneously disabled rulesets.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO: countdown, press any key to unpause immediately
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'github-delete-all-releases': {
    emoji: '☢️',
    taskAliases: [],
    actionDescription: 'Permanently deleting all origin repository releases',
    shortHelpDescription: 'Delete all releases associated with the origin repository',
    longHelpDescription: `This renovation will delete from the origin repository all releases associated with the current package (if \`--scope=${ProjectRenovateScope.ThisPackage}\`) or every possible release in existence (if \`--scope=${ProjectRenovateScope.Unlimited}\`).\n\n⚠️🚧 This is an INCREDIBLY DANGEROUS command that should ONLY be used to clear out unrelated releases after forking a repository.`,
    requiresForce: true,
    supportedScopes: projectRenovateScopes,
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'github-clone-remote-wiki': {
    emoji: '📡',
    taskAliases: [],
    actionDescription: 'Cloning origin repository wiki into project root',
    shortHelpDescription:
      "Clone the origin repository's wiki into a (gitignored) directory",
    longHelpDescription: `This renovation will enable the wiki for the origin repository (if it is not enabled already) and then clone that wiki into the (gitignored) .wiki/ directory at the project root.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO: do not proceed if the .wiki dir already exists unless --force
      // TODO: create wiki via GitHub api if it does not already exist
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'github-kill-master': {
    emoji: '🚷',
    taskAliases: [],
    actionDescription: 'Renaming default branch to "main" and finishing off "master"',
    shortHelpDescription:
      'Rename and remove all references to any legacy "master" branch(es)',
    longHelpDescription: `This renovation will kill any and all references to any "master" ref throughout the repository. This includes renaming the "master" branch to "main," deleting the "master" branch on the origin repository, and setting the default branch to "main" both locally and remotely if it is not the case already.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO: default branch => main
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'generate-scoped-tags': {
    emoji: '⚓',
    taskAliases: [],
    actionDescription: 'Generating scoped aliases for each non-scoped version tag',
    shortHelpDescription:
      'Generate a scoped version tag for each non-scoped version tag',
    longHelpDescription: `This renovation creates an alias of each old-style version tag in the repository going all the way back to the initial commit.\n\nNote that this renovation will respect the "[INIT]" xpipeline command when it appears in commit messages. See the xscripts wiki and xchangelog/xrelease documentation for details on xpipeline command semantics.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;

      // TODO: only since [INIT] (if found)
      void argv;
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  deprecate: {
    emoji: '🪦',
    taskAliases: [],
    actionDescription: 'Deprecating package',
    shortHelpDescription:
      'Deprecate the current package and possibly the entire repository',
    longHelpDescription: `This renovation will execute the standard deprecation procedure on the current package. See the xscripts wiki for details on the standard deprecation procedure.

    Regardless of --scope, if this renovation is used on a polyrepo, the entire repository will also be deprecated; if this renovation is used on a monorepo, it will apply only to the current package unless deprecating the current package would result in all packages in the monorepo having been deprecated, in which case the entire repository will also be deprecated.`,
    requiresForce: true,
    supportedScopes: [ProjectRenovateScope.ThisPackage],
    subOptions: {},
    conflicts: { undeprecate: true },
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;

      checkRuntimeIsReadyForGithub(argv, log);
      checkRuntimeIsReadyForNpm(argv, log);

      // TODO:
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  undeprecate: {
    emoji: '🧟',
    taskAliases: [],
    actionDescription: 'Un-deprecating package',
    shortHelpDescription: 'Un-deprecate the current package and repository',
    longHelpDescription: `This renovation will make a best effort at undoing the standard deprecation procedure on the current package and its containing repository, effectively "un-deprecating" them both. See the xscripts wiki for details on the standard deprecation procedure and what the ramifications of an "un-deprecation" are.`,
    requiresForce: true,
    supportedScopes: [ProjectRenovateScope.ThisPackage],
    subOptions: {},
    conflicts: { deprecate: true },
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;

      checkRuntimeIsReadyForGithub(argv, log);
      checkRuntimeIsReadyForNpm(argv, log);

      // TODO:
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'regenerate-assets': {
    emoji: '♻️',
    taskAliases: [],
    actionDescription: 'Regenerating targeted configuration and template assets',
    shortHelpDescription: 'Regenerate targeted configuration and template asset files',
    longHelpDescription: `
This renovation will regenerate one or more files in the project, each represented by an "asset". An asset is a collection mapping one or more project-root-relative "asset paths" (relative to the project root) to their generated contents. When writing content to its respective asset path on the filesystem, existing files are overwritten, missing files are created, and obsolete files are deleted.

Provide --assets-preset to specify which assets to regenerate. The parameter accepts one of the following presets: ${renovationPresets.join(', ')}. The asset paths of assets included in the preset will be targeted for renovation unless that path is also matched by --skip-asset-paths.

Use --skip-asset-paths to further narrow which files are regenerated. The parameter accepts regular expressions that are matched against the asset paths to be written out. Any asset paths matching one of the aforesaid regular expressions will be discarded instead of written out.

When regenerating files containing import aliases, --with-aliases-loaded-from can be used to include aliases in addition to the hardcoded aliases that come with xscripts. The --with-aliases-loaded-from parameter expects a path to a JavaScript file with an alias map (i.e. RawAliasMapping[]) as its default export.

After invoking this renovation, you should use your IDE's diff tools to compare and contrast the latest best practices with the project's current configuration setup.

This renovation should be re-run each time a package is added to, or removed from, a xscripts-compliant monorepo.

See the xscripts wiki documentation for details on all available assets and their asset paths.
`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'assets-preset': {
        alias: 'preset',
        choices: renovationPresets,
        description: 'Select a hardcoded set of assets to regenerate'
      },
      'skip-asset-paths': {
        alias: 'skip-asset-path',
        array: true,
        string: true,
        description:
          'Asset paths matching these regular expressions are discarded when regenerating',
        default: [],
        coerce(assets: string[]) {
          // ! These regular expressions can never use the global (g) flag
          return assets.map((str) => new RegExp(str, 'u'));
        }
      },
      'with-aliases-loaded-from': {
        string: true,
        description:
          'Additional import aliases are sourced from this file when regenerating'
      }
    },
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;
      const {
        [$executionContext]: { projectMetadata }
      } = argv;

      const preset = argv.assetsPreset as RenovationPreset | undefined;
      const skipAssetPaths = argv.skipAssetPaths as RegExp[];
      const additionalAliasesJsPath = argv.withAliasesLoadedFrom as string | undefined;

      hardAssert(projectMetadata, ErrorMessage.GuruMeditation());

      const context: IncomingTransformerContext = {
        targetAssetsPreset: preset,
        badges: '',
        packageName: '',
        packageVersion: '',
        packageDescription: '',
        packageBuildDetailsShort: '',
        packageBuildDetailsLong: '',
        projectMetadata,
        titleName: '',
        repoName: '',
        repoType: projectMetadata.type,
        repoUrl: '',
        repoSnykUrl: '',
        repoReferenceDocs: '',
        repoReferenceLicense: '',
        repoReferenceNewIssue: '',
        repoReferencePrCompare: '',
        repoReferenceSelf: '',
        repoReferenceSponsor: '',
        repoReferenceContributing: '',
        repoReferenceSupport: '',
        repoReferenceAllContributors: '',
        repoReferenceAllContributorsEmojis: '',
        repoReferenceDefinitionsBadge: '',
        repoReferenceDefinitionsPackage: '',
        repoReferenceDefinitionsRepo: '',
        shouldDeriveAliases: true,
        log,
        debug
      };

      debug('transformer context: %O', context);

      const reifiedAssetPaths = await retrieveAllRelevantConfigAssets({ context });
      debug('relevant asset paths: %O', Object.keys(reifiedAssetPaths));

      // TODO: Replace missing context items with "<!-- TODO -->" if they are
      // TODO: not resolvable (and note it in debug messaging)

      // TODO: move replacement region paragraphs at end of generic help text
      // TODO: into regenerate's help text instead

      // TODO: implement skipAssetPaths and additionalAliasesJsPath

      // TODO: support $delete symbol

      // TODO: (assets) fix asset files (need to return string fn) and fix tests

      // TODO: (assets) existing overwrites; missing created; obsolete is
      // TODO: deleted if contents === $delete symbol

      // TODO: (assets) replacer region count must match in document or entire
      // TODO: document will be overwritten

      // TODO: (assets) regenerate package.json carefully; reuse existing

      // TODO: (assets) return asset paths conditioned on context (like minimal)

      // TODO: (assets) README.md no license blurb if no license

      // TODO: (assets)  .env.default also makes a dummy .env file with only
      // TODO: the VAR= lines

      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'update-dependencies': {
    emoji: '⚕️',
    taskAliases: [],
    actionDescription: 'Launching interactive dependency check for latest versions',
    shortHelpDescription: 'Interactively update dependencies in package.json',
    longHelpDescription:
      'This renovation allows the user to interactively select and update dependencies in package.json files belong to packages across the entire project (depending on --scope). Each updated dependency will generate either a chore-type commit (for package.json::devDependency updates) or a build-type commit (for any other kind of dependency in package.json) with a short simple commit message tailored to the dependency being updated.',
    requiresForce: false,
    supportedScopes: projectRenovateScopes,
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;

      // TODO:
      void argv;
      log.message([LogTag.IF_NOT_SILENCED], `✖️ This task is currently a no-op (todo)`);
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'synchronize-interdependencies': {
    emoji: '🔗',
    taskAliases: ['sync-deps'],
    actionDescription: 'Synchronizing package interdependencies',
    shortHelpDescription:
      'Update package.json dependencies to match their monorepo versions',
    longHelpDescription:
      "This renovation will analyze dependencies in one or more package.json files (depending on --scope), select dependencies in those files that match a package name in this project, and update those dependencies' ranges to match their respective package versions as they are in the project. This is useful in monorepos with published packages that rely on other published packages in the same repo. This renovation ensures a package released from this project will always install the latest version of the other packages released from this project.\n\nIf this repository is a polyrepo, this renovation is essentially a no-op.",
    requiresForce: false,
    supportedScopes: projectRenovateScopes,
    subOptions: {},
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;
      const { scope, [$executionContext]: globalExecutionContext } = argv;
      const { projectMetadata } = globalExecutionContext;

      hardAssert(projectMetadata, ErrorMessage.GuruMeditation());

      const { cwdPackage, rootPackage, subRootPackages } = projectMetadata;
      const allPackages = [rootPackage, ...(subRootPackages?.values() || [])];
      const allPackageNames = allPackages.map(({ json: { name } }) => name);

      debug('allPackageNames: %O', allPackageNames);

      if (subRootPackages) {
        if (scope === DefaultGlobalScope.ThisPackage) {
          log(
            [LogTag.IF_NOT_HUSHED],
            'Synchronizing dependencies in %O',
            cwdPackage.json.name
          );

          await synchronizePackageInterdependencies(cwdPackage);
        } else {
          log(
            [LogTag.IF_NOT_HUSHED],
            'Synchronizing dependencies across the entire project'
          );

          await Promise.all(
            allPackages.map((package_) => synchronizePackageInterdependencies(package_))
          );
        }
      } else {
        log.message([LogTag.IF_NOT_HUSHED], 'This renovation is a no-op in polyrepos');
      }

      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;

      async function synchronizePackageInterdependencies({
        root: ourPackageRoot,
        json: ourPackageJson
      }: Package) {
        const { name: ourPackageName, dependencies: ourDependencies } = ourPackageJson;
        const ourPackageJsonPath = toPath(ourPackageRoot, packageJsonConfigPackageBase);

        const interdependencies = Object.entries(
          (ourDependencies || {}) as Record<string, string>
        ).filter(([depName]) => allPackageNames.includes(depName));

        let didUpdatePackageJson = false;

        for (const [
          theirPackageName,
          ourDependenciesSemverOfTheirPackage
        ] of interdependencies) {
          const theirPackageNameIsRootPackage =
            theirPackageName === rootPackage.json.name;

          const theirPackage_ = theirPackageNameIsRootPackage
            ? rootPackage
            : subRootPackages?.get(theirPackageName);

          hardAssert(theirPackage_, ErrorMessage.GuruMeditation());

          const { version: theirPackageLatestVersion } = theirPackage_.json;

          if (theirPackageLatestVersion) {
            const theirPackageLatestSemver = `^${theirPackageLatestVersion}`;

            if (ourDependenciesSemverOfTheirPackage !== theirPackageLatestSemver) {
              ourDependencies![theirPackageName] = theirPackageLatestSemver;
              didUpdatePackageJson = true;

              log(
                [LogTag.IF_NOT_QUIETED],
                `⛓️ Dependency synchronized:\n${SHORT_TAB}%O\n${SHORT_TAB}%O ==> %O`,
                theirPackageName,
                ourDependenciesSemverOfTheirPackage,
                theirPackageLatestSemver
              );
            } else {
              log(
                [LogTag.IF_NOT_QUIETED],
                `✔️ Dependency already synchronized:\n${SHORT_TAB}%O`,
                theirPackageName
              );
            }
          } else {
            log.warn(
              [LogTag.IF_NOT_QUIETED],
              `Dependency %O is missing "version" field in:\n${SHORT_TAB}%O`,
              theirPackageName,
              toPath(theirPackage_.root, packageJsonConfigPackageBase)
            );
          }
        }

        if (didUpdatePackageJson) {
          await writeFile(ourPackageJsonPath, JSON.stringify(ourPackageJson));

          debug(`formatting ${ourPackageJsonPath} (calling out to sub-command)`);

          const formatHandler = await getInvocableExtendedHandler<
            FormatCliArguments,
            GlobalExecutionContext
          >(format, globalExecutionContext);

          await formatHandler({
            ...argv,
            $0: 'format',
            _: [],
            scope: DefaultGlobalScope.Unlimited,
            files: [ourPackageJsonPath],
            silent: true,
            quiet: true,
            hush: true,
            renumberReferences: false,
            skipIgnored: false,
            skipUnknown: false,
            onlyPackageJson: false,
            onlyMarkdown: false,
            onlyPrettier: false
          });

          debug('sub-command completed successfully');

          log(
            [LogTag.IF_NOT_HUSHED],
            `Wrote out updated dependencies to:\n${SHORT_TAB}%O`,
            ourPackageJsonPath
          );
        }

        log(
          [LogTag.IF_NOT_QUIETED],
          `%O: %O dep${interdependencies.length === 1 ? '' : 's'} synced`,
          ourPackageName,
          interdependencies.length
        );
      }
    }
  }
} as const satisfies Record<string, Omit<RenovationTask, 'taskName'>>;

function rethrowErrorIfNotStatus404(errorResponse: unknown) {
  if ((errorResponse as undefined | (Error & { status: number }))?.status !== 404) {
    throw errorResponse;
  }

  return undefined;
}
