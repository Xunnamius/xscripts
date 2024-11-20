/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { createHash } from 'node:crypto';

import {
  debug as debug_,
  isPackage,
  isProjectMetadata
} from 'rootverse+project-utils:src/analyze/common.ts';

import {
  type deriveVirtualGitignoreLines,
  type deriveVirtualPrettierignoreLines,
  type isAccessible,
  type readJson,
  type readJsonc
} from 'rootverse+project-utils:src/fs.ts';

import type {
  analyzeProjectStructure,
  gatherImportEntriesFromFiles,
  gatherPackageBuildTargets,
  gatherPackageFiles,
  gatherProjectFiles,
  gatherPseudodecoratorEntriesFromFiles
} from 'rootverse+project-utils:src/analyze.ts';

const internalCache = new Map<CacheScope, InternalScopedCache>();
const cacheDebug = debug_.extend('cache');
const cacheDebugHit = cacheDebug.extend('hit');

type DefaultKeysToOmitFromCacheParameters = 'useCached';

type CacheKey = string;

/**
 * @internal
 */
export type ArrayNoLast<T extends unknown[]> = T extends [...infer Parameters_, infer _X]
  ? Parameters_
  : [];

type InternalScopedCache = Map<CacheKey, unknown>;

/**
 * This takes an array of `unknown` types and, if any of those types extend
 * `T[]`, replaces said types with `T`, essentially "unwrapping" them.
 *
 ** We use this because we're assuming array parameters represent things like
 ** file paths, which should each be cached under different keys when passed to
 ** the function in one shot.
 **
 ** This is why generally all of the functions exported by project-utils take
 ** real parameters (required) followed by an options object (mostly optional),
 ** since this pattern makes using a type like `RecursiveUnwrapArraysInArray`
 ** possible here.
 *
 * @internal
 */
export type RecursiveUnwrapArraysInArray<
  Wrapped extends unknown[],
  Rest extends unknown[] = never[]
> = Wrapped extends [infer T, ...infer U]
  ? U extends never[]
    ? ExcludeRestIfNever<Rest, T>
    : RecursiveUnwrapArraysInArray<U, ExcludeRestIfNever<Rest, T>>
  : never;

/**
 * @internal
 */
export type UnwrapIfArray<T> = T extends (infer U)[] ? U : T;

/**
 * @internal
 */
export type ExcludeRestIfNever<Rest extends unknown[], T> = Rest extends never[]
  ? [UnwrapIfArray<T>]
  : [...Rest, UnwrapIfArray<T>];

/**
 * @internal
 */
export type FunctionToCacheParameters<
  Fn extends (...args: never[]) => unknown,
  ShouldUnwrapValue extends boolean = false,
  KeysToOmit extends string = DefaultKeysToOmitFromCacheParameters
> = Fn extends (
  ..._args: [...infer PrimaryOptionsParameters, infer SecondaryOptionsParameter]
) => infer Value
  ? SecondaryOptionsParameter extends Record<string, unknown>
    ? [
        id: PrimaryOptionsParameters extends never[]
          ? [Omit<SecondaryOptionsParameter, KeysToOmit>]
          : [
              ...RecursiveUnwrapArraysInArray<PrimaryOptionsParameters>,
              Omit<SecondaryOptionsParameter, KeysToOmit>
            ],
        value: ShouldUnwrapValue extends true
          ? UnwrapIfArray<Awaited<Value>>
          : Awaited<Value>
      ]
    : never
  : never;

/**
 * A "cache scope" is used to ensure the generation of unique {@link CacheKey}s
 * for memoized functions that accept similar inputs.
 */
export enum CacheScope {
  AnalyzeProjectStructure = 'analyzeProjectStructure',
  GatherImportEntriesFromFiles = 'gatherImportEntriesFromFiles',
  GatherPackageBuildTargets = 'gatherPackageBuildTargets',
  GatherPackageFiles = 'gatherPackageFiles',
  GatherProjectFiles = 'gatherProjectFiles',
  GatherPseudodecoratorEntriesFromFiles = 'gatherPseudodecoratorEntriesFromFiles',
  DeriveVirtualGitignoreLines = 'deriveVirtualGitignoreLines',
  DeriveVirtualPrettierignoreLines = 'deriveVirtualPrettierignoreLines',
  IsAccessible = 'isAccessible',
  ReadJson = 'readJson',
  ReadJsonc = 'readJsonc'
}

