import assert from 'node:assert';

import { hasTypescriptExtension } from '@-xun/scripts/assets/babel.config.cjs';
import { glob as globAsync, sync as globSync } from 'glob';

import {
  ensureRawSpecifierOk,
  generateRawAliasMap,
  mapRawSpecifierToPath,
  mapRawSpecifierToRawAliasMapping,
  WellKnownImportAlias
} from 'rootverse+project-utils:src/alias.ts';

import {
  debug as debug_,
  isWorkspacePackage,
  type GenericPackage,
  // ? Used in documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Package,
  type PackageBuildTargets
} from 'rootverse+project-utils:src/analyze/common.ts';

import {
  gatherImportEntriesFromFiles,
  type ImportSpecifiersEntry
} from 'rootverse+project-utils:src/analyze/gather-import-entries-from-files.ts';

import { gatherPackageFiles } from 'rootverse+project-utils:src/analyze/gather-package-files.ts';
import { pathToPackage } from 'rootverse+project-utils:src/analyze/path-to-package.ts';
import { cache, CacheScope } from 'rootverse+project-utils:src/cache.ts';
import { ErrorMessage, ProjectError } from 'rootverse+project-utils:src/error.ts';

import {
  toPath,
  toRelativePath,
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs.ts';

import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { Entries, Promisable, SetFieldType } from 'type-fest';

const debug = debug_.extend('gatherPackageBuildTargets');

/**
 * Prefixed to specifiers coming from non-source files.
 */
export const prefixAssetImport = '<❗ASSET>';

/**
 * Prefixed to specifiers coming from internal files.
 */
export const prefixInternalImport = '<intr>';

/**
 * Prefixed to specifiers coming from external files.
 */
export const prefixExternalImport = '<extr>';

/**
 * Prefixed to type-only specifiers.
 */
export const prefixTypeOnlyImport = '<type>';

/**
 * @see {@link gatherPackageBuildTargets}
 */
export type GatherPackageBuildTargetsOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * Unless `useCached` is `false`, the results returned by this function will
   * always strictly equal (`===`) each other with respect to call signature.
   *
   * @see {@link cache}
   */
  useCached: boolean;
  /**
   * Exclude paths from the internals result with respect to the patterns in
   * `excludeInternalsPatterns`, which are interpreted according to gitignore
   * rules and _always_ relative to the _project_ (NEVER package or filesystem!)
   * root.
   */
  excludeInternalsPatterns?: string[];
  /**
   * Include in the externals result all paths matching a pattern in
   * `includeExternalsPatterns`, which are interpreted as glob strings and
   * _always_ relative to the _project_ (NEVER package or filesystem!) root.
   */
  includeExternalsPatterns?: string[];
};

