// ? Used in a comment for LogTag
import { type ExtendedLogger } from 'multiverse/rejoinder';

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
 * These color codes correspond to a reddish color on the console.
 * https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124?permalink_comment_id=4481079#gistcomment-4481079
 */
export const ansiRedColorCodes = [1, 9, 52, 88, 124, 160, 196];

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
