import { ErrorMessage as UpstreamErrorMessage } from 'multiverse/@-xun/cli-utils/error';

import type { ProjectMetaAttribute } from 'universe/util';

export { TaskError } from 'multiverse/@-xun/cli-utils/error';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  BadAssetContextKey(key: string) {
    return `assertion failed: asset context value at expected key "${key}" is either not a string, is empty, or is undefined`;
  },
  BadChangelogPatcher(path: string) {
    return `unable to import "${path}" as a JavaScript module. Please ensure it is syntactically sound and contains the expected exports (see documentation).`;
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
  CannotBeCliAndNextJs() {
    return 'project must either provide a CLI or be a Next.js project';
  },
  CliProjectHasBadBinConfig() {
    return 'this project appears to be a CLI project but has one or more poorly configured "bin" entries in package.json';
  },
  CannotBuildIntermediatesForNextJs() {
    return 'intermediates cannot be generated for a Next.js project';
  },
  CannotRunOutsideRoot() {
    return 'the current working directory must be the project root or a workspace (package) sub-root';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
  },
  WrongProjectAttributes(
    expected: ProjectMetaAttribute[],
    actual: ProjectMetaAttribute[],
    preposition = 'with'
  ) {
    return `expected a project ${preposition} the following attributes: ${expected.join(', ')}; saw ${actual.join(', ')} instead`;
  },
  BadProjectTypeInPackageJson() {
    return `a package.json file must contain a "type" field with a value of either "module" or "commonjs", otherwise the "type" field must be omitted`;
  },
  BadProjectNameInPackageJson() {
    return `a package.json file must contain a valid "name" field`;
  },
  MustChooseDeployEnvironment() {
    return 'must choose either --preview or --production deployment environment';
  },
  ArgumentMustBeNonNegative(name: string) {
    return `argument "${name}" must have a non-negative value`;
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
  RetrievalFailed(path: string) {
    return `failed to retrieve asset at ${path}`;
  },
  UnmatchedCommitType(type: string | undefined, variableName: string) {
    return `unmatched commit type ${type ? `"${type}" ` : ''}in ${variableName}`;
  },
  IssuePrefixContainsIllegalCharacters() {
    return 'issue prefixes cannot contain characters recognized by the RegExp constructor';
  }
};
