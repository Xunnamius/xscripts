// @ts-check
/* eslint-disable @typescript-eslint/unbound-method */
'use strict';

const {
  dirname,
  join: joinPath,
  relative: toRelativePath,
  resolve: toAbsolutePath
} = require('node:path');

// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

// ? https://nodejs.org/en/about/releases
const NODE_LTS = 'maintained node versions';

const tsExtensionsToReplace = [
  // TODO: Replace with the extensions exports
  '.ts',
  '.tsx',
  '.mts',
  '.cts'
];

const dTsExtensionsToReplace = [
  ...tsExtensionsToReplace,
  // TODO: Replace with the extensions exports
  '.d.ts',
  // No .js
  '.jsx',
  '.mjs',
  '.cjs'
];

const endsWithPackageJsonRegExp = /(^|\/)package.json/;
const includesNodeModulesRegExp = /(^|\/)node_modules\//;
const grabEverythingUpToAndIncludingNodeModulesRegExp = /^(.*\/)?node_modules\//;
const translateJsExtensionsToTsRegExp = /(.+)\.(c|m)?ts(x)?$/;
const translateJsExtensionsToTsRegExpReplacer = '$1.$2js$3';

const dTsExtensionsToReplaceRegExp = new RegExp(
  `\\.(${dTsExtensionsToReplace.join('|').replaceAll('.', '')})$`
);

// {@xscripts/notExtraneous @babel/cli}

// TODO: replace extensions arrays with well known exports

// ! The aliases described in "alias" are auto-generated by xscripts. Instead of
// ! modifying it directly, consider regenerating aliases across the entire
// ! project: `xscripts project renovate --regenerate-aliases`; you can include
// ! custom aliases using the `--with-alias` parameter.
// * These aliases appear in:
// *   - tsconfig.json      (JSON)
// *   - babel.config.js    (CJS)
// *   - eslint.config.mjs  (ESM)
// *   - jest.config.mjs    (ESM)
// *   - next.config.mjs    (ESM)
// *   - webpack.config.mjs (ESM)
const wellKnownAliases = {
  '^universe (.+)$': String.raw`./src/\1`,
  '^universe$': './src/index.ts',
  '^multiverse#bfe (.+)$': String.raw`./packages/bfe/src/\1`,
  '^multiverse#babel-plugin-metadata-accumulator (.+)$': String.raw`./packages/babel-plugin-metadata-accumulator/src/\1`,
  '^multiverse#cli-utils (.+)$': String.raw`./packages/cli-utils/src/\1`,
  '^multiverse#debug (.+)$': String.raw`./packages/debug/src/\1`,
  '^multiverse#project-utils (.+)$': String.raw`./packages/project-utils/src/\1`,
  '^multiverse#rejoinder (.+)$': String.raw`./packages/rejoinder/src/\1`,
  '^multiverse#run (.+)$': String.raw`./packages/run/src/\1`,
  '^multiverse#bfe$': './packages/bfe/src/index.ts',
  '^multiverse#babel-plugin-metadata-accumulator$':
    './packages/babel-plugin-metadata-accumulator/src/index.ts',
  '^multiverse#cli-utils$': './packages/cli-utils/src/index.ts',
  '^multiverse#debug$': './packages/debug/src/index.ts',
  '^multiverse#project-utils$': './packages/project-utils/src/index.ts',
  '^multiverse#rejoinder$': './packages/rejoinder/src/index.ts',
  '^multiverse#run$': './packages/run/src/index.ts',
  '^testverse (.+)$': String.raw`./test/\1`,
  '^testverse#bfe (.+)$': String.raw`./packages/bfe/test/\1`,
  '^testverse#babel-plugin-metadata-accumulator (.+)$': String.raw`./packages/babel-plugin-metadata-accumulator/test/\1`,
  '^testverse#cli-utils (.+)$': String.raw`./packages/cli-utils/test/\1`,
  '^testverse#debug (.+)$': String.raw`./packages/debug/test/\1`,
  '^testverse#project-utils (.+)$': String.raw`./packages/project-utils/test/\1`,
  '^testverse#rejoinder (.+)$': String.raw`./packages/rejoinder/test/\1`,
  '^testverse#run (.+)$': String.raw`./packages/run/test/\1`,
  '^typeverse (.+)$': String.raw`./types/\1`,
  '^# (.+)$': String.raw`./\1`,
  '^#bfe (.+)$': String.raw`./packages/bfe/\1`,
  '^#babel-plugin-metadata-accumulator (.+)$': String.raw`./packages/babel-plugin-metadata-accumulator/\1`,
  '^#cli-utils (.+)$': String.raw`./packages/cli-utils/\1`,
  '^#debug (.+)$': String.raw`./packages/debug/\1`,
  '^#project-utils (.+)$': String.raw`./packages/project-utils/\1`,
  '^#rejoinder (.+)$': String.raw`./packages/rejoinder/\1`,
  '^#run (.+)$': String.raw`./packages/run/\1`
};

