import { CliError, FrameworkExitCode } from '@black-flag/core';

import { ErrorMessage as UpstreamErrorMessage } from 'multiverse+bfe:error.ts';

import { toSentenceCase } from 'rootverse+cli-utils:src/util.ts';

/**
 * An `Error` class where the first letter of the message is capitalized.
 */
export class TaskError extends Error {
  constructor(...args: Required<ConstructorParameters<typeof Error>>) {
    super(toSentenceCase(args[0]), args[1]);
  }
}

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  GuruMeditation() {
    return 'an impossible scenario occurred';
  },
  UnsupportedCommand() {
    return 'this project does not support this command';
  },
  CommandDidNotComplete(command: string) {
    return `the "${command}" command did not complete`;
  },
  IgnoredArguments(args: string[]) {
    return `the following command arguments were ignored: ${args.join(', ')}`;
  },
  RequiresMinArgs(name: string, min: number, given?: number, adjective?: string) {
    return `${name} requires at least ${min} ${adjective ? `${adjective} ` : ''}argument${min === 1 ? '' : 's'}${given ? `, saw ${given}` : ''}`;
  }
};

/**
 * Throw a {@link CliError} with the given string message, which
 * causes Black Flag to exit with the {@link FrameworkExitCode.DefaultError}
 * status code.
 *
 * Use this function to assert end user error.
 */
export function softAssert(message: string): never;
/**
 * If `value` is falsy, throw a {@link CliError} with the given string message,
 * which causes Black Flag to exit with the
 * {@link FrameworkExitCode.DefaultError} status code.
 *
 * Use this function to assert end user error.
 */
export function softAssert(value: unknown, message: string): asserts value;
export function softAssert(
  valueOrMessage: unknown,
  message?: string
): asserts valueOrMessage {
  let shouldThrow = true;

  if (typeof message === 'string') {
    const value = valueOrMessage;
    shouldThrow = !value;
  } else {
    message = String(valueOrMessage);
  }

  if (shouldThrow) {
    throw new CliError(message, { suggestedExitCode: FrameworkExitCode.DefaultError });
  }
}

/**
 * Throw a so-called "FrameworkError" with the given string message, which
 * causes Black Flag to exit with the {@link FrameworkExitCode.AssertionFailed}
 * status code.
 *
 * Use this function to throw developer errors that end users can do nothing
 * about.
 */
export function hardAssert(message: string): never;
/**
 * If `value` is falsy, throw a so-called "FrameworkError" with the given string
 * message, which causes Black Flag to exit with the
 * {@link FrameworkExitCode.AssertionFailed} status code.
 *
 * Use this function to assert developer errors that end users can do nothing
 * about.
 */
export function hardAssert(value: unknown, message: string): asserts value;
export function hardAssert(
  valueOrMessage: unknown,
  message?: string
): asserts valueOrMessage {
  let shouldThrow = true;

  if (typeof message === 'string') {
    const value = valueOrMessage;
    shouldThrow = !value;
  } else {
    message = String(valueOrMessage);
  }

  if (shouldThrow) {
    throw new CliError(UpstreamErrorMessage.FrameworkError(message), {
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}
