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
    return 'Assertion failed: cannot find suitable package.json file';
  },
  AssertionFailureBadPackageJson() {
    return 'Assertion failed: cannot load given package.json file';
  },
  AssertionFailureCannotUseDoubleFeature() {
    return 'Assertion failed: cannot use both special options features at once';
  },
  AssertionFailureUnequalDemandOptions() {
    return 'Assertion failed: special demandOptions array feature requires matching arrays';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
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
