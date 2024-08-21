// * https://www.npmjs.com/package/npm-check-updates#configuration-files

module.exports = {
  reject: [
    // ? Pin the CJS version
    'supports-color',
    // ? Until upstream semantic-release-atam updates, this needs to be frozen
    '@semantic-release/release-notes-generator'
  ]
};
