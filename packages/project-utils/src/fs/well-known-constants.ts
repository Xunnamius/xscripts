/**
 * The basename of a well-known custom Typescript configuration file.
 */
export enum Tsconfig {
  ProjectBase = 'tsconfig.json',
  ProjectLint = 'tsc.project.lint.json',
  PackageDocumentation = 'tsc.package.docs.json',
  PackageLint = 'tsc.package.lint.json',
  PackageTypes = 'tsc.package.types.json'
}

/**
 * The basename of the well-known custom Jest configuration file.
 */
export const jestConfigProjectBase = 'jest.config.mjs';

/**
 * The basename of the well-known custom Tstyche configuration file.
 */
export const tstycheConfigProjectBase = 'tstyche.config.json';

/**
 * The basename of the well-known custom Next.js configuration file.
 */
export const nextjsConfigProjectBase = 'next.config.mjs';

/**
 * The basename of the well-known custom Webpack configuration file.
 */
export const webpackConfigProjectBase = 'webpack.config.mjs';

/**
 * The basename of the well-known custom Eslint configuration file.
 */
export const eslintConfigProjectBase = 'eslint.config.mjs';

/**
 * The basename of the well-known custom Babel configuration file.
 */
export const babelConfigProjectBase = 'babel.config.cjs';

/**
 * The basename of the well-known custom Remark configuration file.
 */
export const remarkConfigProjectBase = '.remarkrc.mjs';

/**
 * The basename of the well-known custom Semantic Release configuration file.
 */
export const releaseConfigProjectBase = 'release.config.cjs';

/**
 * The basename of the well-known custom Lint Staged configuration file.
 */
export const conventionalChangelogConfigProjectBase = 'conventional.config.cjs';

/**
 * The basename of the well-known dotenv configuration file.
 */
export const dotEnvConfigProjectBase = '.env';

/**
 * The basename of the well-known dotenv configuration file.
 */
export const dotEnvConfigPackageBase = '.env';

/**
 * The basename of the well-known "shared package file". The presence of this
 * file at a package root signifies that commits scoped to said package will be
 * included by other packages in the project.
 *
 * By default, commits scoped to individual packages are ignored by other
 * packages.
 */
export const sharedConfigPackageBase = '.shared';

/**
 * The basename of the well-known distributables output or "dist" directory.
 */
export const distDirPackageBase = 'dist';

/**
 * The basename of the well-known intermediate transpilation output directory.
 */
export const intermediatesDirPackageBase = '.transpiled';

/**
 * The basename of the well-known test coverage output directory.
 */
export const coverageDirPackageBase = 'coverage';

/**
 * The basename of the well-known directory containing the package's source.
 */
export const srcDirPackageBase = 'src';

/**
 * The basename of the well-known directory containing the package's tests.
 */
export const testDirPackageBase = 'test';

/**
 * The basename of the well-known directory containing the package's
 * documentation.
 */
export const documentationDirPackageBase = 'docs';
