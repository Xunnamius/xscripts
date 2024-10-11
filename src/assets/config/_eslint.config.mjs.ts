import assert from 'node:assert';

import { fixupConfigRules } from '@eslint/compat';
import eslintJs from '@eslint/js';

import restrictedGlobals from 'confusing-browser-globals';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsGlobals from 'globals';

import {
  configs as eslintTsConfigs,
  parser as eslintTsParser,
  config as makeTsEslintConfig,
  type Config
} from 'typescript-eslint';

import {
  deriveAliasesForEslint,
  generateRawAliasMap
} from 'multiverse#project-utils alias.ts';

import { Tsconfig } from 'multiverse#project-utils fs/exports/well-known-constants.ts';
import { analyzeProjectStructure, type ProjectMetadata } from 'multiverse#project-utils';

import {
  assertIsExpectedTransformerContext,
  makeTransformer
} from 'universe assets/index.ts';

import { globalDebuggerNamespace } from 'universe constant.ts';
import { ErrorMessage } from 'universe error.ts';

import type { EmptyObject } from 'type-fest';

// TODO: update with latest changes from project root eslint.config.mjs

// TODO: interpolate this into runtime (transformer) since aliases are generated
// const wellKnownPackageAliases = [
//   ['package', './package.json'],
//   ['multiverse', './lib'],
//   ['extverse', './external-scripts'],
//   ['universe', './src'],
//   ['pkgverse', 'packages/*'],
//   ['testverse', './test'],
//   ['typeverse', './types']
// ];

export type EslintConfig = Extract<Config, unknown[]>[number];

/**
 * The name of the tsconfig JSON file used by the linter.
 */
export const tsconfigProject = Tsconfig.ProjectLintUnlimited;

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
  node: eslintPluginNode
  /* jest ... included by imports */
};

export const genericRules: NonNullable<EslintConfig['rules']> = {
  // * eslint
  'no-console': 'warn',
  'no-return-await': 'warn',
  'no-await-in-loop': 'warn',
  'no-restricted-globals': ['warn', ...restrictedGlobals],
  'no-empty': 'off',
  // ? Ever since v4, we will rely on TypeScript to catch these
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-warning-comments': 'warn',
  eqeqeq: 'warn',

  // * import
  'import/extensions': ['error', 'always', { ignorePackages: false }],
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
      groups: [
        'builtin',
        'external',
        'internal',
        ['parent', 'sibling', 'index'],
        ['object', 'type']
      ],
      // TODO: move this into runtime (moduleExport) due to generated aliases
      pathGroups: [],
      // TODO: ^^^
      'newlines-between': 'always-and-inside-groups',
      distinctGroup: true
    }
  ],

  // * node (n)
  'node/hashbang': 'warn',
  'node/no-unpublished-bin': 'error',
  // ? This is disabled (later) for source files under ./lib
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
  // ? Sometimes useful, sometimes annoying, but not an error.
  '@typescript-eslint/require-await': 'warn',
  // ? If I'm doing this, it's probably for intellisense reasons.
  '@typescript-eslint/unified-signatures': 'off',
  // ? If I'm doing this, it's probably for intellisense reasons.
  '@typescript-eslint/no-useless-constructor': 'off',

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
  // ? I don't think so.
  'unicorn/no-negated-condition': 'off',
  // ? This is not it, chief (Prettier prevails).
  'unicorn/number-literal-case': 'off',
  // ? I'll decide when I want switch cases for fallthrough or not, thanks.
  'unicorn/prefer-switch': 'off',
  // ? No, thanks.
  'unicorn/prefer-set-has': 'off',
  // ? Nah.
  'unicorn/prefer-top-level-await': 'off',
  // ? No.
  'unicorn/import-style': 'off',
  // ? This rule is broken as of 05/30/2024.
  'unicorn/throw-new-error': 'off',
  // ? I know what I'm doing, but thanks though.
  'unicorn/no-negation-in-equality-check': 'off',
  // ? test() and exec() are stateful, match() is not. So this is a bad check.
  'unicorn/prefer-regexp-test': 'off'
};

export const jestRules: NonNullable<EslintConfig['rules']> = {
  // * Jest
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

  // * typescript-eslint
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/prefer-promise-reject-errors': 'off'
};

export const globals = {
  ...jsGlobals.builtin,
  ...jsGlobals.commonjs,
  ...jsGlobals.es2025,
  ...jsGlobals.node
};

// TODO: do we need to take any special considerations for projects with
// TODO: assetverse-type imports? Solution is likely monorepo packages and a
// TODO: dummy "index"-type file that wraps all the asset imports

// TODO: needs proper typings (are "any" warnings working properly?!)
export async function moduleExport(
  /**
   * An optional {@link ProjectMetadata} instance that, if given, will be used
   * instead of calling {@link analyzeProjectStructure}.
   */
  projectMetadata?: ProjectMetadata
) {
  projectMetadata ||= await analyzeProjectStructure();

  const {
    project: { root: projectRootDir }
  } = projectMetadata;

  const eslintAliasMap = deriveAliasesForEslint(generateRawAliasMap(projectMetadata));

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
    eslintTsConfigs.strictTypeChecked,
    eslintTsConfigs.stylisticTypeChecked,
    eslintTsConfigs.eslintRecommended,
    legacyExtends('plugin:import/recommended', 'eslint-plugin-import:recommended'),
    legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript'),
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
            map: eslintAliasMap,
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
  ];

  return makeTsEslintConfig(
    {
      ignores: [
        '**/coverage/**/*',
        '**/dist/**/*',
        '**/bin/**/*',
        '**/build/**/*',
        '!**/src/**/*'
      ]
    },
    ...extendedEslintConfigs.flatMap((configs) =>
      overwriteFileProperty(configs, [
        `**/*.{${jsFileExtensions.map((extension) => extension.slice(1)).join(',')}}`
      ])
    ),
    {
      name: '@-xun/scripts:contextual-relative-imports',
      files: ['lib/**/*', '**/*.mjs'],
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
// @ts-check
/*import { createDebugLogger } from 'debug';*/
import { deepMergeConfig } from '@-xun/scripts/assets';
import { moduleExport } from '@-xun/scripts/assets/config/${name}';

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
