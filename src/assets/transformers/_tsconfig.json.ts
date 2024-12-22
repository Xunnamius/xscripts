import {
  deriveAliasesForTypeScript,
  generateRawAliasMap
} from 'multiverse+project-utils:alias.ts';

import { Tsconfig } from 'multiverse+project-utils:fs.ts';

import {
  generatePerPackageAssets,
  generateRootOnlyAssets,
  makeTransformer
} from 'universe:assets.ts';

import { makeGeneratedAliasesWarningComment } from 'universe:constant.ts';

// {@xscripts/notExtraneous typescript}

const tsconfigFiles = {
  [Tsconfig.ProjectBase]: `
{
  "compilerOptions": {
    // ? Needed to type check our various .js files
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    // ? Due to paths, the effect of this prop is limited (already covered)
    "allowImportingTsExtensions": true,
    // ? Due to paths, the effect of this prop is limited (often ignored)
    "allowArbitraryExtensions": true,
    "alwaysStrict": true,
    "baseUrl": ".",
    // ? Does too much; opt-in (provided by allowJs) is better
    "checkJs": false,
    "jsx": "preserve",
    "declaration": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "inlineSourceMap": true,
    "isolatedModules": true,
    // ? Tried it. Not a fan. Also conflicts with allowJs
    "isolatedDeclarations": false,
    "lib": [
      "ESNext",
      "DOM",
      "WebWorker.ImportScripts",
      "ScriptHost",
      "DOM.Iterable"
    ],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    ${makeGeneratedAliasesWarningComment(4)}
    "paths": {derivedAliasesSourceSnippet},
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ESNext"
  },
  "include": [
    "types/**/*",
    "src/**/*",
    "test/**/*",
    "packages/*/src/**/*",
    "packages/*/test/**/*"
  ],
  "exclude": [
    "**/dist/**/*",
    "**/node_modules/**/*",
    "**/*.ignore",
    "**/*.ignore.*/**/*",
    "**/ignore.*"
  ]
}`,
  [Tsconfig.ProjectLint]: `
/**
 ** This file extends the project root tsconfig.json file for use with linting
 ** all files at the project level.
 **
 ** Use this file to exert some control over which files will have their errors
 ** reported and which files will be ignored when linting an entire project
 ** repository at once.
 */

{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "./tsconfig.json",
  "include": ["**/*", "**/.*/**/*", "**/.*"],
  "exclude": [
    "**/dist/**/*",
    "**/test/fixtures/**/*",
    "**/node_modules/**/*",
    "**/*.ignore",
    "**/*.ignore.*/**/*",
    "**/ignore.*"
  ]
}`,
  [Tsconfig.PackageTypes]: `
/**
** This file extends the project root tsconfig.json file for use with tsc at
** the package level.
**
** Use this file to exert some control over how tsc generates package-specific
** definition files.
*/

{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "isolatedModules": false,
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "./"
  },
  "include": ["types/**/*", "src/**/*"],
  "exclude": [
    "**/dist/**/*",
    "**/test/fixtures/**/*",
    "**/node_modules/**/*",
    "packages/**/*",
    "packages/**/.*",
    "**/*.ignore",
    "**/*.ignore.*/**/*",
    "**/ignore.*"
  ]
}`,
  [Tsconfig.PackageLint]: `
/**
 ** This file extends the project root tsconfig.json file for use with linting
 ** all files at the package level. Only tsc gets its paths from this file.
 **
 ** Use this file to exert some control over which files are considered
 ** part of the current package and which will be ignored.
 */

{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "./tsconfig.json",
  "include": ["**/*", "**/.*/**/*", "**/.*"],
  "exclude": [
    "**/dist/**/*",
    "**/test/fixtures/**/*",
    "**/node_modules/**/*",
    "packages/**/*",
    "packages/**/.*",
    "**/*.ignore",
    "**/*.ignore.*/**/*",
    "**/ignore.*"
  ]
}`,
  [Tsconfig.PackageDocumentation]: `
/**
 ** This file extends the project root tsconfig.json file for use with
 ** typedoc at the package level.
 **
 ** Use this file to exert some control over how typedoc generates
 ** package-specific documentation.
 */

{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "extends": "./tsconfig.json",
  "include": ["types/**/*", "src/**/*", "test/**/*"],
  "exclude": [
    "**/dist/**/*",
    "**/test/fixtures/**/*",
    "**/node_modules/**/*",
    "packages/**/*",
    "packages/**/.*",
    "**/*.ignore",
    "**/*.ignore.*/**/*",
    "**/ignore.*"
  ]
}`
};

export const { transformer } = makeTransformer(async function (context) {
  const { shouldDeriveAliases, projectMetadata, toProjectAbsolutePath } = context;

  const derivedAliasesSourceSnippet = shouldDeriveAliases
    ? JSON.stringify(
        deriveAliasesForTypeScript(generateRawAliasMap(projectMetadata)),
        undefined,
        6
      )
        // ? Make it a bit prettier
        .replaceAll(/\[\s+"/g, '["')
        .replaceAll(/"\s+\]/g, '"]')
        .replace(/^}/m, '    }')
    : '{}';

  return [
    ...// * Only the root package gets these files
    (await generateRootOnlyAssets(context, function () {
      return [
        {
          path: toProjectAbsolutePath(Tsconfig.ProjectBase),
          generate: () =>
            tsconfigFiles[Tsconfig.ProjectBase].replace(
              '{derivedAliasesSourceSnippet}',
              derivedAliasesSourceSnippet
            )
        },
        {
          path: toProjectAbsolutePath(Tsconfig.ProjectLint),
          generate: () => tsconfigFiles[Tsconfig.ProjectLint]
        }
      ];
    })),

    ...// * Every package gets these files except non-hybrid monorepo roots
    (await generatePerPackageAssets(context, async function ({ toPackageAbsolutePath }) {
      // TODO: don't these need to be tweaked more for monorepo packages?
      // TODO: if so, use contextWithCwdPackage
      return [
        {
          path: toPackageAbsolutePath(Tsconfig.PackageTypes),
          generate: () => tsconfigFiles[Tsconfig.PackageTypes]
        },
        {
          path: toPackageAbsolutePath(Tsconfig.PackageLint),
          generate: () => tsconfigFiles[Tsconfig.PackageLint]
        },
        {
          path: toPackageAbsolutePath(Tsconfig.PackageDocumentation),
          generate: () => tsconfigFiles[Tsconfig.PackageDocumentation]
        }
      ];
    }))
  ];
});
