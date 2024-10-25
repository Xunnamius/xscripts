import { readlink } from 'node:fs/promises';
import { dirname, join, resolve as toAbsolutePath } from 'node:path';

import { type ConfigureExecutionContext } from '@black-flag/core';
import { defaultVersionTextDescription } from '@black-flag/core/util';

import { type BfeBuilderObject } from 'multiverse#bfe';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse#cli-utils configure.ts';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse#cli-utils extensions.ts';

import { analyzeProjectStructure, type ProjectMetadata } from 'multiverse#project-utils';
import { isAccessible } from 'multiverse#project-utils fs/is-accessible.ts';
import { createDebugLogger, createGenericLogger } from 'multiverse#rejoinder';

import {
  globalCliName,
  globalDebuggerNamespace,
  globalLoggerNamespace
} from 'universe constant.ts';

// ? Used in documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { withGlobalBuilder } from 'universe util.ts';

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

export const configureExecutionContext: ConfigureExecutionContext<GlobalExecutionContext> =
  async function (context) {
    const standardContext = await makeStandardConfigureExecutionContext({
      rootGenericLogger,
      rootDebugLogger
    })(context);

    const projectMetadata = await analyzeProjectStructure().catch(() => undefined);

    if (projectMetadata) {
      const { root: projectRoot } = projectMetadata.rootPackage;
      const distDir = join(projectRoot, 'dist');
      const nodeModulesBinDir = join(projectRoot, 'node_modules', '.bin');

      const xscriptsBinFileLink = join(nodeModulesBinDir, globalCliName);

      rootDebugLogger('distDir: %O', distDir);
      rootDebugLogger('nodeModulesBinDir: %O', nodeModulesBinDir);
      rootDebugLogger('xscriptsBinFileLink: %O', xscriptsBinFileLink);

      if (await isAccessible({ path: xscriptsBinFileLink })) {
        rootDebugLogger('xscriptsBinFileLink is accessible');

        const xscriptsBinFileActual = toAbsolutePath(
          dirname(xscriptsBinFileLink),
          await readlink(xscriptsBinFileLink)
        );

        rootDebugLogger('xscriptsBinFileActual: %O', xscriptsBinFileActual);

        const startsWithDistDir = xscriptsBinFileActual.startsWith(distDir);
        const selfDirMatchesDistDir = __dirname === dirname(xscriptsBinFileActual);

        rootDebugLogger('startsWithDistDir: %O', startsWithDistDir);
        rootDebugLogger('selfDirMatchesDistDir: %O', selfDirMatchesDistDir);

        // ? Lets us know when we're loading a custom-built "dev" xscripts.
        const developmentTag = startsWithDistDir && selfDirMatchesDistDir ? ' (dev)' : '';

        rootDebugLogger('add development tag?: %O', !!developmentTag);

        standardContext.state.globalVersionOption = {
          name: 'version',
          description: defaultVersionTextDescription,
          text: String(projectMetadata.rootPackage.json.version) + developmentTag
        };
      } else {
        rootDebugLogger('xscriptsBinFileLink was not accessible');
      }
    }

    return { ...standardContext, projectMetadata };
  };

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
