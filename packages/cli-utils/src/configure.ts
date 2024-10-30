import { isNativeError } from 'node:util/types';

import {
  createListrManager,
  TAB,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse+rejoinder';

import { TaskError } from 'rootverse+cli-utils:src/error.ts';
import { type StandardExecutionContext } from 'rootverse+cli-utils:src/extensions.ts';
import { LogTag, MAX_LOG_ERROR_ENTRIES } from 'rootverse+cli-utils:src/logging.ts';
import { toFirstLowerCase, toSentenceCase } from 'rootverse+cli-utils:src/util.ts';

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
            if (pushMessageIfFinal(causalStack, subError, previousMessage)) {
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
            shouldBreak = pushMessageIfFinal(causalStack, subError, previousMessage);
          }

          if (shouldBreak) {
            break;
          }
        }

        if (causalStack.length) {
          context.log.newline([IF_NOT_QUIETED], 'alternate');
          context.log.error([IF_NOT_QUIETED], '❌ Causal stack:');
          causalStack.forEach((item) => {
            context.log.error([IF_NOT_QUIETED], item);
          });
        }
      }

      if (
        context.taskManager &&
        !context.state.isHushed &&
        context.taskManager.errors.length > 0
      ) {
        context.log.newline([IF_NOT_HUSHED], 'alternate');
        context.log.error([IF_NOT_HUSHED], '❌ Fatal task errors:');

        const { ListrErrorTypes } = await import('listr2');

        for (const taskError of context.taskManager.errors) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
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

/**
 * Returns `true` if the message is final (and loop should break). Returns
 * `false` otherwise.
 */
function pushMessageIfFinal(
  causalStack: string[],
  subError: Error,
  previousMessage: string
): boolean {
  // ? If the next message isn't an Error, it will be the final message
  if (subError.cause && !isNativeError(subError.cause)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const finalMessage = String(subError.cause);
    if (finalMessage !== previousMessage) {
      causalStack.push(`${TAB}⮕  ${finalMessage}`);
    }

    return true;
  }

  return false;
}
