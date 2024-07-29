'use strict';
// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

// ? https://nodejs.org/en/about/releases
const NODE_LTS = 'maintained node versions';

const debug_ = require('debug');

// TODO: replace with 'package'
const pkgName = require('./package.json').name;

const debug = debug_(`${pkgName}:babel-config`);

debug('NODE_ENV: %O', process.env.NODE_ENV);

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  comments: false,
  parserOpts: { strictMode: true },
  assumptions: {
    constantReexports: true
  },
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    // ? This is required until tc39 makes up its mind
    '@babel/plugin-syntax-import-attributes',
    [
      'module-resolver',
      {
        root: '.',
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        // ! If changed, also update these aliases in tsconfig.json,
        // ! webpack.config.js, next.config.ts, eslint.config.js, and
        // ! jest.config.js
        alias: {
          '^package$': `./package.json`,
          '^multiverse/(.*)$': String.raw`./lib/\1`,
          '^extverse/(.*)$': String.raw`./external-scripts/\1`,
          '^universe/(.*)$': String.raw`./src/\1`,
          '^pkgverse/(.*)$': String.raw`./packages/\1`,
          '^testverse/(.*)$': String.raw`./test/\1`,
          '^typeverse/(.*)$': String.raw`./types/\1`
        }
      }
    ]
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
        ['@babel/preset-env', { targets: { node: true } }],
        ['@babel/preset-typescript', { allowDeclareFields: true }]
        // ? We don't care about minification
      ],
      plugins: [
        // TODO: investigate why this is causing a strange error with coverage
        // ? Only active when testing, the plugin solves the following problem:
        // ? https://stackoverflow.com/q/40771520/1367414
        //'explicit-exports-references'
      ]
    },
    // * Used by `npm run build` for compiling CJS to code output in ./dist
    'production-cjs': {
      presets: [
        [
          '@babel/preset-env',
          {
            // ? https://babeljs.io/docs/en/babel-preset-env#modules
            modules: 'cjs',
            targets: NODE_LTS,
            useBuiltIns: 'usage',
            corejs: '3.37',
            shippedProposals: true,
            exclude: ['transform-dynamic-import']
          }
        ],
        ['@babel/preset-typescript', { allowDeclareFields: true }]
      ],
      plugins: [
        [
          'babel-plugin-transform-rewrite-imports',
          {
            appendExtension: '.js',
            // TODO: fix this whole thing (do this index rewrite automatically)
            replaceExtensions: {
              // TODO: this should likely be implemented as a function that
              // TODO: resolves package.json properly regardless of depth
              // TODO: and then if they don't exist, throw
              '^../package.json$': '../../package.json',
              // TODO: implement these as functions as well that check each path
              // TODO: for existence and if they don't exist try to switch them
              // TODO: such as below and if they still don't exist then throw
              '^(.+)/debug-extended.js$': '$1/debug-extended/index.js',
              '^(.+)/rejoinder.js$': '$1/rejoinder/index.js',
              '^(.+)/@black-flag/extensions.js$': '$1/@black-flag/extensions/index.js',
              '^(([^/]*/)*lib/[^/]+)$': '$1/index'
            }
          }
        ]
      ]
    },
    // TODO: add production-esm too
    // TODO: add production-externals too (renamed from production-external)
    // * Used by `npm run build` for fixing declaration file imports in ./dist
    'production-types': {
      comments: true,
      plugins: [
        ['@babel/plugin-syntax-typescript', { dts: true }],
        [
          'transform-rewrite-imports',
          {
            // TODO: fix these to be generalized... and if they're general
            // TODO: enough, maybe even merge these into production-cjs
            replaceExtensions: {
              // ? Ensure deep package.json imports resolve properly
              '^../../../package.json$': '../../package.json',
              // ? Ensure deep imports resolve properly
              '^../../../(.*)$': '../$1'
            }
          }
        ]
      ]
    }
  }
};

debug('exports: %O', module.exports);
