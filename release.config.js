'use strict';

const debug = require('debug')(
  `${require('./package.json').name}:semantic-release-config`
);

// TODO: replace this with @xunnamius/semantic-release-projector-config

const updateChangelog = process.env.UPDATE_CHANGELOG !== 'false';

debug(`will update changelog: ${updateChangelog ? 'yes' : 'no'}`);

const { parserOpts, writerOpts } = require('./conventional.config');

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
    // TODO: augment this so that the latest section gets put in here properly
    ...(updateChangelog
      ? [
          [
            '@semantic-release/exec',
            {
              prepareCmd: 'NODE_NO_WARNINGS=1 npx xscripts build changelog'
            }
          ]
        ]
      : []),
    [
      '@semantic-release/git',
      {
        assets: [
          'package.json',
          'package-lock.json',
          'npm-shrinkwrap.json',
          'CHANGELOG.md',
          'docs'
        ],
        message: 'release: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    ['@semantic-release/npm'],
    ['@semantic-release/github']
  ]
};

debug('exports: %O', module.exports);
