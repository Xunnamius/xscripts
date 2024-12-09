import fsSync from 'node:fs';
import fs from 'node:fs/promises';

import { run } from '@-xun/run';
import { CliError, FrameworkExitCode } from '@black-flag/core';

import {
  config as _loadDotEnv,
  type DotenvConfigOptions,
  type DotenvParseOutput,
  type DotenvPopulateInput
} from 'dotenv';

import { type Merge } from 'type-fest';

import { hardAssert, softAssert } from 'multiverse+cli-utils:error.ts';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse+cli-utils:extensions.ts';

import { LogTag } from 'multiverse+cli-utils:logging.ts';

import {
  dotEnvConfigPackageBase,
  dotEnvConfigProjectBase,
  dotEnvDefaultConfigPackageBase,
  dotEnvDefaultConfigProjectBase,
  getInitialWorkingDirectory,
  isAccessible,
  toAbsolutePath,
  toPath,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger, type ExtendedLogger } from 'multiverse+rejoinder';

import {
  globalCliArguments,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';

import type { GenericProjectMetadata } from 'multiverse+project-utils:analyze/common.ts';

let cachedEnvironmentContainer = undefined as Partial<DotenvPopulateInput> | undefined;

/**
 * A version of {@link withStandardBuilder} that expects `CustomCliArguments` to
 * extend {@link GlobalCliArguments}.
 *
 * When providing a `customBuilder` function or object, any key in the returned
 * object that is also a key in {@link globalCliArguments} will have its value
 * merged with the value in {@link globalCliArguments} _instead_ of fully
 * overwriting it. This means you can pass minimal configuration values for the
 * keys that are also in {@link globalCliArguments} and those values will be
 * merged over the corresponding default configuration value in
 * {@link globalCliArguments}.
 */
export function withGlobalBuilder<CustomCliArguments extends GlobalCliArguments<string>>(
  ...[customBuilder, settings]: Parameters<
    typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>
  >
): ReturnType<typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withStandardBuilder`
  });

  return withStandardBuilder<CustomCliArguments, GlobalExecutionContext>(
    function builder(blackFlag, helpOrVersionSet, argv) {
      debug_('entered withGlobalBuilder::builder wrapper function');
      debug_('calling customBuilder (if a function) and returning builder object');

      const customCliArguments =
        (typeof customBuilder === 'function'
          ? customBuilder(blackFlag, helpOrVersionSet, argv)
          : customBuilder) || {};

      for (const key of Object.keys(customCliArguments)) {
        if (key in globalCliArguments) {
          customCliArguments[key] = Object.assign(
            {},
            globalCliArguments[key as keyof typeof globalCliArguments],
            customCliArguments[key]
          );
        }
      }

      debug_('exited withGlobalBuilder::builder wrapper function');

      return {
        ...globalCliArguments,
        ...customCliArguments
      };
    },
    {
      ...settings,
      additionalCommonOptions: [
        ...Object.keys(globalCliArguments),
        ...(settings?.additionalCommonOptions || [])
      ]
    }
  );
}

export { withStandardUsage as withGlobalUsage };

/**
 * This function runs common checks against the runtime to ensure the
 * environment is suitable for running xscripts.
 *
 * This function should be called at the top of just about every command
 * handler.
 *
 * This command also asserts that the `projectMetadata` property is defined by
 * returning it (or throwing a {@link CliError} if undefined).
 */
export async function runGlobalPreChecks({
  debug_,
  projectMetadata_
}: {
  debug_: GlobalExecutionContext['debug_'];
  projectMetadata_: GlobalExecutionContext['projectMetadata'];
}): Promise<{
  projectMetadata: NonNullable<GlobalExecutionContext['projectMetadata']>;
}> {
  const debug = debug_.extend('globalPreChecks');

  softAssert(projectMetadata_, ErrorMessage.CannotRunOutsideRoot());

  const cwd = toAbsolutePath(getInitialWorkingDirectory());

  const {
    rootPackage: { root: projectRoot },
    cwdPackage: { root: packageRoot }
  } = projectMetadata_;

  debug('project root: %O', projectRoot);
  debug('cwdPackage root: %O', packageRoot);
  debug('cwd (must match one of the above): %O', cwd);

  softAssert(
    [projectRoot, packageRoot].includes(cwd),
    ErrorMessage.CannotRunOutsideRoot()
  );

  return { projectMetadata: projectMetadata_ };
}

/**
 * If `gitStatusOutput` is not empty or `gitStatusExitCode` is non-zero, then
 * the current working tree is dirty. This can be checked quickly via the
 * `isDirty` property.
 */
export async function determineRepoWorkingTreeDirty() {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:working-tree-state`
  });

  const { all: gitStatusOutput, exitCode: gitStatusExitCode } = await run(
    'git',
    ['status', '--porcelain'],
    { all: true }
  );

  const isDirty = !!gitStatusOutput || gitStatusExitCode !== 0;

  if (isDirty) {
    debug.warn(
      'repository was left in an unclean state! Git status output (exit code %O):',
      gitStatusExitCode
    );
  }

  debug.message('%O', gitStatusOutput);

  return {
    gitStatusOutput,
    gitStatusExitCode,
    isDirty
  };
}

