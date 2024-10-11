import assert from 'node:assert';
import { resolve } from 'node:path';
import { isNativeError } from 'node:util/types';

import { TrialError } from 'named-app-errors';
import { resolve as resolverLibrary } from 'resolve.exports';

import { runNoRejectOnBadExit } from 'multiverse#run';

import { type AbsolutePath } from '#project-utils src/fs/index.ts';

import type { PackageJson } from 'type-fest';

const DUMMY_PKG_DIR = resolve(__dirname, '..', 'fixtures', 'dummy-pkg') as AbsolutePath;

export const availableDummyPackages = [
  'root',
  'simple',
  'complex',
  'sugared',
  'unlimited',
  'defaults'
] as const;

export type AvailableDummyPackages = (typeof availableDummyPackages)[number];

/**
 * Represents the dummy package metadata returned by the `getDummyPackage`
 * function.
 */
export type DummyPackageMetadata<
  RequireObjectImports extends boolean = false,
  RequireObjectExports extends boolean = false
> = {
  path: AbsolutePath;
  name: string;
  packageJson: PackageJson;

  imports: RequireObjectImports extends true
    ? Exclude<PackageJson.Imports, string | undefined | null | unknown[]>
    : PackageJson.Imports | undefined;

  exports: RequireObjectExports extends true
    ? Exclude<PackageJson.Exports, string | undefined | null | unknown[]>
    : PackageJson.Exports | undefined;
};

/**
 * Represents the summary of an import resolution attempt.
 */
export type ResolvedSummary = {
  resolvedTarget: string | null;
  resolverSubpath: string;
  isExportedTypescriptType: boolean;
};

/**
 * Return metadata about an available dummy package.
 */
export function getDummyPackage<
  RequireObjectImports extends boolean = false,
  RequireObjectExports extends boolean = false
>(
  id: AvailableDummyPackages,
  options?: {
    /**
     * If `true`, `imports` must be an object and not `null`, `undefined`,
     * `string`, or an array.
     *
     * @default false
     */
    requireObjectImports?: RequireObjectImports;
    /**
     * If `true`, `exports` must be an object and not `null`, `undefined`,
     * `string`, or an array.
     *
     * @default false
     */
    requireObjectExports?: RequireObjectExports;
  }
): DummyPackageMetadata<RequireObjectImports, RequireObjectExports> {
  const { requireObjectImports, requireObjectExports } = options ?? {};

  const pkg = {
    path: '',
    json: {} as PackageJson
  };

  if (id === 'root') {
    pkg.path = DUMMY_PKG_DIR;
    pkg.json = require(`${pkg.path}/package.json`);
  } else if (availableDummyPackages.includes(id)) {
    pkg.path = `${DUMMY_PKG_DIR}/node_modules/dummy-${id}-pkg`;
    pkg.json = require(`${pkg.path}/package.json`);
  }

  if (!pkg.json.name) {
    throwNewError('package.json is missing "name" field');
  }

  if (
    requireObjectImports &&
    (!pkg.json.imports ||
      typeof pkg.json.imports === 'string' ||
      Array.isArray(pkg.json.imports))
  ) {
    throwNewError('package.json has string, array, null, or undefined "imports" field');
  }

  if (
    requireObjectExports &&
    (!pkg.json.exports ||
      typeof pkg.json.exports === 'string' ||
      Array.isArray(pkg.json.exports))
  ) {
    throwNewError('package.json has string, array, null, or undefined "exports" field');
  }

  return {
    path: pkg.path,
    name: pkg.json.name,
    imports: pkg.json.imports,
    exports: pkg.json.exports,
    packageJson: pkg.json
  } as DummyPackageMetadata<RequireObjectImports, RequireObjectExports>;

  function throwNewError(error: string): never {
    throw new TrialError(`unable to get package "${id}": ${error}`);
  }
}

/**
 * Resolves a subpath to a target using the Node.js runtime. This function is
 * used to ensure project-utils's resolver functions follow the Node.js resolver
 * spec.
 */
