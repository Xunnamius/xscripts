import assert from 'node:assert';

import { fixupConfigRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import restrictedGlobals from 'confusing-browser-globals';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsGlobals from 'globals';

import {
  config as makeTsEslintConfig,
  configs as eslintTsConfigs,
  parser as eslintTsParser
} from 'typescript-eslint';

// TODO: replace with @-xun/project
import { analyzeProjectStructure } from './dist/packages/project-utils/src/index.js';

const $verse = Symbol('verse');

/*import { createDebugLogger } from 'debug';
import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/config/eslint.config.mjs';*/

// TODO: publish latest rejoinder package first, then update configs to use it
/*const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:eslint'
});

const config = deepMergeConfig(moduleExport, {
  // Any custom configs here will be deep merged with moduleExport
});*/

// TODO: replace the rest of this with _eslint.config.mjs moduleExports

const tsconfigProject = 'tsc.project.lint-unlimited.json';
const jsFileExtensions = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'];

// ! The aliases described in "wellKnownPackageAliases" are auto-generated by
// ! xscripts. Instead of modifying it directly, consider regenerating aliases
// ! across the entire project: `xscripts project renovate --regenerate-aliases`;
// ! you can include custom aliases using the `--with-alias` parameter.
// * These aliases appear in:
// *   - tsconfig.json      (JSON)
// *   - babel.config.js    (CJS)
// *   - eslint.config.mjs  (ESM)
// *   - jest.config.mjs    (ESM)
// *   - next.config.mjs    (ESM)
// *   - webpack.config.mjs (ESM)
// TODO: replace this with the auto-generated unified alias configuration
/**
 * @renovate eslint-aliases
 */
const wellKnownPackageAliases = [
  ['multiverse#run *', './packages/run/src/*'],
  ['multiverse#rejoinder *', './packages/rejoinder/src/*'],
  ['multiverse#project-utils *', './packages/project-utils/src/*'],
  ['multiverse#debug *', './packages/debug/src/*'],
  ['multiverse#cli-utils *', './packages/cli-utils/src/*'],
  ['multiverse#bfe *', './packages/bfe/src/*'],
  [
    'multiverse#babel-plugin-metadata-accumulator *',
    './packages/babel-plugin-metadata-accumulator/src/*'
  ],
  ['multiverse#run', './packages/run/src/index.js'],
  ['multiverse#rejoinder', './packages/rejoinder/src/index.js'],
  ['multiverse#project-utils', './packages/project-utils/src/index.js'],
  ['multiverse#debug', './packages/debug/src/index.js'],
  ['multiverse#cli-utils', './packages/cli-utils/src/index.js'],
  ['multiverse#bfe', './packages/bfe/src/index.js'],
  [
    'multiverse#babel-plugin-metadata-accumulator',
    './packages/babel-plugin-metadata-accumulator/src/index.js'
  ],
  ['#run *', './packages/run/*'],
  ['#rejoinder *', './packages/rejoinder/*'],
  ['#project-utils *', './packages/project-utils/*'],
  ['#debug *', './packages/debug/*'],
  ['#cli-utils *', './packages/cli-utils/*'],
  ['#bfe *', './packages/bfe/*'],
  [
    '#babel-plugin-metadata-accumulator *',
    './packages/babel-plugin-metadata-accumulator/*'
  ],
  ['# *', './*'],
  ['universe *', './src/*'],
  ['universe', './src/index.js'],
  ['testverse#run *', './packages/run/test/*'],
  ['testverse#rejoinder *', './packages/rejoinder/test/*'],
  ['testverse#project-utils *', './packages/project-utils/test/*'],
  ['testverse#debug *', './packages/debug/test/*'],
  ['testverse#cli-utils *', './packages/cli-utils/test/*'],
  ['testverse#bfe *', './packages/bfe/test/*'],
  [
    'testverse#babel-plugin-metadata-accumulator *',
    './packages/babel-plugin-metadata-accumulator/test/*'
  ],
  ['testverse *', './test/*'],
  ['typeverse *', './types/*']
];

const genericRules = {
  // * eslint
  'no-console': 'warn',
  // ? We rely on https://typescript-eslint.io/rules/return-await instead
  // ? since this rule is now deprecated (and for good reason)
  'no-return-await': 'off',
  'no-await-in-loop': 'warn',
  'no-restricted-globals': ['warn', ...restrictedGlobals],
  'no-empty': 'off',
  // ? Ever since v4, we will rely on TypeScript to catch these
  'no-undef': 'off',
  'no-unused-vars': 'off',
  eqeqeq: 'warn',

  // * import
  // TODO: replace with fork that fixes this (fix is: ignorePackages should only
  // TODO: ignore stuff that resolves into node_modules)
  // TODO: https://github.com/import-js/eslint-plugin-import/blob/v2.31.0/docs/rules/extensions.md
  'import/extensions': [
    'error',
    'always',
    { ignorePackages: true, checkTypeImports: true }
  ],
  'import/no-duplicates': ['warn', { 'prefer-inline': true }],
  'import/no-unresolved': ['error', { commonjs: true }],
  'import/no-empty-named-blocks': 'warn',
  'import/first': 'warn',
  'import/newline-after-import': 'warn',
  'import/no-relative-packages': 'warn',
  'import/no-absolute-path': 'warn',
  'import/no-cycle': 'warn',
  'import/no-self-import': 'warn',
  'import/order': [
    'warn',
    {
      alphabetize: { order: 'asc', caseInsensitive: true },
      named: {
        enabled: true,
        types: 'types-last'
      },
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index'],
        ['object', 'type']
      ],
      // TODO: perhaps this should be an importable function from asset config?
      // TODO: either way, should use toSorted() instead of this slice() thing
      pathGroups: wellKnownPackageAliases
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce((groups, [alias]) => {
          const verse = alias.split(' ')[0].split('#')[0];
          const previousVerse = groups.at(-1)?.[$verse];

          // ? Collapse imports from the same verse into the same block
          if (previousVerse !== verse) {
            groups.push({
              // ? This is a minimatch pattern to match any use of the aliases
              pattern: `${verse || '#'}{*,*/**}`,
              group: verse === 'testverse' ? 'internal' : 'external',
              position: 'after',
              [$verse]: verse
            });
          }

          return groups;
        }, []),
      pathGroupsExcludedImportTypes: ['builtin', 'object'],
      // TODO: replace with fork that adds new feature (new feature is: new
      // TODO: spacing mode where single-line imports kept together)
      'newlines-between': 'always-and-inside-groups',
      distinctGroup: true
    }
  ],

  // * node (n)
  'node/hashbang': 'warn',
  'node/no-unpublished-bin': 'error',
  // ? This is disabled (later) for non-ts js files
  'node/no-restricted-import': [
    'warn',
    [
      {
        name: '{.,..}/*',
        message: 'Try an aliased import (e.g. universe, multiverse) instead'
      }
    ]
  ],

  // * typescript-eslint
  '@typescript-eslint/camelcase': 'off',
  // ? I am an enby of simple tastes, who does commonjs sometimes
  '@typescript-eslint/no-require-imports': 'off',
  // ? I will decide when I feel like using an interface
  '@typescript-eslint/consistent-type-definitions': 'off',
  // ? I will decide when I feel like using a Record
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/prefer-ts-expect-error': 'warn',
  '@typescript-eslint/no-misused-promises': ['error'],
  '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
  // ? Force the powerful ts comments to come with a brief explanation
  '@typescript-eslint/ban-ts-comment': [
    'warn',
    {
      'ts-expect-error': 'allow-with-description',
      minimumDescriptionLength: 6
    }
  ],
  '@typescript-eslint/consistent-type-exports': [
    'error',
    { fixMixedExportsWithInlineTypeSpecifier: true }
  ],
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_+',
      varsIgnorePattern: '^_+',
      caughtErrorsIgnorePattern: String.raw`^ignored?\d*$`,
      caughtErrors: 'all'
    }
  ],
  // ? Make sure types are marked as such
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }
  ],
  // ? I'll be good, I promise
  '@typescript-eslint/no-var-requires': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-non-null-assertion': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-unsafe-assignment': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-unsafe-argument': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-unsafe-call': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-unsafe-member-access': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-unsafe-return': 'off',
  // ? Numbers are fine.
  '@typescript-eslint/restrict-template-expressions': [
    'warn',
    {
      allowAny: false,
      allowBoolean: false,
      allowNullish: false,
      allowNumber: true,
      allowRegExp: false
    }
  ],
  // ? "this: void" annotations are fine.
  '@typescript-eslint/no-invalid-void-type': [
    'warn',
    {
      allowAsThisParameter: true,
      allowInGenericTypeArguments: true
    }
  ],
  // ? Void expressions are fine.
  '@typescript-eslint/no-confusing-void-expression': [
    'warn',
    {
      ignoreVoidOperator: true,
      ignoreArrowShorthand: true
    }
  ],
  // ? Static references are fine.
  '@typescript-eslint/unbound-method': [
    'warn',
    {
      ignoreStatic: true
    }
  ],
  // ? I don't want to have to ask "what happens if I change the global flag".
  '@typescript-eslint/prefer-regexp-exec': 'off',
  // ? Rarely useful
  '@typescript-eslint/require-await': 'off',
  // ? If I'm doing this, it's probably for intellisense reasons.
  '@typescript-eslint/unified-signatures': 'off',
  // ? If I'm doing this, it's probably for intellisense reasons.
  '@typescript-eslint/no-useless-constructor': 'off',
  // ? This rule is broken: it can actually introduce bugs if applied blindly.
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  // ? TypeScript/Eslint isn't smart enough to do this right
  '@typescript-eslint/no-unnecessary-condition': 'off',

  // * unicorn
  'unicorn/no-keyword-prefix': 'warn',
  'unicorn/no-instanceof-array': 'warn',
  'unicorn/prefer-string-replace-all': 'warn',
  // ? Handled by integration tests
  'unicorn/prefer-module': 'off',
  // ? I am of the opinion that there is a difference between something being
  // ? defined as nothing and something being undefined
  'unicorn/no-null': 'off',
  // ? If MongoDB can get away with "DB" in its name, so can we.
  'unicorn/prevent-abbreviations': [
    'warn',
    {
      checkFilenames: false,
      replacements: {
        args: false,
        str: false,
        fn: false,
        db: false,
        dir: false,
        dist: false,
        tmp: false,
        pkg: false,
        src: false,
        dest: false,
        obj: false,
        val: false,
        env: false,
        temp: false,
        req: false,
        res: false,
        ctx: false
      },
      ignore: [/stderr/i]
    }
  ],
  // ? Actually, I rather like this curt syntax
  'unicorn/no-await-expression-member': 'off',
  // ? Between disabling this and disabling no-empty-function, I choose this
  'unicorn/no-useless-undefined': 'off',
  // ? Not sure why this isn't the default
  'unicorn/prefer-export-from': ['warn', { ignoreUsedVariables: true }],
  // ? Yeah, I read The Good Parts too, I know what I'm doing
  'unicorn/consistent-function-scoping': 'off',
  // ? It's 2022. Use Prettier
  'unicorn/no-nested-ternary': 'off',
  // ? `Array.from` communicates intent much better than `[...]`
  'unicorn/prefer-spread': 'off',
  // ? Not realistic when using TypeScript
  'unicorn/prefer-native-coercion-functions': 'off',
  // ? Premature optimization is evil
  'unicorn/no-array-for-each': 'off',
  // ? Lol, no
  'unicorn/explicit-length-check': 'off',
  // ? I don't think so
  'unicorn/no-negated-condition': 'off',
  // ? This is not it, chief (Prettier prevails)
  'unicorn/number-literal-case': 'off',
  // ? I'll decide when I want switch cases for fallthrough or not, thanks
  'unicorn/prefer-switch': 'off',
  // ? No, thanks
  'unicorn/prefer-set-has': 'off',
  // ? Nah
  'unicorn/prefer-top-level-await': 'off',
  // ? No.
  'unicorn/import-style': 'off',
  // ? This rule is broken as of 05/30/2024
  'unicorn/throw-new-error': 'off',
  // ? I know what I'm doing, but thanks though
  'unicorn/no-negation-in-equality-check': 'off',
  // ? test() and exec() are stateful, match() is not. So this is a bad check.
  'unicorn/prefer-regexp-test': 'off'
};

