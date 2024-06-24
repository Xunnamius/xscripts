import { ErrorMessage as UpstreamErrorMessage } from '@black-flag/core/util';

import { $exists } from './symbols';

import type { Entries } from 'type-fest';

export type KeyValueEntries = Entries<{ [x: string]: unknown }>;
export type KeyValueEntry = KeyValueEntries[number];

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  IllegalHandlerInvocation() {
    return 'withHandlerExtensions::handler was invoked too soon: options analysis unavailable';
  },
  MetadataInvariantViolated(afflictedKey: string) {
    return `an impossible state was detected while analyzing configuration for key: ${afflictedKey}`;
  },
  UnexpectedlyFalsyDetailedArguments() {
    return 'a Black Flag instance is somehow missing its detailed parse result. This is likely the result of an incompatibility between Black Flag and whatever version of Yargs is installed. Please report this!';
  },
  RequiresViolation(requirer: string, missingRequiredKeyValues: KeyValueEntries) {
    return `the following arguments must be given alongside "${requirer}":${keyValuesToString(missingRequiredKeyValues)}`;
  },
  ConflictsViolation(conflicter: string, seenConflictingKeyValues: KeyValueEntries) {
    return `the following arguments cannot be given alongside "${conflicter}":${keyValuesToString(seenConflictingKeyValues)}`;
  },
  ImpliesViolation(implier: string, seenConflictingKeyValues: KeyValueEntries) {
    return `the following arguments as given conflict with the implications of "${implier}":${keyValuesToString(seenConflictingKeyValues)}`;
  },
  DemandIfViolation(demanded: string, demander: KeyValueEntry) {
    return `the argument "${demanded}" must be given whenever the following is given: ${keyValuesToString([demander])}`;
  },
  DemandOrViolation(demanded: KeyValueEntries) {
    return `at least one of the following arguments must be given:${keyValuesToString(demanded)}`;
  },
  DemandGenericXorViolation(demanded: KeyValueEntries) {
    return `exactly one of the following arguments must be given:${keyValuesToString(demanded)}`;
  },
  DemandSpecificXorViolation(
    firstArgument: KeyValueEntry,
    secondArgument: KeyValueEntry
  ) {
    return ErrorMessage.DemandGenericXorViolation([firstArgument, secondArgument]);
  },
  CheckFailed(currentArgument: string) {
    return `check failed for argument "${currentArgument}"`;
  }
};

function keyValuesToString(keyValueEntries: KeyValueEntries) {
  // eslint-disable-next-line unicorn/no-array-reduce
  return keyValueEntries.reduce((str, keyValueEntry) => {
    return `${str}\n⮞  ${keyValueToString(keyValueEntry)}`;
  }, '\n');
}

function keyValueToString(keyValueEntry: KeyValueEntry) {
  const [key, value] = keyValueEntry;
  const stringifiedValue = (() => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  })();

  return (
    (typeof key !== 'string' || key.length === 1 ? '-' : '--') +
    (value === $exists ? key : `${key}=${stringifiedValue}`)
  );
}
