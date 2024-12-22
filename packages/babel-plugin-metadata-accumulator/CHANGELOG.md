# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/babel-plugin-metadata-accumulator[@1.0.0][3] (2024-12-22)

### ✨ Features

- **babel:** use reverse entrypoint resolver to fix tsc output ([c3fc126][4])
- **commands/release:** add `allowMissingNpmScripts` task init option; skippable coverage upload ([f1e8e8e][5])
- Integrate @-xun/run ([d22cee3][6])
- Integrate Tstyche into "test" command ([9045cd7][7])
- **packages/babel-plugin-metadata-accumulator:** always include type-only import metadata ([ca87588][8])
- **packages/debug:** support and expand upstream debug's process.env.DEBUG activation behavior ([f111552][9])
- **packages/project-utils:** add `relativeRoot` to `ProjectMetadata` ([e17adfb][10])
- **packages/project-utils:** add `try` option to json reading functions ([a91e7fa][11])
- **packages/project-utils:** add `typescriptTestFiles` to `ProjectFiles` objects ([e7c4b6e][12])
- **packages/project-utils:** ensure packages with id matching `*.ignore` are excluded from analysis ([4d5ddb6][13])
- **packages/project-utils:** exclude type-only imports from build targets (but keep them elsewhere) ([1d9accc][14])
- **packages/project-utils:** introduce `toDirname` typed analogue of node:fs `dirname` ([51ab454][15])
- **packages/project-utils:** provide richer metadata to consumers of `gatherPackageBuildTargets` ([c2bee3b][16])
- **packages/rejoinder:** ensure outputs are yellow iff they are "warn" outputs ([da60db8][17])
- **project-utils:** expose `process.cwd` replacement exports ([1a69887][18])
- **src:** implement "release" command ([44be676][19])
- **src:** implement new graph algorithm for lint target determination ([3323fc3][20])

### 🪄 Fixes

- **commands/test:** ensure all relevant source files are included when calculating coverage ([0565333][21])
- **eslint:** do not collapse path group overrides ([71b17c8][22])
- **packages/debug:** add interop necessary to preserve upstream DEBUG env var activation behavior ([6a8c411][23])
- **packages/project-utils:** ensure alias calculation uses correct relative directory src path ([da7e953][24])
- **packages/project-utils:** ensure external and internal build target sets are mutually exclusive ([7fed439][25])
- **packages/project-utils:** ensure meaningful error output from `readJsonc` ([01dca03][26])
- **packages/rejoinder:** ensure sub-instance loggers are included in internal tracking ([edec64f][27])
- Remove unnecessary restrictions on universe imports; bail out when an import is rejected ([11b585d][28])
- **src:** ignore root package properly when releasing package ([09373fa][29])

### ⚙️ Build System

