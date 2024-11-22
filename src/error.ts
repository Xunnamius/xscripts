import { makeNamedError } from 'named-app-errors';

import { ErrorMessage as UpstreamErrorMessage } from 'multiverse+cli-utils:error.ts';

import {
  $type,
  $type_ProjectError,
  isProjectError,
  ProjectError
} from 'multiverse+project-utils:error.ts';

import type {
  ImportSpecifier,
  ProjectAttribute,
  RootPackage
} from 'multiverse+project-utils';

export { TaskError } from 'multiverse+cli-utils:error.ts';

// TODO: replace a lot of all that follows with the official package(s),
// TODO: including the symbol use below. Symbols and stuff need to be auto-generated.

export const $type_BuildOutputCheckError = Symbol.for('object-type-hint:ProjectError');
/**
 * Type guard for {@link ProjectError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isBuildOutputCheckError(
  parameter: unknown
): parameter is BuildOutputCheckError {
  return (
    isProjectError(parameter) && parameter[$type].includes($type_BuildOutputCheckError)
  );
}

/**
 * Represents encountering a project that is not a git repository.
 */
export class BuildOutputCheckError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_BuildOutputCheckError, $type_ProjectError];
  /**
   * Represents encountering a project that is not a git repository.
   */
  constructor();
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(message: string);
  constructor(message: string | undefined = undefined) {
    super(message ?? ErrorMessage.BuildOutputChecksFailed());
  }
}
makeNamedError(BuildOutputCheckError, 'BuildOutputCheckError');

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
    return `the distributable package.json file does not contain a valid "name" field`;
  },
  BadPackageExportsInPackageJson() {
    return `the distributable package.json file does not contain a valid "exports" field`;
  },
  MustChooseDeployEnvironment() {
    return 'must choose either --preview or --production deployment environment';
  },
  MissingXscriptsEnvironmentVariable(variableName: string) {
    return `the expected xscripts environment variable "${variableName}" must be defined in process.env`;
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
  OptionValueMustBeAlone(option: string, noun: string) {
    return `the "${option}" ${noun} must not be given alongside any others`;
  },
  OptionValueMustBeAloneWhenBaseline(option: string, noun: string) {
    return ErrorMessage.OptionValueMustBeAlone(option, noun) + ' when using --baseline';
  },
  LintingFailed() {
    return 'one or more linters returned a bad exit code';
  },
  MissingConfigurationFile(path: string) {
    return `this command requires the following configuration file exists: ${path}`;
  },
  TestingFailed() {
    return 'one or more test executables returned a bad exit code';
  },
  BuildOutputChecksFailed() {
    return 'one or more build output integrity checks failed';
  },
  ReleaseEnvironmentValidationFailed() {
    return 'one or more runtime environment validation checks failed';
  },
  ReleaseRepositoryStateValidationFailed() {
    return 'one or more runtime environment validation checks failed';
  },
  ReleaseRepositoryNoCurrentBranch() {
    return 'repository "HEAD" ref is not currently on an existing branch (are you in detached HEAD state?)';
  },
  ReleaseScriptExecutionFailed() {
    return 'one or more package.json scripts returned a non-zero exit code';
  },
  ReleaseRunnerExecutionFailed() {
    return 'one or more release tasks failed to complete';
  },
  CodecovDownloaderOnlySupportsLinux() {
    return 'the Codecov downloader only supports the Linux operating system; ensure a suitable "codecov" binary exists in the runtime path before reattempting this command';
  },
  FailedToInstallCodecov() {
    return 'the Codecov downloader failed to make a "codecov" executable available; ensure a suitable "codecov" binary exists in the runtime path before reattempting this command';
  },
  CodecovRetrievalFailed(url: string) {
    return `failed to download a suitable codecov binary from ${url}`;
  },
  AssetRetrievalFailed(path: string) {
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
  TaskNotRunnable(id: string, npmScripts: string[]) {
    return npmScripts.length
      ? `task ${id} expects one of the following scripts to exist in this package's package.json file: "${npmScripts.join('", "')}`
      : `task ${id} is not runnable`;
  },
  /**
   * These are "error" messages that are not necessarily meant to be the message
   * of an {@link Error} instance, but are reported to the user in other ways
   * (such as via `rejoinder`). They may not follow the same standard
   * punctuation and capitalization rules as the other error messages.
   */
  specialized: {
    BuildOutputIntermediates() {
      return '⚠️🚧 Build output consists of intermediate files NOT SUITABLE FOR DISTRIBUTION OR PRODUCTION';
    },
    BuildOutputPartial() {
      return '⚠️🚧 The build "succeeded," but ONLY a subset of build targets were actually transpiled';
    },
    BuildOutputChecksFailed() {
      return '⚠️🚧 The build succeeded and is available, but one or more build output integrity checks failed';
    },
    ExportSubpathsPointsToInaccessible(subpaths: [subpath: string, target: string][]) {
      return (
        'Bad package.json::exports configuration: one or more entry points targets inaccessible or non-existent files:' +
        subpaths.reduce(
          (result, [subpath, target]) => result + `\n  - ${subpath} =!=> ${target}`,
          ''
        )
      );
    },
    DistributablesSpecifiersPointToInaccessible(specifiers: ImportSpecifier[]) {
      return (
        'Bad distributables specifiers: invalid import of inaccessible or non-existent files:' +
        specifiers.reduce(
          (result, [filepath, specifier]) =>
            result + `\n  - "${specifier}" found in file ${filepath}`,
          ''
        )
      );
    },
    DistributablesSpecifiersPointOutsideDist(specifiers: ImportSpecifier[]) {
      return (
        'Bad distributables specifiers: invalid import of files located outside distributables directory:' +
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
        'Bad distributables specifiers: one or more packages were imported without a corresponding "dependencies" or "peerDependencies" entry in package.json:' +
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
        'Extraneous dependencies detected: the following packages are included in package.json unnecessarily and should be removed to reduce build size:' +
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
        'Bad non-distributables specifiers: one or more packages were imported without a corresponding "devDependencies" entry in package.json:' +
        packageSpecifiers.reduce(
          (result, [filepath, specifier, packageName]) =>
            result +
            `\n  - package "${packageName}" from "${specifier}" found in file ${filepath}`,
          ''
        )
      );
    }
  }
};
