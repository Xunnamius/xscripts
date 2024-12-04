// TODO: re-enable // @ts-check
/* eslint-disable unicorn/prevent-abbreviations */
import assert from 'node:assert';

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
  parser as eslintTsParser
} from 'typescript-eslint';

import {
  extensionsJavascript,
  extensionsTypescript
} from '@-xun/scripts/assets/config/babel.config.cjs';

import { overwriteProperty } from '@-xun/scripts/assets/config/eslint.config.mjs';

import {
  isAccessible,
  Tsconfig
} from './node_modules/@-xun/scripts/dist/packages/project-utils/src/fs.js';

import packageJson from './package.json' with { type: 'json' };

// TODO: add these back:
// TODO: specific to this project; delete these after generalization
//'**/dummy-repo/**/*',
//'src/assets/template/.remarkrc.mjs'

// TODO: import this from project-utils:alias instead
const uriSchemeDelimiter = ':';

// TODO: import this from project-utils:alias instead
const uriSchemeSubDelimiter = '+';

const $scheme = Symbol('scheme');

const extensionsTsAndJs = [...extensionsTypescript, ...extensionsJavascript];
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const { node: packageJsonEnginesNode } = packageJson.engines || {};

if (typeof packageJsonEnginesNode !== 'string') {
  throw new TypeError(
    'project root has missing or invalid "engines.node" field in its package.json'
  );
}

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

// TODO: order matters, so make sure that aliases are being generated in the proper order!
// ! The aliases described in "wellKnownPackageAliases" are auto-generated by
// ! xscripts. Instead of modifying it directly, consider regenerating aliases
// ! across the entire project: `xscripts project renovate --task
// ! regenerate-aliases`; you can include custom aliases using the
// ! `--with-alias` parameter.
// * These aliases appear in:
// *   - tsconfig.json      (JSON)
// *   - babel.config.cjs   (CJS)
// *   - eslint.config.mjs  (ESM)
// *   - jest.config.mjs    (ESM)
// *   - next.config.mjs    (ESM)
// *   - webpack.config.mjs (ESM)
// TODO: replace this with the auto-generated unified alias configuration
// ? Aliases come from tsconfig's paths now, but this is still needed for
// ? analytical purposes.
const wellKnownPackageAliases = [
  ['multiverse+test-utils:*', './packages/test-utils/src/*'],
  ['multiverse+rejoinder:*', './packages/rejoinder/src/*'],
  ['multiverse+project-utils:*', './packages/project-utils/src/*'],
  ['multiverse+debug:*', './packages/debug/src/*'],
  ['multiverse+cli-utils:*', './packages/cli-utils/src/*'],
  ['multiverse+bfe:*', './packages/bfe/src/*'],
  [
    'multiverse+babel-plugin-metadata-accumulator:*',
    './packages/babel-plugin-metadata-accumulator/src/*'
  ],
  ['multiverse+test-utils', './packages/test-utils/src/index.js'],
  ['multiverse+rejoinder', './packages/rejoinder/src/index.js'],
  ['multiverse+project-utils', './packages/project-utils/src/index.js'],
  ['multiverse+debug', './packages/debug/src/index.js'],
  ['multiverse+cli-utils', './packages/cli-utils/src/index.js'],
  ['multiverse+bfe', './packages/bfe/src/index.js'],
  [
    'multiverse+babel-plugin-metadata-accumulator',
    './packages/babel-plugin-metadata-accumulator/src/index.js'
  ],
  ['rootverse+test-utils:*', './packages/test-utils/*'],
  ['rootverse+rejoinder:*', './packages/rejoinder/*'],
  ['rootverse+project-utils:*', './packages/project-utils/*'],
  ['rootverse+debug:*', './packages/debug/*'],
  ['rootverse+cli-utils:*', './packages/cli-utils/*'],
  ['rootverse+bfe:*', './packages/bfe/*'],
  [
    'rootverse+babel-plugin-metadata-accumulator:*',
    './packages/babel-plugin-metadata-accumulator/*'
  ],
  ['rootverse:*', './*'],
  ['universe:*', './src/*'],
  ['universe', './src/index.js'],
  ['testverse+test-utils:*', './packages/test-utils/test/*'],
  ['testverse+rejoinder:*', './packages/rejoinder/test/*'],
  ['testverse+project-utils:*', './packages/project-utils/test/*'],
  ['testverse+debug:*', './packages/debug/test/*'],
  ['testverse+cli-utils:*', './packages/cli-utils/test/*'],
  ['testverse+bfe:*', './packages/bfe/test/*'],
  [
    'testverse+babel-plugin-metadata-accumulator:*',
    './packages/babel-plugin-metadata-accumulator/test/*'
  ],
  ['testverse:*', './test/*'],
  ['typeverse:*', './types/*']
];