// TODO: import from util/constant
const isRelativePathRegExp = /^\.\.?(\/|$)/;

const babelPluginTransformRewriteImportsSourceModuleResolver = [
  // {@xscripts/notExtraneous babel-plugin-transform-rewrite-imports}
  'babel-plugin-transform-rewrite-imports',
  {
    appendExtension: '.js',
    recognizedExtensions: ['.js', '.jsx', '.cjs', '.mjs', '.json'],
    injectDynamicRewriter: 'never',
    replaceExtensions: {
      // ? Replace any aliases with their reified filesystem path
      ...Object.fromEntries(
        Object.entries(wellKnownAliases).map((alias) =>
          makeDistReplacerEntry(alias, 'source')
        )
      ),
      // ? Replace any TS extensions with their JS equivalents
      [translateJsExtensionsToTsRegExp.toString()]:
        translateJsExtensionsToTsRegExpReplacer
    }
  }
];

const babelPluginTransformRewriteImportsDefinitionModuleResolver = [
  // {@xscripts/notExtraneous babel-plugin-transform-rewrite-imports}
  'babel-plugin-transform-rewrite-imports',
  {
    appendExtension: '.js',
    recognizedExtensions: ['.js'],
    injectDynamicRewriter: 'never',
    replaceExtensions: {
      // ? Replace any aliases with their reified filesystem path
      ...Object.fromEntries(
        Object.entries(wellKnownAliases).map((alias) =>
          makeDistReplacerEntry(alias, 'definition')
        )
      ),
      // ? Replace any JS/TS extensions with .js (recognized by/as .d.ts)
      ...Object.fromEntries(dTsExtensionsToReplace.map((extension) => [extension, '.js']))
    }
  }
];

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
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
        // {@xscripts/notExtraneous @babel/preset-env}
        ['@babel/preset-env', { targets: { node: true } }],
        // {@xscripts/notExtraneous @babel/preset-typescript}
        ['@babel/preset-typescript', { allowDeclareFields: true }],
        // {@xscripts/notExtraneous @babel/preset-react}
        ['@babel/preset-react', { runtime: 'automatic' }]
        // ? We don't care about minification
      ],
      plugins: [
        // ? Jest handles transforming specifiers on its own
        //babelPluginTransformRewriteImportsSourceModuleResolver
        // TODO: investigate why this is causing a strange error with coverage
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
          // {@xscripts/notExtraneous @babel/preset-env}
          '@babel/preset-env',
          {
            // ? https://babeljs.io/docs/en/babel-preset-env#modules
            modules: 'cjs',
            targets: NODE_LTS,
            useBuiltIns: 'usage',
            corejs: '3.38',
            shippedProposals: true,
            exclude: ['transform-dynamic-import']
          }
        ],
        // {@xscripts/notExtraneous @babel/preset-typescript}
        ['@babel/preset-typescript', { allowDeclareFields: true }],
        // {@xscripts/notExtraneous @babel/preset-react}
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      plugins: [babelPluginTransformRewriteImportsSourceModuleResolver]
    },
    // TODO: add production-esm too
    // * Used by `npm run build` for fixing declaration file imports in ./dist
    'production-types': {
      comments: true,
      plugins: [
        // {@xscripts/notExtraneous @babel/plugin-syntax-typescript}
        ['@babel/plugin-syntax-typescript', { dts: true }],
        babelPluginTransformRewriteImportsDefinitionModuleResolver
      ]
    }
  }
};

