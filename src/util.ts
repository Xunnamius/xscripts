import assert from 'node:assert';
import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';

import { $executionContext, CliError, type Configuration } from '@black-flag/core';
import { Options } from 'yargs';

import { CustomExecutionContext } from 'universe/configure';
import { LogTag, globalLoggerNamespace, wellKnownCliDistPath } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import {
  ExtendedLogger,
  createDebugLogger,
  disableLoggingByTag
} from 'multiverse/rejoinder';

// TODO: When we inevitably turn most of this file into libs, be sure to
// TODO: reference https://github.com/yargs/yargs/issues/2392 in one of the
// TODO: commits!

/**
 * These properties will be available in the `argv` object of any command that
 * uses `withGlobalOptions` to construct its `builder`.
 */
export type GlobalCliArguments = {
  hush: boolean;
  quiet: boolean;
  silent: boolean;
};

/**
 * Upper-cases the first letter of `str`.
 */
export function toSentenceCase(str: string) {
  return str[0].toLocaleUpperCase() + str.slice(1);
}

/**
 * Upper-cases the first letter of `str` wrt spaces (underscores).
 */
export function toSpacedSentenceCase(str: string) {
  let updatedStr = toSentenceCase(str);
  let indexOf = updatedStr.indexOf('_');

  while (indexOf !== -1) {
    updatedStr = updatedStr.slice(0, indexOf) + ' ' + updatedStr.slice(indexOf + 1);
    indexOf = updatedStr.indexOf('_', indexOf + 1);
  }

  return updatedStr;
}

/**
 * Lower-cases the first letter of `str`.
 */
export function toFirstLowerCase(str: string) {
  return str[0].toLocaleLowerCase() + str.slice(1);
}

/**
 * Generate standard command usage text.
 */
export function makeUsageString(altDescription = '$1.') {
  if (altDescription?.endsWith('.') === false) {
    altDescription += '.';
  }

  return `Usage: $000\n\n${altDescription}`.trim();
}

/**
 * Prints a timestamp indicating the beginning of execution.
 */
export function logStartTime({
  log,
  startTime
}: {
  log: ExtendedLogger;
  startTime: Date;
}) {
  log(
    [LogTag.IF_NOT_HUSHED],
    'Execution began on',
    startTime.toLocaleDateString(),
    'at',
    startTime.toLocaleTimeString()
  );
}

export type BuilderObject<CustomCliArguments extends GlobalCliArguments> = Exclude<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

export type BuilderFunction<CustomCliArguments extends GlobalCliArguments> = Extract<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

export type WithGlobalOptionsReturnType<CustomCliArguments extends GlobalCliArguments> = [
  builder: (
    ...args: Parameters<BuilderFunction<CustomCliArguments>>
  ) => BuilderObject<CustomCliArguments>,
  builderData: {
    handlerPreCheckData: {
      atLeastOneOfOptions: string[][];
      mutuallyConflictedOptions: string[][];
    };
  }
];

export type ExtendedBuilderObject = {
  [key: string]: Omit<Options, 'demandOption'> & {
    demandOption?: Options['demandOption'] | string[];
  };
};

/**
 * Returns a builder function (alongside a live data context) that wraps
 * `customBuilder` to provide standard CLI options (i.e. silent, etc). Most if
 * not all commands should wrap their builder objects/functions with this
 * function.
 *
 * This function enables three additional optionals-related units of
 * functionality:
 *
 * 1. Implements https://github.com/yargs/yargs/issues/2392 via analysis of the
 *    returned options object to perform mutual exclusivity checks per
 *    exclusivity group (represented by `conflicts`). That is: providing `{
 *    demandOption: true, conflicts: ['x', 'y'] }` for both the `x` and `y`
 *    commands (including hyphens) will trigger a check to ensure exactly one of
 *    those two options was given. Commands that are listed as conflicts in one
 *    command but not the other are allowed.
 *
 * 2. Providing `{ demandOption: ['x', 'y'] }` for both the `x` and `y` commands
 *    (including hyphens) will trigger a check to ensure at least one of those
 *    two options was given. Providing such a value for `demandOption` on one
 *    command but not the other will result in an assertion failure.
 *
 * 3. Handles command grouping automatically. However, not that this function
 *    handles command grouping for you **only if you return an options object**
 *    and **only if you add options via said options object**. Specifically:
 *    calling `blackFlag.options(...)` within `customBuilder` will cause
 *    undefined behavior.
 */
