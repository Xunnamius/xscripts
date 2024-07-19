/* eslint-disable unicorn/prevent-abbreviations */
import fs from 'node:fs/promises';

import { transformFileAsync } from '@babel/core';
import { CliError, FrameworkExitCode } from '@black-flag/core';
import { glob } from 'glob-gitignore';

import { globalLoggerNamespace } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import { softAssert } from 'multiverse/@-xun/cli-utils/error';
import { createDebugLogger } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';

import type { GlobalExecutionContext } from './configure';

export async function globalPreChecks({
  debug_,
  runtimeContext
}: Pick<GlobalExecutionContext, 'debug_' | 'runtimeContext'>) {
  const debug = debug_.extend('globalPreChecks');
  const cwd = process.cwd();

  const {
    project: { root },
    package: pkg
  } = runtimeContext;

  debug('project root: %O', root);
  debug('pkg root: %O', pkg?.root);
  debug('cwd (must match one of the above): %O', cwd);

  if (root !== cwd && (!pkg || pkg.root !== cwd)) {
    throw new CliError(ErrorMessage.CannotRunOutsideRoot());
  }
}

export async function readFile(path: string) {
  try {
    return await fs.readFile(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotReadFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function writeFile(path: string, contents: string) {
  try {
    return await fs.writeFile(path, contents);
  } catch (error) {
    throw new CliError(ErrorMessage.CannotWriteFile(path), {
      cause: error,
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
 * Return the first defined value in `package.json`'s `bin`, if there is one.
 */
export function findMainBinFile(
  runtimeContext: GlobalExecutionContext['runtimeContext']
) {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:findMainBinFile`
  });

  const {
    project: {
      json: { bin }
    }
  } = runtimeContext;

  const mainBinFile =
    typeof bin === 'string' ? bin : Object.values(bin || {}).find((path) => !!path);

  debug('mainBinFile: %O', mainBinFile);

  return mainBinFile;
}

/**
 * Returns an array of various different absolute file paths (strings):
 *
 * - **`pkgFiles`** - `package.json` files at root or belonging to workspaces or
 *   belonging to lib
 * - **`mdFiles`** - Markdown files not ignored by `.prettierignore`
 * - **`tsFiles`** - TypeScript (.ts, .tsx) files under any relative `src/`
 *   directory or under the root `lib/` directory
 */
export async function findProjectFiles(
  runtimeContext: GlobalExecutionContext['runtimeContext'],
  {
    useCached = true,
    skipIgnored = true,
    skipUnknown = false
  }: {
    /**
     * Use the internal cached result from a previous run, if available.
     */
    useCached?: boolean;
    /**
     * If `true`, do not consider `.prettierignore` when sifting through and
     * returning project files.
     */
    skipIgnored?: boolean;
    /**
     * Skip files unknown to git (even if already ignored by
     * `.gitignore`/`.prettierignore`).
     */
    skipUnknown?: boolean;
  } = {}
) {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:findProjectFiles`
  });

  if (useCached && projectFileCache.cached) {
    debug('reusing cached resources: %O', projectFileCache.cache);
    return projectFileCache.cache;
  }

  const {
    project: { root, packages }
  } = runtimeContext;

  const ignore = skipIgnored
    ? await deriveVirtualPrettierIgnoreLines(root, skipUnknown)
    : [];

  debug('virtual .prettierignore lines: %O', ignore);

  const [mdFiles, tsRootLibFiles, tsSrcFiles, libPkgDirs] = await Promise.all([
    glob('**/*.md', { ignore, dot: true, absolute: true, nodir: true }),
    glob(`${root}/lib/**/*.ts?(x)`, {
      ignore: [],
      dot: true,
      absolute: true,
      nodir: true
    }),
    glob('src/**/*.ts?(x)', { ignore: [], dot: true, absolute: true, nodir: true }),
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
   * The type of access check to perform. Defaults to `fs.constants.R_OK`.
   *
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
  Vercel = 'vercel',
  Cjs = 'cjs',
  Esm = 'esm'
}

/**
 * Metadata about the current project.
 */
export type ProjectMetadata = {
  attributes: ProjectMetaAttribute[];
};

/**
 * Sugar for `(await import('node:fs/promises')).constants`.
 */
export const fsConstants = fs.constants;

/**
 * Return metadata about the current project.
 */
export async function getProjectMetadata(
  runtimeContext: GlobalExecutionContext['runtimeContext']
): Promise<ProjectMetadata> {
  const debug = createDebugLogger({
    namespace: `${globalLoggerNamespace}:getProjectMetadata`
  });

  const { type = 'commonjs', bin } = runtimeContext.project.json;

  const attributes: ProjectMetaAttribute[] = [];

  if (await isAccessible('next.config.js')) {
    attributes.push(ProjectMetaAttribute.Next);
  }

  softAssert(
    ['module', 'commonjs'].includes(type as string),
    ErrorMessage.BadProjectTypeInPackageJson()
  );

  if (type === 'module') {
    attributes.push(ProjectMetaAttribute.Esm);
  }

  if (type === 'commonjs') {
    attributes.push(ProjectMetaAttribute.Cjs);
  }

  if (bin) {
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

  softAssert(
    !(
      attributes.includes(ProjectMetaAttribute.Cli) &&
      attributes.includes(ProjectMetaAttribute.Next)
    ),
    ErrorMessage.CannotBeCliAndNextJs()
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

/**
 * Return an array of the lines of a `.prettierignore` file.
 */
export async function deriveVirtualPrettierIgnoreLines(
  root: string,
  skipUnknown: boolean
) {
  const ignore = (await readFile(`${root}/.prettierignore`))
    .split('\n')
    .filter((entry) => entry && !entry.startsWith('#'));

  if (skipUnknown) {
    const unknownPaths = (
      await run('git', ['ls-files', '--others', '--directory'])
    ).stdout.split('\n');

    ignore.push(...unknownPaths);
  }

  return ignore;
}

// TODO: stuff like this should be co-located in @-xun/project-utils alongside
// TODO: the @projector-js/core redux
export async function getImportSpecifierEntriesFromFiles(
  files: string[]
): Promise<[file: string, specifiers: string[]][]> {
  const debugImportLister = createDebugLogger({
    namespace: `${globalLoggerNamespace}:import-lister`
  });

  debugImportLister('evaluating files: %O', files);

  const { default: createImportsListerPlugin } = await import(
    'babel-plugin-list-imports'
  );

  const importSpecifierEntries = await Promise.all(
    files.map(async (path, index) => {
      const debugImportLister_ = debugImportLister.extend(`file-${index}`);
      const importLister = createImportsListerPlugin();

      debugImportLister_('evaluating file: %O', path);

      await transformFileAsync(path, {
        configFile: false,
        plugins: [
          '@babel/syntax-import-attributes',
          '@babel/syntax-typescript',
          importLister.plugin
        ]
      });

      debugImportLister_(
        'imports seen (%O): %O',
        importLister.state.size,
        importLister.state
      );

      const result = Array.from(importLister.state);
      return [path, result] as [string, string[]];
    })
  );

  debugImportLister('import specifiers: %O', importSpecifierEntries);
  return importSpecifierEntries;
}

export function checkAllChoiceIfGivenIsByItself(allChoice: string, noun: string) {
  return function (currentArg: unknown[]) {
    const includesAll = currentArg.includes(allChoice);

    return (
      !includesAll ||
      currentArg.length === 1 ||
      ErrorMessage.AllOptionValueMustBeAlone(noun)
    );
  };
}

export function checkIsNonNegative(argName: string) {
  return function (currentArg: number) {
    return currentArg >= 0 || ErrorMessage.ArgumentMustBeNonNegative(argName);
  };
}

export function checkChoicesNotEmpty(argName: string, adjective = 'non-empty') {
  return function (currentArg: unknown[]) {
    return (
      (currentArg.length > 0 && currentArg.every((file) => isNonEmptyString(file))) ||
      ErrorMessage.RequiresMinArgs(argName, 1, undefined, adjective)
    );
  };
}

export function isNonEmptyString(o: unknown): o is string {
  return typeof o === 'string' && o.length > 0;
}
