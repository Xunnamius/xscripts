import { type ConfigureExecutionContext } from '@black-flag/core';

import { getRunContext } from '@projector-js/core/project';

import { createDebugLogger, createGenericLogger } from 'multiverse/rejoinder';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse/@-xun/cli-utils/configure';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse/@-xun/cli-utils/extensions';

import { globalDebuggerNamespace, globalLoggerNamespace } from 'universe/constant';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type GlobalExecutionContext = StandardExecutionContext & {
  runtimeContext: ReturnType<typeof getRunContext>;
};

export type GlobalCliArguments = StandardCommonCliArguments;

export const configureExecutionContext: ConfigureExecutionContext<GlobalExecutionContext> =
  async function (context) {
    const standardContext = await makeStandardConfigureExecutionContext({
      rootGenericLogger,
      rootDebugLogger
    })(context);

    return {
      ...standardContext,
      // TODO: probably want to merge this into @projector-js/core's project
      // TODO: metadata package
      runtimeContext: getRunContext()
    };
  };

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
