import { ErrorMessage as UpstreamErrorMessage } from '@black-flag/core/util';
import { toSentenceCase } from 'universe/util';

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
  AssertionFailureMissingPackageJson() {
    return 'assertion failed: cannot find suitable package.json file';
  },
  AssertionFailureBadPackageJson() {
    return 'assertion failed: cannot load given package.json file';
  },
  AssertionFailureCannotUseDoubleFeature() {
    return 'assertion failed: cannot use both special options features at once';
  },
  AssertionFailureUnequalDemandOptions() {
    return 'assertion failed: special demandOptions array feature requires matching arrays';
  },
  AssertionFailureCannotBeCliAndNextJs() {
    return 'assertion failed: project must either provide a CLI or be a Next.js project';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
  },
  UnsupportedCommand() {
    return 'this project does not support this command';
  },
  DidNotProvideAtLeastOneOfSeveralOptions(givenOptions: Record<string, unknown>) {
    const possibleOptions = Object.keys(givenOptions);
    return `at least one of the following options must be provided: ${possibleOptions.join(', ')}`;
  },
  DidNotProvideExactlyOneOfSeveralOptions(givenOptions: Record<string, unknown>) {
    const possibleOptions = Object.keys(givenOptions);
    return `exactly one of the following options must be provided: ${possibleOptions.join(', ')}`;
  }
};
