import { join as joinPath, relative as toRelativePath } from 'node:path';

import { glob as globAsync, sync as globSync } from 'glob-gitignore';

import {
  _internalPackageFilesCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

import {
  assignResultTo,
  debug as debug_,
  type Package,
  type PackageFiles
} from '#project-utils src/analyze/common.ts';

import {
  deriveVirtualGitignoreLines,
  type AbsolutePath,
  type RelativePath
} from '#project-utils src/fs/index.ts';

import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

const rawDistGlob = 'dist/**/*';
// eslint-disable-next-line unicorn/prevent-abbreviations
const rawDocsGlob = 'docs/**/*';
const rawSrcGlob = 'src/**/*';
const rawTestGlob = 'test/**/*';
const rawOtherGlob = '**/*';

/**
 * @see {@link gatherPackageFiles}
 */
export type GatherPackageFilesOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `gatherPackageFiles` will be cached regardless of
   * `useCached`. `useCached` determines if the cached result will be returned
   * or recomputed on subsequent calls.
   *
   * @default true
   */
  useCached?: boolean;
  /**
   * If `true`, use `.gitignore` to filter out returned project files.
   *
   * @default true
   */
  skipGitIgnored?: boolean;
  /**
   * Exclude paths from the result with respect to the given patterns, which are
   * interpreted **relative to the _project root_** according to gitignore
   * rules.
   *
   * This option can also be used together with
   * {@link GatherPackageFilesOptions.skipGitIgnored}. Also, since `ignore` is
   * appended to the final list of ignored files, negated globs can be used to
   * un-ignore files.
   */
  ignore?: (string | RelativePath)[];
};

