import { ErrorMessage as UpstreamErrorMessage } from 'multiverse/@-xun/cli-utils/error';

import type { ProjectMetaAttribute } from 'universe/util';

export { TaskError } from 'multiverse/@-xun/cli-utils/error';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
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
  CannotBuildIntermediatesForNextJs() {
    return 'intermediates cannot be generated for a Next.js project';
  },
  CannotRunOutsideRoot() {
    return 'the current working directory must be the project root or a workspace sub-root';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
  },
  WrongProjectAttributes(
    expected: ProjectMetaAttribute[],
    actual: ProjectMetaAttribute[],
    withOrWithout: 'with' | 'without' = 'with'
  ) {
    return `expected a project ${withOrWithout} the following attributes: ${expected.join(', ')}; saw ${actual.join(', ')} instead`;
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
  AllScopeMustBeAlone() {
    return 'the "all" scope/target must not be given alongside any others';
  }
};
