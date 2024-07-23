import assert from 'node:assert';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import { getRunContext } from '@projector-js/core/project';
/*import eslintPluginTsEslint from '@typescript-eslint/eslint-plugin';*/
import eslintTsParser from '@typescript-eslint/parser';
import restrictedGlobals from 'confusing-browser-globals';
/*import eslintPluginImport from 'eslint-plugin-import';*/
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginModuleResolver from 'eslint-plugin-module-resolver';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsGlobals from 'globals';

import {
  configs as eslintTsConfigs,
  config as makeTsEslintConfig,
  type Config
} from 'typescript-eslint';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';
import { globalDebuggerNamespace } from 'universe/constant';

import type { EmptyObject } from 'type-fest';
import { ErrorMessage } from 'universe/error';

type EslintConfig = Extract<Config, unknown[]>[number];

/**
 * The name of the tsconfig JSON file used by the linter.
 */
export const tsconfigProject = 'tsconfig.eslint.json';

/**
 * All file extensions recognized as JavaScript or TypeScript.
 */
export const jsFileExtensions = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs'
];

export const eslintPlugins = {
  /* unicorn: eslintPluginUnicorn ... included by imports */
  /* '@typescript-eslint': eslintPluginTsEslint ... included by imports */
  /* import: fixupPluginRules(eslintPluginImport) ... included by imports */
  'module-resolver': fixupPluginRules(eslintPluginModuleResolver)
  /* jest ... included by imports */
};

export const genericRules: NonNullable<EslintConfig['rules']> = {
  'no-console': 'warn',
  'no-return-await': 'warn',
  'no-await-in-loop': 'warn',
  'import/no-unresolved': ['error', { commonjs: true }],
  'module-resolver/use-alias': [
    'error',
    {
      extensions: ['.ts', '.tsx', '.jsx']
    }
  ],
  'no-restricted-globals': ['warn', ...restrictedGlobals],
  'no-extra-boolean-cast': 'off',
  'no-empty': 'off',
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/prefer-ts-expect-error': 'warn',
  '@typescript-eslint/no-misused-promises': ['error'],
  '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
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
  // ? Ever since v4, we will rely on TypeScript to catch these
  'no-undef': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  // ? I'll be good, I promise
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }
  ],
  'no-unused-vars': 'off',
  'unicorn/no-keyword-prefix': 'warn',
  'unicorn/prefer-string-replace-all': 'warn',
  // ? Handled by integration tests
  'unicorn/prefer-module': 'off',
  // ? I am of the opinion that there is a difference between something being
  // ? defined as nothing and something being undefined
  'unicorn/no-null': 'off',
  // ? If MongoDB can get away with "DB" in its name, so can we. Also,
  // ? unnecessary underscores are a big no-no.
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
  'unicorn/no-negation-in-equality-check': 'off'
};

export const jestRules: NonNullable<EslintConfig['rules']> = {
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
  'jest/prefer-importing-jest-globals': 'off'
};

export const globals = {
  ...jsGlobals.builtin,
  ...jsGlobals.commonjs,
  ...jsGlobals.es2025,
  ...jsGlobals.node
};

export async function moduleExport(
  /**
   * An optional `runContext` that, if given, will be used instead of calling
   * {@link getRunContext}.
   */
  runContext = getRunContext()
) {
  const {
    project: { root: projectRootDir }
  } = runContext;

  const { FlatCompat } = await import('@eslint/eslintrc');

  const flatCompat = new FlatCompat({
    baseDirectory: projectRootDir,
    resolvePluginsRelativeTo: projectRootDir,
    recommendedConfig: eslintJs.configs.recommended,
    allConfig: eslintJs.configs.all
  });

  const eslintPluginUnicornRecommended = eslintPluginUnicorn.configs?.[
    'flat/recommended'
  ] as EslintConfig;

  assert(
    eslintPluginUnicornRecommended,
    ErrorMessage.EslintPluginReturnedSomethingUnexpected('eslint-plugin-unicorn')
  );

  const eslintPluginJestAll = eslintPluginJest.configs?.['flat/all'] as EslintConfig;
  const eslintPluginJestStyle = eslintPluginJest.configs?.['flat/style'] as EslintConfig;

  assert(
    eslintPluginJestAll,
    ErrorMessage.EslintPluginReturnedSomethingUnexpected('eslint-plugin-jest')
  );

  assert(
    eslintPluginJestStyle,
    ErrorMessage.EslintPluginReturnedSomethingUnexpected('eslint-plugin-jest')
  );

  const extendedEslintConfigs: (EslintConfig | EslintConfig[])[] = [
    { ...eslintJs.configs.recommended, name: '@eslint/js:recommended' },
    eslintTsConfigs.recommended,
    eslintTsConfigs.eslintRecommended,
    eslintTsConfigs.stylisticTypeChecked,
    legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript'),
    legacyExtends('plugin:import/warnings', 'eslint-plugin-import:warnings'),
    legacyExtends('plugin:import/errors', 'eslint-plugin-import:errors'),
    eslintPluginUnicornRecommended,
    {
      name: '@-xun/scripts:base',
      plugins: eslintPlugins,
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
            map: [
              // ! If changed, also update these aliases in tsconfig.json,
              // ! webpack.config.js, next.config.ts, babel.config.js, and
              // ! jest.config.js
              ['universe', './src'],
              ['multiverse', './lib'],
              ['testverse', './test'],
              ['externals', './external-scripts'],
              ['types', './types'],
              ['package', './package.json']
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
          },
          typescript: {
            alwaysTryTypes: true,
            project: tsconfigProject
          },
          'babel-module': {},
          node: {}
        },
        'import/ignore': [
          // ? Don't go complaining about anything that we don't own
          '.*/node_modules/.*',
          '.*/bin/.*'
        ]
      }
    }
  ];

  return makeTsEslintConfig(
    {
      ignores: [
        '**/coverage/**/*',
        '**/dist/**/*',
        '**/bin/**/*',
        '**/build/**/*',
        'next.config.js',
        '!**/src/**/*'
      ]
    },
    ...extendedEslintConfigs.flatMap((configs) =>
      overwriteFileProperty(configs, [
        `**/*.{${jsFileExtensions.map((extension) => extension.slice(1)).join(',')}}`
      ])
    ),
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

  function legacyExtends(extension: string, name: string) {
    return {
      ...fixupConfigRules(flatCompat.extends(extension)[0])[0],
      name
    } as EslintConfig;
  }
}

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: /*js*/ `
/*import { createDebugLogger } from 'debug-extended';*/
import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/config/eslint.config.js';

// TODO: publish latest rejoinder package first, then update configs to use it
/*const debug = createDebugLogger({
  namespace: '${globalDebuggerNamespace}:config:eslint'
});*/

const config = deepMergeConfig(moduleExport, {
  // Any custom configs here will be deep merged with moduleExport
});

export default config;

/*debug('exported config: %O', config);*/
`.trimStart()
    };
  }
});

function overwriteFileProperty(configs: EslintConfig | EslintConfig[], files: string[]) {
  configs = [configs].flat();

  configs.forEach((config) => {
    config.files = files;
  });

  return configs;
}
