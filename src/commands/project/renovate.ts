import { rm } from 'node:fs/promises';

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
import { type RawAliasMapping } from 'multiverse+project-utils:alias.ts';
import { type Package } from 'multiverse+project-utils:analyze.ts';

import {
  packageJsonConfigPackageBase,
  toAbsolutePath,
  toPath,
  toRelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  SHORT_TAB,
  SINGLE_SPACE,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse+rejoinder';

import { version as packageVersion } from 'rootverse:package.json';

import { parsePackageJsonRepositoryIntoOwnerAndRepo } from 'universe:assets/transformers/_package.json.ts';

import {
  $delete,
  assetPresets,
  gatherAssetsFromAllTransformers,
  type AssetPreset,
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
  importAdditionalRawAliasMappings,
  loadDotEnv,
  magicStringReplacerRegionEnd,
  magicStringReplacerRegionStart,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage,
  writeFile
} from 'universe:util.ts';

import type { RestEndpointMethodTypes } from '@octokit/rest' with { 'resolution-mode': 'import' };
import type { CamelCasedProperties, KeysOfUnion, Merge } from 'type-fest';
import type { ProjectMetadata } from 'multiverse+project-utils';

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

/**
 * @internal
 */
export type RenovationTaskArgv = BfeStrictArguments<
  CustomCliArguments,
  GlobalExecutionContext
>;

/**
 * @internal
 */
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
   * If `true`, --force must be given on the command line alongside this task.
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
 * A function that receives the current {@link ProjectMetadata} and must return
 * an array of {@link RawAliasMapping}s.
 *
 * `aliases.config.mjs` can export via default either `RawAliasMapperFunction`
 * or an array of {@link RawAliasMapping}s.
 */
export type RawAliasMapperFunction = (
  projectMetadata: ProjectMetadata,
  outputFunctions: { log: ExtendedLogger; debug: ExtendedDebugger }
) => RawAliasMapping[];

/**
 * Represents the result of importing an `aliases.config.mjs` file.
 * `aliases.config.mjs` can export via default either
 * {@link RawAliasMapperFunction} or an array of {@link RawAliasMapping}s.
 */
export type ImportedAliasMap = RawAliasMapping[] | RawAliasMapperFunction;

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

This command must be invoked with at least one task flag. Tasks are run concurrently unless --no-parallel is given, and are all run to completion even if one of the tasks fails unless --run-to-completion=false is given.

Environment variables are loaded into process.env from the following file(s), if they exist and depending on scope, with the variables in latter files overwriting those in the former:

${SHORT_TAB}- ${getRelevantDotEnvFilePaths(projectMetadata_).join(`\n${SHORT_TAB}- `)}

When --scope=${ProjectRenovateScope.Unlimited}, package-specific .env and .env.default files are ignored.

Renovations are performed on the entire project by default, and typically involve overwriting/deleting obsolete versions of certain configuration files, but several renovation tasks can be limited to the current package via --scope=${ProjectRenovateScope.ThisPackage}.

If this command is invoked in a repository with an unclean working directory, it will fail unless --force is given. Similarly, tasks with potentially destructive or permanent consequences must be manually authorized via --force. That said, all renovation tasks are idempotent: running the same renovations back-to-back on an otherwise-unchanged project/package is essentially a no-op.

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

        // TODO: This task runner logic appears in at least four places in this
        // TODO: code base alone. We need to make this into a package :)

        const errors: unknown[] = [];

        if (parallel) {
          const promises = taskPromiseFunctions.map((p) => p());

          if (runToCompletion) {
            debug.message(
              'renovation tasks will run to completion even if an error occurs'
            );

            errors.push(
              ...(await Promise.allSettled(promises))
                .map((result) =>
                  result.status === 'rejected' ? result.reason : undefined
                )
                .filter((r) => !!r)
            );
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
          for (const taskPromiseFunction of taskPromiseFunctions) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await taskPromiseFunction();
            } catch (error) {
              if (runToCompletion) {
                errors.push(error);
              } else {
                throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed(), {
                  cause: error
                });
              }
            }
          }
        }

        if (errors.length) {
          genericLogger.newline([LogTag.IF_NOT_SILENCED], 'alternate');

          for (const error of errors) {
            log.error(
              [LogTag.IF_NOT_SILENCED],
              'Renovation task execution error:\n%O',
              error
            );
          }

          throw new CliError(ErrorMessage.RenovationRunnerExecutionFailed());
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
      info: ghLog,
      warn: ghLog.message,
      error: ghLog.warn
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

// TODO: When we settle on a unified task-runner API, these should be placed
// TODO: into their own files. Maybe they should be so placed before then...
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
    longHelpDescription: `This renovation will delete from the origin repository all releases associated with the current package (if --scope=${ProjectRenovateScope.ThisPackage}) or every possible release in existence (if --scope=${ProjectRenovateScope.Unlimited}).\n\n⚠️🚧 This is an INCREDIBLY DANGEROUS command that should ONLY be used to clear out unrelated releases after forking a repository.`,
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
      'Rename and remove all references to any legacy "master" ref(s)',
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
This renovation will regenerate one or more files in the project, each represented by an "asset". An asset is a collection mapping output paths to generated content. When writing out content to an output path, existing files are overwritten, missing files are created, and obsolete files are deleted.

Provide --assets-preset (required) to specify which assets to regenerate. The parameter accepts one of the following presets: ${assetPresets.join(', ')}. The paths of assets included in the preset will be targeted for renovation except those paths matched by --skip-asset-paths.

Use --skip-asset-paths to further narrow which files are regenerated. The parameter accepts regular expressions that are matched against the paths to be written out. Any paths matching one of the aforesaid regular expressions will have their contents discarded instead of written out.

This renovation attempts to import the "import-aliases.mjs" file if it exists at the root of the project. Use this file to provide additional \`RawAliasMapping[]\`s to include when regenerating files defining the project's import aliases. See the xscripts wiki documentation for further details.

When renovating Markdown files with templates divided into replacer regions via the magic comments "${magicStringReplacerRegionStart}" and "${magicStringReplacerRegionEnd}", this command will perform so-called "regional replacements" where only the content between the "start" and "end" comments will be modified. Regions without matching ids are ignored.

When regional replacements are performed, matching non-numeric reference definitions will be overwritten respectively, and new definitions will be appended. However, when attempting to renovate a Markdown file and either (1) it does not have replacer regions when its corresponding template contains replacer regions or (2) --force is used, the entire file will be overwritten instead.

Note that only certain Markdown files support regional replacements. See the xscripts wiki documentation for more details.

After invoking this renovation, you should use your IDE's diff tools to compare and contrast the latest best practices with the project's current configuration setup.

This renovation should be re-run each time a package is added to, or removed from, a xscripts-compliant monorepo but should NEVER be run in a CI environment or anywhere logs can be viewed publicly.

See the xscripts wiki documentation for more details on this command and all available assets.
`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'assets-preset': {
        alias: 'preset',
        choices: assetPresets,
        description: 'Select a set of assets to target for regeneration',
        subOptionOf: {
          'regenerate-assets': {
            when: (superOptionValue) => superOptionValue,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          }
        }
      },
      'skip-asset-paths': {
        alias: 'skip-asset-path',
        array: true,
        string: true,
        description: 'skip regenerating assets matching a regular expression',
        default: []
      }
    },
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;
      const {
        force,
        [$executionContext]: { projectMetadata }
      } = argv;

      const preset = argv.assetsPreset as AssetPreset;
      const skipAssetPaths = argv.skipAssetPaths as RegExp[];

      hardAssert(projectMetadata, ErrorMessage.GuruMeditation());

      const {
        cwdPackage: { root: packageRoot },
        rootPackage: { root: projectRoot, json: projectJson }
      } = projectMetadata;

      const { owner: repoOwner, repo: repoName } =
        parsePackageJsonRepositoryIntoOwnerAndRepo(projectJson);

      const transformerContext: IncomingTransformerContext = {
        log,
        debug,

        toPackageAbsolutePath: (...pathsLike) =>
          toAbsolutePath(packageRoot, ...pathsLike),
        toProjectAbsolutePath: (...pathsLike) =>
          toAbsolutePath(projectRoot, ...pathsLike),

        forceOverwritePotentiallyDestructive: force,
        shouldDeriveAliases: true,
        scope: DefaultGlobalScope.Unlimited,
        assetPreset: preset,
        projectMetadata,
        additionalRawAliasMappings: await importAdditionalRawAliasMappings(
          projectMetadata,
          { log, debug }
        ),

        repoOwner,
        repoName,
        year: new Date().getFullYear().toString()
      };

      debug('preset: %O', preset);
      debug('skipAssetPaths: %O', skipAssetPaths);
      debug('transformer context: %O', transformerContext);

      const reifiedAssetPathEntries = Object.entries(
        await gatherAssetsFromAllTransformers({
          transformerContext
        })
      );

      const results = await Promise.allSettled(
        reifiedAssetPathEntries.map(async function ([
          outputPathString,
          generateContent
        ]) {
          const outputPath = toRelativePath(projectRoot, outputPathString);

          if (skipAssetPaths.some((r) => r.test(outputPath))) {
            debug('skipped asset due to --skip-asset-paths exclusion: %O', outputPath);
            log(`🟧 ${outputPath}`);
            return;
          }

          try {
            const content = await generateContent();

            if (content === $delete) {
              debug.message(
                'deleting asset due to presence of $delete symbol: %O',
                outputPath
              );
              await rm(outputPath, { force: true });
              log(`🗑️ ${outputPath}`);
            } else {
              await writeFile(outputPath, content);
              log(`✅ ${outputPath}`);
            }
          } catch (error) {
            debug.error('content generation failure: %O', error);
            log.error(`❗ ${outputPath}`);
            throw new Error('wrapper', { cause: { error, outputPath } });
          }
        })
      );

      const errorCount = results.filter((r) => r.status !== 'fulfilled').length;

      log.message(
        [LogTag.IF_NOT_QUIETED],
        '%O/%O renovations succeeded',
        results.length - errorCount,
        results.length
      );

      if (errorCount > 0) {
        let firstError = new Error(ErrorMessage.GuruMeditation());

        for (const result of results) {
          if (result.status === 'rejected') {
            const { error, outputPath } = result.reason.cause;
            firstError = error;

            hardAssert(error, ErrorMessage.GuruMeditation());

            log.error(
              [LogTag.IF_NOT_SILENCED],
              'Content regeneration failed for %O:\n%O',
              outputPath,
              error
            );
          }
        }

        throw firstError;
      }

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
