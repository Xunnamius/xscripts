/// @ts-check
'use strict';

// TODO: replace this with @xunnamius/semantic-release-projector-config

const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const debug = require('debug')('xscripts:semantic-release-config');

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
    // ? This block pulls in a custom semantic-release plugin that mutates
    // ? internal state as required.
    // TODO: in assets/config/_release.config.js, this should be:
    //['@-xun/scripts/assets/config/release.config.js'],
    [
      './dist/src/assets/config/_release.config.js.js',
      {
        releaseSectionPath,
        parserOpts,
        writerOpts
      }
    ],

    // * Publish

    // ! This ordering is important to ensure errors stop the process safely
    // ! and that broken builds are not published. The proper order is:
    // ! NPM (+ attestations) > Git > GitHub.

    // TODO: add support for GitHub Actions build provenance attestations here
    ['@semantic-release/npm'],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'docs'],
        // ? Make sure semantic-release uses a patched release (changelog) body.
        message: `release: <%= nextRelease.version %> [skip ci]\n\n<%= nextRelease.notes %>`
      }
    ],
    ['@semantic-release/github']
  ]
};

debug('exports: %O', module.exports);
