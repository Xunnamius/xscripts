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
  cache: {
    /**
     * The project's Markdown files.
     */
    mdFiles: [] as string[],
    /**
     * The project's relevant package.json files.
     */
    pkgFiles: {
      /**
       * The project's root package.json file.
       */
      root: '' as string,
      /**
       * Each workspace package.json file in the project.
       */
      workspaces: [] as string[],
      /**
       * Each lib sub-project's package.json file.
       */
      lib: [] as string[]
    },
    /**
     * The project's relevant TypeScript files.
     */
    tsFiles: {
      /**
       * TypeScript files under root `lib/`.
       */
      lib: [] as string[],
      /**
       * TypeScript files under any `src/` directory or subdirectory relative to
       * the current working directory.
       */
      src: [] as string[]
    }
  }
};

/**
 * Returns an array of various different file paths (strings):
 *
 * - **`pkgFiles`** - `package.json` files at root or belonging to workspaces or
 *   belonging to lib
 * - **`mdFiles`** - Markdown files not ignored by `.prettierignore`
 * - **`tsFiles`** - TypeScript (.ts, .tsx) files under any relative `src/`
 *   directory or under the root `lib/` directory
 */
export async function findProjectFiles(useCached = true) {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:findProjectFiles`
  });

  if (useCached && projectFileCache.cached) {
    debug('reusing cached resources: %O', projectFileCache.cache);
    return projectFileCache.cache;
  }

  const {
    project: { root, packages }
  } = getRunContext();

  const ignore = (await readFile(`${root}/.prettierignore`)).split(`\n`).filter(Boolean);

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const [mdFiles, tsRootLibFiles, tsSrcFiles, libPkgDirs] = await Promise.all([
    glob('**/*.md', { ignore, dot: true }),
    glob(`${root}/lib/**/*.ts?(x)`, { ignore: [], dot: true, absolute: true }),
    glob('src/**/*.ts?(x)', { ignore: [], dot: true }),
    glob([`${root}/lib/!(@*)/`, `${root}/lib/@*/*/`], { ignore: [], absolute: true })
  ]);

  const pkgFiles = {
    root: `${root}/package.json`,
    workspaces: packages
      ? Array.from(packages.values()).map((pkg) => `${pkg.root}/package.json`)
      : [],
    lib: libPkgDirs.map((path) => `${path}package.json`)
  };

  debug('mdFiles: %O', mdFiles);
  debug('tsRootLibFiles: %O', tsRootLibFiles);
  debug('tsSrcFiles: %O', tsSrcFiles);
  debug('libPkgDirs: %O', libPkgDirs);
  debug('pkgFiles: %O', pkgFiles);

  await Promise.all(
    pkgFiles.lib.map(async (path) => {
      if (!(await isAccessible(path))) {
        throw new CliError(ErrorMessage.CannotReadFile(path));
      }
    })
  );

  const tsFiles = { lib: tsRootLibFiles, src: tsSrcFiles };
  const result = { mdFiles, pkgFiles, tsFiles };

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
export enum ProjectMetaAttribute {
  Next = 'next',
  Cli = 'cli',
  Webpack = 'webpack',
  Vercel = 'vercel'
}

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
    attributes.push(ProjectMetaAttribute.Next);
  }

  if (await isAccessible(wellKnownCliDistPath, fsConstants.R_OK | fsConstants.X_OK)) {
    isCliProject = true;
    attributes.push(ProjectMetaAttribute.Cli);
  }

  if (await isAccessible('webpack.config.js', fsConstants.R_OK)) {
    attributes.push(ProjectMetaAttribute.Webpack);
  }

  if (
    (await isAccessible('vercel.json', fsConstants.R_OK)) ||
    (await isAccessible('.vercel/project.json', fsConstants.R_OK))
  ) {
    attributes.push(ProjectMetaAttribute.Vercel);
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