const jestRules = {
  // * Jest (all jest rules are enabled by default)
  'jest/lowercase': 'off',
  'jest/consistent-test-it': 'off',
  'jest/require-top-level-describe': 'off',
  'jest/valid-describe': 'off',
  'jest/no-hooks': 'off',
  'jest/require-to-throw-message': 'off',
  'jest/prefer-called-with': 'off',
  'jest/prefer-spy-on': 'off',
  'jest/no-if': 'off',
  'jest/no-disabled-tests': 'warn',
  'jest/no-commented-out-tests': 'warn',
  'jest/no-alias-methods': 'off',
  'jest/max-expects': 'off',
  'jest/prefer-mock-promise-shorthand': 'off',
  'jest/no-conditional-in-test': 'off',
  'jest/no-conditional-expect': 'off',
  'jest/prefer-each': 'off',
  'jest/prefer-snapshot-hint': 'off',
  'jest/prefer-importing-jest-globals': 'off',
  'jest/padding-around-all': 'off',
  'jest/padding-around-expect-groups': 'off',
  'jest/padding-around-test-blocks': 'off',
  'jest/require-hook': [
    'error',
    {
      allowedFunctionCalls: ['reconfigureJestGlobalsToSkipTestsInThisFileIfRequested']
    }
  ],

  // * typescript-eslint
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/prefer-promise-reject-errors': 'off'
};

