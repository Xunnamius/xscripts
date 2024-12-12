import {
  deriveAliasesForTypeScript,
  generateRawAliasMap
} from 'multiverse+project-utils:alias.ts';

import {
  isRootPackage,
  ProjectAttribute,
  type Package
} from 'multiverse+project-utils:analyze.ts';
import { Tsconfig } from 'multiverse+project-utils:fs.ts';

import { makeTransformer, type Asset } from 'universe:assets.ts';
import { RenovationPreset } from 'universe:commands/project/renovate.ts';
import { DefaultGlobalScope } from 'universe:configure.ts';
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

export const { transformer } = makeTransformer(function ({
  shouldDeriveAliases,
  projectMetadata,
  toProjectAbsolutePath,
  targetAssetsPreset,
  scope
}) {
  const assets: Asset[] = [];
  const { cwdPackage, rootPackage, subRootPackages } = projectMetadata;
  const derivedAliasesSourceSnippet = shouldDeriveAliases
    ? JSON.stringify(
        deriveAliasesForTypeScript(generateRawAliasMap(projectMetadata)),
        undefined,
        6
      )
        .replaceAll(/\[\s+"/g, '["')
        .replaceAll(/"\s+\]/g, '"]')
        .replace(/^}/m, '    }')
    : '{}';

  if (scope === DefaultGlobalScope.Unlimited || isRootPackage(cwdPackage)) {
    assets.push(
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
    );
  }

  if (scope === DefaultGlobalScope.ThisPackage) {
    addPackageAssets(cwdPackage);
  } else {
    const allPackages = [cwdPackage].concat(...(subRootPackages?.values() || []));
    for (const package_ of allPackages) {
      addPackageAssets(package_);
    }
  }

  return assets;

  function addPackageAssets(package_: Package) {
    const isPackageTheRootPackage = isRootPackage(package_);
    const isInHybridrepoOrPolyrepo =
      rootPackage.attributes[ProjectAttribute.Hybridrepo] ||
      rootPackage.attributes[ProjectAttribute.Polyrepo];

    if (!isPackageTheRootPackage || isInHybridrepoOrPolyrepo) {
      const relativeRoot = 'relativeRoot' in package_ ? package_.relativeRoot : '';

      assets.push({
        path: toProjectAbsolutePath(relativeRoot, Tsconfig.PackageTypes),
        generate: () => tsconfigFiles[Tsconfig.PackageTypes]
      });

      if (targetAssetsPreset !== RenovationPreset.Minimal) {
        // TODO: don't these need to be tweaked more for monorepo packages?
        assets.push(
          {
            path: toProjectAbsolutePath(relativeRoot, Tsconfig.PackageLint),
            generate: () => tsconfigFiles[Tsconfig.PackageLint]
          },
          {
            path: toProjectAbsolutePath(relativeRoot, Tsconfig.PackageDocumentation),
            generate: () => tsconfigFiles[Tsconfig.PackageDocumentation]
          }
        );
      }
    }
  }
});
