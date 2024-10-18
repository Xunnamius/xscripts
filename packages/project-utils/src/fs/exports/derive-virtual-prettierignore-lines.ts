import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { createDebugLogger } from 'multiverse#rejoinder';
import { runNoRejectOnBadExit } from 'multiverse#run';

import { globalDebuggerNamespace } from '#project-utils src/constant.ts';
import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { ensurePathIsAbsolute } from '#project-utils src/fs/exports/ensure-path-is-absolute.ts';
import { type AbsolutePath } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

const debug_ = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:fs:deriveVirtualPrettierignoreLines`
});

export type DeriveVirtualPrettierignoreLinesOptions = {
  /**
   * The absolute path to the root directory of a project.
   */
  projectRoot: AbsolutePath;
  /**
   * If `true`, include any paths unknown to git.
   *
   * @default false
   */
  includeUnknownPaths?: boolean;
};

function deriveVirtualPrettierignoreLines_(
  shouldRunSynchronously: false,
  options: DeriveVirtualPrettierignoreLinesOptions
): Promise<string[]>;
function deriveVirtualPrettierignoreLines_(
  shouldRunSynchronously: true,
  options: DeriveVirtualPrettierignoreLinesOptions
): string[];
function deriveVirtualPrettierignoreLines_(
  shouldRunSynchronously: boolean,
  { projectRoot, includeUnknownPaths = false }: DeriveVirtualPrettierignoreLinesOptions
): Promisable<string[]> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path: projectRoot });

    if (includeUnknownPaths) {
      throw new ProjectError(ErrorMessage.DeriverAsyncConfigurationConflict());
    }

    try {
      return readFileSync(`${projectRoot}/.prettierignore`, 'utf8')
        .split('\n')
        .filter((entry) => entry && !entry.startsWith('#'));
    } catch (error) {
      debug_.extend('deriveVirtualPrettierignoreLines').error(error);
      return [];
    }
  } else {
    return ensurePathIsAbsolute({ path: projectRoot }).then(() =>
      readFileAsync(`${projectRoot}/.prettierignore`, 'utf8')
        .then(async (content) => {
          const ignore = content
            .split('\n')
            .filter((entry) => entry && !entry.startsWith('#'));

          if (includeUnknownPaths) {
            const { stdout } = await runNoRejectOnBadExit('git', [
              'ls-files',
              '--others',
              '--directory'
            ]);

            const unknownPaths = stdout.split('\n');
            ignore.push(...unknownPaths);
          }

          return ignore;
        })
        .catch((error: unknown) => {
          debug_.extend('deriveVirtualPrettierignoreLines').error(error);
          return [];
        })
    );
  }
}

/**
 * Asynchronously return an array of the lines of a `.prettierignore` file, or
 * an empty array if an error occurs.
 *
 * You can optionally include paths unknown to git as well via
 * `includeUnknownPaths`.
 */
export function deriveVirtualPrettierignoreLines(
  ...args: ParametersNoFirst<typeof deriveVirtualPrettierignoreLines_>
) {
  return deriveVirtualPrettierignoreLines_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace deriveVirtualPrettierignoreLines {
  /**
   * Synchronously return an array of the lines of a `.prettierignore` file, or
   * an empty array if an error occurs.
   */
  export const sync = function (
    options: Omit<DeriveVirtualPrettierignoreLinesOptions, 'includeUnknownPaths'>
  ): Awaited<ReturnType<typeof deriveVirtualPrettierignoreLines>> {
    return deriveVirtualPrettierignoreLines_(true, options);
  };
}
