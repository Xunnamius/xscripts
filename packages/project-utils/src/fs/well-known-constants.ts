/**
 * The basename of a well-known custom Typescript configuration file.
 */
export enum Tsconfig {
  ProjectBase = 'tsconfig.json',
  ProjectLintSource = 'tsc.project.lint-source.json',
  ProjectLintUnlimited = 'tsc.project.lint-unlimited.json',
  PackageDocumentation = 'tsc.package.docs.json',
  PackageLintSource = 'tsc.package.lint-source.json',
  PackageLintUnlimited = 'tsc.package.lint-unlimited.json',
  PackageTypes = 'tsc.package.types.json'
}

/**
 * The basename of the well-known custom Jest configuration file.
 */
export const jestConfigProjectBase = 'jest.config.mjs';

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
export const babelConfigProjectBase = 'babel.config.js';

/**
 * The basename of the well-known custom Remark configuration file.
 */
export const remarkConfigProjectBase = '.remarkrc.mjs';

/**
 * The basename of the well-known custom Semantic Release configuration file.
 */
export const releaseConfigProjectBase = 'release.config.js';

/**
 * The basename of the well-known custom Lint Staged configuration file.
 */
export const conventionalChangelogConfigProjectBase = 'conventional.config.js';