// TODO: add debug calls in this function
/**
 * Takes a definition file (`.d.ts`) path relative to the project root and
 * returns a function that, when called, will return a path relative to the file
 * being transpiled by Babel.
 *
 * @param {[specifierRegExp: string, projectRootRelativeReplacerPath: string]} entry
 * @param {'source' | 'definition'} type
 * @returns {[string,
 * import('babel-plugin-transform-rewrite-imports').Callback<string>]}
 */
function makeDistReplacerEntry(
  [specifierRegExp, rawProjectRootRelativeReplacerPath],
  type
) {
  // ? Assuming the current working directory is always at a package root, an
  // ? invariant enforced by xscripts itself
  const packageRoot = process.cwd();
  // ? Assuming this file is always at the project root
  const projectRoot = __dirname;
  // ? Are we at the root package of a hybridrepo?
  const isCwdPackageTheRootPackage = projectRoot === packageRoot;
  // ? Remove the leading ./ if it exists
  const projectRootRelativeReplacerPath = joinPath(rawProjectRootRelativeReplacerPath);

  return [
    specifierRegExp,
    function ({ filepath: inputFilepath, capturingGroups }) {
      const originalSpecifier = capturingGroups[0];
      const specifierTarget = capturingGroups.at(1);
      const specifierSubRootPrefix =
        projectRoot === packageRoot ? '' : packageRoot.slice(projectRoot.length + 1);

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

      const isImportTargetAPackageJson = endsWithPackageJsonRegExp.test(
        importTargetProjectRootRelativeRealFilepath
      );

      const isImportTargetThePackageRootPackageJson =
        importTargetProjectRootRelativeRealFilepath ===
        joinPath(specifierSubRootPrefix, 'package.json');

      const isImportTargetTheProjectRootPackageJson =
        importTargetProjectRootRelativeRealFilepath === 'package.json';

      if (!isCwdPackageTheRootPackage && isImportTargetTheProjectRootPackageJson) {
        // TODO: replace with ErrorMessage.X
        throw new Error(
          `importing "${originalSpecifier}" from "${inputFilepath}" does not make sense in a monorepo`
        );
      }

      if (isImportTargetAPackageJson && !isImportTargetThePackageRootPackageJson) {
        // TODO: replace with rejoinder
        // eslint-disable-next-line no-console
        console.warn(
          `importing "${originalSpecifier}" from "${inputFilepath}" will cause additional package.json files to be included in build output. This may significantly increase the size of distributables`
        );
      }

      const importTargetIsValidlyOutsideDistDirectory =
        isImportTargetUnderAPackageRootNodeModules ||
        isImportTargetThePackageRootPackageJson;

      const importTargetPackageRootRelativeRealFilepath = isCwdPackageTheRootPackage
        ? importTargetProjectRootRelativeRealFilepath
        : sliceOffPackageRootPrefix(importTargetProjectRootRelativeRealFilepath);

      const importTargetOutputFilepath = toAbsolutePath(
        packageRoot,
        // ? Importables sometimes live outside the package's root directory
        // ? (like package.json, or node_modules) so we should facilitate access
        importTargetIsValidlyOutsideDistDirectory ? '' : 'dist',
        isImportTargetUnderAPackageRootNodeModules ? 'node_modules' : '',
        importTargetPackageRootRelativeRealFilepath
          .replace(grabEverythingUpToAndIncludingNodeModulesRegExp, '')
          // ? Ensure proper extension is used
          .replace(
            type === 'source'
              ? translateJsExtensionsToTsRegExp
              : dTsExtensionsToReplaceRegExp,
            type === 'source' ? translateJsExtensionsToTsRegExpReplacer : '.js'
          )
      );

      const result = toRelativePath(
        dirname(transpilationOutputFilepath),
        importTargetOutputFilepath
      );

      return (isRelativePathRegExp.test(result) ? '' : './') + result;

      function sliceOffPackageRootPrefix(path) {
        return path?.startsWith(specifierSubRootPrefix)
          ? path.slice((specifierSubRootPrefix.length || -1) + 1)
          : path || '';
      }
    }
  ];
}