const globals = {
  ...jsGlobals.builtin,
  ...jsGlobals.commonjs,
  ...jsGlobals.es2025,
  ...jsGlobals.node
};

const runtimeContext = analyzeProjectStructure.sync();

const {
  project: { root: projectRootDir }
} = runtimeContext;

if (process.env.XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS !== 'true') {
  genericRules['no-warning-comments'] = 'warn';
}

const { FlatCompat } = await import('@eslint/eslintrc');

const flatCompat = new FlatCompat({
  baseDirectory: projectRootDir,
  resolvePluginsRelativeTo: projectRootDir,
  recommendedConfig: eslintJs.configs.recommended,
  allConfig: eslintJs.configs.all
});

const eslintPluginUnicornRecommended = eslintPluginUnicorn.configs?.['flat/recommended'];

assert(eslintPluginUnicornRecommended);

const eslintPluginJestAll = eslintPluginJest.configs?.['flat/all'];
const eslintPluginJestStyle = eslintPluginJest.configs?.['flat/style'];

assert(eslintPluginJestAll);
assert(eslintPluginJestStyle);

const plugins = {
  /* unicorn: eslintPluginUnicorn ... included by imports */
  /* @typescript-eslint: eslintPluginTsEslint ... included by imports */
  /* import: eslintPluginImport ... included by imports */
  node: eslintPluginNode
  /* jest ... included by imports */
};