// TODO: perhaps this should be an importable function from asset config? Yes!
const pathGroups = wellKnownPackageAliases
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((groups, [alias]) => {
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

const pathGroupOverrides = wellKnownPackageAliases
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce((overrides, [alias]) => {
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
  }, []);

// ! It's not safe to use this var until AFTER the process.env conditional below
const sharedRestrictedImportRules = [
  // ! This must always be the first restrict import configuration object
  {
    name: '+(.|..)/node_modules/@-xun/**/*',
    message:
      'This warning is a reminder that the import needs to be removed once the corresponding package is published.'
  }
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
  eqeqeq: 'warn',
  // ? Ever since v4, we will rely on TypeScript to catch these
  'no-undef': 'off',
  'no-unused-vars': 'off',
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

if (process.env.XSCRIPTS_LINT_ALLOW_WARNING_COMMENTS !== 'true') {
  genericRules['no-warning-comments'] = 'warn';
} else {
  sharedRestrictedImportRules.shift();
}

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
    { allowedFunctionCalls: ['reconfigureJestGlobalsToSkipTestsInThisFileIfRequested'] }
  ],

  // * typescript-eslint
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/prefer-promise-reject-errors': 'off'
};

const nodeRules = {
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
  'n/no-restricted-import': ['warn', sharedRestrictedImportRules],
  'n/no-restricted-require': ['warn', sharedRestrictedImportRules]
};

const tsNodeRules = {
  // * Node (eslint-plugin-n) rules (only affects TS files)
  'n/no-restricted-import': [
    'warn',
    [
      ...sharedRestrictedImportRules,
      {
        name: '{.,..}/**/*',
        message:
          'Use an import alias scheme (e.g. universe:, multiverse+pkg-name:, rootverse:) instead.'
      }
    ]
  ]
};

const cjsRules = {
  // * Rules applied only to commonjs files (not necessarily w/ .cjs extension)
  // TODO: figure out why ESM syntax allowed in CJS files. Is it b/c babel parser?
};

const mjsRules = {
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

const earlyJsOnlyRules = {
  // * Rules applied only to JS files (cjs, mjs, jsx, etc) but NOT TS files.
  // * These rules are also applied before all others and may be overridden
  // ? We can't count on tsc to be around to catch these in our JS files
  'no-undef': 'error'
};

const globals = {
  ...jsGlobals.builtin,
  ...jsGlobals.commonjs,
  ...jsGlobals.es2025,
  ...jsGlobals.node
};

const eslintPluginUnicornRecommended = eslintPluginUnicorn.configs['flat/recommended'];

assert(eslintPluginUnicornRecommended);

const eslintPluginJestAll = eslintPluginJest.configs['flat/all'];
const eslintPluginJestStyle = eslintPluginJest.configs['flat/style'];

assert(eslintPluginJestAll);
assert(eslintPluginJestStyle);

const eslintPluginNodeRecommendedExtEither = eslintPluginNode.configs['flat/recommended'];
const eslintPluginNodeRecommendedExtMjs =
  eslintPluginNode.configs['flat/recommended-module'];
const eslintPluginNodeRecommendedExtCjs =
  eslintPluginNode.configs['flat/recommended-script'];

assert(eslintPluginNodeRecommendedExtEither);
assert(eslintPluginNodeRecommendedExtMjs);
assert(eslintPluginNodeRecommendedExtCjs);

const projectBasePath = `${import.meta.dirname}/${Tsconfig.ProjectBase}`;
const projectLintPath = `${import.meta.dirname}/${Tsconfig.ProjectLint}`;

/**
 ** Despite the scope used by xscripts, we want as broad a configuration file
 ** as possible and we'll leave the further narrowing of scope to others.
 */
const cwdTsconfigFile = isAccessible.sync(projectLintPath, { useCached: true })
  ? projectLintPath
  : isAccessible.sync(projectBasePath, { useCached: true })
    ? projectBasePath
    : // TODO: make this a ProjectError; use ErrorMessage.X
      toss(new Error('unable to locate suitable tsconfig file'));

const config = makeTsEslintConfig(
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
      '!**/src/**/*',
      // TODO: specific to this project; delete these after generalization
      '**/dummy-repo/**/*',
      'src/assets/template/.remarkrc.mjs'
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
      rules: genericRules,
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
    }
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
    rules: earlyJsOnlyRules
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
      ...nodeRules,
      ...cjsRules
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
      ...nodeRules,
      ...cjsRules
    }
  },

  // * Configs applying only to JavaScript files ending in .mjs or .jsx
  {
    ...eslintPluginNodeRecommendedExtMjs,
    name: 'node/recommended-module++:.mjs-jsx-only',
    files: ['**/*.{mjs,jsx}'],
    rules: {
      ...eslintPluginNodeRecommendedExtMjs.rules,
      ...nodeRules,
      ...mjsRules
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
      ...nodeRules,
      ...tsNodeRules
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
      ...jestRules
    }
  }
);

export default config;

/*debug('exported config: %O', config);*/

/**
 * @returns {string}
 */
function toCommaSeparatedExtensionList(array) {
  return array.map((extension) => extension.slice(1)).join(',');
}
