import { join, resolve } from 'node:path';
import { readlink } from 'node:fs/promises';

import { type ConfigureExecutionContext } from '@black-flag/core';
import { defaultVersionTextDescription } from '@black-flag/core/util';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse#cli-utils configure.ts';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse#cli-utils extensions.ts';

import { createDebugLogger, createGenericLogger } from 'multiverse#rejoinder';
import { analyzeProjectStructure, type ProjectMetadata } from 'multiverse#project-utils';
import { type BfeBuilderObject } from 'multiverse#bfe';
import { isAccessible } from 'multiverse#project-utils fs/exports/is-accessible.ts';

import {
  globalCliName,
  globalDebuggerNamespace,
  globalLoggerNamespace
} from 'universe constant.ts';

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
 */
export enum GlobalScope {
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
 * This enum represents the "base class" of {@link GlobalScope}. This enum is
 * useful for type checking commands that only operate in the "this-package"
 * scope.
 *
 * @see {@link GlobalScope}
 */
export enum LimitedGlobalScope {
  /**
   * @see {@link GlobalScope.ThisPackage}
   */
  ThisPackage = 'this-package'
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
export type GlobalCliArguments = StandardCommonCliArguments & {
  scope?: GlobalScope;
};

/**
 * This {@link BfeBuilderObject} instance describes the CLI arguments available
 * in the `argv` object of any command that uses {@link withGlobalBuilder} to
 * construct its `builder`.
 *
 * This object is manually synchronized with {@link GlobalCliArguments}, but the
 * keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).
 *
 * @see {@link StandardCommonCliArguments}
 */
export const globalCliArguments = {
  scope: {
    string: true,
    choices: Object.values(GlobalScope),
    default: GlobalScope.ThisPackage,
    description: 'Which files this command will consider'
  }
} as const satisfies BfeBuilderObject<Record<string, unknown>, StandardExecutionContext>;

export const configureExecutionContext: ConfigureExecutionContext<GlobalExecutionContext> =
  async function (context) {
    const standardContext = await makeStandardConfigureExecutionContext({
      rootGenericLogger,
      rootDebugLogger
    })(context);

    const projectMetadata = await analyzeProjectStructure().catch(() => undefined);

    if (projectMetadata) {
      const distDir = join(projectMetadata.project.root, 'dist');
      const nodeModulesBinDir = join(
        projectMetadata.project.root,
        'node_modules',
        '.bin'
      );

      const xscriptsBinFileLink = join(nodeModulesBinDir, globalCliName);

      if (await isAccessible({ path: xscriptsBinFileLink })) {
        const xscriptsBinFileActual = resolve(
          projectMetadata.project.root,
          await readlink(xscriptsBinFileLink)
        );

        // ? Lets us know when we're loading xscripts under special conditions.
        const developmentTag = xscriptsBinFileActual.startsWith(distDir) ? '' : ' (dev)';

        standardContext.state.globalVersionOption = {
          name: 'version',
          description: defaultVersionTextDescription,
          text: String(projectMetadata.project.json.version) + developmentTag
        };
      }
    }

    return { ...standardContext, projectMetadata };
  };

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