export async function withGlobalOptions<CustomCliArguments extends GlobalCliArguments>(
  customBuilder?:
    | ExtendedBuilderObject
    | ((
        ...args: Parameters<BuilderFunction<CustomCliArguments>>
      ) => ExtendedBuilderObject),
  hasVersion = false
): Promise<WithGlobalOptionsReturnType<CustomCliArguments>> {
  const handlerPreCheckData: WithGlobalOptionsReturnType<CustomCliArguments>[1]['handlerPreCheckData'] =
    {
      atLeastOneOfOptions: [],
      mutuallyConflictedOptions: []
    };

  const builder: WithGlobalOptionsReturnType<CustomCliArguments>[0] = function (
    blackFlag,
    helpOrVersionSet,
    argv
  ) {
    const debug = createDebugLogger({
      namespace: `${globalLoggerNamespace}:globalOptionsBuilding`
    });

    debug('entered global options wrapper (builder)');

    blackFlag.options({
      hush: {
        boolean: true,
        default: false,
        description: 'Set output to be somewhat less verbose'
      },
      quiet: {
        boolean: true,
        default: false,
        description: 'Set output to be dramatically less verbose (implies --hush)'
      },
      silent: {
        boolean: true,
        default: false,
        description: 'No output will be generated (implies --quiet)'
      }
    });

    blackFlag.updateStrings({ 'Commands:': 'Subcommands:' });

    debug('calling customBuilder (if a function) and returning builder object');

    // ? We make a semi-shallow clone of whatever options object we're passed
    // ? since we're going to be doing some light mutating
    const result = Object.fromEntries(
      Object.entries(
        typeof customBuilder === 'function'
          ? customBuilder(blackFlag, helpOrVersionSet, argv)
          : customBuilder || {}
      ).map(([k, v]) => [k, { ...v }])
    );

    debug('result: %O', result);
    debug('argv is defined: %O', !!argv);

    if (Object.keys(result).length) {
      const requiredMutuallyExclusiveOptionsSet = new Map<Set<string>, string[]>();
      const requiredAtLeastOneOptionsSet = new Map<Set<string>, string[]>();
      const requiredOptions: string[] = [];
      const optionalOptions: string[] = [];

      for (const [option, optionConfig] of Object.entries(result)) {
        const { demandOption, conflicts } = optionConfig;

        if (demandOption && conflicts) {
          // ? We do not allow both features to be used simultaneously
          assert(
            typeof demandOption === 'boolean',
            ErrorMessage.AssertionFailureCannotUseDoubleFeature()
          );
          optionConfig.demandOption = false;

          const rawKey = new Set<string>([
            ...(Array.isArray(conflicts)
              ? conflicts
              : typeof conflicts === 'string'
                ? [conflicts]
                : Object.keys(conflicts)),
            option
          ]);

          const key =
            [...requiredMutuallyExclusiveOptionsSet.keys()].find((potentialKey) =>
              areEqualSets(rawKey, potentialKey)
            ) || rawKey;

          requiredMutuallyExclusiveOptionsSet.set(key, [
            ...(requiredMutuallyExclusiveOptionsSet.get(key) || []),
            option
          ]);
        } else if (Array.isArray(demandOption)) {
          // ! Ensures demandOption is given to yargs as a valid type
          optionConfig.demandOption = false;

          const rawKey = new Set<string>([...demandOption, option]);

          const key =
            [...requiredAtLeastOneOptionsSet.keys()].find((potentialKey) =>
              areEqualSets(rawKey, potentialKey)
            ) || rawKey;

          requiredAtLeastOneOptionsSet.set(key, [
            ...(requiredAtLeastOneOptionsSet.get(key) || []),
            option
          ]);
        } else {
          (demandOption ? requiredOptions : optionalOptions).push(option);
        }
      }

      debug(
        'requiredMutuallyExclusiveOptionsGroups: %O',
        requiredMutuallyExclusiveOptionsSet
      );

      for (const [_, mutuallyConflictedOptions] of requiredMutuallyExclusiveOptionsSet) {
        if (mutuallyConflictedOptions.length > 1) {
          if (!!argv) {
            handlerPreCheckData.mutuallyConflictedOptions.push(mutuallyConflictedOptions);
            debug('pushed to handlerPreCheckData.mutuallyConflictedOptions');
          }

          blackFlag.group(
            mutuallyConflictedOptions,
            'Required Options (mutually exclusive):'
          );

          debug(
            'added "Required (mutually exclusive)" grouping: %O',
            mutuallyConflictedOptions
          );
        }
      }

      debug('requiredAtLeastOneOptionsGroups: %O', requiredAtLeastOneOptionsSet);

      let count = 0;

      for (const [
        atLeastOneOfDemandedSet,
        atLeastOneOfOptions
      ] of requiredAtLeastOneOptionsSet) {
        const atLeastOneOfOptionsSet = new Set(atLeastOneOfOptions);
        if (!areEqualSets(atLeastOneOfDemandedSet, atLeastOneOfOptionsSet)) {
          debug.error(
            'unequal sets (atLeastOneOfDemandedSet != atLeastOneOfOptionsSet): %O != %O',
            atLeastOneOfDemandedSet,
            atLeastOneOfOptionsSet
          );

          debug.error(atLeastOneOfDemandedSet);
          debug.error(atLeastOneOfOptionsSet);
          assert.fail(ErrorMessage.AssertionFailureUnequalDemandOptions());
        }

        if (!!argv) {
          handlerPreCheckData.atLeastOneOfOptions.push(atLeastOneOfOptions);
          debug('pushed to handlerPreCheckData.atLeastOneOfOptions');
        }

        blackFlag.group(
          atLeastOneOfOptions,
          `Required Options ${requiredAtLeastOneOptionsSet.size > 1 ? `${++count} ` : ''}(at least one):`
        );
        debug(
          `added "Required (at least one)" grouping #%O: %O`,
          count,
          atLeastOneOfOptions
        );
      }

      if (requiredOptions.length) {
        blackFlag.group(requiredOptions, 'Required Options:');
        debug('added "Required" grouping: %O', requiredOptions);
      }

      if (optionalOptions.length) {
        blackFlag.group(optionalOptions, 'Optional Options:');
        debug('added "Optional" grouping: %O', optionalOptions);
      }
    }

    const commonOptions = [
      'help',
      ...(hasVersion ? ['version'] : []),
      'hush',
      'quiet',
      'silent'
    ];

    blackFlag.group(commonOptions, 'Common Options:');
    debug('added "Common" grouping: %O', commonOptions);

    debug('handlerPreCheckData: %O', handlerPreCheckData);

    return result as ReturnType<typeof builder>;
  };

  return [builder, { handlerPreCheckData }];
}

