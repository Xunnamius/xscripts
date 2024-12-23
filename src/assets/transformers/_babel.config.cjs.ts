// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

import assert from 'node:assert';
import { statSync } from 'node:fs';

import findUp from 'find-up~5';
import semver from 'semver';

import { LogTag } from 'multiverse+cli-utils:logging.ts';

import {
  deriveAliasesForBabel,
  generateRawAliasMap,
  isDotRelativePathRegExp
} from 'multiverse+project-utils:alias.ts';

import { ProjectError } from 'multiverse+project-utils:error.ts';

import {
  babelConfigProjectBase,
  getCurrentWorkingDirectory,
  readXPackageJsonAtRoot,
  toAbsolutePath,
  toDirname,
  toPath,
  toRelativePath,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  flattenPackageJsonSubpathMap,
  resolveEntryPointsFromExportsTarget
} from 'multiverse+project-utils:resolver.ts';

import { createDebugLogger, createGenericLogger } from 'multiverse+rejoinder';

import { generateRootOnlyAssets, makeTransformer } from 'universe:assets.ts';

import {
  globalDebuggerNamespace,
  makeGeneratedAliasesWarningComment
} from 'universe:constant.ts';

import { ErrorMessage } from 'universe:error.ts';

import type { TransformOptions as BabelConfig } from '@babel/core';
import type { Options as BabelPresetEnvConfig } from '@babel/preset-env';

import type {
  Callback as TransformRewriteImportsCallback,
  Options as TransformRewriteImportsOptions
} from 'babel-plugin-transform-rewrite-imports';

import type { PackageJson } from 'type-fest';

