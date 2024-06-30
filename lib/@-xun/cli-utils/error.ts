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
  CommandDidNotComplete(command: string) {
    return `the "${command}" command did not complete`;
  },
  IgnoredArguments(args: string[]) {
    return `the following command arguments were ignored: ${args.join(', ')}`;
  },
  RequiresMinArgs(name: string, min: number, given: number) {
    return `${name} requires at least ${min} argument${min === 1 ? '' : 's'}, saw ${given}`;
  }
};
