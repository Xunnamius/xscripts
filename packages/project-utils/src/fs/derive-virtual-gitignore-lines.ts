import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import { createDebugLogger } from 'multiverse+rejoinder';
import { runNoRejectOnBadExit } from 'multiverse+run';

import { globalDebuggerNamespace } from 'rootverse+project-utils:src/constant.ts';
import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';
import { ensurePathIsAbsolute } from 'rootverse+project-utils:src/fs/ensure-path-is-absolute.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';
import { type ParametersNoFirst } from 'rootverse+project-utils:src/util.ts';

import type { Promisable } from 'type-fest';

const debug_ = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:fs:deriveVirtualGitignoreLines`
});

const alwaysIgnored = ['.git'];

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
      return alwaysIgnored.concat(
        readFileSync(`${projectRoot}/.gitignore`, 'utf8')
          .split('\n')
          .filter((entry) => entry && !entry.startsWith('#'))
      );
    } catch (error) {
      debug_.extend('deriveVirtualGitignoreLines').error(error);
      return alwaysIgnored;
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

            const unknownPaths = stdout
              .split('\n')
              .filter((l) => !alwaysIgnored.includes(l));

            ignore.push(...unknownPaths);
          }

          return alwaysIgnored.concat(ignore);
        })
        .catch((error: unknown) => {
          debug_.extend('deriveVirtualGitignoreLines').error(error);
          return alwaysIgnored;
        })
    );
  }
}

/**
 * Asynchronously return an array of the lines of a `.gitignore` file, or an
 * empty array if an error occurs. The string '.git' is prepended to the result.
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
   * Synchronously return an array of the lines of a `.gitignore` file, or an
   * empty array if an error occurs. The string '.git' is prepended to the
   * result.
   */
  export const sync = function (
    options: Omit<DeriveVirtualGitignoreLinesOptions, 'includeUnknownPaths'>
  ): Awaited<ReturnType<typeof deriveVirtualGitignoreLines>> {
    return deriveVirtualGitignoreLines_(true, options);
  };
}