/**
 * Returns a handler function that wraps `customHandler` to provide the
 * functionality for the standard CLI options (i.e. silent, etc). Most if not
 * all commands should wrap their handler functions with this function.
 */
export async function withGlobalOptionsHandling<
  CustomCliArguments extends GlobalCliArguments
>(
  // ! builderData MUST only be accessed WITHIN the returned handler!
  builderData: WithGlobalOptionsReturnType<CustomCliArguments>[1],
  customHandler: Configuration<CustomCliArguments, CustomExecutionContext>['handler']
): Promise<Configuration<CustomCliArguments, CustomExecutionContext>['handler']> {
  return async function handler(argv) {
    const {
      hush,
      quiet,
      silent,
      [$executionContext]: { state, debug_ }
    } = argv;

    const tags = new Set<LogTag>();
    const debug = debug_.extend('globalOptionsHandling');

    debug('entered global options wrapper (handler)');
    debug('hush: %O', hush);
    debug('quiet: %O', quiet);
    debug('silent: %O', silent);
    debug('builderData: %O', builderData);

    if (silent) {
      tags.add(LogTag.IF_NOT_SILENCED);
      state.isSilenced = true;
      tags.add(LogTag.IF_NOT_QUIETED);
      state.isQuieted = true;
      tags.add(LogTag.IF_NOT_HUSHED);
      state.isHushed = true;

      state.showHelpOnFail = false;
    }

    if (quiet) {
      tags.add(LogTag.IF_NOT_QUIETED);
      state.isQuieted = true;
      tags.add(LogTag.IF_NOT_HUSHED);
      state.isHushed = true;
    }

    if (hush) {
      tags.add(LogTag.IF_NOT_HUSHED);
      state.isHushed = true;
    }

    disableLoggingByTag({ tags: Array.from(tags) });

    builderData.handlerPreCheckData.atLeastOneOfOptions
      .map((constraint) => getOptionsFromArgv(constraint, argv))
      .forEach((options) => ensureAtLeastOneOptionWasGiven(options));

    builderData.handlerPreCheckData.mutuallyConflictedOptions
      .map((constraint) => getOptionsFromArgv(constraint, argv))
      .forEach((options) => ensureMutualExclusivityOfOptions(options));

    await customHandler(argv);
  };
}

