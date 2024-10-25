// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe assets.ts';

import { globalDebuggerNamespace } from 'universe constant.ts';

import type { EmptyObject } from 'type-fest';

// ? https://nodejs.org/en/about/releases
export const NODE_LTS = 'maintained node versions';

/**
 * All known TypeScript file extensions supported by Babel.
 */
export const extensionsTypescript = ['.ts', '.cts', '.mts', '.tsx'] as const;

/**
 * All known JavaScript file extensions supported by Babel.
 */
export const extensionsJavascript = ['.js', '.mjs', '.cjs', '.jsx'] as const;

/**
 * All possible extensions accepted by Babel using standard xscripts configs.
 */
export const extensionsAcceptedByBabel = [
  ...extensionsTypescript,
  ...extensionsJavascript
] as const;

/**
 * Returns `true` if `path` points to a file with an extension accepted by
 * Babel.
 *
 * @see {@link extensionsAcceptedByBabel}
 */
export function hasExtensionAcceptedByBabel(path: string) {
  return extensionsAcceptedByBabel.some((extension) => path.endsWith(extension));
}

/**
 * Returns `true` if `path` points to a file with a TypeScript extension.
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

export const babelExpectedEnvironment = [
  'development',
  'test',
  //'production',
  'production-esm',
  'production-cjs',
  'production-types'
] as const;

export function moduleExport() {
  return {
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
          // TODO: update this with latest changes
          // ! If changed, also update these aliases in tsconfig.json,
          // ! webpack.config.mjs, next.config.ts, eslint.config.mjs, and jest.config.mjs
          alias: {
            '^universe/(.+)$': String.raw`./src/\1`,
            '^multiverse/(.+)$': String.raw`./lib/\1`,
            '^pkgverse/(.+)$': String.raw`./packages/\1`,
            '^extverse/(.+)$': String.raw`./external-scripts/\1`,
            '^testverse/(.+)$': String.raw`./test/\1`,
            '^typeverse/(.+)$': String.raw`./types/\1`,
            '^package$': `./package.json`
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
          // ? Only active when testing, the plugin solves the following problem:
          // ? https://stackoverflow.com/q/40771520/1367414
          'explicit-exports-references'
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
              corejs: '3.38',
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
                '^(.+)/debug.js$': '$1/debug/index.js',
                '^(.+)/rejoinder.js$': '$1/rejoinder/index.js',
                '^(.+)/@black-flag/extensions.js$': '$1/@black-flag/extensions/index.js',
                '^(([^/]*/)*lib/[^/]+)$': '$1/index'
              }
            }
          ]
        ]
      },
      // TODO: add production-esm too
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
                '^../../../(.+)$': '../$1'
              }
            }
          ]
        ]
      }
    }
  };
}

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
// @ts-check
'use strict';

/*const { createDebugLogger } = require('debug');
const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:babel'
});*/

const { deepMergeConfig } = require('@-xun/scripts/assets');

const {
  moduleExport,
  babelExpectedEnvironment
} = require('@-xun/scripts/assets/config/${name}');

const nodeEnv = process.env.NODE_ENV;

/*debug('node env: %O', nodeEnv);*/

if (!babelExpectedEnvironment.includes(nodeEnv)) {
  throw new Error(
    'babel expects NODE_ENV to be one of either: ' + babelExpectedEnvironment.join(', ')
  );
}

module.exports = deepMergeConfig(moduleExport(), {
  // Any custom configs here will be deep merged with moduleExport's result
});

/*debug('exported config: %O', module.exports);*/
`.trimStart()
    };
  }
});