/**
 * @see {@link CacheScope}
 */
const cacheScopes = Object.values(CacheScope);

/**
 * The internal (to `@-xun/project`) memoization cache shared by all project
 * utility functions.
 */
const externalCache = {
  set: setInCache,
  /**
   * The number of times `this.set` has been called.
   */
  sets: 0,
  /**
   * The number of times `this.set` has been called that resulted in a cache
   * hit.
   */
  setsOverwrites: 0,
  /**
   * The number of times `this.set` has been called that resulted in a cache miss.
   */
  setsCreated: 0,
  get: getFromCache,
  /**
   * The number of times `this.get` has been called.
   */
  gets: 0,
  /**
   * The number of times `this.get` has been called that resulted in a cache
   * hit..
   */
  getsHits: 0,
  /**
   * The number of times `this.get` has been called that resulted in a cache miss.
   */
  getsMisses: 0,
  clear: clearCacheByScope,
  /**
   * The number of times `this.clear` has been called.
   */
  clears: 0
};

export { externalCache as cache };

/**
 * Place a value into the internal cache.
 */
function setInCache(
  scope: CacheScope.AnalyzeProjectStructure,
  ...args: FunctionToCacheParameters<typeof analyzeProjectStructure>
): void;
function setInCache(
  scope: CacheScope.GatherImportEntriesFromFiles,
  ...args: FunctionToCacheParameters<typeof gatherImportEntriesFromFiles, true>
): void;
function setInCache(
  scope: CacheScope.GatherPackageBuildTargets,
  ...args: FunctionToCacheParameters<typeof gatherPackageBuildTargets>
): void;
function setInCache(
  scope: CacheScope.GatherPackageFiles,
  ...args: FunctionToCacheParameters<typeof gatherPackageFiles>
): void;
function setInCache(
  scope: CacheScope.GatherProjectFiles,
  ...args: FunctionToCacheParameters<typeof gatherProjectFiles>
): void;
function setInCache(
  scope: CacheScope.GatherPseudodecoratorEntriesFromFiles,
  ...args: FunctionToCacheParameters<typeof gatherPseudodecoratorEntriesFromFiles, true>
): void;
function setInCache(
  scope: CacheScope.DeriveVirtualGitignoreLines,
  ...args: FunctionToCacheParameters<typeof deriveVirtualGitignoreLines>
): void;
function setInCache(
  scope: CacheScope.DeriveVirtualPrettierignoreLines,
  ...args: FunctionToCacheParameters<typeof deriveVirtualPrettierignoreLines>
): void;
function setInCache(
  scope: CacheScope.IsAccessible,
  ...args: FunctionToCacheParameters<typeof isAccessible>
): void;
function setInCache(
  scope: CacheScope.ReadJson,
  ...args: FunctionToCacheParameters<typeof readJson>
): void;
function setInCache(
  scope: CacheScope.ReadJsonc,
  ...args: FunctionToCacheParameters<typeof readJsonc>
): void;
function setInCache(scope: CacheScope, id: unknown[], value: unknown): void {
  const [cache, cacheKey] = deriveCacheKeyFromIdentifiers(scope, id);

  if (cache.has(cacheKey)) {
    externalCache.setsOverwrites += 1;
    cacheDebug('update existing key %O:%O', scope, cacheKey);
  } else {
    externalCache.setsCreated += 1;
    cacheDebug('create new key %O:%O', scope, cacheKey);
  }

  externalCache.sets += 1;
  cache.set(cacheKey, value);
}

/**
 * Retrieve a value from the internal cache given one or more `id` components.
 * If no matching value is found, `undefined` is returned.
 */
