import { ErrorMessage as UpstreamErrorMessage } from 'multiverse/@-xun/cli-utils/error';
import { type ProjectMetaAttribute } from 'universe/util';

export { TaskError } from 'multiverse/@-xun/cli-utils/error';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  AssertionFailureMissingPackageJson() {
    return 'assertion failed: cannot find suitable package.json file';
  },
  AssertionFailureBadPackageJson() {
    return 'assertion failed: cannot load given package.json file';
  },
  AssertionFailureCannotBeCliAndNextJs() {
    return 'assertion failed: project must either provide a CLI or be a Next.js project';
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
