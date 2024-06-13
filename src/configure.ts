import { globalDebuggerNamespace, globalLoggerNamespace } from 'universe/constant';

import { createDebugLogger, createGenericLogger } from 'multiverse/rejoinder';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse/@-xun/cli-utils/configure';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse/@-xun/cli-utils/extensions';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type GlobalExecutionContext = StandardExecutionContext;

export type GlobalCliArguments = StandardCommonCliArguments;

export const configureExecutionContext = makeStandardConfigureExecutionContext({
  rootGenericLogger,
  rootDebugLogger
});

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
