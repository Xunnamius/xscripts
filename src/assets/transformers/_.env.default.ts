import {
  dotEnvConfigPackageBase,
  dotEnvDefaultConfigPackageBase,
  isAccessible,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { makeTransformer, type Asset } from 'universe:assets.ts';
import { readFile } from 'universe:util.ts';

// {@xscripts/notExtraneous dotenv-cli}

const startsWithAlphaNumeric = /^[a-z0-9]/i;

export const { transformer } = makeTransformer(async function ({
  toProjectAbsolutePath,
  forceOverwritePotentiallyDestructive,
  log,
  debug
}) {
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
        'secrets file will be updated (current secrets are preserved): %O',
        secretsFilePath
      );
    }

    assets.push({
      path: secretsFilePath,
      generate: () => generateDummyDotEnv({ merge: secretsFilePath })
    });
  }

  return assets;

  async function generateDummyDotEnv({ merge }: { merge: AbsolutePath }) {
    debug('generating dummy dotenv file');

    let dotEnvLines = generate()
      .split('\n')
      .filter((str) => startsWithAlphaNumeric.test(str));

    if (merge) {
      const currentDotEnv = await readFile(merge);
      const currentDotEnvVariables = currentDotEnv
        .split('\n')
        .filter((str) => startsWithAlphaNumeric.test(str) && str.includes('='))
        .map((str) => str.split('=')[0] + '=');

      debug('currentDotEnvVariables: %O', currentDotEnvVariables);

      const linesToAppend = dotEnvLines.filter((line) =>
        currentDotEnvVariables.every((variable) => !line.startsWith(variable))
      );

      debug('linesToAppend: %O', linesToAppend);

      if (linesToAppend.length) {
        dotEnvLines = [currentDotEnv, '\n'].concat(dotEnvLines);
      }
    }

    return dotEnvLines.join('\n');
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
