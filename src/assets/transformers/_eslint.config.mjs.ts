/* eslint-disable unicorn/prevent-abbreviations */
// {@xscripts/notExtraneous eslint}
import assert from 'node:assert';

import { fixupConfigRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import restrictedGlobals from 'confusing-browser-globals';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsGlobals from 'globals';
import { toss } from 'toss-expression';

import {
  config as makeTsEslintConfig,
  configs as eslintTsConfigs,
  parser as eslintTsParser,
  type Config
} from 'typescript-eslint';

import {
  deriveAliasesForEslint,
  generateRawAliasMap,
  uriSchemeDelimiter,
  uriSchemeSubDelimiter
} from 'multiverse+project-utils:alias.ts';

import { ProjectError } from 'multiverse+project-utils:error.ts';

import {
  getCurrentWorkingDirectory,
  isAccessible,
  toAbsolutePath,
  toPath,
  Tsconfig,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { createDebugLogger } from 'multiverse+rejoinder';

import { makeTransformer } from 'universe:assets.ts';

import {
  globalDebuggerNamespace,
  makeGeneratedAliasesWarningComment
} from 'universe:constant.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  extensionsJavascript,
  extensionsTypescript
} from '@-xun/scripts/assets/babel.config.cjs';

import type { PackageJson } from 'type-fest';

const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:asset:conventional`
});

const $scheme = Symbol('scheme');
const extensionsTsAndJs = [...extensionsTypescript, ...extensionsJavascript];

const sharedRestrictedImportRules = [
  // ! This must always be the first restrict import configuration object
  {
    name: '+(.|..)/node_modules/@-xun/**/*',
    message:
      'This warning is a reminder that the import needs to be removed once the corresponding package is published.'
  } as const
];

export type EslintConfig = Extract<Config, unknown[]>[number];

export type PathGroup = {
  pattern: string;
  group: string;
  position: string;
  [$scheme]: string;
};

export type PathGroupOverride = { pattern: string; action: string };

function genericRules(
  pathGroups: PathGroup[],
  pathGroupOverrides: PathGroupOverride[]
): NonNullable<EslintConfig['rules']> {
  return {
    // * eslint
    'no-console': 'warn',
    // ? We rely on https://typescript-eslint.io/rules/return-await instead
    // ? since this rule is now deprecated (and for good reason)
    'no-return-await': 'off',
    'no-await-in-loop': 'warn',
    'no-restricted-globals': ['warn', ...restrictedGlobals],
    'no-empty': 'off',
    eqeqeq: 'warn',
    // ? Ever since v4, we will rely on TypeScript to catch these
    'no-undef': 'off',
    'no-unused-vars': 'off',
    // ? If I'm using apply, it's because I want to
    'prefer-spread': 'off',
    // ? We need to warn about using bad things that are or may be bad
    'no-restricted-syntax': [
      'warn',
      {
        selector: "BinaryExpression[operator='instanceof']",
        message:
          'Using `instanceof` is a poor choice when writing a library due to realms and other package hazards. Consider a symbol-based tagging scheme instead'
      },
      {
        selector: "MemberExpression[object.name='process'][property.name='cwd']",
        message:
          'Use `getCurrentWorkingDirectory` or `getInitialWorkingDirectory` from @-xun/js-utils instead of `process.cwd`'
      }
    ],

    // * import
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
        checkTypeImports: true,
        pathGroupOverrides
      }
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
        // * Applies to both import identifiers and specifiers (see below)
        alphabetize: { order: 'asc', orderImportKind: 'asc', caseInsensitive: true },
        // * Applies to import identifiers
        // * e.g. "id1" and "id2" in `import { id1, id2 } from 'specifier';`
        named: {
          enabled: true,
          types: 'types-last'
        },
        // * Applies to import specifiers
        // * e.g. "specifier" in `import { id1, id2 } from 'specifier';`
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          ['object', 'type']
        ],
        // * Custom sub-groups based on specifier allowing sorting between groups
        pathGroups,
        // * Ensures different "pathGroup" groups are separated by a newline even
        // * though they're technically part of the same "group" group
        distinctGroup: true,
        // * Controls which groups are excluded from "pathGroups" rules. The
        // * default is ["builtin", "external", "object"]
        pathGroupsExcludedImportTypes: ['builtin', 'object'],
        // * Controls the spacing between and within import groups
        'newlines-between': 'always-and-inside-groups',
        // * Controls the spacing between and within type-only import groups
        'newlines-between-types': 'never',
        // * Enables sorting type-only imports and exports amongst themselves
        sortTypesAmongThemselves: true,
        // * Ensures multiline imports are separated and singleline are collected
        consolidateIslands: 'inside-groups'
      }
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
          arg: false,
          args: false,
          str: false,
          fn: false,
          db: false,
          dir: false,
          dist: false,
          tmp: false,
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
    'unicorn/prefer-regexp-test': 'off',
    // ? Of limited use; when I want to reduce, it's usually for a good reason
    'unicorn/no-array-reduce': 'warn'
  };
}

function jestRules(): NonNullable<EslintConfig['rules']> {
  return {
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
}

function nodeRules(
  restrictedImportRules: typeof sharedRestrictedImportRules
): NonNullable<EslintConfig['rules']> {
  return {
    // * Node (eslint-plugin-n) rules (affects all JS/TS files)
    'n/hashbang': 'warn',
    'n/no-unpublished-bin': 'error',
    // ? Handled (albeit badly currently) by eslint-plugin-import
    'n/file-extension-in-import': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-missing-import': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-missing-require': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-extraneous-import': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-extraneous-require': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-unpublished-import': 'off',
    // ? Handled by xscripts project lint and xscripts build distributables
    'n/no-unpublished-require': 'off',
    // ? Handled by babel and core-js
    'n/no-unsupported-features/es-builtins': 'off',
    // ? Handled by babel and core-js
    'n/no-unsupported-features/es-syntax': 'off',
    // ? Handled by babel and core-js
    'n/no-unsupported-features/node-builtins': 'off',
    // ? Handled by unicorn
    'n/no-process-exit': 'off',
    'n/no-restricted-import': ['warn', restrictedImportRules],
    'n/no-restricted-require': ['warn', restrictedImportRules]
  };
}

function tsNodeRules(
  restrictedImportRules: typeof sharedRestrictedImportRules
): NonNullable<EslintConfig['rules']> {
  return {
    // * Node (eslint-plugin-n) rules (only affects TS files)
    'n/no-restricted-import': [
      'warn',
      [
        ...restrictedImportRules,
        {
          name: '{.,..}/**/*',
          message:
            'Use an import alias scheme (e.g. universe:, multiverse+pkg-name:, rootverse:) instead.'
        }
      ]
    ]
  };
}

function cjsRules(): NonNullable<EslintConfig['rules']> {
  return {
    // * Rules applied only to commonjs files (not necessarily w/ .cjs extension)
    // TODO: figure out why ESM syntax allowed in CJS files. Is it b/c babel parser?
  };
}

function mjsRules(): NonNullable<EslintConfig['rules']> {
  return {
    // * Rules applied only to esm files (not necessarily w/ .mjs extension)
    'import/no-commonjs': [
      'error',
      {
        allowRequire: false,
        allowConditionalRequire: false,
        allowPrimitiveModules: false
      }
    ]
  };
}

function earlyJsOnlyRules(): NonNullable<EslintConfig['rules']> {
  return {
    // * Rules applied only to JS files (cjs, mjs, jsx, etc) but NOT TS files.
    // * These rules are also applied before all others and may be overridden
    // ? We can't count on tsc to be around to catch these in our JS files
    'no-undef': 'error'
  };
}

const globals = {
  ...jsGlobals.builtin,
  ...jsGlobals.commonjs,
  ...jsGlobals.es2025,
  ...jsGlobals.node
};

export function moduleExport({
  cwdTsconfigFile,
  derivedAliases,
  packageJsonEnginesNode,
  shouldAllowWarningComments
}: {
  packageJsonEnginesNode: string;
  cwdTsconfigFile: AbsolutePath;
  shouldAllowWarningComments: boolean;
  derivedAliases: ReturnType<typeof deriveAliasesForEslint>;
}) {
  debug('cwdTsconfigFile: %O', cwdTsconfigFile);
  debug('packageJsonEnginesNode: %O', packageJsonEnginesNode);
  debug('shouldAllowWarningComments: %O', shouldAllowWarningComments);

  const eslintPluginUnicornRecommended =
    eslintPluginUnicorn.configs?.['flat/recommended'];

  assert(eslintPluginUnicornRecommended);

  const eslintPluginJestAll = eslintPluginJest.configs?.['flat/all'];
  const eslintPluginJestStyle = eslintPluginJest.configs?.['flat/style'];

  assert(eslintPluginJestAll);
  assert(eslintPluginJestStyle);

  const eslintPluginNodeRecommendedExtEither =
    eslintPluginNode.configs['flat/recommended'];
  const eslintPluginNodeRecommendedExtMjs =
    eslintPluginNode.configs['flat/recommended-module'];
  const eslintPluginNodeRecommendedExtCjs =
    eslintPluginNode.configs['flat/recommended-script'];

  assert(eslintPluginNodeRecommendedExtEither);
  assert(eslintPluginNodeRecommendedExtMjs);
  assert(eslintPluginNodeRecommendedExtCjs);

  // eslint-disable-next-line unicorn/no-array-reduce
  const pathGroups = derivedAliases.reduce<PathGroup[]>((groups, [alias]) => {
    const verse = alias.split(uriSchemeDelimiter)[0].split(uriSchemeSubDelimiter)[0];
    const previousVerse = groups.at(-1)?.[$scheme];

    // ? Collapse imports from the same scheme (verse) into the same block
    if (previousVerse !== verse) {
      groups.push({
        // ? This is a minimatch pattern to match any use of the aliases
        pattern: `${verse}{*,*/**}`,
        // ? "internal" is always under package root but not under
        // ? node_modules; "external" is under node_modules or above
        // ? package root; our custom groups _could_ be either, so we
        // ? default to "external"
        group: 'external',
        position: 'after',
        [$scheme]: verse
      });
    }

    return groups;
  }, []);

  debug('pathGroups: %O', pathGroups);

  // eslint-disable-next-line unicorn/no-array-reduce
  const pathGroupOverrides = derivedAliases.reduce<PathGroupOverride[]>(
    (overrides, [alias]) => {
      // ? We're only interested in enforcing extensions on specifiers with paths
      if (alias.includes(uriSchemeDelimiter)) {
        const schemeAndPath = alias.replace('*', '{*,*/**}');

        if (overrides.every(({ pattern }) => pattern !== schemeAndPath)) {
          overrides.push({
            // ? This is a minimatch pattern to match any use of the aliases
            pattern: schemeAndPath,
            action: 'enforce'
          });
        }
      }

      return overrides;
    },
    []
  );

  debug('pathGroupOverrides: %O', pathGroups);

  const reifiedGenericRules = genericRules(pathGroups, pathGroupOverrides);

  if (!shouldAllowWarningComments) {
    debug('no warning comments allowed (will generate warning)');
    reifiedGenericRules['no-warning-comments'] = 'warn';
  } else {
    debug('warning comments ARE allowed (will NOT generate any warnings)');
  }

  const reifiedRestrictedImportRules = shouldAllowWarningComments
    ? sharedRestrictedImportRules.slice(1)
    : sharedRestrictedImportRules;

  return makeTsEslintConfig(
    // * Global ignores applying to all files (any extension)
    // ! Should be the first configuration block (as of 2024)
    {
      // ! These should include the contents of tsc.project.lint.json's "exclude"
      ignores: [
        '**/dist/**/*',
        '**/test/fixtures/**/*',
        '**/node_modules/**/*',
        '**/*.ignore',
        '**/*.ignore.*/**/*',
        '**/ignore.*',
        '**/coverage/**/*',
        '**/bin/**/*',
        '**/.transpiled/**/*',
        // TODO: delete this after we rename build => dist for Next.js projects
        '**/build/**/*',
        '!**/src/**/*'
      ]
    },

    // * Configs applying to both JavaScript and TypeScript files (all extensions)
    // ? Keep in mind that JS files can use @ts-check and "become" TS files, hence
    // ? the existence of this block. Logically, most rules should be loaded here.
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
        rules: reifiedGenericRules,
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          parser: eslintTsParser,
          parserOptions: {
            //tsconfigRootDir: cwd,
            project: cwdTsconfigFile,
            ecmaFeatures: {
              impliedStrict: true,
              jsx: true
            },
            babelOptions: {
              rootMode: 'upward'
            }
          },
          globals
        },
        linterOptions: { reportUnusedDisableDirectives: 'error' },
        // ? Shared settings used to configure many rules at once
        settings: {
          react: { version: 'detect' },
          'import/extensions': extensionsTsAndJs,
          // ? Switch parsers depending on which type of file we're looking at
          'import/parsers': {
            // ! Note how Babel is NOT being used to transpile TypeScript here!
            // {@xscripts/notExtraneous @typescript-eslint/parser}
            '@typescript-eslint/parser': extensionsTypescript,
            // {@xscripts/notExtraneous @babel/eslint-parser}
            '@babel/eslint-parser': extensionsJavascript
          },
          'import/resolver': {
            // ? Aliases come from tsconfig's paths now
            // {@xscripts/notExtraneous eslint-import-resolver-typescript}
            typescript: {
              alwaysTryTypes: true,
              project: cwdTsconfigFile
            },
            node: true
          },
          'import/ignore': [
            // ? Don't go complaining about anything that we don't own
            '.*/node_modules/.*',
            '.*/bin/.*'
          ],
          node: {
            // ? Seems eslint-plugin-n is struggling to get engines.node...
            version: packageJsonEnginesNode,
            tsconfigPath: cwdTsconfigFile
          }
        }
      } satisfies EslintConfig
    ].flatMap((configs) =>
      overwriteProperty(configs, 'files', [
        `**/*.{${toCommaSeparatedExtensionList(extensionsTsAndJs)}}`
      ])
    ),

    // * Early configs, likely overridden applying only to ANY JavaScript file
    // ? These do not apply to TypeScript files, and likely get overridden later
    {
      name: '@-xun/scripts:any-js-no-ts',
      files: [`**/*.{${toCommaSeparatedExtensionList(extensionsJavascript)}}`],
      rules: earlyJsOnlyRules()
    },

    // * Configs applying only to JavaScript files ending in .js
    {
      ...eslintPluginNodeRecommendedExtEither,
      // ? Fix bug in eslint-plugin-n that illegally sets sourceType to "commonjs"
      languageOptions: { sourceType: 'script' },
      name: 'node/recommended:.js-only',
      files: ['**/*.js'],
      rules: {
        ...eslintPluginNodeRecommendedExtEither.rules,
        ...nodeRules(reifiedRestrictedImportRules),
        ...cjsRules()
      }
    },

    // * Configs applying only to JavaScript files ending in .cjs
    {
      ...eslintPluginNodeRecommendedExtCjs,
      // ? Fix bug in eslint-plugin-n that illegally sets sourceType to "commonjs"
      languageOptions: { sourceType: 'script' },
      name: 'node/recommended-script:.cjs-only',
      files: ['**/*.cjs'],
      rules: {
        ...eslintPluginNodeRecommendedExtCjs.rules,
        ...nodeRules(reifiedRestrictedImportRules),
        ...cjsRules()
      }
    },

    // * Configs applying only to JavaScript files ending in .mjs or .jsx
    {
      ...eslintPluginNodeRecommendedExtMjs,
      name: 'node/recommended-module++:.mjs-jsx-only',
      files: ['**/*.{mjs,jsx}'],
      rules: {
        ...eslintPluginNodeRecommendedExtMjs.rules,
        ...nodeRules(reifiedRestrictedImportRules),
        ...mjsRules()
      }
    },

    // * Rules applying only to TypeScript files
    {
      name: 'node/custom:typescript-only',
      files: [`**/*.{${toCommaSeparatedExtensionList(extensionsTypescript)}}`],
      plugins: eslintPluginNodeRecommendedExtMjs.plugins,
      rules: {
        ...eslintPluginNodeRecommendedExtMjs.rules,
        ...eslintPluginNodeRecommendedExtCjs.rules,
        ...nodeRules(reifiedRestrictedImportRules),
        ...tsNodeRules(reifiedRestrictedImportRules)
      }
    },

    // * Configs applying only to Jest test files (any relevant extension)
    {
      ...eslintPluginJestAll,
      name: '@-xun/scripts:jest',
      files: [`**/*.test.{${toCommaSeparatedExtensionList(extensionsTsAndJs)}}`],
      ignores: [`**/type-*.test.{${toCommaSeparatedExtensionList(extensionsTsAndJs)}}`],
      rules: {
        ...eslintPluginJestAll.rules,
        ...jestRules()
      }
    }
  );
}

