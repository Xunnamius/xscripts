import { ErrorMessage as UpstreamErrorMessage } from 'multiverse+project-utils:error.ts';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  GuruMeditation() {
    return 'an impossible scenario occurred';
  },
  EncounteredEmptyImportCallExpression(isRequire: boolean) {
    return `encountered an illegal ${isRequire ? 'require' : 'dynamic import'} statement with no arguments`;
  }
};
