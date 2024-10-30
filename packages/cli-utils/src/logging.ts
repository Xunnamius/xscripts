// ? Used in a comment for LogTag
import { type ExtendedLogger } from 'multiverse+rejoinder';

/**
 * Hard-coded maximum reporting depth of the causal stack when fatal errors
 * occur.
 */
export const MAX_LOG_ERROR_ENTRIES = 10;

/**
 * The success message commands should output when a command succeeds.
 */
export const standardSuccessMessage = '✅ Succeeded!';

/**
 * Well-known {@link ExtendedLogger} tags for filtering output automatically
 * depending on program state.
 */
export enum LogTag {
  IF_NOT_SILENCED = 'lens-cli:if-not-silenced',
  IF_NOT_QUIETED = 'lens-cli:if-not-quieted',
  IF_NOT_HUSHED = 'lens-cli:if-not-hushed'
}

/**
 * Prints a timestamp indicating the beginning of execution.
 */
export function logStartTime({
  log,
  startTime
}: {
  log: ExtendedLogger;
  startTime: Date;
}) {
  log(
    [LogTag.IF_NOT_HUSHED],
    'Execution began on',
    startTime.toLocaleDateString(),
    'at',
    startTime.toLocaleTimeString()
  );
}