/**
 * @see {@link assertEnvironment}
 */
export const { transformer } = makeTransformer(function ({
  asset,
  shouldDeriveAliases,
  toProjectAbsolutePath,
  projectMetadata
}) {
  const derivedAliasesSourceSnippet = shouldDeriveAliases
    ? `return ${JSON.stringify(
        deriveAliasesForEslint(generateRawAliasMap(projectMetadata)),
        undefined,
        4
      )
        // ? Make it a bit prettier
        .replaceAll(/\[\s+"/g, '["')
        .replaceAll(/",\s+"/g, '", "')
        .replaceAll(/"\s+\]/g, '"]')
        .replace(/^]/m, '  ]')},`
    : 'return []';

  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => /*js*/ `
// @ts-check

import { deepMergeConfig } from '@-xun/scripts/assets.ts';

import {
  moduleExport,
  assertEnvironment
} from '@-xun/scripts/assets/${asset}';

// TODO: publish latest rejoinder package first, then update configs to use it
/*import { createDebugLogger } from 'rejoinder';*/

/*const debug = createDebugLogger({ namespace: '${globalDebuggerNamespace}:config:eslint' });*/

const config = deepMergeConfig(
  moduleExport({ derivedAliases: getEslintAliases(), ...assertEnvironment() }),
  /**
   * @type {import('@-xun/scripts/assets/${asset}').EslintConfig}
   */
  {
    // Any custom configs here will be deep merged with moduleExport
  }
);

export default config;

/*debug('exported config: %O', config);*/

function getEslintAliases() {
${makeGeneratedAliasesWarningComment(2)}
  ${derivedAliasesSourceSnippet}
}
`
    }
  ];
});

