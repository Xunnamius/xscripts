import { join, resolve } from 'node:path';
import { readlink } from 'node:fs/promises';

import { type ConfigureExecutionContext } from '@black-flag/core';
import { getRunContext } from '@projector-js/core/project';
import { defaultVersionTextDescription } from '@black-flag/core/util';

import { createDebugLogger, createGenericLogger } from 'multiverse/rejoinder';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse/@-xun/cli-utils/configure';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse/@-xun/cli-utils/extensions';

import {
  globalCliName,
  globalDebuggerNamespace,
  globalLoggerNamespace
} from 'universe/constant';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type GlobalExecutionContext = StandardExecutionContext & {
  runtimeContext: ReturnType<typeof getRunContext> | undefined;
};

export type GlobalCliArguments = StandardCommonCliArguments;

export const configureExecutionContext: ConfigureExecutionContext<GlobalExecutionContext> =
  async function (context) {
    const standardContext = await makeStandardConfigureExecutionContext({
      rootGenericLogger,
      rootDebugLogger
    })(context);

    // TODO: probably want to merge this into @projector-js/core's project
    // TODO: metadata package
    const runtimeContext = (() => {
      try {
        return getRunContext();
      } catch {}
    })();

    if (runtimeContext) {
      const distDir = join(runtimeContext.project.root, 'dist');
      const nodeModulesBinDir = join(runtimeContext.project.root, 'node_modules', '.bin');
      const xscriptsBinFileLink = join(nodeModulesBinDir, globalCliName);

      const xscriptsBinFileActual = resolve(
        runtimeContext.project.root,
        await readlink(xscriptsBinFileLink)
      );

      // ? Lets us know when we're loading xscripts under special conditions.
      const developmentTag = xscriptsBinFileActual.startsWith(distDir) ? '' : ' (dev)';

      standardContext.state.globalVersionOption = {
        name: 'version',
        description: defaultVersionTextDescription,
        text: String(runtimeContext.project.json.version) + developmentTag
      };
    }

    return {
      ...standardContext,
      runtimeContext
    };
  };

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
