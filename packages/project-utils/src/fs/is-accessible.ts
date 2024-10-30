import { accessSync } from 'node:fs';
import { access as accessAsync, constants as fsConstants_ } from 'node:fs/promises';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link fsConstants_}
 */
export const fsConstants = fsConstants_;

/**
 * @see {@link isAccessible}
 */
export type IsAccessibleOptions = {
  /**
   * The path to perform an access check against.
   */
  path: string;
  /**
   * The type of access check to perform. Defaults to `fs.constants.R_OK`.
   *
   * @see {@link fs.constants}
   */
  fsConstant?: number;
};

function isAccessible_(
  shouldRunSynchronously: false,
  options: IsAccessibleOptions
): Promise<boolean>;
function isAccessible_(
  shouldRunSynchronously: true,
  options: IsAccessibleOptions
): boolean;
function isAccessible_(
  shouldRunSynchronously: boolean,
  { path, fsConstant = fsConstants.R_OK }: IsAccessibleOptions
): Promisable<boolean> {
  if (shouldRunSynchronously) {
    try {
      accessSync(path, fsConstant);
      return true;
    } catch {
      return false;
    }
  } else {
    return accessAsync(path, fsConstant).then(
      () => true,
      () => false
    );
  }
}

/**
 * Sugar for asynchronous `access(path, fsConstant)` that returns `true` or
 * `false` rather than rejecting or resolving to `undefined`.
 */
export function isAccessible(...args: ParametersNoFirst<typeof isAccessible_>) {
  return isAccessible_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace isAccessible {
  /**
   * Sugar for the synchronous `access(path, fsConstant)` that returns `true` or
   * `false` rather than throwing or returning `void`.
   */
  export const sync = function (...args) {
    return isAccessible_(true, ...args);
  } as SyncVersionOf<typeof isAccessible>;
}
