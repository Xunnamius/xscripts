// ? Used in the comment for $artificiallyInvoked
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { getInvocableExtendedHandler } from './index';

/**
 * Represents any value for the given argument.
 */
export const $exists = Symbol('exists');

/**
 * Represents the name of the argument that is the originator of a configuration
 * check.
 */
export const $genesis = Symbol('genesis');

/**
 * Represents the canonical form of an implication (i.e. excluding expansions,
 * aliases, etc).
 */
export const $canonical = Symbol('genesis');

/**
 * Will appear in the `argv` of commands that were invoked via
 * {@link getInvocableExtendedHandler} instead of naturally via Black Flag.
 */
export const $artificiallyInvoked = Symbol('was-artificially-invoked');
