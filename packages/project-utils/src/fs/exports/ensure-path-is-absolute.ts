import { isAbsolute } from 'node:path';

import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';
import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { type AbsolutePath } from '#project-utils src/fs/common.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link ensurePathIsAbsolute}
 */
export type EnsurePathIsAbsoluteOptions = {
  /**
   * The path in question.
   */
  path: string;
};

function ensurePathIsAbsolute_(
  shouldRunSynchronously: false,
  options: EnsurePathIsAbsoluteOptions
): Promise<AbsolutePath>;
function ensurePathIsAbsolute_(
  shouldRunSynchronously: true,
  options: EnsurePathIsAbsoluteOptions
): AbsolutePath;
function ensurePathIsAbsolute_(
  shouldRunSynchronously: boolean,
  { path }: EnsurePathIsAbsoluteOptions
): Promisable<AbsolutePath> {
  return shouldRunSynchronously
    ? throwIfNotAbsolute()
    : Promise.resolve().then(throwIfNotAbsolute);

  function throwIfNotAbsolute() {
    if (!isAbsolute(path)) {
      throw new ProjectError(ErrorMessage.PathIsNotAbsolute(path));
    }

    return path as AbsolutePath;
  }
}

/**
 * Rejects if the provided path is not absolute.
 */
export function ensurePathIsAbsolute(
  ...args: ParametersNoFirst<typeof ensurePathIsAbsolute_>
) {
  return ensurePathIsAbsolute_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ensurePathIsAbsolute {
  /**
   * Throws if the provided path is not absolute.
   */
  export const sync = function (...args) {
    return ensurePathIsAbsolute_(true, ...args);
  } as SyncVersionOf<typeof ensurePathIsAbsolute>;
}