function getFromCache(
  scope: CacheScope.AnalyzeProjectStructure,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof analyzeProjectStructure>>
): FunctionToCacheParameters<typeof analyzeProjectStructure>[1] | undefined;
function getFromCache(
  scope: CacheScope.GatherImportEntriesFromFiles,
  ...args: ArrayNoLast<
    FunctionToCacheParameters<typeof gatherImportEntriesFromFiles, true>
  >
): FunctionToCacheParameters<typeof gatherImportEntriesFromFiles, true>[1] | undefined;
function getFromCache(
  scope: CacheScope.GatherPackageBuildTargets,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof gatherPackageBuildTargets>>
): FunctionToCacheParameters<typeof gatherPackageBuildTargets>[1] | undefined;
function getFromCache(
  scope: CacheScope.GatherPackageFiles,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof gatherPackageFiles>>
): FunctionToCacheParameters<typeof gatherPackageFiles>[1] | undefined;
function getFromCache(
  scope: CacheScope.GatherProjectFiles,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof gatherProjectFiles>>
): FunctionToCacheParameters<typeof gatherProjectFiles>[1] | undefined;
function getFromCache(
  scope: CacheScope.GatherPseudodecoratorEntriesFromFiles,
  ...args: ArrayNoLast<
    FunctionToCacheParameters<typeof gatherPseudodecoratorEntriesFromFiles, true>
  >
):
  | FunctionToCacheParameters<typeof gatherPseudodecoratorEntriesFromFiles, true>[1]
  | undefined;
function getFromCache(
  scope: CacheScope.DeriveVirtualGitignoreLines,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof deriveVirtualGitignoreLines>>
): FunctionToCacheParameters<typeof deriveVirtualGitignoreLines>[1] | undefined;
function getFromCache(
  scope: CacheScope.DeriveVirtualPrettierignoreLines,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof deriveVirtualPrettierignoreLines>>
): FunctionToCacheParameters<typeof deriveVirtualPrettierignoreLines>[1] | undefined;
function getFromCache(
  scope: CacheScope.IsAccessible,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof isAccessible>>
): FunctionToCacheParameters<typeof isAccessible>[1] | undefined;
function getFromCache(
  scope: CacheScope.ReadJson,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof readJson>>
): FunctionToCacheParameters<typeof readJson>[1] | undefined;
function getFromCache(
  scope: CacheScope.ReadJsonc,
  ...args: ArrayNoLast<FunctionToCacheParameters<typeof readJsonc>>
): FunctionToCacheParameters<typeof readJsonc>[1] | undefined;
function getFromCache(scope: CacheScope, id: unknown[]): unknown {
  const [cache, cacheKey] = deriveCacheKeyFromIdentifiers(scope, id);

  if (cache.has(cacheKey)) {
    cacheDebugHit('hit for key %O:%O', scope, cacheKey);
    externalCache.getsHits += 1;
  } else {
    cacheDebug('miss for key %O:%O', scope, cacheKey);
    externalCache.getsMisses += 1;
  }

  externalCache.gets += 1;
  return cache.get(cacheKey);
}

/**
 * Clear one or more scopes within the internal cache. Mostly useful in a
 * testing context.
 */
function clearCacheByScope(
  scopesToClear: {
    [cacheScope in CacheScope]?: boolean;
  } = {}
) {
  externalCache.clears += 1;

  for (const scope of cacheScopes) {
    if (scopesToClear[scope] !== false) {
      const internalScopedCache = internalCache.get(scope);
      internalScopedCache?.clear();

      if (internalScopedCache?.size) {
        cacheDebug(
          'internal %O cache cleared (%O entries deleted)',
          scope,
          internalScopedCache.size
        );
      } else {
        cacheDebug('internal %O cache vacuously cleared (cache was never used)', scope);
      }
    }
  }
}

/**
 * Takes an array of data objects that are either (1) serializable as JSON or
 * (2) an instance of {@link Package} or {@link ProjectMetadata} and
 * deterministically returns a MD5 key that, along with `scope`, can be used to
 * memoize potentially expensive analysis functions.
 */
function deriveCacheKeyFromIdentifiers(
  scope: CacheScope,
  idComponents: unknown[]
): [InternalScopedCache, CacheKey] {
  const cacheKey = createHash('md5');
  const internalScopedCache =
    internalCache.get(scope) || internalCache.set(scope, new Map()).get(scope)!;

  for (const idComponent of idComponents) {
    if (isPackage(idComponent)) {
      // ? Packages are cyclical data structures, so we account for that
      const { projectMetadata: _, ...serializablePackage } = idComponent;
      cacheKey.update(JSON.stringify(serializablePackage));
    } else if (isProjectMetadata(idComponent)) {
      // ? ProjectMetadata has cyclical data structures, so we account for that
      const {
        rootPackage: { projectMetadata: _, ...serializablePackage }
      } = idComponent;

      cacheKey.update(JSON.stringify(serializablePackage));
    } else {
      cacheKey.update(JSON.stringify(idComponent));
    }
  }

  return [internalScopedCache, cacheKey.digest('hex')];
}
