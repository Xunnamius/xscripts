import {
  type ConfigureErrorHandlingEpilogue,
  type ConfigureExecutionContext,
  type ConfigureExecutionEpilogue
} from '@black-flag/core';

import { defaultVersionTextDescription } from '@black-flag/core/util';

import { type BfeBuilderObject } from 'multiverse+bfe';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse+cli-utils:configure.ts';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse+cli-utils:extensions.ts';

import { analyzeProjectStructure, type ProjectMetadata } from 'multiverse+project-utils';
import { cache } from 'multiverse+project-utils:cache.ts';
import { isAccessible } from 'multiverse+project-utils:fs/is-accessible.ts';
import { distDirPackageBase, toPath } from 'multiverse+project-utils:fs.ts';
import { createDebugLogger, createGenericLogger } from 'multiverse+rejoinder';

import { version as packageVersion } from 'rootverse:package.json';

import { globalDebuggerNamespace, globalLoggerNamespace } from 'universe:constant.ts';

// ? Used in documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { withGlobalBuilder } from 'universe:util.ts';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type GlobalExecutionContext = StandardExecutionContext & {
  projectMetadata: ProjectMetadata | undefined;
};

/**
 * Determines which project files are considered within a command's purview.
 * Files outside of a command's purview will be treated by xscripts as if they
 * do not exist where possible.
 *
 * This enum is essentially {@link ThisPackageGlobalScope} +
 * {@link UnlimitedGlobalScope}.
 */
export enum DefaultGlobalScope {
  /**
   * Limit the command to _all_ relevant files contained within the current
   * package (as determined by the current working directory), excluding the
   * files of any other (named) workspace packages. Hence, this scope is only
   * meaningful in a monorepo context.
   *
   * This is the default scope for most commands.
   */
  ThisPackage = 'this-package',
  /**
   * Do not limit or exclude any files by default when running the command.
   *
   * This is useful, for instance, when attempting to manually lint an entire
   * monorepo at once; e.g. `npx xscripts lint --scope=unlimited`.
   */
  Unlimited = 'unlimited'
}

/**
 * This enum represents a subset of {@link DefaultGlobalScope}, and is useful for type
 * checking commands that only operate in the "this-package" scope.
 *
 * @see {@link DefaultGlobalScope}
 */
export enum ThisPackageGlobalScope {
  /**
   * @see {@link DefaultGlobalScope.ThisPackage}
   */
  ThisPackage = 'this-package'
}

/**
 * This enum represents a subset of {@link DefaultGlobalScope}, and is useful for type
 * checking commands that only operate in the "unlimited" scope.
 *
 * @see {@link DefaultGlobalScope}
 */
export enum UnlimitedGlobalScope {
  /**
   * @see {@link DefaultGlobalScope.Unlimited}
   */
  Unlimited = 'unlimited'
}

/**
 * These properties will be available in the `argv` object of any command that
 * uses {@link withGlobalBuilder} to construct its `builder`.
 *
 * This type is manually synchronized with {@link globalCliArguments}, but the
 * keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).
 *
 * @see {@link StandardCommonCliArguments}
 */
export type GlobalCliArguments<Scope extends string = DefaultGlobalScope> =
  StandardCommonCliArguments & {
    scope: Scope;
  };

/**
 * This {@link BfeBuilderObject} instance describes the CLI arguments available
 * in the `argv` object of any command that uses {@link withGlobalBuilder} to
 * construct its `builder`.
 *
 * This object is manually synchronized with {@link GlobalCliArguments}, but the
 * keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).
 *
 * When providing a custom {@link BfeBuilderObject} instance to
 * {@link withGlobalBuilder}, any key specified in that instance that is also a
 * key in this object (`globalCliArguments`) will have its value merged with the
 * value in this object _instead_ of fully overwriting it. This means you can
 * pass minimal configuration values for the keys that are also in
 * `globalCliArguments` and those values will be merged over the corresponding
 * default configuration value in `globalCliArguments`.
 *
 * @see {@link StandardCommonCliArguments}
 */
export const globalCliArguments = {
  scope: {
    string: true,
    choices: Object.values(DefaultGlobalScope),
    default: DefaultGlobalScope.ThisPackage,
    description: 'Which files this command will consider when scanning the filesystem'
  }
} satisfies BfeBuilderObject<Record<string, unknown>, StandardExecutionContext>;

export const configureExecutionContext = async function (context) {
  const standardContext = await makeStandardConfigureExecutionContext({
    rootGenericLogger,
    rootDebugLogger
  })(context);

  const projectMetadata = await analyzeProjectStructure({ useCached: true }).catch(
    () => undefined
  );

  if (projectMetadata) {
    const {
      rootPackage: { root: projectRoot },
      cwdPackage: { root: packageRoot }
    } = projectMetadata;

    const cwdPackageDistDirPath = toPath(packageRoot, distDirPackageBase);
    const rootPackageDistDirPath = toPath(projectRoot, distDirPackageBase);

    const nodeModulesDirTsconfigFilePath = toPath(
      projectRoot,
      'node_modules',
      '@-xun',
      'scripts',
      'tsconfig.json'
    );

    const isRunningFromWithinCurrentProjectDistDir =
      !__dirname.includes('/node_modules/') &&
      (__dirname.startsWith(cwdPackageDistDirPath) ||
        __dirname.startsWith(rootPackageDistDirPath));

    rootDebugLogger('__dirname: %O', __dirname);
    rootDebugLogger('nodeModulesDirTsconfigFilePath: %O', nodeModulesDirTsconfigFilePath);
    rootDebugLogger(
      'isRunningFromWithinCurrentProjectDistDir: %O',
      isRunningFromWithinCurrentProjectDistDir
    );

    if (
      isRunningFromWithinCurrentProjectDistDir ||
      // ? ... or look for the existence of a non-distributables file
      (await isAccessible(nodeModulesDirTsconfigFilePath, { useCached: true }))
    ) {
      rootDebugLogger('decision: a dev version is probably running');

      standardContext.state.globalVersionOption = {
        name: 'version',
        description: defaultVersionTextDescription,
        // ? Lets us know when we're loading a custom-built "dev" xscripts.
        text: String(packageVersion) + ` (dev from ${__filename})`
      };
    } else {
      rootDebugLogger('decision: a non-dev version is probably running');
    }
  }

  return { ...standardContext, projectMetadata };
} as ConfigureExecutionContext<GlobalExecutionContext>;

export const configureErrorHandlingEpilogue = function (...args) {
  reportFinalCacheStats();
  return makeStandardConfigureErrorHandlingEpilogue()(...args);
} as ConfigureErrorHandlingEpilogue<GlobalExecutionContext>;

export const configureExecutionEpilogue = function (argv) {
  reportFinalCacheStats();
  return argv;
} as ConfigureExecutionEpilogue<GlobalExecutionContext>;

function reportFinalCacheStats() {
  const { clear: _, get: __, set: ___, ...stats } = cache;
  rootDebugLogger.extend('cache')('final cache stats: %O', stats);
}