export async function resolveTargetWithNodeJs({
  packageName,
  rootPackagePath,
  subpath,
  conditions
}: {
  /**
   * Name of the package to resolve subpaths against.
   */
  packageName: string;
  /**
   * Path to the root of the package that contains the `packageName` package in
   * its `node_modules` directory if testing `exports` or the path to the root
   * of the `packageName` package if testing `imports`.
   */
  rootPackagePath: string;
  /**
   * The subpath to resolve against the `packageName` package. Must start with
   * either "#" or "./" or be "." exactly or the behavior of this function is
   * undefined.
   *
   * Note that if the subpath ends in the strings "package" or ".json", the
   * import will use the "type: json" attribute.
   */
  subpath: string;
  /**
   * Conditions to match against during subpath resolution.
   */
  conditions: string[];
}): Promise<ResolvedSummary> {
  const specifier = subpath.startsWith('#')
    ? subpath
    : `${packageName}${subpath.slice(1)}`;

  const result = await runNoRejectOnBadExit(
    'node',
    [
      '--loader',
      `${__dirname}/../fixtures/node-loader.mjs`,
      '--input-type',
      'module',
      '--eval',
      `import "${specifier}"${
        specifier.endsWith('package') || specifier.endsWith('.json')
          ? ' with { type: "json" }'
          : ''
      };`
    ].concat(conditions.map((condition) => `--conditions=${condition}`)),
    { cwd: rootPackagePath, all: true }
  );

  assert(typeof result.all === 'string');

  const [resolvedSpecifier, resolvedTarget] =
    result.all.match(/^(.*?) => (.*?)$/m)?.slice(1) ?? ([] as undefined[]);

  if (
    result.all.includes('ERR_PACKAGE_PATH_NOT_EXPORTED') ||
    result.all.includes('ERR_PACKAGE_IMPORT_NOT_DEFINED')
  ) {
    return {
      resolvedTarget: null,
      resolverSubpath: subpath,
      isExportedTypescriptType: false
    };
  }

  if (!resolvedTarget || !resolvedSpecifier) {
    throw new TrialError(
      `unable to resolve specifier "${specifier}" at ${rootPackagePath} with conditions: "${
        conditions.join('", "') || 'default'
      }"\n\nNode.js process output: ${result.all}`
    );
  }

  const summary: ResolvedSummary = {
    resolvedTarget,
    resolverSubpath: resolvedSpecifier.replace(packageName, '.'),
    isExportedTypescriptType:
      !!result.all.includes('ERR_UNKNOWN_FILE_EXTENSION') &&
      resolvedTarget.endsWith('.d.ts')
  };

  return summary;
}

/**
 * Resolves a subpath to a target using the resolve.exports library. This
 * function is used to ensure project-utils's resolver functions return results
 * that coincide with resolve.exports in the interest of ecosystem
 * interoperability.
 */
export function resolveTargetWithResolveExports({
  packageJson,
  subpath,
  conditions
}: {
  /**
   * Contents of the `package.json` file of the package under test.
   */
  packageJson: PackageJson;
  /**
   * The subpath to resolve against the `packageName` package. Must start with
   * either "#" or "./" or be "." exactly.
   */
  subpath: string;
  /**
   * Conditions to match against during target resolution.
   */
  conditions: string[];
}): ResolvedSummary & { allResolvedTargets: ResolvedSummary['resolvedTarget'][] } {
  if (!(subpath.startsWith('#') || subpath.startsWith('./') || subpath === '.')) {
    throw new TrialError('subpath must start with "#" or "./", or strictly equal "."');
  }

  const result = (() => {
    try {
      const result = resolverLibrary(packageJson, subpath, { unsafe: true, conditions });
      if (result === undefined) {
        throw new TypeError('resolve.exports unexpectedly returned `undefined`');
      }
      return result;
    } catch (error) {
      if (
        isNativeError(error) &&
        (error.message.includes(`No known conditions for "${subpath}" specifier`) ||
          error.message.includes(`Missing "${subpath}" specifier`))
      ) {
        return [null];
      }

      throw new TrialError(
        `resolve.exports failed to resolve target "${subpath}" with conditions: "${
          conditions.join('", "') || 'default'
        }"\n\nError thrown by resolve.exports: ${String(error)}`
      );
    }
  })();

  return {
    resolvedTarget: result[0],
    allResolvedTargets: result,
    resolverSubpath: subpath,
    isExportedTypescriptType: !!result[0]?.endsWith('.d.ts')
  };
}