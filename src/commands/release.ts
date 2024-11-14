import { run, runNoRejectOnBadExit } from '@-xun/run';
import { type ChildConfiguration } from '@black-flag/core';
// ? Patches global Proxy and spawn functions; see documentation for details
import '@-xun/scripts/assets/config/conventional.config.cjs';

import { type AsStrictExecutionContext } from 'multiverse+bfe';
import { hardAssert } from 'multiverse+cli-utils:error.ts';

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

import { ErrorMessage } from 'universe:error.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

const specialNonSpaceCharacter = '⠀';
const nestedTaskDepth = 2;

/**
 * @see {@link ReleaseScope}
 */
export const releaseScopes = Object.values(ReleaseScope);

/**
 * A string that can be passed to --skip-tasks representing all prerelease and
 * postrelease tasks.
 */
export const allTasks = 'all';

/**
 * A string that can be passed to --skip-tasks representing all prerelease
 * tasks.
 */
export const allPrereleaseTasks = 'prerelease';

/**
 * A string that can be passed to --skip-tasks representing all postrelease
 * tasks.
 */
export const allPostReleaseTasks = 'postrelease';

export type ReleaseTaskRunner = (
  argv: Parameters<ReturnType<typeof command>['handler']>[0]
) => Promise<void>;

export type InitReleaseTaskRunner = (
  executionContext: Parameters<typeof command>[0],
  argv: Parameters<ReturnType<typeof command>['handler']>[0]
) => ReturnType<ReleaseTaskRunner>;

/**
 * A prerelease, release, or postrelease task to be executed by this command.
 */
export type ReleaseTask =
  | {
      type: 'pre' | 'post';
      id: number;
      skippable: boolean;
      npmScripts: string[];
      description: string;
      run?: ReleaseTaskRunner;
    }
  | {
      type: 'release';
      id: number;
      skippable: false;
      npmScripts: never[];
      description: string;
      run?: ReleaseTaskRunner;
    };

export interface BaseInitTask {
  skippable: boolean;
  npmScripts?: string[];
  description: string;
  run?: InitReleaseTaskRunner;
}

/**
 * A partially defined prerelease-`type` {@link ReleaseTask}.
 */
export interface InitPrereleaseTask extends BaseInitTask {
  type?: 'pre';
}

/**
 * A partially defined postrelease-`type` {@link ReleaseTask}.
 */
export interface InitPostreleaseTask extends BaseInitTask {
  type?: 'post';
}

/**
 * A partially defined release-`type` {@link ReleaseTask}.
 */
export interface InitCoreReleaseTask
  extends Omit<BaseInitTask, 'skippable' | 'npmScripts'> {
  skippable?: false;
  npmScripts?: never[];
}

export type CustomCliArguments = GlobalCliArguments<ReleaseScope> & {
  ci: boolean;
  dryRun: boolean;
  force: boolean;
  parallel: boolean;
  skipTasks: string[];
  skipMissingTasks: boolean;
};

