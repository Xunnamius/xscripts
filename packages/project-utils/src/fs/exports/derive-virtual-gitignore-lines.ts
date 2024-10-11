import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { createDebugLogger } from 'multiverse#rejoinder';
import { runNoRejectOnBadExit } from 'multiverse#run';

import { type ParametersNoFirst } from '#project-utils src/util.ts';
import { ErrorMessage, ProjectError } from '#project-utils src/error.ts';
import { globalDebuggerNamespace } from '#project-utils src/constant.ts';
import { type AbsolutePath } from '#project-utils src/fs/index.ts';
import { ensurePathIsAbsolute } from '#project-utils src/fs/exports/ensure-path-is-absolute.ts';

import type { Promisable } from 'type-fest';

const debug_ = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:fs:deriveVirtualGitignoreLines`
});

export type DeriveVirtualGitignoreLinesOptions = {
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

function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: false,
  options: DeriveVirtualGitignoreLinesOptions
): Promise<string[]>;
function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: true,
  options: DeriveVirtualGitignoreLinesOptions
): string[];
function deriveVirtualGitignoreLines_(
  shouldRunSynchronously: boolean,
  { projectRoot, includeUnknownPaths = false }: DeriveVirtualGitignoreLinesOptions
): Promisable<string[]> {
  if (shouldRunSynchronously) {
    ensurePathIsAbsolute.sync({ path: projectRoot });

    if (includeUnknownPaths) {
      throw new ProjectError(ErrorMessage.DeriverAsyncConfigurationConflict());
    }

    try {
      return readFileSync(`${projectRoot}/.gitignore`, 'utf8')
        .split('\n')
        .filter((entry) => entry && !entry.startsWith('#'));
    } catch (error) {
      debug_.extend('deriveVirtualGitignoreLines').error(error);
      return [];
    }
  } else {
    return ensurePathIsAbsolute({ path: projectRoot }).then(() =>
      readFileAsync(`${projectRoot}/.gitignore`, 'utf8')
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
          debug_.extend('deriveVirtualGitignoreLines').error(error);
          return [];
        })
    );
  }
}

/**
 * Asynchronously return an array of the lines of a `.gitignore` file, or an
 * empty array if an error occurs.
 *
 * You can optionally include paths unknown to git as well via
 * `includeUnknownPaths`.
 */
export function deriveVirtualGitignoreLines(
  ...args: ParametersNoFirst<typeof deriveVirtualGitignoreLines_>
) {
  return deriveVirtualGitignoreLines_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace deriveVirtualGitignoreLines {
  /**
   * Synchronously return an array of the lines of a `.gitignore` file, or
   * an empty array if an error occurs.
   */
  export const sync = function (
    options: Omit<DeriveVirtualGitignoreLinesOptions, 'includeUnknownPaths'>
  ): Awaited<ReturnType<typeof deriveVirtualGitignoreLines>> {
    return deriveVirtualGitignoreLines_(true, options);
  };
}
