import { ErrorMessage as UpstreamErrorMessage } from 'multiverse+cli-utils:error.ts';

import type {
  ImportSpecifier,
  ProjectAttribute,
  RootPackage
} from 'multiverse+project-utils';

export { TaskError } from 'multiverse+cli-utils:error.ts';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  EslintPluginReturnedSomethingUnexpected(identifier: string) {
    return `assertion failed: the eslint plugin "${identifier}" returned something unexpected`;
  },
  BadSkipArgs() {
    return 'impossible combination of skipIgnored and skipUnknown was encountered';
  },
  BadAssetContextKey(key: string) {
    return `assertion failed: asset context value at expected key "${key}" is either not a string, is empty, or is undefined`;
  },
  BadPostNpmInstallScript(path: string) {
    return `unable to execute "${path}" as a JavaScript module. Please ensure it is syntactically sound`;
  },
  BadChangelogPatcher(path: string) {
    return `unable to import "${path}" as a JavaScript module. Please ensure it is syntactically sound and contains the expected exports (see documentation)`;
  },
  BadAdditionalChangelogSection(path: string) {
    return `unable to extract valid semver version from changelog section file at path: ${path}`;
  },
  BadGeneratedChangelogSection() {
    return `failed to extract valid semver version from generated changelog section`;
  },
  CannotAccessDirectory(path: string) {
    return `failed to access directory at path: ${path}`;
  },
  CannotReadFile(path: string) {
    return `failed to read from file at path: ${path}`;
  },
  CannotWriteFile(path: string) {
    return `failed to write to file at path: ${path}`;
  },
  CannotCopyFile(from: string, to: string) {
    return `failed to copy file: ${from} => ${to}`;
  },
  CannotMakeDirectory(path: string) {
    return `failed to make directory: ${path}`;
  },
  CannotUseIgnoresWithPathsOutsideProjectRoot() {
    return 'cannot use ignore functionality (like --skip-ignored) when one or more --files paths are outside of the project root';
  },
  CliProjectHasBadBinConfig() {
    return 'this project appears to be a CLI project but has one or more poorly configured "bin" entries in package.json';
  },
  CannotRunOutsideRoot() {
    return 'the current working directory must be the project root or a workspace (package) sub-root';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
  },
  WrongProjectAttributes(
    expected: ProjectAttribute[],
    actual: RootPackage['attributes'],
    preposition = 'with'
  ) {
    return `expected a project ${preposition} the following attributes: ${expected.join(', ')}; saw ${Object.keys(actual).join(', ')} instead`;
  },
  BadProjectNameInPackageJson() {
    return `a package.json file must contain a valid "name" field`;
  },
  BadPackageExportsInPackageJson() {
    return `a distributable package.json file must contain a valid "exports" field`;
  },
  MustChooseDeployEnvironment() {
    return 'must choose either --preview or --production deployment environment';
  },
  MultipleConfigsWhenExpectingOnlyOne(filename1: string, filename2: string) {
    return `expected one configuration file but encountered multiple conflicting files: ${filename1} conflicts with ${filename2}`;
  },
  ArgumentMustBeNonNegative(name: string) {
    return `argument "${name}" must have a non-negative value`;
  },
  ArgumentMustNotBeFalsy(name: string) {
    return `argument "${name}" must have a non-empty (non-falsy) value`;
  },
  MarkdownNoUndefinedReferences() {
    return 'cannot continue with undefined references present in one or more Markdown files';
  },
  AllOptionValueMustBeAlone(noun: string) {
    return `the "all" ${noun} must not be given alongside any others`;
  },
  LintingFailed() {
    return 'one or more linters returned a bad exit code';
  },
  BuildOutputChecksFailed() {
    return 'the build succeeded and is available, but one or more build output integrity checks failed';
  },
  RetrievalFailed(path: string) {
    return `failed to retrieve asset at ${path}`;
  },
  UnmatchedCommitType(type: string | undefined, variableName: string) {
    return `unmatched commit type ${type ? `"${type}" ` : ''}in ${variableName}`;
  },
  IssuePrefixContainsIllegalCharacters() {
    return 'issue prefixes cannot contain characters recognized by the RegExp constructor';
  },
  CannotImportConventionalConfig(path: string) {
    return `failed to import conventional configuration file: ${path}`;
  },
  DefaultImportFalsy() {
    return 'default import was falsy';
  },
  BadParameter(name: string) {
    return `invalid value for parameter "${name}"`;
  },
  TranspilationReturnedNothing(sourcePath: string, outputPath: string) {
    return `transpilation of the following file returned an empty result: ${sourcePath} => ${outputPath}`;
  },
  ExportSubpathsPointsToInaccessible(subpaths: [subpath: string, target: string][]) {
    return (
      'bad package.json::exports configuration: one or more entry points targets inaccessible or non-existent files:' +
      subpaths.reduce(
        (result, [subpath, target]) => result + `\n  - ${subpath} =!=> ${target}`,
        ''
      )
    );
  },
  DistributablesSpecifiersPointToInaccessible(specifiers: ImportSpecifier[]) {
    return (
      'bad distributables specifiers: invalid import of inaccessible or non-existent files:' +
      specifiers.reduce(
        (result, [filepath, specifier]) =>
          result + `\n  - "${specifier}" found in file ${filepath}`,
        ''
      )
    );
  },
  DistributablesSpecifiersPointOutsideDist(specifiers: ImportSpecifier[]) {
    return (
      'bad distributables specifiers: invalid import of files located outside distributables directory:' +
      specifiers.reduce(
        (result, [filepath, specifier]) =>
          result + `\n  - "${specifier}" found in file ${filepath}`,
        ''
      )
    );
  },
  DistributablesSpecifiersDependenciesMissing(
    packageSpecifiers: [...ImportSpecifier, packageName: string][]
  ) {
    return (
      'bad distributables specifiers: one or more packages were imported without a corresponding "dependencies" or "peerDependencies" entry in package.json:' +
      packageSpecifiers.reduce(
        (result, [filepath, specifier, packageName]) =>
          result +
          `\n  - package "${packageName}" from "${specifier}" found in file ${filepath}`,
        ''
      )
    );
  },
  DependenciesExtraneous(packagesMeta: [name: string, type: string][]) {
    return (
      'extraneous dependencies detected: the following packages are included in package.json unnecessarily and should be removed to reduce build size:' +
      packagesMeta.reduce(
        (result, [packageName, packageType]) =>
          result + `\n  - package "${packageName}" in package.json::${packageType}`,
        ''
      )
    );
  },
  OthersSpecifiersDependenciesMissing(
    packageSpecifiers: [...ImportSpecifier, packageName: string][]
  ) {
    return (
      'bad non-distributables specifiers: one or more packages were imported without a corresponding "devDependencies" entry in package.json:' +
      packageSpecifiers.reduce(
        (result, [filepath, specifier, packageName]) =>
          result +
          `\n  - package "${packageName}" from "${specifier}" found in file ${filepath}`,
        ''
      )
    );
  }
};
