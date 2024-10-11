import { isAbsolute } from 'node:path';

import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';
import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { type RelativePath } from '#project-utils src/fs/common.ts';

import type { Promisable } from 'type-fest';

/**
 * @see {@link ensurePathIsRelative}
 */
export type EnsurePathIsRelativeOptions = {
  /**
   * The path in question.
   */
  path: string;
};

function ensurePathIsRelative_(
  shouldRunSynchronously: false,
  options: EnsurePathIsRelativeOptions
): Promise<RelativePath>;
function ensurePathIsRelative_(
  shouldRunSynchronously: true,
  options: EnsurePathIsRelativeOptions
): RelativePath;
function ensurePathIsRelative_(
  shouldRunSynchronously: boolean,
  { path }: EnsurePathIsRelativeOptions
): Promisable<RelativePath> {
  return shouldRunSynchronously
    ? throwIfNotRelative()
    : Promise.resolve().then(throwIfNotRelative);

  function throwIfNotRelative() {
    if (path && !isAbsolute(path)) {
      throw new ProjectError(ErrorMessage.PathIsNotRelative(path));
    }

    return path as RelativePath;
  }
}

/**
 * Rejects if the provided path is empty or not relative.
 */
export function ensurePathIsRelative(
  ...args: ParametersNoFirst<typeof ensurePathIsRelative_>
) {
  return ensurePathIsRelative_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ensurePathIsRelative {
  /**
   * Throws if the provided path is empty or not relative.
   */
  export const sync = function (...args) {
    return ensurePathIsRelative_(true, ...args);
  } as SyncVersionOf<typeof ensurePathIsRelative>;
}
