/* eslint-disable unicorn/prevent-abbreviations */
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import { join as joinPath } from 'node:path';

import { CliError, FrameworkExitCode } from '@black-flag/core';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse#cli-utils extensions.ts';

import { ProjectError } from 'multiverse#project-utils error.ts';
import { isAccessible, type AbsolutePath } from 'multiverse#project-utils fs/index.ts';
import { createDebugLogger } from 'multiverse#rejoinder';

import {
  globalCliArguments,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { globalDebuggerNamespace } from 'universe constant.ts';
import { ErrorMessage } from 'universe error.ts';

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

  if (!projectMetadata_) {
    throw new CliError(ErrorMessage.CannotRunOutsideRoot());
  }

  const cwd = process.cwd() as AbsolutePath;

  const {
    rootPackage: { root: projectRoot },
    cwdPackage: { root: packageRoot }
  } = projectMetadata_;

  debug('project root: %O', projectRoot);
  debug('cwdPackage root: %O', packageRoot);
  debug('cwd (must match one of the above): %O', cwd);

  if (![projectRoot, packageRoot].includes(cwd)) {
    throw new CliError(ErrorMessage.CannotRunOutsideRoot());
  }

  return { projectMetadata: projectMetadata_ };
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
      const path = joinPath(configRoot, filename);
      return [path, await isAccessible({ path: path })] as const;
    })
  ).then((results) => {
    // eslint-disable-next-line unicorn/no-array-reduce
    return results.reduce<undefined | AbsolutePath>(function (
      firstAccessiblePath,
      [currentPath, currentPathIsReadable]
    ) {
      if (firstAccessiblePath !== undefined && currentPathIsReadable) {
        throw new ProjectError(
          ErrorMessage.MultipleConfigsWhenExpectingOnlyOne(
            firstAccessiblePath,
            currentPath
          )
        );
      }

      return (currentPathIsReadable ? currentPath : firstAccessiblePath) as AbsolutePath;
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

export function checkAllChoiceIfGivenIsByItself(allChoice: string, noun: string) {
  return function (currentArg: unknown[]) {
    const includesAll = currentArg.includes(allChoice);

    return (
      !includesAll ||
      currentArg.length === 1 ||
      ErrorMessage.AllOptionValueMustBeAlone(noun)
    );
  };
}

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
