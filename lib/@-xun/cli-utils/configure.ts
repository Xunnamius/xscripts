import { isNativeError } from 'node:util/types';

import { ListrErrorTypes } from 'listr2';

import {
  createListrManager,
  TAB,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse/rejoinder';

import { TaskError } from './error';
import { type StandardExecutionContext } from './index';
import { LogTag, MAX_LOG_ERROR_ENTRIES } from './logging';
import { toFirstLowerCase, toSentenceCase } from './util';

import type {
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext
} from '@black-flag/core';

const { IF_NOT_SILENCED, IF_NOT_QUIETED, IF_NOT_HUSHED } = LogTag;

export function makeStandardConfigureExecutionContext({
  rootDebugLogger,
  rootGenericLogger,
  withListr2Support = false
}: {
  rootGenericLogger: ExtendedLogger;
  rootDebugLogger: ExtendedDebugger;
  withListr2Support?: boolean;
}): ConfigureExecutionContext {
  return function (context) {
    return {
      ...context,
      log: rootGenericLogger,
      debug_: rootDebugLogger,
      ...(withListr2Support ? { taskManager: createListrManager() } : {}),
      state: {
        ...context.state,
        isSilenced: false,
        isQuieted: false,
        isHushed: false,
        startTime: new Date()
      }
    };
  };
}

export function makeStandardConfigureErrorHandlingEpilogue(): ConfigureErrorHandlingEpilogue<StandardExecutionContext> {
  return async function (
    ...[{ message, error }, _argv, context]: Parameters<
      ConfigureErrorHandlingEpilogue<StandardExecutionContext>
    >
  ) {
    // ? Pretty print error output depending on how silent we're supposed to be
    if (!context.state.isSilenced) {
      if (context.state.didOutputHelpOrVersionText) {
        context.log.newline([IF_NOT_SILENCED], 'alternate');
      }

      if (message) {
        context.log.error(
          [IF_NOT_SILENCED],
          `❌ Execution failed: ${toFirstLowerCase(message)}`
        );
      }

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

      if (
        context.taskManager &&
        !context.state.isHushed &&
        context.taskManager.errors.length > 0
      ) {
        context.log.newline([IF_NOT_HUSHED]);
        context.log.error([IF_NOT_HUSHED], '❌ Fatal task errors:');

        for (const taskError of context.taskManager.errors) {
          if (taskError.type !== ListrErrorTypes.HAS_FAILED_WITHOUT_ERROR) {
            context.log.error(
              [IF_NOT_HUSHED],
              `${TAB}❗ ${toSentenceCase(taskError.message)}`
            );
          }
        }
      }
    }
  };
}
