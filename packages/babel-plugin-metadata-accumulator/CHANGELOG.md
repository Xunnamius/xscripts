# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/babel-plugin-metadata-accumulator[@1.0.0][3] (2024-11-24)

### ✨ Features

- **babel:** use reverse entrypoint resolver to fix tsc output ([c3fc126][4])
- Integrate @-xun/run ([d22cee3][5])
- Integrate Tstyche into "test" command ([9045cd7][6])
- **src:** implement "release" command ([44be676][8])
- **src:** implement new graph algorithm for lint target determination ([3323fc3][9])

### 🪄 Fixes

- **eslint:** do not collapse path group overrides ([71b17c8][10])

### ⚙️ Build System

- **babel:** add core-js validation checks ([55ee62d][11])
- **babel:** fix incorrect regexp stringification when using transform-rewrite-imports ([56b706a][12])
- **eslint:** add `instanceof` and `process.cwd` usage restrictions ([645473d][13])
- **eslint:** allow "arg" as a variable name ([9087086][14])
- **eslint:** ensure .transpiled directory is ignored ([c34a549][15])
- **eslint:** update to use experimental features of @-xun/eslint-plugin-import-experimental ([36016b1][16])
- **gitignore:** upgrade to more robust .gitignore ([43da882][17])
- **husky:** add husky pre-push protective hook ([33af2bc][18])
- **jest:** ensure .transpiled directory is ignored ([c1ac811][19])
- **jest:** ensure .transpiled directory is ignored by jest-haste-map et al ([901d853][20])
- **jest:** ensure jest and jest-haste-map ignore ignored packages ([86fca58][21])
- **jest:** ignore type-only tests ([1fb8568][22])
- Add missing dependencies (to be pared down later) ([b3e2560][23])
- Ensure root types/ directory is included in sub-root tsc configs ([0ed2513][24])
- Package-ify this workspace ([11da8f2][25])
- **prettierignore:** ignore license files ([b928e8a][28])
- **remarkrc:** never automatically capitalize our packages' names in markdown headings ([45bcd8c][29])
- Use consistent exclusions across TS configurations ([98a1dd7][30])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/compare/@-xun/babel-plugin-metadata-accumulator@0.0.0-init...@-xun/babel-plugin-metadata-accumulator@1.0.0
[4]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c3fc1264932eb8224289ef973366fc0cb5435f59
[5]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/d22cee3b292da80ab45e4513bba3b2157fa72245
[6]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/9045cd704121600e07d84839c3e23b407e184f6b
[7]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/1a69887158a00db7133cf0a2eee85146ec6d1399
[8]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/44be676ca04207bd17553941d367abda2325c0ee
[9]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/3323fc3580b663f00518e7ca7bd9f52a7e50b80f
[10]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/71b17c8574fe55da23831cd1be11457e7cb4bdb5
[11]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/55ee62d4a379fc1aae845c6847adc0a9c8a8db6f
[12]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/56b706a90fbab254ee74509f45cf632157a0cfdc
[13]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/645473d084f3d4033afe39d72802b0a2a89e112d
[14]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/9087086d6944cb6a847f325142753a63be2ca30c
[15]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c34a5499cb58878fdaa42e83063e1c36a0582e06
[16]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/36016b10da47bb5799d3e558831a96eda878c10e
[17]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/43da8828df733ab8fd835d1a40c2a2c0c98fdd9b
[18]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/33af2bc79370b38bc94633617180bcd283b5a0bf
[19]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c1ac811d2d7500a4b665d4d1531b5d51a9da2c19
[20]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/901d85357b06b854b6c37a34ac2b37948376660c
[21]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/86fca5843564773f9e0ec53c454c72109befbec6
[22]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/1fb8568e874687f25f13bcd31db7e94a8eb43282
[23]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/b3e256005e6c4e658993e9edbfb1013e633e09a9
[24]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/0ed2513071351aa815018080c9a6d477141905d6
[25]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/11da8f2253218e0303be5a2ae11eee7ae958f0b5
[26]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/8cbc4e40c61d48b61ab4ee2c34f679f6cd2ed0ab
[27]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/b1249edd6124c7f86bc60288861d61854e30ff3d
[28]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/b928e8a92064bcc4a0ef17b45eb6af40654208f2
[29]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/45bcd8c56f38ccbc330b4088c6f8a5812714611a
[30]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/98a1dd7eacac964a7fbab47ded92c33173383f11
