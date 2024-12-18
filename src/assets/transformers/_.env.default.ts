import {
  dotEnvConfigPackageBase,
  dotEnvDefaultConfigPackageBase,
  isAccessible,
  toRelativePath,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { generateRootOnlyAssets, makeTransformer, type Asset } from 'universe:assets.ts';
import { readFile } from 'universe:util.ts';

// {@xscripts/notExtraneous dotenv-cli}

const startsWithAlphaNumeric = /^[a-z0-9]/i;

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath, forceOverwritePotentiallyDestructive, log, debug } =
    context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    const secretsFilePath = toProjectAbsolutePath(dotEnvConfigPackageBase);
    const doesSecretsFileAlreadyExist = await isAccessible(secretsFilePath, {
      useCached: true
    });

    const shouldOverwriteSecretsFile =
      forceOverwritePotentiallyDestructive || !doesSecretsFileAlreadyExist;

    const assets: Asset[] = [
      {
        path: toProjectAbsolutePath(dotEnvDefaultConfigPackageBase),
        generate
      }
    ];

    if (shouldOverwriteSecretsFile) {
      if (doesSecretsFileAlreadyExist) {
        log.warn(
          'Potentially appending new secrets to sensitive file (current secrets preserved): %O',
          toRelativePath(toProjectAbsolutePath(), secretsFilePath)
        );
      }

      assets.push({
        path: secretsFilePath,
        generate: () => generateDummyDotEnv({ merge: secretsFilePath })
      });
    }

    return assets;
  });

  // ! NEVER log the return value of this function
  async function generateDummyDotEnv({ merge }: { merge: AbsolutePath }) {
    debug('generating dummy dotenv file');

    let __SENSITIVE__outputFileContents = '';
    const dummyDotEnvVariables = generate()
      .split('\n')
      .filter((str) => startsWithAlphaNumeric.test(str));

    if (merge) {
      const __SENSITIVE__currentDotEnv = await readFile(merge).catch(
        (error: unknown) => {
          debug.message('unable to read in an existing .env file: %O', error);
          return '';
        }
      );

      if (__SENSITIVE__currentDotEnv) {
        const currentDotEnvVariables = __SENSITIVE__currentDotEnv
          .split('\n')
          .filter((str) => startsWithAlphaNumeric.test(str) && str.includes('='))
          .map((str) => str.split('=')[0] + '=');

        // ! CAREFUL not to log sensitive information!
        debug('default dotenv template variables: %O', dummyDotEnvVariables);

        // ! CAREFUL not to log sensitive information!
        debug('currentDotEnvVariables: %O', currentDotEnvVariables);

        const variablesToAppend = dummyDotEnvVariables.filter((line) =>
          currentDotEnvVariables.every((variable) => !line.startsWith(variable))
        );

        // ! CAREFUL not to log sensitive information!
        debug('variablesToAppend: %O', variablesToAppend);

        // ? We NEVER overwrite the current secrets file, we only append to it
        __SENSITIVE__outputFileContents = [__SENSITIVE__currentDotEnv]
          .concat(variablesToAppend)
          .join('\n');
      }
    }

    if (!__SENSITIVE__outputFileContents) {
      // ! CAREFUL not to log sensitive information!
      debug('default dotenv template variables: %O', dummyDotEnvVariables);
      __SENSITIVE__outputFileContents = dummyDotEnvVariables.join('\n');
    }

    // ! CAREFUL not to log sensitive information!
    debug('output file content size: ~%O bytes', __SENSITIVE__outputFileContents.length);
    return __SENSITIVE__outputFileContents;
  }
});

function generate() {
  return `
# shellcheck disable=all

# Codecov test analysis token
#
# The token used during CI/CD to analyze and upload build artifact code quality
# data to Codecov.
CODECOV_TOKEN=

# GitHub deploy token (alias GH_TOKEN)
#
# The token used during CI/CD to interact with GitHub's API.
GITHUB_TOKEN=

# NPM deploy token
#
# The token used during CD to login to NPM. Not referenced during non-CI/CD
# (i.e. local, manual) deployments.
NPM_TOKEN=

# Git push author name
#
# The token used during CD to set the author name of the git push.
GIT_AUTHOR_NAME=

# Git commit committer name
#
# The token used during CD to set the name attached to any git commits.
GIT_COMMITTER_NAME=

# Git push author email
#
# The token used during CD to set the author email of the git push.
GIT_AUTHOR_EMAIL=

# Git commit committer email
#
# The token used during CD to set the email attached to any git commits.
GIT_COMMITTER_EMAIL=

# GPG private key passphrase
#
# The passphrase used to unlock GPG_PRIVATE_KEY. Not referenced during non-CI/CD
# (i.e. local, manual) deployments.
GPG_PASSPHRASE=

# GPG private key
#
# The GPG key used to sign all git commits and releases. Not referenced during
# non-CI/CD (i.e. local, manual) deployments.
GPG_PRIVATE_KEY=
`;
}
