import { CliError, type ChildConfiguration } from '@black-flag/core';

import { hardAssert, softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { type XPackageJson } from 'multiverse+project-utils:analyze.ts';

import {
  babelConfigProjectBase,
  dotEnvConfigPackageBase,
  dotEnvConfigProjectBase,
  eslintConfigProjectBase,
  jestConfigProjectBase,
  markdownArchitectureProjectBase,
  markdownReadmePackageBase,
  nextjsConfigProjectBase,
  Tsconfig,
  webpackConfigProjectBase
} from 'multiverse+project-utils:fs.ts';

import {
  SHORT_TAB,
  SINGLE_SPACE,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse+rejoinder';

import { version as packageVersion } from 'rootverse:package.json';

import {
  $executionContext,
  DefaultGlobalScope as ProjectRenovateScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  determineRepoWorkingTreeDirty,
  loadDotEnvAndCheckVariables,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

import type { CamelCasedProperties, KeysOfUnion } from 'type-fest';

import type {
  AsStrictExecutionContext,
  BfeBuilderObject,
  BfeBuilderObjectValue,
  BfeCheckFunction,
  BfeStrictArguments
} from 'multiverse+bfe';

/**
 * The number of minutes the "pause ruleset" renovation will "pause" for
 */
const RULESET_PROTECTION_PAUSE_MINUTES = 5;

/**
 * The names of the configuration assets containing the project's import
 * aliases. The contents of this array are sanity checked against the list of
 * known configuration assets.
 */
const assetsWithAliasDefinitions = [
  Tsconfig.ProjectBase,
  babelConfigProjectBase,
  eslintConfigProjectBase,
  jestConfigProjectBase,
  // TODO: re-evaluate if next and webpack need alias configs or if the above
  // TODO: four are sufficient
  nextjsConfigProjectBase,
  webpackConfigProjectBase
];

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

export type RenovationTask = BfeBuilderObjectValue<
  Record<string, unknown>,
  GlobalExecutionContext
> & {
  /**
   * The name of the task.
   */
  taskName: string;
  /**
   * The alternative names of the task.
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
  subOptions: BfeBuilderObject<Record<string, unknown>, GlobalExecutionContext>;
  /**
   * A function called when the task is triggered.
   */
  run: (argv: unknown, taskContextPartial: RenovationTaskContext) => Promise<void>;
};

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
  const { rootPackage: rootPackage_, cwdPackage: cwdPackage_ } = projectMetadata_ || {};

  const cwdPackageEnvFile =
    cwdPackage_?.root && rootPackage_?.root !== cwdPackage_.root
      ? `${cwdPackage_.root}/${dotEnvConfigPackageBase}`
      : undefined;

  const rootPackageEnvFile = rootPackage_?.root
    ? `${rootPackage_.root}/${dotEnvConfigProjectBase}`
    : undefined;

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

  executionContext.state.dotEnvFilePaths = [rootPackageEnvFile, cwdPackageEnvFile].filter(
    Boolean
  );

  return {
    builder,
    description: 'Bring a project into compliance with latest best practices',
    usage:
      withGlobalUsage(`$1 via the execution of one or more renovation "tasks". A task is executed by specifying its renovation "task flag", e.g. --an-example-task-flag. The following task flags are available:

${printRenovationTasks()}

This command must be invoked with at least one task flag. Tasks are run concurrently unless --no-parallel is given, and are all run to completion even if one of the tasks fails unless \`--run-to-completion=false\` is given.

Environment variables are loaded into process.env from the following file(s), if they exist:

${SHORT_TAB}- ${(executionContext.state.dotEnvFilePaths as string[]).join(
        `\n${SHORT_TAB}- `
      )}

Renovations are performed on the entire project by default, and typically involve overwriting/deleting obsolete versions of certain configuration files, but several renovation tasks can be limited to the current package via \`--scope=${ProjectRenovateScope.ThisPackage}\`.

If this command is invoked in a repository with an unclean working directory, it will fail unless --force is given. Similarly, tasks with potentially destructive or permanent consequences must be manually authorized via --force. That said, all renovation tasks are idempotent: running the same renovations back-to-back on an otherwise-unchanged project/package is essentially a no-op.

When renovating a Markdown file using an asset template that is divided into replacer regions via the magic comments "<!-- xscripts-renovate-region-start -->", "<!-- xscripts-renovate-region-end -->", and potentially "<!-- xscripts-renovate-region-definitions -->"; and if the existing renovation target has corresponding replacer regions defined; this command will perform so-called "regional replacements," where only the content within the renovation regions (i.e. between the "start" and "end" comments) will be modified. Regional replacements can be used to allow ultimate flexibility and customization of Markdown assets while still maintaining a consistent look and feel across xscripts-powered projects. This benefit is most evident in each package's ${markdownReadmePackageBase} file, and each project's ${markdownArchitectureProjectBase} file, among others.

When attempting to renovate a Markdown file without replacer regions when its corresponding asset template does have replacer regions, the entire file will be overwritten like normal.`),
    handler: withGlobalHandler(async function (argv) {
      const { $0: scriptFullName, scope, parallel, force } = argv;

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

      debug('argv: %O', argv);

      const { isDirty } = await determineRepoWorkingTreeDirty();

      softAssert(
        !isDirty || force,
        ErrorMessage.ActionAttemptedWithADirtyRepo('renovation')
      );

      genericLogger.newline([LogTag.IF_NOT_HUSHED]);
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

              dbg('preparing to run task %O: %O', taskName, task);
              taskLogger([LogTag.IF_NOT_HUSHED], `${emoji}${actionDescription}`);

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

        if (parallel) {
          const results = await Promise.allSettled(taskPromiseFunctions.map((p) => p()));

          for (const result of results) {
            if (result.status === 'fulfilled') {
              debug('a task runner promise has been fulfilled');
            } else {
              throw new CliError(ErrorMessage.ReleaseRunnerExecutionFailed(), {
                cause: result.reason
              });
            }
          }
        } else {
          for (const taskPromiseFunction of taskPromiseFunctions) {
            // eslint-disable-next-line no-await-in-loop
            await taskPromiseFunction();
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
              ...subOption,
              requires: { [taskName]: true },
              group: 'Task-dependent Options:'
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
    force,
    [$executionContext]: { state }
  } = argv;

  loadDotEnvAndCheckVariables(['GITHUB_TOKEN'], {
    log,
    state,
    force,
    failInstructions: 'Skip this check with --force',
    onFail() {
      softAssert(ErrorMessage.RenovateEnvironmentValidationFailed());
    }
  });
}

function checkRuntimeIsReadyForNpm(argv: RenovationTaskArgv, log: ExtendedLogger) {
  const {
    force,
    [$executionContext]: { state }
  } = argv;

  loadDotEnvAndCheckVariables(['NPM_TOKEN'], {
    log,
    state,
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

  return new Octokit({
    userAgent: `Xunnamius/xscripts@${packageVersion}`,
    auth: process.env.GITHUB_TOKEN,
    log: {
      debug,
      info: log,
      warn: log.warn,
      error: log.error
    }
  });
}

const githubUrlRegExp = /github.com\/([^/]+)\/([^/]+)(?:\.git)?/;

function parsePackageJsonRepository({ repository, name }: XPackageJson) {
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
    longHelpDescription: `This renovation will apply a standard configuration preset to the remote origin repository. Specifically, this renovation will:

- Update the "repository details"
${SHORT_TAB} - Set description (with default emoji) to package.json::description if not already set
${SHORT_TAB} - Set website to npm.im URL if not already set
${SHORT_TAB} - Set topics to package.json::keywords if not already set
${SHORT_TAB} - Include "Releases" and remove "Packages" and "Deployments" sidebar sections
- Set the user to star the repository
- Set the user to watch "all activity" in the repository
- Enable wikis with editing restricted to collaborators only
- Enable issues
- Enable sponsorships
- Enable repository preservation
- Enable discussions
- Enable projects
- Disable "allow merge commits"
- Enable "allow squash merging"
- Enable "allow rebase merging"
- Enable "always suggest updating pull request branches"
- Enable "allow auto-merge"
- (Re-)create and (re-)enable the "standard-protect" and "canary-protect" rulesets; issue warnings about the existence of any other rulesets
${SHORT_TAB} - "standard-protect" restricts deletions of, requires signed commits for, and blocks force pushes to the repository's main branch and any maintenance branches
${SHORT_TAB} - "canary-protect" restricts deletions of and requires signed commits for the repository's canary branch(es), but does NOT block force pushes to these branches
- Clear out any classic branch protection settings
- Enable "private vulnerability reporting"
- Enable "dependency graph"
- Enable "dependabot" (i.e. "dependabot alerts" and "dependabot security updates")
- Enable "secret scanning" (i.e. "alerts" and "push protection")
- Overwrite the repository's "environment secrets" for GitHub Actions using the closest .env file
${SHORT_TAB} - The filesystem will be walked starting from the current directory upward until a suitable .env file is found or the filesystem root is reached
${SHORT_TAB} - .env.default is used if .env is not available
${SHORT_TAB} - Secrets are never deleted by this command, only added/overwritten
`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      const { projectMetadata } = argv[$executionContext];
      hardAssert(projectMetadata, ErrorMessage.GuruMeditation());

      const github = await makeOctokit({ debug, log });
      const {
        cwdPackage: { json }
      } = projectMetadata;
      const { keywords = [] } = json;

      await github.repos.replaceAllTopics({
        names: keywords.map((word) => word.toLocaleLowerCase()),
        ...parsePackageJsonRepository(json)
      });

      log.error('todo');
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'github-rename-repo': {
    emoji: '🧬',
    taskAliases: [],
    actionDescription:
      'Updating origin repository name and synchronizing local configuration',
    shortHelpDescription:
      'Rename the origin repository and update git remotes accordingly',
    longHelpDescription: `This renovation will rename the remote origin repository, rename (move) the repository directory on the local filesystem, and update the remotes in .git/config accordingly.\n\nIf the origin repository cannot be renamed, the rename attempt will be aborted and no local changes will occur.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'new-name': {
        string: true,
        description: "The repository's new name",
        subOptionOf: {
          'github-rename-repo': {
            when(superOptionValue) {
              return superOptionValue;
            },
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
    shortHelpDescription: `Temporarily pause origin repository ruleset protections`,
    longHelpDescription: `This renovation will temporarily disable all rulesets in the repository for ${RULESET_PROTECTION_PAUSE_MINUTES} minutes, after which this command will re-enable them.\n\nUpon executing this renovation, you will be presented with a countdown until protections will be re-enabled. You may press any key to immediately re-enable protections and exit the program.\n\nIf this renovation does not exit cleanly, re-running it (or --github-reconfigure-repo) will restore and re-enable any disabled rulesets.`,
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
      "Clone the origin repository's wikis into a (gitignored) directory",
    longHelpDescription: `This renovation will clone the repository's wiki into the (gitignored) .wiki/ directory at the project root. If a wiki does not exist, this command will throw an error; in such a case, use --github-reconfigure-repo first to enable wikis before running this renovation.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {},
    async run(argv_, { log }) {
      const argv = argv_ as RenovationTaskArgv;
      checkRuntimeIsReadyForGithub(argv, log);

      // TODO: do not proceed if the .wiki dir already exists
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
    longHelpDescription: `This renovation will kill any and all references to any "master" ref throughout the repository. This includes renaming the "master" branch to "main," deleting the "master" branch on the remote origin repository, and setting the default branch to "main" both locally and remotely if it is not the case already.`,
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
    shortHelpDescription: 'Generate a scoped version tag for each non-scoped version tag',
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
    actionDescription: 'Regenerating configuration and template assets',
    shortHelpDescription: 'Regenerate all configuration and template asset files',
    longHelpDescription: `This renovation will regenerate all configuration assets in the project. Existing conflicting configurations are overwritten. Missing configurations are created. Old configurations are deleted.\n\nAfter running this renovation, you should use your IDE's diff tools to compare and contrast the latest best practices with the project's current configuration setup.\n\nNote that this renovation is a superset of --regenerate-aliases; invoking both renovations is pointlessly redundant.`,
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'skip-assets': {
        alias: 'skip-asset',
        array: true,
        string: true,
        conflicts: 'only-assets',
        description:
          'One or more regular expressions used to ignore matching project-root-relative file paths (all others will be included)',
        default: []
      },
      'only-assets': {
        alias: 'only-asset',
        array: true,
        string: true,
        conflicts: 'skip-assets',
        description:
          'One or more regular expressions used to include matching project-root-relative file paths (all others will be ignored)',
        default: []
      }
    },
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;

      // TODO: Replace missing context items with "<!-- TODO -->" if they are
      // TODO: not resolvable (and note it in debug messaging)

      // TODO: existing overwrites, missing created, =!=> obsolete deleted <=!=

      // TODO: replacer region count must match in document or entire document
      // TODO: will be overwritten
      log.error('todo');
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  },
  'regenerate-aliases': {
    emoji: '🧭',
    taskAliases: [],
    actionDescription: 'Regenerating project aliases',
    shortHelpDescription:
      'Regenerate the assets files that define project-wide import aliases',
    longHelpDescription: `
This renovation is a subset of --regenerate-assets in that it will only regenerate the assets that define the project's import aliases. Currently, these assets are (relative to the project root):

- ${assetsWithAliasDefinitions.join('\n - ')}

This renovation is equivalent to calling \`xscripts project renovate --regenerate-assets --only-assets ...\` where "..." represents the assets listed above. This renovation should be run each time a package is added to or removed from a monorepo to ensure proper alias support.`.trim(),
    requiresForce: false,
    supportedScopes: [ProjectRenovateScope.Unlimited],
    subOptions: {
      'with-aliases-loaded-from': {
        string: true,
        description:
          'Include additional alias definitions imported from a JavaScript file'
      }
    },
    async run(argv_, { debug, log }) {
      const argv = argv_ as RenovationTaskArgv;

      // TODO: sanity check assetsWithAliasDefinitions
      // TODO: print overview of aliases
      log.error('todo');
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

      log.error('todo');
      // ? Typescript wants this here because of our "as const" for some reason
      return undefined;
    }
  }
} as const satisfies Record<string, Omit<RenovationTask, 'taskName'>>;
