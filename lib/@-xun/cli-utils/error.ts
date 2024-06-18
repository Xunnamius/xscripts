import { ErrorMessage as UpstreamErrorMessage } from 'multiverse/@black-flag/extensions/error';
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
  UnsupportedCommand() {
    return 'this project does not support this command';
  },
  IgnoredArguments(args: string[]) {
    return `the following command arguments were ignored: ${args.join(', ')}`;
  }
};
