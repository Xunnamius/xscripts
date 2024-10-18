/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { ensurePathIsAbsolute } from '#project-utils src/fs/exports/ensure-path-is-absolute.ts';
import { type AbsolutePath } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { JsonValue, Promisable } from 'type-fest';

/**
 * @see {@link readJson}
 */
export type ReadJsonOptions = {
  /**
   * The absolute path to a JSON file.
   */
  path: AbsolutePath;
};

function readJson_<T>(
  shouldRunSynchronously: false,
  { path }: ReadJsonOptions
): Promise<T>;
function readJson_<T>(shouldRunSynchronously: true, { path }: ReadJsonOptions): T;
function readJson_<T>(
  shouldRunSynchronously: boolean,
  { path }: ReadJsonOptions
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
      return JSON.parse(rawJson);
    } catch (error) {
      throw new ProjectError(ErrorMessage.NotParsable(path), { cause: error });
    }
  }
}

/**
 * Asynchronously read in and parse the contents of an arbitrary JSON file.
 */
export function readJson<T = JsonValue>(...args: ParametersNoFirst<typeof readJson_>) {
  return readJson_<T>(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace readJson {
  /**
   * Synchronously read in and parse the contents of an arbitrary JSON file.
   */
  export const sync = function <T = JsonValue>(
    ...args: ParametersNoFirst<typeof readJson_>
  ) {
    return readJson_<T>(true, ...args);
  } as SyncVersionOf<typeof readJson>;
}