/**
 * Returns all dotenv file paths relevant to the current package in reverse
 * order of precedence; the most important dotenv file will be last in the
 * returned array.
 */
export function getRelevantDotEnvFilePaths(
  projectMetadata: GenericProjectMetadata | undefined
) {
  const { cwdPackage, rootPackage } = projectMetadata || {};

  const cwdPackageEnvFile =
    cwdPackage?.root && rootPackage?.root !== cwdPackage.root
      ? `${cwdPackage.root}/${dotEnvConfigPackageBase}`
      : undefined;

  const cwdPackageEnvDefaultFile =
    cwdPackage?.root && rootPackage?.root !== cwdPackage.root
      ? `${cwdPackage.root}/${dotEnvDefaultConfigPackageBase}`
      : undefined;

  const rootPackageEnvFile = rootPackage?.root
    ? `${rootPackage.root}/${dotEnvConfigProjectBase}`
    : undefined;

  const rootPackageEnvDefaultFile = rootPackage?.root
    ? `${rootPackage.root}/${dotEnvDefaultConfigProjectBase}`
    : undefined;

  // ! Most important env file should be last, least important should be first
  const paths = [
    rootPackageEnvDefaultFile,
    cwdPackageEnvDefaultFile,
    rootPackageEnvFile,
    cwdPackageEnvFile
  ].filter((p): p is string => !!p);

  return paths;
}

// TODO: transmute this and related functions into @-xun/env

export type LoadDotEnvSettings = {
  log: ExtendedLogger;
  /**
   * Variables from files earlier in this list will be overwritten by
   * variables from files later in the list.
   */
  dotEnvFilePaths: string[];
  /**
   * If `true`, do not throw on errors.
   */
  force: boolean;
  /**
   * Further instructions for the user upon environment validation failure.
   */
  failInstructions: string;
  /**
   * Action to take upon environment validation failure.
   */
  onFail: () => void;
  /**
   * If `true`, loaded environment variables will be added to `process.env`
   * with respect to `override`, and this function will return `void`. If
   * `false`, the environment variables will be returned instead and
   * `override` is ignored.
   *
   * @default true
   */
  updateProcessEnv?: boolean;
} & Pick<DotenvConfigOptions, 'override'>;

/**
 * @see {@link loadDotEnv}
 */
export type LoadDotEnvSimplifiedSettings = Merge<
  LoadDotEnvSettings,
  { onFail?: undefined; failInstructions?: undefined; force?: undefined }
>;

