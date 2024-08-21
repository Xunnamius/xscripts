/// @ts-check
'use strict';

const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const debug = require('debug')('xscripts:semantic-release-config');

// TODO: replace this with @xunnamius/semantic-release-projector-config

const updateChangelog = process.env.UPDATE_CHANGELOG !== 'false';

debug(`will update changelog: ${updateChangelog ? 'yes' : 'no'}`);

const { parserOpts, writerOpts } = require('./conventional.config');

const releaseSectionPath = path.join(
  os.tmpdir(),
  `xscripts-release-changelog-${crypto.randomBytes(4).readUInt32LE(0).toString(16)}.md`
);

debug(`releaseSectionPath: ${releaseSectionPath}`);

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
    // * Prepare

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
    // ? We need this for patching the release body even when not updating
    // ? the changelog.
    // * This generates the changelog during semantic-release's "prepare" step.
    ['@semantic-release/changelog', { changelogFile: releaseSectionPath }],
    // ? Optionally update the changelog file.
    updateChangelog
      ? [
          '@semantic-release/exec',
          {
            prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --import-section-file ${releaseSectionPath}`
          }
        ]
      : [],
    // ? We run this block now so the release body is patched and formatted when
    // ? referenced in the blocks below. We run this after the updateChangelog
    // ? section so we don't run the patcher over the same content twice.
    [
      '@semantic-release/exec',
      {
        // * Note how we patch and format releaseSectionPath and not the
        // * changelog file itself.
        prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --only-patch-changelog --changelog-file ${releaseSectionPath}`
      }
    ],
    // ? This block pulls in a custom semantic-release plugin that mutates
    // ? nextRelease.notes among other context values.
    // TODO: in assets/config/_release.config.js, this should be:
    //['@-xun/scripts/assets/config/release.config.js'],
    ['./dist/src/assets/config/_release.config.js.js', { releaseSectionPath }]

    // * Publish

    // ! This ordering is important to ensure errors stop the process safely
    // ! and that broken builds are not published. The proper order is:
    // ! NPM (+ attestations) > Git > GitHub.

    // TODO: add support for GitHub Actions build provenance attestations here
    /* ['@semantic-release/npm'],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'docs'],
        // ? Make sure semantic-release uses a patched release (changelog) body.
        message: `release: <%= nextRelease.version %> [skip ci]\n\n<%= nextRelease.notes %>`
      }
    ],
    ['@semantic-release/github'] */
  ]
};

debug('exports: %O', module.exports);
