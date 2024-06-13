import { ErrorMessage as UpstreamErrorMessage } from '@black-flag/core/util';
import { toSentenceCase } from './util';

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
  ...UpstreamErrorMessage,
  DemandedXorViolation(firstArgument: string, secondArgument: string) {
    // TODO:
    return `cannot provide both "${firstArgument}" and "${secondArgument}" arguments`;
  },
  // TODO: rename the next two to match the above
  DidNotProvideAtLeastOneOfSeveralOptions(givenOptions: Record<string, unknown>) {
    const possibleOptions = Object.keys(givenOptions);
    return `at least one of the following options must be provided: ${possibleOptions.join(', ')}`;
  },
  DidNotProvideExactlyOneOfSeveralOptions(givenOptions: Record<string, unknown>) {
    const possibleOptions = Object.keys(givenOptions);
    return `exactly one of the following options must be provided: ${possibleOptions.join(', ')}`;
  },
  UnsupportedCommand() {
    return 'this project does not support this command';
  },
  IgnoredArguments(args: string[]) {
    return `the following command arguments were ignored: ${args.join(', ')}`;
  }
};
