import { globalDebuggerNamespace, globalLoggerNamespace } from 'universe/constant';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse/@-xun/cli-utils/configure';

import { type StandardExecutionContext } from 'multiverse/@-xun/cli-utils/extensions';

import { createDebugLogger, createGenericLogger } from 'multiverse/rejoinder';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type CustomExecutionContext = StandardExecutionContext;

export const configureExecutionContext = makeStandardConfigureExecutionContext({
  rootGenericLogger,
  rootDebugLogger
});

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
