import assert from 'node:assert';
import { promises as fs } from 'node:fs';

import { CliError, FrameworkExitCode } from '@black-flag/core';
import { getRunContext } from '@projector-js/core/project';
import { glob } from 'glob-gitignore';

import { globalLoggerNamespace, wellKnownCliDistPath } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import { createDebugLogger } from 'multiverse/rejoinder';

export async function readFile(path: string) {
  try {
    return await fs.readFile(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(new Error(ErrorMessage.CannotReadFile(path), { cause: error }), {
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

const projectFileCache = {
  cached: false,
  cache: { mdFiles: [] as string[], pkgFiles: [] as string[] }
};

/**
 * Returns an array of various different file paths (strings):
 *
 * - **`pkgFiles`** - `package.json` files at root or belonging to workspaces
 * - **`mdFiles`** - Markdown files not ignored by `.prettierignore`
 */
export async function findProjectFiles(useCached = true) {
  if (useCached && projectFileCache.cached) {
    return projectFileCache.cache;
  }

  const {
    project: { root, packages }
  } = getRunContext();

  const mdFiles = await glob('**/*.md', {
    ignore: (await readFile(`${root}/.prettierignore`)).split(`\n`).filter(Boolean),
    dot: true
  });

  const pkgFiles = [`${root}/package.json`].concat(
    packages ? Array.from(packages.values()).map((pkg) => `${pkg.root}/package.json`) : []
  );

  const result = { mdFiles, pkgFiles };

  if (useCached) {
    projectFileCache.cached = true;
    Object.assign(projectFileCache.cache, result);
  }

  return result;
}

/**
 * Sugar for `await access(path, fsConstants)` that returns `true` or `false`
 * rather than throwing or returning `void`.
 */
export async function isAccessible(
  /**
   * The path to perform an access check against.
   */
  path: string,
  /**
   * The type of access check to perform.
   *
   * @default fs.constants.R_OK
   * @see {@link fs.constants}
   */
  fsConstants = fs.constants.R_OK
) {
  return fs.access(path, fsConstants).then(
    () => true,
    () => false
  );
}

/**
 * Metadata attributes that describe the capabilities and scope of a project.
 */
export type ProjectMetaAttribute = 'next' | 'cli' | 'webpack' | 'vercel';

/**
 * Metadata about the current project.
 */
export type ProjectMetadata = {
  attributes: ProjectMetaAttribute[];
};

/**
 * Sugar for `(await import('node:fs)).promises.constants`.
 */
export const fsConstants = fs.constants;

// TODO: probably want to merge this into @projector-js/core's project metadata
// TODO: package
/**
 * Return metadata about the current project.
 */
export async function getProjectMetadata(): Promise<ProjectMetadata> {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:getProjectMetadata`
  });

  const attributes: ProjectMetaAttribute[] = [];
  let isNextProject = false;
  let isCliProject = false;

  if (await isAccessible('next.config.js')) {
    isNextProject = true;
    attributes.push('next');
  }

  if (await isAccessible(wellKnownCliDistPath, fsConstants.R_OK | fsConstants.X_OK)) {
    isCliProject = true;
    attributes.push('cli');
  }

  if (await isAccessible('webpack.config.js', fsConstants.R_OK)) {
    attributes.push('webpack');
  }

  if (
    (await isAccessible('vercel.json', fsConstants.R_OK)) ||
    (await isAccessible('.vercel/project.json', fsConstants.R_OK))
  ) {
    attributes.push('vercel');
  }

  assert(!(isNextProject && isCliProject), ErrorMessage.CannotBeCliAndNextJs());

  const metadata: ProjectMetadata = { attributes };
  debug('project metadata: %O', metadata);

  return metadata;
}

export function hasExitCode(error: unknown): error is object & { exitCode: number } {
  return !!(
    error &&
    typeof error === 'object' &&
    'exitCode' in error &&
    typeof error.exitCode === 'number'
  );
}