/**
 * Accepts an array of configuration objects/arrays and returns a flattened
 * array with each object's `files` property overwritten by the `files`
 * parameter.
 *
 * For example:
 *
 * ```typescript
 * const eslintConfig = makeTsEslintConfig({
 *   // some other configs...
 * },
 * ...[
 *   legacyExtends('plugin:import/recommended', 'eslint-plugin-import:recommended'),
 *   legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript')
 * ]).flatMap((configs) =>
 *   overwriteFileProperty(configs, [`*.{js,jsx,cjs,mjs}`])
 * );
 */
export function overwriteFileProperty(configs, files) {
  configs = [configs].flat();

  configs.forEach((config) => {
    config.files = files;
  });

  return configs;
}

/**
 * Returns an eslint@>=9 configuration object that adapts a legacy eslint@<9
 * plugin's exposed rule extension.
 *
 * For example:
 *
 * ```typescript
 * const eslintConfig = makeTsEslintConfig(
 *   legacyExtends('plugin:import/recommended', 'eslint-plugin-import:recommended'),
 *   legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript')
 * );
 * ```
 */
export function legacyExtends(extension, name) {
  return { ...fixupConfigRules(flatCompat.extends(extension)[0])[0], name };
}

const config = makeTsEslintConfig(
  {
    ignores: [
      '**/coverage/**/*',
      '**/dist/**/*',
      '**/bin/**/*',
      '**/build/**/*',
      '!**/src/**/*',
      '**/dummy-repo/**/*',
      // TODO: specific to this project; delete this comment after generalization
      'src/assets/template/.remarkrc.mjs'
    ]
  },
  ...[
    { ...eslintJs.configs.recommended, name: '@eslint/js:recommended' },
    eslintTsConfigs.strictTypeChecked,
    eslintTsConfigs.stylisticTypeChecked,
    eslintTsConfigs.eslintRecommended,
    eslintPluginImport.flatConfigs.recommended,
    eslintPluginImport.flatConfigs.typescript,
    eslintPluginUnicornRecommended,
    {
      name: '@-xun/scripts:base',
      plugins,
      rules: genericRules,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: eslintTsParser,
        parserOptions: {
          tsconfigRootDir: projectRootDir,
          project: tsconfigProject,
          ecmaFeatures: {
            impliedStrict: true,
            jsx: true
          }
        },
        globals
      },
      linterOptions: { reportUnusedDisableDirectives: 'error' },
      settings: {
        react: {
          version: 'detect'
        },
        'import/extensions': jsFileExtensions,
        // ? Switch parsers depending on which type of file we're looking at
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
          '@babel/eslint-parser': ['.js', '.jsx', '.cjs', '.mjs']
        },
        'import/resolver': {
          alias: {
            map: wellKnownPackageAliases,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
          },
          typescript: {
            alwaysTryTypes: true,
            project: tsconfigProject
          },
          'babel-module': true,
          node: true
        },
        'import/ignore': [
          // ? Don't go complaining about anything that we don't own
          '.*/node_modules/.*',
          '.*/bin/.*'
        ]
      }
    }
  ].flatMap((configs) =>
    overwriteFileProperty(configs, [
      `**/*.{${jsFileExtensions.map((extension) => extension.slice(1)).join(',')}}`
    ])
  ),
  {
    name: '@-xun/scripts:contextual-relative-imports',
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: { 'node/no-restricted-import': 'off' }
  },
  {
    name: '@-xun/scripts:jest',
    files: [
      `**/*.test.{${jsFileExtensions.map((extension) => extension.slice(1)).join(',')}}`
    ],
    ...eslintPluginJestAll
  },
  {
    name: '@-xun/scripts:jest-overrides',
    files: [
      `**/*.test.{${jsFileExtensions.map((extension) => extension.slice(1)).join(',')}}`
    ],
    rules: jestRules
  }
);

export default config;

/*debug('exported config: %O', config);*/