- **babel:** `readPackageJsonAtRoot` => `readXPackageJsonAtRoot` ([aa60eeb][30])
- **babel:** add core-js validation checks ([55ee62d][31])
- **babel:** fix incorrect regexp stringification when using transform-rewrite-imports ([56b706a][32])
- **eslint:** add `instanceof` and `process.cwd` usage restrictions ([645473d][33])
- **eslint:** allow "arg" as a variable name ([9087086][34])
- **eslint:** ensure .transpiled directory is ignored ([c34a549][35])
- **eslint:** update to use experimental features of @-xun/eslint-plugin-import-experimental ([36016b1][36])
- **gitignore:** upgrade to more robust .gitignore ([43da882][37])
- **husky:** add husky pre-push protective hook ([33af2bc][38])
- **husky:** skip slow unit tests ([c52b3f1][39])
- **husky:** use proper lint command ([62a5a12][40])
- **jest:** ensure .transpiled directory is ignored ([c1ac811][41])
- **jest:** ensure .transpiled directory is ignored by jest-haste-map etc ([901d853][42])
- **jest:** ensure jest and jest-haste-map ignore ignored packages ([86fca58][43])
- **jest:** ignore type-only tests ([1fb8568][44])
- **packages/babel-plugin-metadata-accumulator:** add missing dependencies (to be pared down later) ([b3e2560][45])
- **packages/babel-plugin-metadata-accumulator:** ensure root types/ directory is included in sub-root tsc configs ([0ed2513][46])
- **packages/babel-plugin-metadata-accumulator:** package-ify this workspace ([11da8f2][47])
- **packages/babel-plugin-metadata-accumulator:** remove extraneous dependencies ([d6a0c06][48])
- **packages/debug:** package-ify this workspace ([afa3f46][49])
- **prettier.config:** reduce typescript print width to 89 (vscode shrunk) ([c248757][50])
- **prettierignore:** ignore license files ([b928e8a][51])
- Regenerate conventional and release assets ([a33aed8][52])
- **remarkrc:** ensure remark doesn't mangle GFM alerts with escape characters ([98a868e][53])
- **remarkrc:** fix faulty array reference ([8feaaa7][54])
- **remarkrc:** never automatically capitalize our packages' names in markdown headings ([45bcd8c][55])
- Remove execa bridge dependency now that we use @-xun/run exclusively ([f4ecfc9][56])
- Use consistent exclusions across TS configurations ([98a1dd7][57])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/compare/@-xun/babel-plugin-metadata-accumulator@0.0.0-init...@-xun/babel-plugin-metadata-accumulator@1.0.0
[4]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c3fc1264932eb8224289ef973366fc0cb5435f59
[5]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/f1e8e8e08a4139a060af4c155aa1ee4e73c344e0
[6]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/d22cee3b292da80ab45e4513bba3b2157fa72245
[7]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/9045cd704121600e07d84839c3e23b407e184f6b
[8]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/ca87588aee7f76fe8635e4e7f2f712b7b96671bb
[9]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/f111552d67f5c3bdd81c8d24a4fea5e21298f620
[10]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/e17adfb5fcd7395225e1fb530ebce697dce1b40d
[11]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/a91e7fa7a369d3d71bc98b147279c01b8f87af3c
[12]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/e7c4b6e1bc996d5a975a497cd3ca0e4774a39a85
[13]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/4d5ddb62d49f74d07dc8c24887bcf3ec50c00362
[14]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/1d9accc2d1627d74a04f1bb7f776a4e4b2049f9a
[15]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/51ab45426d8058a8a84b8206feda4242d780f53a
[16]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c2bee3ba59f700348dc33e31ad742d2348169ec0
[17]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/da60db8ff76efa3ad05f524298df8c0bb64399e3
[18]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/1a69887158a00db7133cf0a2eee85146ec6d1399
[19]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/44be676ca04207bd17553941d367abda2325c0ee
[20]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/3323fc3580b663f00518e7ca7bd9f52a7e50b80f
[21]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/0565333411580fd45659aad0e9727012cea9a699
[22]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/71b17c8574fe55da23831cd1be11457e7cb4bdb5
[23]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/6a8c411beeda36c4d6825608de4c76eb481d8cb5
[24]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/da7e953744dde41a45c249d74e7f4007719eece4
[25]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/7fed43963c71aad0d9b37b72a52dad1c55226140
[26]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/01dca03e237882091b9f849a4beeb06537d27ecd
[27]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/edec64f03b4f426f768a4ba699c64c8cc7ce1f80
[28]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/11b585ddfa1954ce0380fa64b5c4120773dc55d2
[29]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/09373fa4830377ba42824797eb0791655da0fa34
[30]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/aa60eebffcdbbf28d8ce6943dc7ed6cb6b50150b
[31]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/55ee62d4a379fc1aae845c6847adc0a9c8a8db6f
[32]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/56b706a90fbab254ee74509f45cf632157a0cfdc
[33]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/645473d084f3d4033afe39d72802b0a2a89e112d
[34]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/9087086d6944cb6a847f325142753a63be2ca30c
[35]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c34a5499cb58878fdaa42e83063e1c36a0582e06
[36]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/36016b10da47bb5799d3e558831a96eda878c10e
[37]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/43da8828df733ab8fd835d1a40c2a2c0c98fdd9b
[38]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/33af2bc79370b38bc94633617180bcd283b5a0bf
[39]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c52b3f184ba122013ac555d962b3df41c9329d0c
[40]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/62a5a128781629f5df99e05eff025da3e88022a6
[41]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c1ac811d2d7500a4b665d4d1531b5d51a9da2c19
[42]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/901d85357b06b854b6c37a34ac2b37948376660c
[43]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/86fca5843564773f9e0ec53c454c72109befbec6
[44]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/1fb8568e874687f25f13bcd31db7e94a8eb43282
[45]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/b3e256005e6c4e658993e9edbfb1013e633e09a9
[46]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/0ed2513071351aa815018080c9a6d477141905d6
[47]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/11da8f2253218e0303be5a2ae11eee7ae958f0b5
[48]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/d6a0c06d5c37835dbbf0c987b84c95bcc840b6c9
[49]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/afa3f466c6d6e960ccb11c76149c54378a87b16a
[50]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/c248757d6afb672ef03d93c652f5385bd80670df
[51]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/b928e8a92064bcc4a0ef17b45eb6af40654208f2
[52]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/a33aed8d5b0262dd81b375fcef062e5f7d1b5601
[53]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/98a868e21d0126772abbbb69bb64a9b56da229ac
[54]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/8feaaa78a9f524f02e4cc9204ef84f329d31ab94
[55]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/45bcd8c56f38ccbc330b4088c6f8a5812714611a
[56]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/f4ecfc9dd682e307a08becf562a877450fe903ef
[57]: https://github.com/Xunnamius/babel-plugin-metadata-accumulator/commit/98a1dd7eacac964a7fbab47ded92c33173383f11