function gatherPackageFiles_(
  shouldRunSynchronously: false,
  package_: Package,
  options?: GatherPackageFilesOptions
): Promise<PackageFiles>;
function gatherPackageFiles_(
  shouldRunSynchronously: true,
  package_: Package,
  options?: GatherPackageFilesOptions
): PackageFiles;
function gatherPackageFiles_(
  shouldRunSynchronously: boolean,
  package_: Package,
  {
    useCached = true,
    skipGitIgnored: skipIgnored = true,
    ignore: additionalIgnores = []
  }: GatherPackageFilesOptions = {}
): Promisable<PackageFiles> {
  const debug = debug_.extend('gatherPackageFiles');

  if (useCached && _internalPackageFilesCache.has(package_)) {
    cacheDebug('cache hit!');
    const cachedResult = _internalPackageFilesCache.get(package_)!;
    debug('reusing cached resources: %O', cachedResult);
    return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
  } else {
    cacheDebug('cache miss');
  }

  const packageRoot = package_.root;
  const projectRoot = package_.projectMetadata.rootPackage.root;

  debug('package root: %O', packageRoot);
  debug('project root: %O', projectRoot);

  const packageFiles: PackageFiles = {
    dist: [],
    docs: [],
    src: [],
    test: [],
    other: []
  };

  const baseGlobOptions = {
    dot: true,
    absolute: true,
    nodir: true,
    cwd: projectRoot
  };

  const distGlob = toRelativePath(projectRoot, joinPath(packageRoot, rawDistGlob));
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const docsGlob = toRelativePath(projectRoot, joinPath(packageRoot, rawDocsGlob));
  const srcGlob = toRelativePath(projectRoot, joinPath(packageRoot, rawSrcGlob));
  const testGlob = toRelativePath(projectRoot, joinPath(packageRoot, rawTestGlob));
  const otherGlob = toRelativePath(projectRoot, joinPath(packageRoot, rawOtherGlob));

  debug('distGlob: %O', distGlob);
  debug('docsGlob: %O', docsGlob);
  debug('srcGlob: %O', srcGlob);
  debug('testGlob: %O', testGlob);
  debug('otherGlob: %O', otherGlob);

  const packagesIgnore =
    '/' + toRelativePath(projectRoot, joinPath(packageRoot, 'packages'));

  debug('packagesIgnore: %O', packagesIgnore);

  if (shouldRunSynchronously) {
    runSynchronously();
    return packageFiles;
  } else {
    return runAsynchronously().then(() => packageFiles);
  }

  async function runAsynchronously() {
    const ignore = skipIgnored ? await deriveVirtualGitignoreLines({ projectRoot }) : [];

    // * Ignore "packages" + .gitignored'd + custom ignore
    const ignoreAndPackages = ignore.concat(packagesIgnore, additionalIgnores);
    const globOptions = { ...baseGlobOptions, ignore: ignoreAndPackages };

    debug(
      'virtual .gitignore lines (+ appended + additionalIgnores): %O',
      ignoreAndPackages
    );

    debug('globOptions: %O', globOptions);

    await Promise.all([
      globAsync(distGlob, {
        ...globOptions,
        // * Don't ignore anything
        ignore: []
      }).then(assignResultTo(packageFiles, 'dist')),

      globAsync(docsGlob, globOptions).then(assignResultTo(packageFiles, 'docs')),
      globAsync(srcGlob, globOptions).then(assignResultTo(packageFiles, 'src')),
      globAsync(testGlob, globOptions).then(assignResultTo(packageFiles, 'test')),

      globAsync(otherGlob, {
        ...globOptions,
        // * Ignore "packages" + .gitignored'd + files under docs, src, and test
        // ? Absolute paths in .gitignore/.gitignore are relative to repo
        ignore: ignoreAndPackages.concat([distGlob, docsGlob, srcGlob, testGlob])
      }).then(assignResultTo(packageFiles, 'other'))
    ]);

    finalize();
  }

  function runSynchronously() {
    const ignore = skipIgnored ? deriveVirtualGitignoreLines.sync({ projectRoot }) : [];

    // * Ignore "packages" + .gitignored'd + custom ignore
    const ignoreAndPackages = ignore.concat(packagesIgnore, additionalIgnores);
    const globOptions = { ...baseGlobOptions, ignore: ignoreAndPackages };

    debug(
      'virtual .gitignore lines (+ appended + additionalIgnores): %O',
      ignoreAndPackages
    );

    debug('globOptions: %O', otherGlob);

    packageFiles.dist = globSync(distGlob, {
      ...globOptions,
      // * Don't ignore anything
      ignore: []
    }) as AbsolutePath[];

    packageFiles.docs = globSync(docsGlob, globOptions) as AbsolutePath[];
    packageFiles.src = globSync(srcGlob, globOptions) as AbsolutePath[];
    packageFiles.test = globSync(testGlob, globOptions) as AbsolutePath[];

    packageFiles.other = globSync(otherGlob, {
      ...globOptions,
      // * Ignore "packages" + .gitignored'd + files under docs, src, and test
      // ? Absolute paths in .gitignore/.gitignore are relative to repo
      ignore: ignoreAndPackages.concat([distGlob, docsGlob, srcGlob, testGlob])
    }) as AbsolutePath[];

    finalize();
  }

  function finalize() {
    debug('package files: %O', packageFiles);

    if (useCached || !_internalPackageFilesCache.has(package_)) {
      _internalPackageFilesCache.set(package_, packageFiles);
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }
}

/**
 * Asynchronously construct a {@link PackageFiles} instance containing
 * {@link AbsolutePath}s to every file under `package_`'s root.
 *
 * @see {@link clearInternalCache}
 */
export function gatherPackageFiles(
  ...args: ParametersNoFirst<typeof gatherPackageFiles_>
) {
  return gatherPackageFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPackageFiles {
  /**
   * Synchronously construct a {@link PackageFiles} instance containing
   * {@link AbsolutePath}s to every file under `package_`'s root.
   *
   * @see {@link clearInternalCache}
   */
  export const sync = function (...args) {
    return gatherPackageFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageFiles>;
}