/**
 * Safely imports the nearest package.json file without using `require` or
 * `import`.
 */
export async function findProjectRoot(): Promise<string> {
  const pkgJsonPath = await (await import('pkg-up')).pkgUp();
  assert(pkgJsonPath, ErrorMessage.AssertionFailureMissingPackageJson());
  return dirname(pkgJsonPath);
}

/**
 * Sugar for `await access(path, fsConstants)` that returns `true` or `false`
 * rather than throwing or returning `void`.
 */
export async function isAccessible(
  /**
   * The path to perform an access check against.
   */
  path: string,
  /**
   * The type of access check to perform.
   *
   * @default fs.constants.R_OK
   * @see {@link fs.constants}
   */
  fsConstants = fs.constants.R_OK
) {
  return fs.access(path, fsConstants).then(
    () => true,
    () => false
  );
}

/**
 * Metadata attributes that describe the capabilities and scope of a project.
 */
export type ProjectMetaAttribute = 'next' | 'cli' | 'webpack';

/**
 * Metadata about the current project.
 */
export type ProjectMetadata = {
  attributes: ProjectMetaAttribute[];
};

/**
 * Sugar for `(await import('node:fs)).promises.constants`.
 */
export const fsConstants = fs.constants;

/**
 * Return metadata about the current project.
 */
export async function getProjectMetadata(): Promise<ProjectMetadata> {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:getProjectMetadata`
  });

  const attributes: ProjectMetaAttribute[] = [];
  let isNextProject = false;
  let isCliProject = false;

  if (await isAccessible('next.config.js')) {
    isNextProject = true;
    attributes.push('next');
  }

  if (await isAccessible(wellKnownCliDistPath, fsConstants.R_OK | fsConstants.X_OK)) {
    isCliProject = true;
    attributes.push('cli');
  }

  if (await isAccessible('webpack.config.js', fsConstants.R_OK)) {
    attributes.push('webpack');
  }

  assert(
    !(isNextProject && isCliProject),
    ErrorMessage.AssertionFailureCannotBeCliAndNextJs()
  );

  const metadata: ProjectMetadata = { attributes };
  debug('project metadata: %O', metadata);

  return metadata;
}

/**
 * Returns `true` iff `setA` and `setB` are equal-enough sets.
 */
function areEqualSets(setA: Set<unknown>, setB: Set<unknown>) {
  return setA.size === setB.size && [...setA].every((item) => setB.has(item));
}

function getOptionsFromArgv(
  targetOptionsNames: string[],
  optionsGiven: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries([
    ...targetOptionsNames.map((name) => [name, undefined]),
    ...Object.entries(optionsGiven).filter(([name]) => targetOptionsNames.includes(name))
  ]);
}

function ensureMutualExclusivityOfOptions(optionsEntries: Record<string, unknown>) {
  let sawOne = false;
  Object.values(optionsEntries).every((value) => {
    if (sawOne) {
      throw new CliError(
        ErrorMessage.DidNotProvideExactlyOneOfSeveralOptions(optionsEntries),
        { showHelp: true }
      );
    }

    sawOne = value !== undefined;
  });
}

function ensureAtLeastOneOptionWasGiven(optionsEntries: Record<string, unknown>) {
  const sawAtLeastOne = Object.values(optionsEntries).some(
    (value) => value !== undefined
  );

  if (!sawAtLeastOne) {
    throw new CliError(
      ErrorMessage.DidNotProvideAtLeastOneOfSeveralOptions(optionsEntries),
      { showHelp: true }
    );
  }
}