export default function command(
  executionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  const { log, debug_, state, projectMetadata: projectMetadata_ } = executionContext;

  const { prereleaseTasks, postreleaseTasks, tasksInRunOrder } =
    marshalTasks(executionContext);

  const firstPrereleaseTaskId = prereleaseTasks[0].id;
  const lastSchedulerPurviewTaskId = findTaskByDescription(/@-xun\/changelog/).id - 1;

  /**
   * A string that can be passed to --skip-tasks representing all tasks that are
   * manageable by an outside scheduler such as Turbo. This value is dynamically
   * generated.
   */
  const allSchedulerTasks = `${firstPrereleaseTaskId}-${lastSchedulerPurviewTaskId}`;

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
      description: 'Disregard all safety checks',
      default: false
    },
    parallel: {
      boolean: true,
      default: true,
      describe: 'Run release tasks concurrently when possible'
    },
    'skip-tasks': {
      alias: 'skip-task',
      array: true,
      choices: prereleaseTasks
        .concat(postreleaseTasks)
        .filter(({ skippable }) => skippable)
        .map(({ id }) => id.toString())
        .concat([allSchedulerTasks, allPrereleaseTasks, allPostReleaseTasks, allTasks]),
      description: 'Skip one, some, or all prerelease/postrelease tasks',
      default: process.env.TURBO_HASH ? [allSchedulerTasks] : [],
      defaultDescription: `"${allSchedulerTasks}" if run using Turbo, empty otherwise`,
      coerce(skipTargets: string[]) {
        return Array.from(
          new Set(
            skipTargets.flatMap((target) => {
              switch (target) {
                case allSchedulerTasks: {
                  return Array.from({
                    length: lastSchedulerPurviewTaskId - firstPrereleaseTaskId
                  }).map((_, index) => String(firstPrereleaseTaskId + index));
                }

                case allPrereleaseTasks: {
                  return prereleaseTasks.map(({ id }) => id.toString());
                }

                case allPostReleaseTasks: {
                  return postreleaseTasks.map(({ id }) => id.toString());
                }

                case allTasks: {
                  return prereleaseTasks
                    .concat(postreleaseTasks)
                    .map(({ id }) => id.toString());
                }

                default: {
                  return target;
                }
              }
            })
          )
        );
      }
    },
    'skip-missing-tasks': {
      boolean: true,
      description: 'Skip any task with missing NPM scripts instead of throwing an error',
      default: false
    }
  });

  return {
    builder,
    description: 'Pack and release existing production-ready distributables',
    usage: withGlobalUsage(
      `
$1 according to the release procedure described in the MAINTAINING.md file and at length in the xscripts wiki: https://github.com/Xunnamius/xscripts/wiki. The procedure is composed of the primary "release" task as well as ${prereleaseTasks.length + postreleaseTasks.length} "prerelease" and "postrelease" tasks:

${printTasks(tasksInRunOrder)}

Tasks at the same indentation level will be run concurrently unless --no-parallel is provided, in which case they will be run serially ordered by their unique numeric #ids. Use --no-parallel to prevent race conditions when, for instance, linting a package that imports from its own build output while also rebuilding that same package.

Provide --ci (--continuous-integration) to enable useful functionality for CI execution environments. Specifically: run npm ci (task #${findTaskByDescription(/npm ci/).id}), run xrelease in CI mode (task #${findTaskByDescription(/@-xun\/release/).id}), and facilitate package provenance if the runtime environment supports it (task #${findTaskByDescription(/@-xun\/release/).id}). If running the release procedure by hand instead of via CI/CD, use --no-ci to disable CI-specific functionality. --no-ci (\`--ci=false\`) is the default when the NODE_ENV environment variable is undefined or "development," otherwise --ci (\`--ci=true\`) is the default.

Task #${findTaskByDescription(/@-xun\/changelog/).id} sets the XSCRIPTS_RELEASE_UPDATE_CHANGELOG environment variable in the current execution environment. This will be picked up by xrelease, causing it to rebuild the changelog using \`xscripts build changelog\`.

Task #${findTaskByDescription(/sync-deps/).id} runs the equivalent of \`xscripts project renovate --scope this-package --task synchronize-interdependencies\` as a pre-release task.

Task #${findTaskByDescription(/codecov/i).id}, a postrelease task that uploads test coverage data to Codecov, is only performed if coverage data already exists; an error will be thrown if it does not. Coverage data is generated by task #${findTaskByDescription(/xscripts test/).id}. When uploading coverage data, the package's name is used to derive one or more flags (https://docs.codecov.com/docs/flags). Codecov uses flags to map reports to specific packages in its UI and coverage badges.

Running \`xscripts release\` will usually execute all prerelease and postrelease tasks. Provide \`--skip-tasks=task-id\` (where "task-id" is a valid task number) to skip running a specific task, \`--skip-tasks=prerelease\` to skip running tasks #${firstPrereleaseTaskId}-${prereleaseTasks.at(-1)!.id}, \`--skip-tasks=postrelease\` to skip running tasks #${postreleaseTasks[0].id} and above, or \`--skip-tasks=all\` to skip running all skippable prerelease and postrelease tasks.

There is also \`--skip-tasks=${allSchedulerTasks}\`, which will skip running tasks ${firstPrereleaseTaskId} through ${findTaskByDescription(/@-xun\/changelog/).id - 1}. This is useful when xscripts is being managed by a task scheduling tool like Turbo that decides out-of-band if/when/how it wants to run these specific tasks; such a tool only calls \`xscripts release\` afterwards, when it's ready to trigger xrelease. Therefore, \`--skip-tasks=${allSchedulerTasks}\` becomes the default when Turbo is detected in the runtime environment (by checking for the existence of \`process.env.TURBO_HASH\`).

If the package's package.json file is missing all of the NPM scripts a task requires, this command will exit with an error unless \`--skip-missing-tasks\` is provided, in which case any missing scripts (except "release", which must be defined) are noted in a warning but otherwise ignored.

The only available scope is "${ReleaseScope.ThisPackage}"; hence, when invoking this command, only the package at the current working directory will be eligible for release. Use Npm's workspace features, or Turbo's, if your goal is to potentially release multiple packages.

Provide --dry-run to ensure no changes are made (except to CHANGELOG.md), no release is cut, and no publishing or git write operations occur. Use --dry-run to test what would happen if you were to cut a release. Do note, however, that --dry-run will update the CHANGELOG.md file to match what would have been output during a real release. This is done so the end result can be more easily scrutinized by the developer. Hence, CHANGELOG.md should be reverted manually after a dry run, though this is not necessary if the dry run directly precedes an actual release.

Note: the minimum package version this command will release will always be 1.0.0. This is because xrelease does not officially support "experimental packages," which are packages with versions below semver 1.0.0. If you attempt to release a package with a version below 0.0.1, it will be released as a 1.0.0 (breaking change) instead. It is not wise to use experimental package versions with xrelease or xscripts.

WARNING: this command is NOT DESIGNED TO HANDLE CONCURRENT EXECUTION ON THE SAME GIT REPOSITORY IN A SAFE MANNER. DO NOT run multiple instances of this command on the same repository or project. If using a tool like Turbo, ensure it runs all NPM "release" scripts serially (and ideally topologically).
`.trim()
    ),
    handler: withGlobalHandler(async function (argv) {
      const {
        $0: scriptFullName,
        scope,
        ci,
        dryRun,
        force,
        parallel,
        skipTasks,
        skipMissingTasks
      } = argv;

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
      debug('skipTasks: %O', skipTasks);
      debug('skipMissingTasks: %O', skipMissingTasks);

      // TODO: execute tasks wrt --ci

      await processTasks(tasksInRunOrder);

      // TODO: do codecov upload last; CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) codecov; use codecov flags to determine which flags to send to codecov when uploading test results. DO NOT upload codecov information if we're not on the main branch... unless we can use codecov's flags to address this issue? Maybe we can! DO NOT USE npx codecov, we need to download the binary (to a consistent location based on its filename) if it isn't in path and use it instead

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      async function processTasks(tasksInRunOrder: ReleaseTask[][]) {
        for (const taskGroup of tasksInRunOrder) {
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(
            taskGroup.map(async ({ run, npmScripts, id: id_ }) => {
              const id = id_.toString();
              if (!skipTasks.includes(id)) {
                if (npmScripts) {
                  // TODO
                }

                if (run) {
                  await run(argv);
                }
              }
            })
          );
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;

  function findTaskByDescription(
    /**
     * **WARNING: MUST NEVER BE A RegExp WITH A GLOBAL (g) FLAG!**
     */
    searchRegExp: RegExp
  ): ReleaseTask {
    for (const tasks of tasksInRunOrder) {
      const found = tasks.find(({ description }) => searchRegExp.test(description));

      if (found) {
        return found;
      }
    }

    // ? まさか!
    hardAssert(ErrorMessage.GuruMeditation());
  }
}

function marshalTasks(executionContext: Parameters<typeof command>[0]) {
  let count = 0;

  const prereleaseTasks = initPrereleaseTasks.map(toReleaseTasks('pre'));
  const coreReleaseTask = toReleaseTasks('release')(initReleaseTask);
  const postreleaseTasks = initPostreleaseTasks.map(toReleaseTasks('post'));
  const tasksInRunOrder = [...prereleaseTasks, [coreReleaseTask], ...postreleaseTasks];

  return {
    /**
     * A 1-D array of all prerelease {@link ReleaseTask}s.
     */
    prereleaseTasks: prereleaseTasks.flat(nestedTaskDepth),
    /**
     * A 1-D array of all postrelease {@link ReleaseTask}s.
     */
    postreleaseTasks: postreleaseTasks.flat(nestedTaskDepth),
    /**
     * The prerelease and postrelease {@link ReleaseTask}s organized in run
     * order. Tasks that can be run concurrently will be grouped into arrays.
     */
    tasksInRunOrder
  };

  function toReleaseTasks(type: ReleaseTask['type']) {
    return self;

    function self(
      taskOrTasks: InitPrereleaseTask | InitPostreleaseTask | InitCoreReleaseTask
    ): ReleaseTask;
    function self(
      taskOrTasks: InitPrereleaseTask[] | InitPostreleaseTask[]
    ): ReleaseTask[];
    function self(
      taskOrTasks:
        | InitPrereleaseTask
        | InitPostreleaseTask
        | InitCoreReleaseTask
        | InitPrereleaseTask[]
        | InitPostreleaseTask[]
    ): ReleaseTask | ReleaseTask[] {
      if (Array.isArray(taskOrTasks)) {
        const tasks = taskOrTasks;
        return tasks.map((task) => self(task));
      }

      const task = taskOrTasks;
      const releaseTask: ReleaseTask =
        type === 'release'
          ? {
              ...task,
              skippable: false,
              type,
              id: ++count,
              npmScripts: [],
              run: task.run ? (argv) => task.run!(executionContext, argv) : undefined
            }
          : {
              skippable: false,
              npmScripts: [],
              ...task,
              type,
              id: ++count,
              run: task.run ? (argv) => task.run!(executionContext, argv) : undefined
            };

      return releaseTask;
    }
  }
}

function printTasks(tasksInRunOrder: ReleaseTask[][]): string {
  let tasksString = '';

  for (const [nestingLevel, taskGroup] of tasksInRunOrder.entries()) {
    for (const { description, id, npmScripts, skippable, type } of taskGroup) {
      tasksString +=
        specialNonSpaceCharacter.repeat(nestingLevel) +
        `${id}. ${skippable ? `[${type}release task] ` : ''}${
          npmScripts.length
            ? `[${npmScripts.map((script) => 'npm run ' + script).join(' or ')}] `
            : ''
        }${description}\n`;
    }
  }

  return tasksString.trimEnd();
}

const initPrereleaseTasks: InitPrereleaseTask[][] = [
  [
    {
      skippable: false,
      description: 'Validate environment variables',
      async run(executionContext, argv) {
        // {@xscripts/notExtraneous dotenv}
        // TODO: check that all required environment variables are defined and valid
      }
    }
  ],
  [
    {
      skippable: true,
      description: 'npm ci (only if `--ci=true`)',
      async run(executionContext, argv) {
        void executionContext, argv;
      }
    }
  ],
  [
    {
      skippable: true,
      npmScripts: ['format'],
      description: 'xscripts format'
    }
  ],
  [
    {
      skippable: true,
      npmScripts: ['lint:package:source', 'lint'],
      description: 'xscripts lint --scope=this-package-source'
    },
    {
      skippable: true,
      npmScripts: ['build:dist', 'build'],
      description: 'xscripts build distributables'
    },
    {
      skippable: true,
      npmScripts: ['build:docs'],
      description: 'xscripts build documentation'
    }
  ],
  [
    {
      skippable: true,
      npmScripts: ['test:package:all', 'test'],
      description: 'xscripts test --coverage'
    },
    {
      skippable: true,
      description: 'xscripts project renovate --scope this-package --task sync-deps',
      async run(executionContext, argv) {
        void executionContext, argv;
      }
    }
  ],
  [
    {
      skippable: true,
      description: 'Run @-xun/changelog (rebuild CHANGELOG.md)',
      async run(executionContext, argv) {
        // TODO
        void process.env.XSCRIPTS_RELEASE_REBUILD_CHANGELOG;
      }
    }
  ]
];

const initReleaseTask: InitCoreReleaseTask = {
  description: 'Run @-xun/release (publish new release)',
  async run(executionContext, argv) {
    // TODO
    void process.env.XSCRIPTS_SPECIAL_INITIAL_COMMIT;
  }
};

const initPostreleaseTasks: InitPostreleaseTask[][] = [
  [
    {
      skippable: true,
      description: 'Upload test coverage data to Codecov',
      async run(executionContext, argv) {
        void executionContext, argv;
      }
    }
  ]
];
