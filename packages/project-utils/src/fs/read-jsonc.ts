/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import * as JSONC from 'jsonc-parser';

import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import { ensurePathIsAbsolute } from 'rootverse+project-utils:src/fs/ensure-path-is-absolute.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';
import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { JsonValue, Promisable } from 'type-fest';

export { JSONC };

/**
 * @see {@link readJsonc}
 */
export type ReadJsoncOptions = {
  /**
   * The absolute path to a JSONC file.
   */
  path: AbsolutePath;
  /**
   * If `true`, so long as the `parse` function does not throw, this function
   * will return the result. Note that this could result in an incomplete or
   * corrupted (but syntactically sound) object.
   *
   * @default false
   */
  ignoreNonExceptionErrors?: boolean;
  parseOptions?: Parameters<typeof JSONC.parse>[2];
};

function readJsonc_<T>(
  shouldRunSynchronously: false,
  { path, ignoreNonExceptionErrors, parseOptions }: ReadJsoncOptions
): Promise<T>;
function readJsonc_<T>(
  shouldRunSynchronously: true,
  { path, ignoreNonExceptionErrors, parseOptions }: ReadJsoncOptions
): T;
function readJsonc_<T>(
  shouldRunSynchronously: boolean,
  { path, ignoreNonExceptionErrors, parseOptions }: ReadJsoncOptions
): Promisable<T> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path });

    const rawJson = (() => {
      try {
        return readFileSync(path, 'utf8');
      } catch (error) {
        throw new ProjectError(ErrorMessage.NotReadable(path), { cause: error });
      }
    })();

    return parse(rawJson);
  } else {
    return ensurePathIsAbsolute({ path }).then(() =>
      readFileAsync(path, 'utf8').then(
        (rawJson) => {
          return parse(rawJson);
        },
        (error: unknown) => {
          throw new ProjectError(ErrorMessage.NotReadable(path), { cause: error });
        }
      )
    );
  }

  function parse(rawJson: string): T {
    try {
      const errors: JSONC.ParseError[] = [];
      const result = JSONC.parse(rawJson, errors, parseOptions);

      if (!ignoreNonExceptionErrors && errors.length) {
        throw new Error('JSONC.parse returned with errors: ' + errors.join('; '));
      }

      return result;
    } catch (error) {
      throw new ProjectError(ErrorMessage.NotParsable(path, 'jsonc'), { cause: error });
    }
  }
}

/**
 * Asynchronously read in and parse the contents of an arbitrary JSONC file.
 */
export function readJsonc<T = JsonValue>(...args: ParametersNoFirst<typeof readJsonc_>) {
  return readJsonc_<T>(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readJsonc {
  /**
   * Synchronously read in and parse the contents of an arbitrary JSONC file.
   */
  export const sync = function <T = JsonValue>(
    ...args: ParametersNoFirst<typeof readJsonc_>
  ) {
    return readJsonc_<T>(true, ...args);
  } as SyncVersionOf<typeof readJsonc>;
}
