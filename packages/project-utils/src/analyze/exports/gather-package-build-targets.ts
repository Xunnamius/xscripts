import assert from 'node:assert';
import { join as joinPath, relative as toRelativePath } from 'node:path';

import { glob as globAsync, sync as globSync } from 'glob';

// TODO: replace this with actual package once published
import { hasTypescriptExtension } from '# src/assets/config/_babel.config.js.ts';

import {
  ensureRawSpecifierOk,
  generateRawAliasMap,
  mapRawSpecifierToPath,
  mapRawSpecifierToRawAliasMapping,
  WellKnownImportAlias
} from '#project-utils src/alias.ts';

import {
  _internalPackageBuildTargetsCache,
  cacheDebug
} from '#project-utils src/analyze/cache.ts';

import {
  debug as debug_,
  isWorkspacePackage,
  type Package,
  type PackageBuildTargets
} from '#project-utils src/analyze/common.ts';

import {
  gatherImportEntriesFromFiles,
  type ImportSpecifierEntry
} from '#project-utils src/analyze/exports/gather-import-entries-from-files.ts';

import { gatherPackageFiles } from '#project-utils src/analyze/exports/gather-package-files.ts';
import { pathToPackage } from '#project-utils src/analyze/exports/path-to-package.ts';
import { ErrorMessage } from '#project-utils src/error.ts';
import { type AbsolutePath, type RelativePath } from '#project-utils src/fs/index.ts';
import { type ParametersNoFirst, type SyncVersionOf } from '#project-utils src/util.ts';

import type { Promisable } from 'type-fest';

/**
 * Prefixed to specifiers coming from non-source files.
 */
export const assetPrefix = '<!FROM-ASSET>';

/**
 * @see {@link gatherPackageBuildTargets}
 */
export type GatherPackageBuildTargetsOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `gatherPackageBuildTargets` will be cached regardless of
   * `useCached`. `useCached` determines if the cached result will be returned
   * or recomputed on subsequent calls.
   *
   * @default true
   */
  useCached?: boolean;
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
  package_: Package,
  options?: GatherPackageBuildTargetsOptions
): Promise<PackageBuildTargets>;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: true,
  package_: Package,
  options?: GatherPackageBuildTargetsOptions
): PackageBuildTargets;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: boolean,
  package_: Package,
  {
    excludeInternalsPatterns = [],
    includeExternalsPatterns = [],
    useCached = true
  }: GatherPackageBuildTargetsOptions = {}
): Promisable<PackageBuildTargets> {
  const debug = debug_.extend('gatherPackageBuildTargets');

  const { projectMetadata } = package_;
  const { rootPackage } = projectMetadata;
  const { root: projectRoot } = rootPackage;

  const packageId_ = isWorkspacePackage(package_) ? package_.id : undefined;

  if (useCached && _internalPackageBuildTargetsCache.has(package_)) {
    cacheDebug('cache hit!');
    const cachedResult = _internalPackageBuildTargetsCache.get(package_)!;
    debug('reusing cached resources: %O', cachedResult);
    return shouldRunSynchronously ? cachedResult : Promise.resolve(cachedResult);
  } else {
    cacheDebug('cache miss');
  }

  const packageBuildTargets: PackageBuildTargets = {
    targets: { external: new Set(), internal: new Set() },
    metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } }
  };

  const {
    targets,
    metadata: {
      imports: { aliasCounts, dependencyCounts }
    }
  } = packageBuildTargets;

  let seenImportPaths = new Set<AbsolutePath>();
  const wellKnownAliases = generateRawAliasMap(projectMetadata);

  if (shouldRunSynchronously) {
    runSynchronously();
    return packageBuildTargets;
  } else {
    return runAsynchronously().then(() => packageBuildTargets);
  }

  async function runAsynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = await Promise.all([
      gatherPackageFiles(package_, { ignore: excludeInternalsPatterns }).then(
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
    targets.internal = absolutePathsSetToRelative(new Set(packageSrcPaths), projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let previousDiff = new Set<AbsolutePath>(
        packageSrcPaths.concat(additionalExternalPaths)
      );
      previousDiff.size !== 0;

    ) {
      const externalPaths = rawSpecifiersToExternalTargetPaths(
        true,
        // eslint-disable-next-line no-await-in-loop
        await gatherImportEntriesFromFiles(Array.from(previousDiff.values()))
      );

      // * Note that targets.external is relative to the **PROJECT ROOT**
      targets.external = targets.external.union(
        absolutePathsSetToRelative(externalPaths, projectRoot)
      );

      previousDiff = externalPaths.difference(seenImportPaths);
      seenImportPaths = seenImportPaths.union(previousDiff);
    }

    finalize();
  }

  function runSynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = [
      gatherPackageFiles.sync(package_, { ignore: excludeInternalsPatterns }).src,
      globSync(includeExternalsPatterns, {
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as AbsolutePath[]
    ];

    // * Note that targets.internal is relative to the **PROJECT ROOT**
    targets.internal = absolutePathsSetToRelative(new Set(packageSrcPaths), projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let previousDiff = new Set<AbsolutePath>(
        packageSrcPaths.concat(additionalExternalPaths)
      );
      previousDiff.size !== 0;

    ) {
      const externalPaths = rawSpecifiersToExternalTargetPaths(
        true,
        gatherImportEntriesFromFiles.sync(Array.from(previousDiff.values()))
      );

      // * Note that targets.external is relative to the **PROJECT ROOT**
      targets.external = targets.external.union(
        absolutePathsSetToRelative(externalPaths, projectRoot)
      );

      previousDiff = externalPaths.difference(seenImportPaths);
      seenImportPaths = seenImportPaths.union(previousDiff);
    }

    finalize();
  }

  function finalize() {
    debug('package build targets: %O', packageBuildTargets);

    if (useCached || !_internalPackageBuildTargetsCache.has(package_)) {
      _internalPackageBuildTargetsCache.set(package_, packageBuildTargets);
      cacheDebug('cache entry updated');
    } else {
      cacheDebug('skipped updating cache entry');
    }
  }

  /**
   * Given an array of {@link ImportSpecifierEntry}s, this function returns a
   * flattened array of ({@link AbsolutePath})s resolved from those specifiers.
   * Specifiers that are not multiversal/external, do not come from TypeScript
   * files, or cannot be mapped are ignored, though their existence is still
   * noted in the metadata and, unless they do not come from a TypeScript file,
   * their syntax is still validated.
   *
   * @see {@link PackageBuildTargets}
   */
  function rawSpecifiersToExternalTargetPaths(
    runSynchronously: false,
    entries: ImportSpecifierEntry[]
  ): Promise<Set<AbsolutePath>>;
  function rawSpecifiersToExternalTargetPaths(
    runSynchronously: true,
    entries: ImportSpecifierEntry[]
  ): Set<AbsolutePath>;
  function rawSpecifiersToExternalTargetPaths(
    runSynchronously: boolean,
    entries: ImportSpecifierEntry[]
  ): Promisable<Set<AbsolutePath>> {
    const externalTargets: RelativePath[] = [];

    if (runSynchronously) {
      for (const [path, specifiers] of entries) {
        const specifierPackage = pathToPackage.sync({ path, projectMetadata });

        rawSpecifiersToExternalTargetPaths_(
          externalTargets,
          path,
          specifiers,
          specifierPackage
        );
      }

      return new Set(relativePathsArrayToAbsolute(externalTargets, projectRoot));
    } else {
      return Promise.resolve().then(async () => {
        for (const [path, specifiers] of entries) {
          // eslint-disable-next-line no-await-in-loop
          const specifierPackage = await pathToPackage({ path, projectMetadata });

          rawSpecifiersToExternalTargetPaths_(
            externalTargets,
            path,
            specifiers,
            specifierPackage
          );
        }

        return new Set(relativePathsArrayToAbsolute(externalTargets, projectRoot));
      });
    }
  }

  function rawSpecifiersToExternalTargetPaths_(
    externalTargets: RelativePath[],
    path: AbsolutePath,
    specifiers: Set<string>,
    specifierPackage: Package
  ) {
    // TODO: consider optionally allowing files other than typescript to have
    // TODO: their raw specifiers checked
    const comesFromTypescriptFile = hasTypescriptExtension(path);
    const specifierPackageId = isWorkspacePackage(specifierPackage)
      ? specifierPackage.id
      : undefined;

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
        const [{ group, alias, packageId }] = rawAliasMapping;
        const aliasKey = comesFromTypescriptFile ? alias : `${assetPrefix} ${alias}`;

        // ? Looks like one of ours. Noting it...
        aliasCounts[aliasKey] = (aliasCounts[alias] || 0) + 1;

        if (comesFromTypescriptFile) {
          const isMultiversal =
            group === WellKnownImportAlias.Multiverse ||
            (group === WellKnownImportAlias.Rootverse && packageId_ !== packageId);

          const specifierResolvedPath = mapRawSpecifierToPath(rawAliasMapping, specifier);

          assert(specifierResolvedPath, ErrorMessage.GuruMeditation());

          if (isMultiversal) {
            externalTargets.push(specifierResolvedPath);
          }
        }
      } else {
        const split = specifier.split('/').slice(0, 2);
        const key =
          (comesFromTypescriptFile ? '' : `${assetPrefix} `) +
          (specifier.startsWith('@') && split.length === 2
            ? split.join('/')
            : ['.', '..'].includes(split[0])
              ? specifier
              : split[0]);

        // ? Looks like a normal non-aliased import. Noting it...
        dependencyCounts[key] = (dependencyCounts[key] || 0) + 1;
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
 * @see {@link clearInternalCache}
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
   * @see {@link clearInternalCache}
   */
  export const sync = function (...args) {
    return gatherPackageBuildTargets_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageBuildTargets>;
}

function relativePathsArrayToAbsolute(relativePaths: RelativePath[], root: AbsolutePath) {
  return relativePaths.map((path) => joinPath(root, path) as AbsolutePath);
}

function absolutePathsSetToRelative(set: Set<AbsolutePath>, root: AbsolutePath) {
  // ? Don't forget the +1 to slice off the initial path separator!
  return new Set(
    Array.from(set).map((path) => toRelativePath(root, path) as RelativePath)
  );
}