// {@xscripts/notExtraneous @babel/cli}

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:babel`
});

const log = createGenericLogger({
  namespace: `${globalDebuggerNamespace}:asset:babel`
});

export type { BabelConfig };

/**
 * An array of NODE_ENV values recognized by this configuration file.
 */
export const wellKnownNodeEnvValues = [
  'development',
  'test',
  //'production',
  'production-esm',
  'production-cjs',
  'production-types'
] as const;

/**
 * Should be bumped manually and with caution.
 *
 * ! MUST ALWAYS FOLLOW THE SYNTAX X.X -OR- X.X.X (WHERE "X" ARE NUMERIC CHARS)
 */
export const CORE_JS_LIBRARY_VERSION = '3.39';

// ? https://nodejs.org/en/about/releases
export const NODE_LTS = 'maintained node versions';

/**
 * All known TypeScript file extensions supported by Babel (except `.d.ts`).
 */
export const extensionsTypescript = ['.ts', '.cts', '.mts', '.tsx'] as const;

/**
 * All known JavaScript file extensions supported by Babel.
 */
export const extensionsJavascript = [
  // ! .js must be the first extension in this array
  '.js',
  '.mjs',
  '.cjs',
  '.jsx'
] as const;

/**
 * All possible extensions accepted by Babel using standard xscripts configs
 * (except `.d.ts`).
 */
export const extensionsAcceptedByBabel = [
  ...extensionsTypescript,
  ...extensionsJavascript
] as const;

/**
 * Returns `true` if `path` points to a file with an extension accepted by Babel
 * (except `.d.ts`).
 *
 * @see {@link extensionsAcceptedByBabel}
 */
export function hasExtensionAcceptedByBabel(path: string) {
  return extensionsAcceptedByBabel.some((extension) => path.endsWith(extension));
}

/**
 * Returns `true` if `path` points to a file with a TypeScript extension (except
 * `.d.ts`).
 *
 * @see {@link extensionsTypescript}
 */
export function hasTypescriptExtension(path: string) {
  return extensionsTypescript.some((extension) => path.endsWith(extension));
}

/**
 * Returns `true` if `path` points to a file with a JavaScript extension.
 *
 * @see {@link extensionsJavascript}
 */
export function hasJavascriptExtension(path: string) {
  return extensionsTypescript.some((extension) => path.endsWith(extension));
}

const dTsExtensionsToReplace = [
  '.d.ts',
  // ? No .js
  ...extensionsJavascript.slice(1)
];

const endsWithPackageJsonRegExp = /(^|\/)package\.json$/;
const includesNodeModulesRegExp = /(^|\/)node_modules\//;
const grabEverythingUpToAndIncludingNodeModulesRegExp = /^(.*\/)?node_modules\//;
// ! Must end with a dollar sign
const translateJsExtensionsToTsRegExp = /(.+)\.(c|m)?ts(x)?$/;
const translateJsExtensionsToTsRegExpReplacer = '$1.$2js$3';

const dTsExtensionsToReplaceRegExp = new RegExp(
  `\\.(${dTsExtensionsToReplace.join('|').replaceAll('.', '')})$`
);

function makeTransformRewriteImportsSourceModuleResolver(
  derivedAliases: ReturnType<typeof deriveAliasesForBabel>,
  packageRoot: AbsolutePath,
  projectRoot: AbsolutePath
) {
  return [
    // {@xscripts/notExtraneous babel-plugin-transform-rewrite-imports}
    'babel-plugin-transform-rewrite-imports',
    {
      appendExtension: '.js',
      recognizedExtensions: ['.js', '.jsx', '.cjs', '.mjs', '.json'],
      injectDynamicRewriter: 'never',
      replaceExtensions: {
        // ? Replace any aliases with their reified filesystem path
        ...Object.fromEntries(
          Object.entries(derivedAliases).map((alias) =>
            makeDistReplacerEntry(
              alias as [string, RelativePath],
              'source',
              packageRoot,
              projectRoot
            )
          )
        ),
        // ? Replace any TS extensions with their JS equivalents
        [translateJsExtensionsToTsRegExp.toString().slice(1, -1)]:
          translateJsExtensionsToTsRegExpReplacer
      }
    } satisfies TransformRewriteImportsOptions
  ] as const;
}

function makeTransformRewriteImportsDefinitionModuleResolver(
  derivedAliases: ReturnType<typeof deriveAliasesForBabel>,
  packageRoot: AbsolutePath,
  projectRoot: AbsolutePath
) {
  return [
    // {@xscripts/notExtraneous babel-plugin-transform-rewrite-imports}
    'babel-plugin-transform-rewrite-imports',
    {
      // ? Don't append extensions to imports in .d.ts files (tsc sometimes spits
      // ? out import specifiers that rely on cjs-style extensionless import
      // ? rules)
      //appendExtension: '.js',
      recognizedExtensions: ['.js'],
      injectDynamicRewriter: 'never',
      replaceExtensions: {
        // ? Replace any aliases with their reified filesystem path
        ...Object.fromEntries(
          Object.entries(derivedAliases).map((alias) =>
            makeDistReplacerEntry(
              alias as [string, RelativePath],
              'definition',
              packageRoot,
              projectRoot
            )
          )
        ),
        // ? Replace any JS/TS extensions with .js (recognized by/as .d.ts)
        ...Object.fromEntries(
          dTsExtensionsToReplace.map((extension) => [extension, '.js'])
        )
      }
    } satisfies TransformRewriteImportsOptions
  ] as const;
}

export function moduleExport({
  derivedAliases,
  packageRoot,
  projectRoot
}: {
  derivedAliases: ReturnType<typeof deriveAliasesForBabel>;
  packageRoot: AbsolutePath;
  projectRoot: AbsolutePath;
}): BabelConfig {
  debug('derivedAliases: %O', derivedAliases);
  debug('packageRoot: %O', packageRoot);
  debug('projectRoot: %O', projectRoot);

  return {
    comments: false,
    parserOpts: { strictMode: true },
    generatorOpts: { importAttributesKeyword: 'with' },
    assumptions: { constantReexports: true },
    plugins: [
      // {@xscripts/notExtraneous @babel/plugin-proposal-export-default-from}
      '@babel/plugin-proposal-export-default-from'
    ],
    // ? Sub-keys under the "env" config key will augment the above
    // ? configuration depending on the value of NODE_ENV and friends. Default
    // ? is: development
    env: {
      // * Used by Jest and `npm test`
      test: {
        comments: true,
        sourceMaps: 'inline',
        presets: [
          // {@xscripts/notExtraneous @babel/preset-env @types/babel__preset-env}
          [
            '@babel/preset-env',
            { targets: { node: true } } satisfies BabelPresetEnvConfig
          ],
          // {@xscripts/notExtraneous @babel/preset-typescript}
          ['@babel/preset-typescript', { allowDeclareFields: true }],
          // {@xscripts/notExtraneous @babel/preset-react}
          ['@babel/preset-react', { runtime: 'automatic' }]
          // ? We don't care about minification
        ],
        plugins: [
          // ? Jest handles transforming specifiers on its own
          //babelPluginTransformRewriteImportsSourceModuleResolver
          // TODO: explicit-exports-references need to be updated to work with
          // TODO: latest babel mode (need to rename usage, rather than exports)
          // ? Only active when testing, the plugin solves the following problem:
          // ? https://stackoverflow.com/q/40771520/1367414
          // {@xscripts/notExtraneous babel-plugin-explicit-exports-references}
          //'babel-plugin-explicit-exports-references'
        ]
      },
      // * Used by `npm run build` for compiling CJS to code output in ./dist
      'production-cjs': {
        presets: [
          [
            // {@xscripts/notExtraneous @babel/preset-env @types/babel__preset-env}
            '@babel/preset-env',
            {
              // ? https://babeljs.io/docs/en/babel-preset-env#modules
              modules: 'cjs',
              targets: NODE_LTS,
              useBuiltIns: 'usage',
              corejs: doCoreJsVersionChecksAndReturnHardcodedVersion({ packageRoot }),
              shippedProposals: true,
              exclude: ['transform-dynamic-import']
            } satisfies BabelPresetEnvConfig
          ],
          // {@xscripts/notExtraneous @babel/preset-typescript}
          ['@babel/preset-typescript', { allowDeclareFields: true }],
          // {@xscripts/notExtraneous @babel/preset-react}
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        plugins: [
          makeTransformRewriteImportsSourceModuleResolver(
            derivedAliases,
            packageRoot,
            projectRoot
          )
        ]
      },
      // TODO: add production-esm too
      // * Used by `npm run build` for fixing declaration file imports in ./dist
      'production-types': {
        comments: true,
        plugins: [
          // {@xscripts/notExtraneous @babel/plugin-syntax-typescript}
          ['@babel/plugin-syntax-typescript', { dts: true }],
          makeTransformRewriteImportsDefinitionModuleResolver(
            derivedAliases,
            packageRoot,
            projectRoot
          )
        ]
      }
    }
  };
}

/**
 * @see {@link assertEnvironment}
 */
export const { transformer } = makeTransformer(function (context) {
  const { asset, shouldDeriveAliases, projectMetadata, toProjectAbsolutePath } = context;
  const derivedAliasesSourceSnippet = shouldDeriveAliases
    ? `return ${JSON.stringify(
        deriveAliasesForBabel(generateRawAliasMap(projectMetadata)),
        undefined,
        4
      ).replace(/^}/m, '  }')}`
    : 'return {}';

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(babelConfigProjectBase),
        generate: () => /*js*/ `
