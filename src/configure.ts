import { isNativeError } from 'node:util/types';

import { type ExecutionContext } from '@black-flag/core/util';

import {
  createDebugLogger,
  createGenericLogger,
  ExtendedDebugger,
  TAB,
  type ExtendedLogger
} from 'multiverse/rejoinder';

import {
  globalDebuggerNamespace,
  globalLoggerNamespace,
  LogTag,
  MAX_LOG_ERROR_ENTRIES
} from 'universe/constant';

import { TaskError } from 'universe/error';
import { toFirstLowerCase } from 'universe/util';

import type {
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext
} from '@black-flag/core';

const { IF_NOT_SILENCED, IF_NOT_QUIETED } = LogTag;
const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type CustomExecutionContext = ExecutionContext & {
  /**
   * The {@link ExtendedLogger} for the CLI.
   */
  log: ExtendedLogger;
  /**
   * The {@link ExtendedDebugger} for the CLI.
   */
  debug_: ExtendedDebugger;
  state: {
    /**
     * If `true`, the program should not output anything at all. It also implies
     * `isQuieted` and `isHushed` are both `true`.
     */
    isSilenced: boolean;
    /**
     * If `true`, the program should be dramatically less verbose. It also
     * implies `isHushed` is `true`.
     */
    isQuieted: boolean;
    /**
     * If `true`, the program should output only the most pertinent information.
     */
    isHushed: boolean;
    /**
     * A `Date` object representing the start time of execution.
     */
    startTime: Date;
  };
};

export const configureExecutionContext: ConfigureExecutionContext = (context) => {
  return {
    ...context,
    log: rootGenericLogger,
    debug_: rootDebugLogger,
    state: {
      ...context.state,
      isSilenced: false,
      isQuieted: false,
      isHushed: false,
      startTime: new Date()
    }
  };
};

export const configureErrorHandlingEpilogue: ConfigureErrorHandlingEpilogue<
  CustomExecutionContext
> = async (
  ...[{ message, error }, _argv, context]: Parameters<
    ConfigureErrorHandlingEpilogue<CustomExecutionContext>
  >
) => {
  // ? Pretty print error output depending on how silent we're supposed to be
  if (!context.state.isSilenced) {
    if (context.state.didOutputHelpOrVersionText) {
      context.log.newline([IF_NOT_SILENCED], 'alternate');
    }

    context.log.error(
      [IF_NOT_SILENCED],
      `❌ Execution failed: ${toFirstLowerCase(message)}`
    );

    if (
      !context.state.isQuieted &&
      isNativeError(error) &&
      error.cause &&
      // ? Don't repeat what has already been output
      error.cause !== message
    ) {
      for (
        let count = 0, subError: Error | undefined = error;
        subError?.cause && count < MAX_LOG_ERROR_ENTRIES;
        count++
      ) {
        if (isNativeError(subError.cause)) {
          if (count === 0) {
            if (!subError.cause.cause) {
              break;
            }

            context.log.error([IF_NOT_QUIETED], '❌ Causal stack:');
          }

          context.log.error(
            [IF_NOT_QUIETED],
            `${TAB}⮕  ${subError.cause instanceof TaskError ? toFirstLowerCase(subError.cause.message) : subError.cause.message}`
          );
          subError = subError.cause;
        } else {
          context.log.error([IF_NOT_QUIETED], `${TAB}⮕  ${String(subError.cause)}`);
          subError = undefined;
        }

        if (count + 1 >= MAX_LOG_ERROR_ENTRIES) {
          context.log.error([IF_NOT_QUIETED], `(remaining entries have been hidden)`);
        }
      }
    }
  }
};
