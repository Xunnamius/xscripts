'use strict';

const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const debug = require('debug')(
  `${require('./package.json').name}:semantic-release-config`
);

// TODO: replace this with @xunnamius/semantic-release-projector-config

const updateChangelog = process.env.UPDATE_CHANGELOG !== 'false';

debug(`will update changelog: ${updateChangelog ? 'yes' : 'no'}`);

const { parserOpts, writerOpts } = require('./conventional.config');

const tmpChangelogReleaseSectionPath = path.join(
  os.tmpdir(),
  'xscripts-release-changelog-' + crypto.randomBytes(4).readUInt32LE(0).toString(16)
);

debug(`tmpChangelogReleaseSectionPath: ${tmpChangelogReleaseSectionPath}`);

const releaseBodyTemplateEsm = /* js */ `
try {
  const data = require('node:fs')
  .readFileSync('${tmpChangelogReleaseSectionPath}', 'utf8')
  .trim();

  if(!data) {
    throw new Error('unexpectedly empty file: ${tmpChangelogReleaseSectionPath}');
  }

  print(data);
} catch (error) {
  print('Failed to generate changelog: ' + String(error));
  throw error;
}
`.trim();

debug(`releaseBodyTemplate: ${releaseBodyTemplateEsm}`);

// ! Cannot contain the single-quote character (')
const cleanupTmpFilesTemplateCjs = /* js */ `
try {
  require("node:fs").rmSync("${tmpChangelogReleaseSectionPath}", {
    force: true
  });
} catch {}
`.trim();

debug(`cleanupTmpFilesTemplate: ${cleanupTmpFilesTemplateCjs}`);

assert(
  !cleanupTmpFilesTemplateCjs.includes("'"),
  'release.config.js assertion failed: invalid cleanupTmpFilesTemplate value (hard-coded)'
);

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    {
      name: 'canary',
      channel: 'canary',
      prerelease: true
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts,
        releaseRules: [
          // ? releaseRules are checked first; if none match, defaults are
          // ? checked next.

          // ! These two lines must always appear first and in order:
          { breaking: true, release: 'major' },
          { revert: true, release: 'patch' },

          // * Custom release rules, if any, may appear next:
          { type: 'build', release: 'patch' }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts,
        writerOpts
      }
    ],
    ['@semantic-release/changelog', { changelogFile: tmpChangelogReleaseSectionPath }],
    ...(updateChangelog
      ? [
          [
            '@semantic-release/exec',
            {
              prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --import-section-file ${tmpChangelogReleaseSectionPath}`
            }
          ]
        ]
      : []),
    // ? We run this before @semantic-release/github so the GitHub release is
    // ? patched. We run this after the updateChangelog section so that we
    // ? don't run the patcher over the same file twice, which would be bad.
    // * Note how we patch tmpChangelogReleaseSectionPath and not CHANGELOG.md.
    [
      '@semantic-release/exec',
      {
        prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --only-patch-changelog --no-format-changelog --changelog-file ${tmpChangelogReleaseSectionPath}`
      }
    ],
    // ! NPM, Git, and GitHub steps must be last just in case any other steps
    // ! fail. Further, NPM must happen before Git must happen before GitHub or
    // ! the release commit will not be properly synchronized with its
    // ! respective published releases. This order is important!
    // TODO: add support for GitHub Actions build provenance attestations here
    ['@semantic-release/npm'],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'docs'],
        // ? Make sure semantic-release uses a patched release (changelog) body.
        message: `release: <%= nextRelease.version %> [skip ci]\n\n<% ${releaseBodyTemplateEsm} %>`
      }
    ],
    [
      '@semantic-release/github',
      {
        // ? Make sure semantic-release uses a patched release (changelog) body.
        releaseBodyTemplate: `<% ${releaseBodyTemplateEsm} %>`
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: `node --input-type commonjs --eval '${cleanupTmpFilesTemplateCjs}'`
      }
    ]
  ]
};

debug('exports: %O', module.exports);