/**
 * @see {@link moduleExport}
 */
export async function assertEnvironment(): Promise<
  Omit<Parameters<typeof moduleExport>[0], 'derivedAliases'>
> {
  const currentWorkingDirectory = getCurrentWorkingDirectory();
  const packageJsonPath = toPath(currentWorkingDirectory, 'package.json');

  const packageJson = (await import(packageJsonPath, {
    with: { type: 'json' }
  })) as PackageJson;

  const { node: packageJsonEnginesNode } = packageJson.engines || {};

  if (typeof packageJsonEnginesNode !== 'string') {
    throw new ProjectError(ErrorMessage.BadEnginesNodeInPackageJson(packageJsonPath));
  }

  const projectBasePath = toAbsolutePath(currentWorkingDirectory, Tsconfig.ProjectBase);
  const projectLintPath = toAbsolutePath(currentWorkingDirectory, Tsconfig.ProjectLint);

  // * Despite the scope used by xscripts, we want as broad a configuration file
  // * as possible and we'll leave the further narrowing of scope to others.
  const cwdTsconfigFile = isAccessible.sync(projectLintPath, { useCached: true })
    ? projectLintPath
    : isAccessible.sync(projectBasePath, { useCached: true })
      ? projectBasePath
      : toss(new ProjectError(ErrorMessage.CannotImportTsconfig()));

  const shouldAllowWarningComments =
    process.env.XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS === 'true';

  return { packageJsonEnginesNode, cwdTsconfigFile, shouldAllowWarningComments };
}

