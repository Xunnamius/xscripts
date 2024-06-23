import { isNativeError } from 'node:util/types';

import { ListrErrorTypes } from 'listr2';

import {
  createListrManager,
  TAB,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse/rejoinder';

import { TaskError } from './error';
import { type StandardExecutionContext } from './extensions';
import { LogTag, MAX_LOG_ERROR_ENTRIES } from './logging';
import { toFirstLowerCase, toSentenceCase } from './util';

import type {
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext
} from '@black-flag/core';

const { IF_NOT_SILENCED, IF_NOT_QUIETED, IF_NOT_HUSHED } = LogTag;

/**
 * Returns a {@link ConfigureExecutionContext} instance considered standard
 * across [Xunnamius](https://github.com/Xunnamius)'s CLI projects.
 */
export function makeStandardConfigureExecutionContext({
  rootDebugLogger,
  rootGenericLogger,
  withListr2Support = false
}: {
  /**
   * The generic logging function used whenever the CLI wants to send text to
   * stdout.
   */
  rootGenericLogger: ExtendedLogger;
  /**
   * The generic logging function used whenever the CLI wants to send text to
   * stderr.
   */
  rootDebugLogger: ExtendedDebugger;
  /**
   * If `true`, support for Listr2 tasks will be enabled for this program.
   *
   * @default false
   */
  withListr2Support?: boolean;
}): ConfigureExecutionContext<StandardExecutionContext> {
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
    } as StandardExecutionContext;
  };
}

/**
 * Returns a {@link ConfigureErrorHandlingEpilogue} instance considered standard
 * across [Xunnamius](https://github.com/Xunnamius)'s CLI projects.
 */
export function makeStandardConfigureErrorHandlingEpilogue(): ConfigureErrorHandlingEpilogue<StandardExecutionContext> {
  return async function (
    ...[{ message, error }, _argv, context]: Parameters<
      ConfigureErrorHandlingEpilogue<StandardExecutionContext>
    >
  ) {
    // ? Pretty print error output depending on how silent we're supposed to be
    if (message && !context.state.isSilenced) {
      if (context.state.didOutputHelpOrVersionText) {
        context.log.newline([IF_NOT_SILENCED], 'alternate');
      }

      context.log.error(
        [IF_NOT_SILENCED],
        `❌ Execution failed: ${toFirstLowerCase(message)}`
      );

      if (!context.state.isQuieted && isNativeError(error)) {
        const causalStack: string[] = [];

        for (
          let previousMessage = message, subError: Error | undefined = error;
          subError && causalStack.length < MAX_LOG_ERROR_ENTRIES;
          subError = isNativeError(subError.cause) ? subError.cause : undefined
        ) {
          const currentMessage = subError.message;

          // ? Do not output duplicate messages
          if (currentMessage === previousMessage) {
            if (pushMessageIfFinal(causalStack, subError)) {
              break;
            } else {
              continue;
            }
          }

          previousMessage = currentMessage;

          // ? Push the current message onto the causal stack
          causalStack.push(
            `${TAB}⮕  ${subError instanceof TaskError ? toFirstLowerCase(currentMessage) : currentMessage}`
          );

          let shouldBreak = false;

          // ? If we're over max count, indicate messages clipped
          if (causalStack.length >= MAX_LOG_ERROR_ENTRIES) {
            causalStack.push('(remaining entries have been hidden)');
            shouldBreak = true;
          } else {
            // ? If the next message isn't an Error, it'll be the final message
            shouldBreak = pushMessageIfFinal(causalStack, subError);
          }

          if (shouldBreak) {
            break;
          }
        }

        if (causalStack.length) {
          context.log.newline([IF_NOT_QUIETED], 'alternate');
          context.log.error([IF_NOT_QUIETED], '❌ Causal stack:');
          causalStack.forEach((item) => context.log.error([IF_NOT_QUIETED], item));
        }
      }

      if (
        context.taskManager &&
        !context.state.isHushed &&
        context.taskManager.errors.length > 0
      ) {
        context.log.newline([IF_NOT_HUSHED], 'alternate');
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

    /**
     * Returns `true` if the message is final (and loop should break). Returns
     * `false` otherwise.
     */
    function pushMessageIfFinal(causalStack: string[], subError: Error): boolean {
      // ? If the next message isn't an Error, it will be the final message
      if (subError.cause && !isNativeError(subError.cause)) {
        causalStack.push(`${TAB}⮕  ${String(subError.cause)}`);
        return true;
      }

      return false;
    }
  };
}