function gatherPackageBuildTargets_(
  shouldRunSynchronously: false,
  package_: GenericPackage,
  options: GatherPackageBuildTargetsOptions
): Promise<PackageBuildTargets>;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: true,
  package_: GenericPackage,
  options: GatherPackageBuildTargetsOptions
): PackageBuildTargets;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: boolean,
  package_: GenericPackage,
  { useCached, ...cacheIdComponentsObject }: GatherPackageBuildTargetsOptions
): Promisable<PackageBuildTargets> {
  const { excludeInternalsPatterns = [], includeExternalsPatterns = [] } =
    cacheIdComponentsObject;

  const { projectMetadata } = package_;
  const { rootPackage } = projectMetadata;
  const { root: projectRoot } = rootPackage;

  if (useCached) {
    const cachedBuildTargets = cache.get(CacheScope.GatherPackageBuildTargets, [
      package_,
      cacheIdComponentsObject
    ]);

    if (cachedBuildTargets) {
      debug('reusing cached resources: %O', cachedBuildTargets);
      return shouldRunSynchronously
        ? cachedBuildTargets
        : Promise.resolve(cachedBuildTargets);
    }
  }

  const packageBuildTargets: PackageBuildTargets = {
    targets: {
      external: { normal: new Set(), typeOnly: new Set() },
      internal: new Set()
    },
    metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } }
  };

  const {
    targets,
    metadata: {
      imports: { aliasCounts, dependencyCounts }
    }
  } = packageBuildTargets;

  const wellKnownAliases = generateRawAliasMap(projectMetadata);

  if (shouldRunSynchronously) {
    runSynchronously();
    return packageBuildTargets;
  } else {
    return runAsynchronously().then(() => packageBuildTargets);
  }

  async function runAsynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = await Promise.all([
      gatherPackageFiles(package_, { ignore: excludeInternalsPatterns, useCached }).then(
        ({ src }) => src
      ),
      globAsync(includeExternalsPatterns, {
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as Promise<AbsolutePath[]>
    ]);

    // * Note that targets.internal is relative to the **PROJECT ROOT**
    let seenImportPaths = new Set(packageSrcPaths);
    // * Note that packageSrcPaths contains normal and type-only imports
    targets.internal = absolutePathsSetToRelative(seenImportPaths, projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external.normal = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let previousDiff = new Set<AbsolutePath>(
        packageSrcPaths.concat(additionalExternalPaths)
      );
      previousDiff.size !== 0;

    ) {
      seenImportPaths = seenImportPaths.union(previousDiff);

      const { normal: normalPaths_, typeOnly: typeOnlyPaths_ } =
        rawSpecifiersToTargetPaths(
          targets.internal,
          // eslint-disable-next-line no-await-in-loop
          await gatherImportEntriesFromFiles(Array.from(previousDiff.values()), {
            useCached
          })
        );

      // * Note that these are relative to the **PROJECT ROOT**
      const normalPaths = normalPaths_.difference(seenImportPaths);
      const typeOnlyPaths = typeOnlyPaths_.difference(seenImportPaths);

      targets.external.normal = targets.external.normal.union(
        absolutePathsSetToRelative(normalPaths, projectRoot)
      );

      targets.external.typeOnly = targets.external.typeOnly.union(
        absolutePathsSetToRelative(typeOnlyPaths, projectRoot)
      );

      previousDiff = normalPaths.union(typeOnlyPaths);
    }

    finalize();
  }

  function runSynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = [
      gatherPackageFiles.sync(package_, {
        ignore: excludeInternalsPatterns,
        useCached
      }).src,
      globSync(includeExternalsPatterns, {
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as AbsolutePath[]
    ];

    // * Note that targets.internal is relative to the **PROJECT ROOT**
    let seenImportPaths = new Set(packageSrcPaths);
    // * Note that packageSrcPaths contains normal and type-only imports
    targets.internal = absolutePathsSetToRelative(seenImportPaths, projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external.normal = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let previousDiff = new Set<AbsolutePath>(
        packageSrcPaths.concat(additionalExternalPaths)
      );
      previousDiff.size !== 0;

    ) {
      seenImportPaths = seenImportPaths.union(previousDiff);

      const { normal: normalPaths_, typeOnly: typeOnlyPaths_ } =
        rawSpecifiersToTargetPaths(
          targets.internal,
          gatherImportEntriesFromFiles.sync(Array.from(previousDiff.values()), {
            useCached
          })
        );

      // * Note that these are relative to the **PROJECT ROOT**
      const normalPaths = normalPaths_.difference(seenImportPaths);
      const typeOnlyPaths = typeOnlyPaths_.difference(seenImportPaths);

      targets.external.normal = targets.external.normal.union(
        absolutePathsSetToRelative(normalPaths, projectRoot)
      );

      targets.external.typeOnly = targets.external.typeOnly.union(
        absolutePathsSetToRelative(typeOnlyPaths, projectRoot)
      );

      previousDiff = normalPaths.union(typeOnlyPaths);
    }

    finalize();
  }

  function finalize() {
    debug('package build targets: %O', packageBuildTargets);

    cache.set(
      CacheScope.GatherPackageBuildTargets,
      [package_, cacheIdComponentsObject],
      packageBuildTargets
    );
  }

  /**
   * Given an array of {@link ImportSpecifiersEntry}s, this function returns a
   * flattened array of ({@link AbsolutePath})s resolved from those specifiers.
   * Specifiers that are not from a distributable source verse (i.e. testverse,
   * typeverse) will cause an error. Specifiers that do not come from TypeScript
   * files or cannot be mapped are ignored, though their existence is still
   * noted in the metadata and, unless they do NOT come from a TypeScript file,
   * their syntax is still validated.
   *
   * **Note that this function returns external and, potentially, internal paths
   * mixed together** since rootverse imports are technically external but can
   * still refer to internal paths.
   *
   * @see {@link PackageBuildTargets}
   */
  function rawSpecifiersToTargetPaths(
    internalPaths: Set<RelativePath>,
    entries: ImportSpecifiersEntry[]
  ): SetFieldType<ImportSpecifiersEntry[1], 'normal' | 'typeOnly', Set<AbsolutePath>> {
    const targets: Parameters<typeof rawSpecifiersToTargetPaths_>[0] = {
      normal: [],
      typeOnly: []
    };

    for (const [path, specifiers] of entries) {
      const specifierPackage = pathToPackage(path, projectMetadata);
      rawSpecifiersToTargetPaths_(
        targets,
        path,
        specifiers,
        specifierPackage,
        internalPaths.has(toRelativePath(projectRoot, path))
      );
    }

    return {
      normal: new Set(relativePathsArrayToAbsolute(targets.normal, projectRoot)),
      typeOnly: new Set(relativePathsArrayToAbsolute(targets.typeOnly, projectRoot))
    };
  }

  function rawSpecifiersToTargetPaths_(
    targets: { normal: RelativePath[]; typeOnly: RelativePath[] },
    path: AbsolutePath,
    specifierSets: ImportSpecifiersEntry[1],
    specifierPackage: GenericPackage,
    isInternal: boolean
  ) {
    // TODO: consider optionally allowing files other than typescript to have
    // TODO: their raw specifiers checked
    const comesFromTypescriptFile = hasTypescriptExtension(path);
    const specifierPackageId = isWorkspacePackage(specifierPackage)
      ? specifierPackage.id
      : undefined;

    for (const [importKind, specifiers] of Object.entries(specifierSets) as Entries<
      typeof specifierSets
    >) {
      for (const specifier of specifiers.values()) {
        if (comesFromTypescriptFile) {
          ensureRawSpecifierOk(wellKnownAliases, specifier, {
            packageId: specifierPackageId,
            path
          });
        }

        const rawAliasMapping = mapRawSpecifierToRawAliasMapping(
          wellKnownAliases,
          specifier
        );

        if (rawAliasMapping) {
          const [{ group, alias }] = rawAliasMapping;

          const aliasKey = withPrefixes(alias);

          // ? Looks like one of ours. Noting it...
          aliasCounts[aliasKey] = (aliasCounts[alias] || 0) + 1;

          if (comesFromTypescriptFile) {
            const isUniversal = group === WellKnownImportAlias.Universe;
            const isMultiversal =
              group === WellKnownImportAlias.Multiverse ||
              group === WellKnownImportAlias.Rootverse ||
              group === WellKnownImportAlias.Typeverse;

            const specifierResolvedPath = mapRawSpecifierToPath(
              rawAliasMapping,
              specifier
            );
            assert(specifierResolvedPath, ErrorMessage.GuruMeditation());

            if (isMultiversal || isUniversal) {
              targets[importKind].push(specifierResolvedPath);
            }

            if (isMultiversal) {
              debug(
                'multiversal target added: %O => %O',
                specifier,
                specifierResolvedPath
              );
            } else if (isUniversal) {
              debug(
                'universal target added: %O => %O',
                specifier,
                specifierResolvedPath
              );
            } else {
              debug.error(
                `${group} target rejected: %O => %O`,
                specifier,
                specifierResolvedPath
              );

              throw new ProjectError(
                ErrorMessage.SpecifierNotOkVerseNotAllowed(group, specifier, path)
              );
            }
          }
        } else {
          const key = withPrefixes(specifierToPackageName(specifier));
          // ? Looks like a normal non-aliased import. Noting it...
          dependencyCounts[key] = (dependencyCounts[key] || 0) + 1;
        }

        function withPrefixes(aliasKey: string) {
          if (importKind === 'typeOnly') {
            aliasKey = `${prefixTypeOnlyImport} ${aliasKey}`;
          }

          aliasKey = isInternal
            ? `${prefixInternalImport} ${aliasKey}`
            : `${prefixExternalImport} ${aliasKey}`;

          // ! prefixAssetImport must always be the LAST to be prefixed (i.e.
          // ! the whole line should start with prefixAssetImport)
          if (!comesFromTypescriptFile) {
            aliasKey = `${prefixAssetImport} ${aliasKey}`;
          }

          return aliasKey;
        }
      }
    }
  }
}

/**
 * Asynchronously construct a {@link PackageBuildTargets} instance derived from
 * a {@link Package} instance.
 *
 * Also performs a lightweight correctness check of all imports as they're
 * encountered.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherPackageBuildTargets(
  ...args: ParametersNoFirst<typeof gatherPackageBuildTargets_>
) {
  return gatherPackageBuildTargets_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPackageBuildTargets {
  /**
   * Synchronously construct a {@link PackageBuildTargets} instance derived from
   * a {@link Package} instance.
   *
   * Also performs a lightweight correctness check of all imports as they're
   * encountered.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherPackageBuildTargets_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageBuildTargets>;
}

/**
 * Takes a fully-resolved (i.e. _not an alias_) import specifier and returns its
 * package name. Accounts for imports of namespaced packages like `@babel/core`.
 *
 * Useful for translating external NPM package import specifiers into the names
 * of the individual packages. Examples:
 *
 * ```
 * specifierToPackageName('next/jest') === 'next'
 * specifierToPackageName('@babel/core') === '@babel/core'
 * specifierToPackageName('/something/custom') === '/something/custom'
 * specifierToPackageName('./something/custom') === './something/custom'
 * ```
 */
export function specifierToPackageName(specifier: string) {
  const split = specifier.split('/').slice(0, 2);
  const packageName =
    specifier.startsWith('@') && split.length === 2
      ? split.join('/')
      : ['.', '..'].includes(split[0])
        ? specifier
        : split[0];

  return packageName;
}

function relativePathsArrayToAbsolute(
  relativePaths: RelativePath[],
  root: AbsolutePath
) {
  return relativePaths.map((path) => toPath(root, path));
}

function absolutePathsSetToRelative(set: Set<AbsolutePath>, root: AbsolutePath) {
  return new Set(Array.from(set).map((path) => toRelativePath(root, path)));
}