/**
 * Accepts an absolute path to the project root and returns a {@link FlatCompat}
 * instance.
 *
 * Only useful when interfacing with legacy plugins built for `eslint@<9`.
 */
export async function makeEslintFlatCompat(projectRoot: AbsolutePath) {
  const { FlatCompat } = await import('@eslint/eslintrc');

  const flatCompat = new FlatCompat({
    baseDirectory: projectRoot,
    resolvePluginsRelativeTo: projectRoot,
    recommendedConfig: eslintJs.configs.recommended,
    allConfig: eslintJs.configs.all
  });

  return flatCompat;
}

/**
 * Accepts an {@link EslintConfig} object (or an array of them) and returns a
 * flattened array with each object's `property` property overwritten by the
 * given `value`.
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
 *   overwriteProperty(configs, 'files', ['*.{js,jsx,cjs,mjs}'])
 * );
 */
export function overwriteProperty<T extends keyof EslintConfig>(
  configs: EslintConfig | EslintConfig[],
  property: T,
  value: EslintConfig[T]
) {
  return [configs].flat().map((config) => {
    config[property] = value;
    return config;
  });
}

/**
 * Returns a function that, when invoked, returns an `eslint@>=9` configuration
 * object that adapts a legacy `eslint@<9` plugin's exposed rule extension.
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
export function legacyExtendsFactory(
  flatCompat: Awaited<ReturnType<typeof makeEslintFlatCompat>>
) {
  return function (extension: string, name: string) {
    return {
      ...fixupConfigRules(flatCompat.extends(extension)[0])[0],
      name
    } as EslintConfig;
  };
}

function toCommaSeparatedExtensionList(extensions: readonly string[]) {
  return extensions.map((extension) => extension.slice(1)).join(',');
}