/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * `process.env` will be updated, and then an object containing only the loaded
 * environment variables is returned.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  settings: LoadDotEnvSimplifiedSettings & { updateProcessEnv?: true }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * An object containing only the loaded environment variables is returned.
 * **`process.env` will NOT be updated!**
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  settings: LoadDotEnvSimplifiedSettings & { updateProcessEnv: false }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * `process.env` will be updated, and the resulting environment object (after
 * `overrides` and `updateProcessEnv` are considered) will be checked for the
 * existence of the variables in `expectedEnvironmentVariables`. If the check is
 * successful, an object containing only the loaded environment variables is
 * returned. Otherwise, an error is thrown.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  expectedEnvironmentVariables: string[],
  settings: LoadDotEnvSettings & { updateProcessEnv?: true }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * The resulting environment object (after `overrides` and `updateProcessEnv`
 * are considered) will be checked for the existence of the variables in
 * `expectedEnvironmentVariables`, but **`process.env` will NOT be updated!**.
 * If the check is successful, an object containing only the loaded environment
 * variables is returned. Otherwise, an error is thrown.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  expectedEnvironmentVariables: string[],
  settings: LoadDotEnvSettings & { updateProcessEnv: false }
): DotenvParseOutput;
export function loadDotEnv(
  ...args: [LoadDotEnvSimplifiedSettings] | [string[], LoadDotEnvSettings]
) {
  const expectedEnvironmentVariables = Array.isArray(args[0]) ? args[0] : [];

  const {
    log,
    dotEnvFilePaths,
    force = false,
    failInstructions = '',
    onFail = () => undefined,
    override = false,
    updateProcessEnv = true
  } = (Array.isArray(args[0]) ? args[1] : args[0])!;

  const failLogger = log.extend('env-valid');
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:load-env`
  });

  debug('dotEnvFilePaths: %O', dotEnvFilePaths);
  hardAssert(Array.isArray(dotEnvFilePaths), ErrorMessage.GuruMeditation());

  const problems: string[] = [];

  if (!cachedEnvironmentContainer) {
    cachedEnvironmentContainer = {};

    dotEnvFilePaths.forEach((path) => {
      const result = _loadDotEnv({
        debug: !!process.env.DEBUG,
        path,
        override: true,
        processEnv: cachedEnvironmentContainer as DotenvPopulateInput
      });

      if (result.error) {
        debug.warn('attempt to load dotenv file %O failed: %O', path, result.error);
      } else {
        debug('loaded dotenv file %O successfully', path);
      }
    });

    if (
      cachedEnvironmentContainer.GITHUB_TOKEN &&
      cachedEnvironmentContainer.GH_TOKEN === undefined
    ) {
      cachedEnvironmentContainer.GH_TOKEN = cachedEnvironmentContainer.GITHUB_TOKEN;
    }
  }

  const transientEnvironmentContainer = Object.assign(
    updateProcessEnv ? process.env : {},
    cachedEnvironmentContainer,
    override ? {} : process.env
  );

  expectedEnvironmentVariables.forEach((variable) => {
    const isVariableDefined = (transientEnvironmentContainer[variable]?.length || 0) > 0;
    if (!isVariableDefined) {
      problems.push(`variable "${variable}" is empty or missing in environment`);
    }
  });

  problems.forEach((problem, index) => {
    failLogger[force ? 'warn' : 'error'](
      [LogTag.IF_NOT_QUIETED],
      'Problem %O: ' + problem,
      index + 1
    );
  });

  if (!force && problems.length) {
    failLogger.message(
      [LogTag.IF_NOT_SILENCED],
      `Validation failed: %O problem${problems.length === 1 ? '' : 's'} detected.${failInstructions ? ` ${failInstructions}` : ''}`,
      problems.length
    );

    onFail();
  }

  return cachedEnvironmentContainer;
}

// TODO: probably prudent to make these part of cli-utils

export async function readFile(path: string) {
  try {
    return await fs.readFile(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotReadFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function writeFile(path: string, contents: string) {
  try {
    await fs.writeFile(path, contents, { mode: 0o664 });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotWriteFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function copyFile(from: string, to: string) {
  try {
    await fs.copyFile(from, to);
  } catch (error) {
    throw new CliError(ErrorMessage.CannotCopyFile(from, to), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function makeDirectory(path: string) {
  try {
    await fs.mkdir(path, {
      mode: 0o775,
      recursive: true
    });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotMakeDirectory(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export function __read_file_sync(path: string) {
  try {
    return fsSync.readFileSync(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotReadFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export function __write_file_sync(path: string, contents: string) {
  try {
    fsSync.writeFileSync(path, contents);
  } catch (error) {
    throw new CliError(ErrorMessage.CannotWriteFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

/**
 * Takes an array of `wellKnownFiles`, which can be filenames or paths (both
 * taken local to `configRoot`) and returns an absolute path to an existing
 * readable file from `wellKnownFiles` should one exist. If more than one file
 * in `wellKnownFiles` exists, this function will throw.
 */
export async function findOneConfigurationFile(
  wellKnownFiles: string[],
  configRoot: AbsolutePath
) {
  return Promise.all(
    wellKnownFiles.map(async (filename) => {
      const path = toPath(configRoot, filename);
      return [path, await isAccessible(path, { useCached: true })] as const;
    })
  ).then((results) => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return results.reduce<undefined | AbsolutePath>(function (
      firstAccessiblePath,
      [currentPath, currentPathIsReadable]
    ) {
      if (firstAccessiblePath !== undefined && currentPathIsReadable) {
        softAssert(
          ErrorMessage.MultipleConfigsWhenExpectingOnlyOne(
            firstAccessiblePath,
            currentPath
          )
        );
      }

      return currentPathIsReadable ? currentPath : firstAccessiblePath;
    }, undefined);
  });
}

export function hasExitCode(error: unknown): error is object & { exitCode: number } {
  return !!(
    error &&
    typeof error === 'object' &&
    'exitCode' in error &&
    typeof error.exitCode === 'number'
  );
}

// TODO: also consider a package of @-xun/black-flag-common-option-checks that
// TODO: includes the generic checks implemented below:

export function checkIsNotNegative(argName: string) {
  return function (currentArg: unknown) {
    return (
      (typeof currentArg === 'number' && currentArg >= 0) ||
      ErrorMessage.ArgumentMustBeNonNegative(argName)
    );
  };
}

export function checkIsNotNil(argName: string) {
  return function (currentArg: unknown) {
    return !!currentArg || ErrorMessage.ArgumentMustNotBeFalsy(argName);
  };
}

export function checkArrayNotEmpty(argName: string, adjective = 'non-empty') {
  return function (currentArg: unknown[]) {
    return (
      (currentArg.length > 0 && currentArg.every((file) => isNonEmptyString(file))) ||
      ErrorMessage.RequiresMinArgs(argName, 1, undefined, adjective)
    );
  };
}

export function isNonEmptyString(o: unknown): o is string {
  return typeof o === 'string' && o.length > 0;
}