// @ts-check
'use strict';

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  assertEnvironment,
  moduleExport
} = require('@-xun/scripts/assets/${asset}');

// TODO: publish latest rejoinder package first, then update configs to use it
//const { createDebugLogger } = require('rejoinder');

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:babel' });*/

module.exports = deepMergeConfig(
  moduleExport({
    derivedAliases: getBabelAliases(),
    ...assertEnvironment({ projectRoot: __dirname })
  }),
  /**
   * @type {import('@-xun/scripts/assets/${asset}').BabelConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport's result
  }
);

/*debug('exported config: %O', module.exports);*/

function getBabelAliases() {
${makeGeneratedAliasesWarningComment(2)}
  ${derivedAliasesSourceSnippet}
}
`
      }
    ];
  });
});

/**
 * @see {@link moduleExport}
 */
export function assertEnvironment({
  projectRoot
}: {
  projectRoot: string;
}): Omit<Parameters<typeof moduleExport>[0], 'derivedAliases'> {
  const mode = (process.env.NODE_ENV ||
    '(undefined)') as (typeof wellKnownNodeEnvValues)[number];

  if (!wellKnownNodeEnvValues.includes(mode)) {
    throw new ProjectError(
      ErrorMessage.ConfigAssetEnvironmentValidationFailed(
        'babel',
        mode,
        wellKnownNodeEnvValues
      )
    );
  }

  const packageRoot = getCurrentWorkingDirectory();

  return { projectRoot: toAbsolutePath(projectRoot), packageRoot };
}

/**
 * Returns the core-js version to use with babel (always
 * {@link CORE_JS_LIBRARY_VERSION}). Usually it should just be whatever
 * `@-xun/scripts` is providing, but it could be the case that the current
 * package supplies its own version of `core-js` (and prevents `@-xun/scripts`'s
 * version from being hoisted). In this case, we should try to use their
 * version.
 */
function doCoreJsVersionChecksAndReturnHardcodedVersion({
  packageRoot
}: {
  packageRoot: AbsolutePath;
}) {
  debug('packageRoot: %O', packageRoot);

  const coreJsLibraryVersion = semver.coerce(CORE_JS_LIBRARY_VERSION)?.version;

  debug('coreJsLibraryVersion: %O', coreJsLibraryVersion);
  assert(coreJsLibraryVersion, ErrorMessage.GuruMeditation());

  const {
    name: packageName,
    dependencies: { 'core-js': cwdPackageCoreJsDependency_ } = {}
  } = readXPackageJsonAtRoot.sync(packageRoot, { useCached: true, try: true });

  const cwdPackageCoreJsDependency =
    semver.validRange(cwdPackageCoreJsDependency_) || undefined;

  debug('packageName (current package): %O', packageName);
  debug('cwdPackageCoreJsDependency_: %O', cwdPackageCoreJsDependency_);
  debug('cwdPackageCoreJsDependency: %O', cwdPackageCoreJsDependency);

  if (cwdPackageCoreJsDependency) {
    const { version: resolvedCoreJsVersion } = (() => {
      try {
        return require('core-js/package.json') as PackageJson;
      } catch (error) {
        debug.error('attempt to read core-js package.json failed: %O', error);
        return {};
      }
    })();

    debug('resolvedCoreJsVersion: %O', resolvedCoreJsVersion);

    if (resolvedCoreJsVersion) {
      // * At this point, any error conditions are catastrophic enough that the
      // * build process must be abruptly aborted

      const isResolvedVersionLessThanLibraryVersion =
        semver.compare(resolvedCoreJsVersion, coreJsLibraryVersion) === -1;

      if (isResolvedVersionLessThanLibraryVersion) {
        throw new ProjectError(
          ErrorMessage.BabelCorejsInstalledVersionTooOld(
            coreJsLibraryVersion,
            CORE_JS_LIBRARY_VERSION,
            resolvedCoreJsVersion,
            packageRoot
          )
        );
      }

      const isCwdPackageDependencyNotSatisfiedByLibraryVersion = semver.valid(
        cwdPackageCoreJsDependency
      )
        ? !semver.satisfies(cwdPackageCoreJsDependency, `^${coreJsLibraryVersion}`)
        : !semver.satisfies(coreJsLibraryVersion, cwdPackageCoreJsDependency);

      if (isCwdPackageDependencyNotSatisfiedByLibraryVersion) {
        throw new ProjectError(
          ErrorMessage.BabelCorejsInstalledVersionRangeNotSatisfactory(
            coreJsLibraryVersion,
            CORE_JS_LIBRARY_VERSION,
            cwdPackageCoreJsDependency,
            packageName,
            packageRoot
          )
        );
      }
    } else {
      // * We don't throw an error here to be kind to the build process; this
      // * error should cause problems with Babel, which should do the reporting
      log.warn(
        [LogTag.IF_NOT_QUIETED],
        ErrorMessage.specialized.BabelCorejsVersionUnresolvable(
          coreJsLibraryVersion,
          CORE_JS_LIBRARY_VERSION
        )
      );
    }
  } else {
    // * We don't throw an error here to be kind to the build process; this
    // * error should be caught by post-build checks from "xscripts build"
    log.warn(
      [LogTag.IF_NOT_QUIETED],
      ErrorMessage.specialized.BabelCorejsDependencyMissing(
        coreJsLibraryVersion,
        CORE_JS_LIBRARY_VERSION,
        cwdPackageCoreJsDependency,
        packageName,
        packageRoot
      )
    );
  }

  return CORE_JS_LIBRARY_VERSION;
}

/**
 * Takes a definition file (`.d.ts`) path relative to the project root and
 * returns a function that, when called, will return a path relative to the file
 * being transpiled by Babel after performing some light validation.
 */
function makeDistReplacerEntry(
  [specifierRegExp, rawProjectRootRelativeReplacerPath]: [string, RelativePath],
  type: 'source' | 'definition',
  packageRoot: AbsolutePath,
  projectRoot: AbsolutePath
): [typeof specifierRegExp, TransformRewriteImportsCallback<RelativePath>] {
  // ? Are we at the root package of a hybridrepo/polyrepo?
  const isCwdPackageTheRootPackage = projectRoot === packageRoot;

  // ? Remove the leading ./ if it exists
  const projectRootRelativeReplacerPath = toPath(rawProjectRootRelativeReplacerPath);

  // ? A local cache mapping absolute paths (resolved from import specifiers)
  // ? to valid path-like entry points beginning with a package name in
  // ? node_modules and potentially followed by a slash and a path
  const knownEntrypoints: Record<AbsolutePath, RelativePath | undefined> = {};

  return [
    specifierRegExp,
    function ({ filepath: inputFilepath_, capturingGroups }) {
      const inputFilepath = toAbsolutePath(inputFilepath_);
      const originalSpecifier = capturingGroups[0];
      const specifierTarget = capturingGroups.at(1);
      const specifierSubRootPrefix = toRelativePath(
        projectRoot === packageRoot ? '' : packageRoot.slice(projectRoot.length + 1)
      );

      const transpilationOutputFilepath =
        type === 'source'
          ? // ? We need to account for sources being outside /dist while
            // ? definitions are already inside /dist
            toAbsolutePath(
              packageRoot,
              'dist',
              inputFilepath.slice(projectRoot.length + 1)
            )
          : inputFilepath;

      const importTargetProjectRootRelativeRealFilepath = projectRootRelativeReplacerPath
        // ? Ensure proper replacer syntax is used
        .replace(String.raw`\1`, sliceOffPackageRootPrefix(specifierTarget));

      const isImportTargetUnderAPackageRootNodeModules = includesNodeModulesRegExp.test(
        importTargetProjectRootRelativeRealFilepath
      );

      // ? We're assuming all package.json files being imported belong to a root
      const isImportTargetAPackageJson = endsWithPackageJsonRegExp.test(
        importTargetProjectRootRelativeRealFilepath
      );

      const isImportTargetThePackageRootPackageJson =
        importTargetProjectRootRelativeRealFilepath ===
        toPath(specifierSubRootPrefix, 'package.json');

      if (isImportTargetAPackageJson && !isImportTargetThePackageRootPackageJson) {
        log.warn(
          [LogTag.IF_NOT_QUIETED],
          ErrorMessage.specialized.BabelCorejsEgregiousPackageJsonFileInBuildOutput(
            originalSpecifier,
            inputFilepath
          )
        );
      }

      const importTargetIsValidlyOutsideDistDirectory =
        // ? node_modules is always outside the ./dist directory
        isImportTargetUnderAPackageRootNodeModules ||
        // ? When cwd is not the root package, any package.json counts as
        // ? outside the ./dist directory
        (!isCwdPackageTheRootPackage && isImportTargetAPackageJson) ||
        // ? When cwd is the root package, sub-root package.json imports, while
        // ? ill-advised, are not actually outside the ./dist directory
        (isCwdPackageTheRootPackage && isImportTargetThePackageRootPackageJson);

      const importTargetOutputFilepath = toAbsolutePath(
        packageRoot,
        // ? Importables sometimes live outside the package's root directory
        // ? (like package.json, or node_modules) so we should facilitate access
        importTargetIsValidlyOutsideDistDirectory ? '' : 'dist',
        isImportTargetUnderAPackageRootNodeModules ? 'node_modules' : '',
        isImportTargetThePackageRootPackageJson
          ? sliceOffPackageRootPrefix(importTargetProjectRootRelativeRealFilepath)
          : importTargetProjectRootRelativeRealFilepath
              .replace(grabEverythingUpToAndIncludingNodeModulesRegExp, '')
              // ? Ensure proper extension is used
              .replace(
                type === 'source'
                  ? translateJsExtensionsToTsRegExp
                  : dTsExtensionsToReplaceRegExp,
                type === 'source' ? translateJsExtensionsToTsRegExpReplacer : '.js'
              )
      );

      // * Note how we purposely avoided adding missing extensions to the
      // * filepath above

      if (isImportTargetUnderAPackageRootNodeModules) {
        // ? Attempt to resolve this precarious node_modules path into a bare
        // ? package specifier that is more resilient to hoisting
        if (!knownEntrypoints[importTargetOutputFilepath]) {
          const isDir = statSync(importTargetOutputFilepath).isDirectory();
          const packageJsonFile = findUp.sync('package.json', {
            cwd: isDir
              ? importTargetOutputFilepath
              : toDirname(importTargetOutputFilepath)
          }) as AbsolutePath | undefined;

          if (packageJsonFile) {
            const packageDir = toDirname(packageJsonFile);

            const {
              exports: packageExports,
              name: packageName,
              types: packageTypes
            } = readXPackageJsonAtRoot.sync(packageDir, {
              useCached: true
            });

            assert(packageName);

            if (packageExports) {
              // ? For perf reasons, we only attempt resolutions in definition
              // ? files at the moment
              if (type === 'definition') {
                const flatXports = flattenPackageJsonSubpathMap({ map: packageExports });
                const target =
                  './' + toRelativePath(packageDir, importTargetOutputFilepath);

                const options = {
                  flattenedExports: flatXports,
                  target,
                  conditions: ['types', 'require', 'import', 'node']
                };

                let entrypoints = resolveEntryPointsFromExportsTarget(options);

                // ? I believe tsc also does shortest-path-wins
                if (!entrypoints.length) {
                  entrypoints = resolveEntryPointsFromExportsTarget({
                    ...options,
                    target: target + '.d.ts'
                  });
                }

                if (!entrypoints.length) {
                  entrypoints = resolveEntryPointsFromExportsTarget({
                    ...options,
                    target: target.replace(/\.js$/, '.d.ts')
                  });
                }

                if (!entrypoints.length) {
                  entrypoints = resolveEntryPointsFromExportsTarget({
                    ...options,
                    target: target + '/index.d.ts'
                  });
                }

                // ? Try fallbacks

                if (!entrypoints.length && packageTypes) {
                  entrypoints = resolveEntryPointsFromExportsTarget({
                    ...options,
                    target: packageTypes
                  });
                }

                knownEntrypoints[importTargetOutputFilepath] = entrypoints
                  .at(0)
                  ?.replace('.', packageName) as RelativePath;
              }
            } else {
              const result = importTargetOutputFilepath.split('node_modules/').at(-1) as
                | RelativePath
                | undefined;

              if (result) {
                knownEntrypoints[importTargetOutputFilepath] = result;
              }
            }
          }
        }

        if (knownEntrypoints[importTargetOutputFilepath]) {
          return knownEntrypoints[importTargetOutputFilepath];
        }
      }

      const result = toRelativePath(
        toDirname(transpilationOutputFilepath),
        importTargetOutputFilepath
      );

      return ensureStringStartsWithDotSlash(result);

      function sliceOffPackageRootPrefix(path: string | undefined) {
        return path?.startsWith(specifierSubRootPrefix)
          ? path.slice((specifierSubRootPrefix.length || -1) + 1)
          : path || '';
      }

      function ensureStringStartsWithDotSlash(result: string) {
        return toRelativePath(
          (isDotRelativePathRegExp.test(result) ? '' : './') + result
        );
      }
    }
  ];
}
