/// @ts-check
'use strict';

const { readFile, rm: rmFile } = require('node:fs/promises');
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
    ['@semantic-release/changelog', { changelogFile: tmpChangelogReleaseSectionPath }],
    // ? Optionally update the changelog file
    updateChangelog
      ? [
          '@semantic-release/exec',
          {
            prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --import-section-file ${tmpChangelogReleaseSectionPath}`
          }
        ]
      : [],
    // ? We run this block now so the release body is patched when referenced
    // ? in the blocks below. We run this after the updateChangelog section so
    // ? we don't run the patcher over the same content twice, which is a no-no.
    // * Note how we patch tmpChangelogReleaseSectionPath and not CHANGELOG.md.
    [
      '@semantic-release/exec',
      {
        prepareCmd: `NODE_NO_WARNINGS=1 npx xscripts build changelog --only-patch-changelog --no-format-changelog --changelog-file ${tmpChangelogReleaseSectionPath}`
      }
    ],
    // ? This executes module.exports.prepare() (exported by this file) within
    // ? semantic-release's runtime realm, allowing us to mutate `nextRelease`
    // ? as we see fit.
    [__filename],

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
    [
      '@semantic-release/github',
      {
        // ? Make sure semantic-release uses a patched release (changelog) body.
        releaseBodyTemplate: `<%= nextRelease.notes %>`
      }
    ]
  ]
};

/**
 * This is a custom semantic-release plugin that replaces `nextRelease.notes`
 * with the version patched by xscripts.
 */
module.exports.prepare = async function prepare(_pluginConfig, context) {
  debug('entered custom plugin prepare function');
  /*try {*/
  const updatedNotes = (await readFile(tmpChangelogReleaseSectionPath, 'utf8')).trim();

  if (!updatedNotes) {
    throw new Error(
      `unexpectedly empty temporary changelog file: ${tmpChangelogReleaseSectionPath}`
    );
  }

  context.nextRelease.notes = updatedNotes;
  debug('updated nextRelease.notes: %O', context.nextRelease.notes);

  // ? We don't really care if this succeeds or fails
  void rmFile(tmpChangelogReleaseSectionPath, { force: true }).catch();
  /*} catch (error) {
    // TODO: add a call out to debug.error here once we start using rejoinder
    throw error;
  }*/
};

debug('exports: %O', module.exports);
