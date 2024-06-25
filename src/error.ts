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
  }
};
