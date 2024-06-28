import { ErrorMessage as UpstreamErrorMessage } from 'multiverse/@-xun/cli-utils/error';

import type { ProjectMetaAttribute } from 'universe/util';

export { TaskError } from 'multiverse/@-xun/cli-utils/error';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  CannotReadFile(expectedPath: string) {
    return `failed to read file at path: ${expectedPath}`;
  },
  CannotBeCliAndNextJs() {
    return 'project must either provide a CLI or be a Next.js project';
  },
  CannotRunOutsideRoot() {
    return 'the current working directory must be the project root or a workspace sub-root';
  },
  CleanCalledWithoutForce() {
    return 'no deletions were performed (try again with --force)';
  },
  WrongProjectAttributes(
    expected: ProjectMetaAttribute[],
    actual: ProjectMetaAttribute[]
  ) {
    return `expected a project with the following attributes: ${expected.join(', ')}; saw ${actual.join(', ')} instead`;
  },
  MustChooseDeployEnvironment() {
    return 'must choose either --preview or --production deployment environment';
  },
  MarkdownNoUndefinedReferences() {
    return 'cannot continue with undefined references present in one or more Markdown files';
  }
};
