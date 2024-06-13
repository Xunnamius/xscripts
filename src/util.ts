import assert from 'node:assert';
import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';

import { globalLoggerNamespace, wellKnownCliDistPath } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import { createDebugLogger } from 'multiverse/rejoinder';

/**
 * Safely imports the nearest package.json file without using `require` or
 * `import`.
 */
export async function findProjectRoot(): Promise<string> {
  const pkgJsonPath = await (await import('pkg-up')).pkgUp();
  assert(pkgJsonPath, ErrorMessage.AssertionFailureMissingPackageJson());
  return dirname(pkgJsonPath);
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

  assert(
    !(isNextProject && isCliProject),
    ErrorMessage.AssertionFailureCannotBeCliAndNextJs()
  );

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
