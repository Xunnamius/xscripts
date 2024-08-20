# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## [1.20.0][3] (2024-08-20)

### ✨ Features

- Ensure `--changelog-file` is added to "build changelog" ([d84b35f][4])
- **release:** support modern changelog generation flow ([6ef0123][5])
- **src:** add `--import-section-file` and `--changelog-file` flags to "build changelog" ([8cf99a9][6])

### 🪄 Fixes

- **src:** ensure "format" ignores .remarkignore; ensure "lint" respects .remarkignore ([3dd5d78][7])
- **src:** ensure changelog prints patches (including imports) in proper order ([5c3ed73][8])
- **src:** properly section off patch notes using dividers ([c912b09][9])

### ⚙️ Build System

- **package:** update repository url to conform with GHA provenance guidelines ([9cb2d72][10])
- **src/assets:** disable remark-validate-links for template files ([ce03500][11])
- **tsconfig:** set declaration=false by default ([22f2f41][12])
  <br />

## [1.19.0][13] (2024-07-29)

### ✨ Features

- **@black-flag/extensions:** add support for `vacuousImplications` option configuration key ([0c199f6][14])
- **src:** implement `--output-sort` for "build changelog"; integrate conventional core and drop cli ([587a354][15])

### ⚙️ Build System

- **babel:** disable explicit-exports-references for now ([92bb25f][16])
- **commitlint.config:** expand to include several useful rules ([909949d][17])
- **release:** take advantage of new `--output-sort` functionality ([59dd752][18])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.19.1][19] (2024-07-29)

#### 🪄 Fixes

- **package:** fix asset config import configuration ([d201164][20])

<br />

## [1.18.0][21] (2024-07-27)

### ✨ Features

- **src:** "build changelog" now accepts `--only-patch-changelog` and `--output-unreleased` ([6c7ae27][22])
- **src:** "lint" now accepts `--run-to-completion` and `--ignore-warnings` ([e833523][23])

### 🪄 Fixes

- **package:** downgrade @arethetypeswrong/cli to ^0.15.0 ([0383586][24])
- **src:** ensure node options are concatenated properly ([3a3489c][25])

### ⚡️ Optimizations

- **src:** take advantage of [tsc@5.6-beta][26] `--noCheck` argument in "build distributables" ([4e75096][27])

### ⚙️ Build System

- **eslint.config:** update @typescript-eslint/unbound-method linting config ([f6515ea][28])
- **release:** take advantage of new `--only-patch-changelog` flag ([01375f7][29])
- **tsconfig:** exclude test/ dir from "lint" command limited scope, include dotfiles under lib ([df6116b][30])
- Update source aliases to latest ([8d71521][31])
- **vscode:** take advantage of new `--run-to-completion` flag ([d9b4b80][32])
- **vscode:** update example with latest best practices ([64b7309][33])

<br />

## [1.17.0][34] (2024-07-23)

### ✨ Features

- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][35])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][36])

### ⚙️ Build System

- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][37])
- **husky:** update husky scripts ([e55a88e][38])
- **package:** add semver; force install alpha versions of typescript-eslint et al ([b56fd66][39])
- **package:** update exports, dependencies, and scripts ([323579d][40])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][41])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][42])

<br />

## [1.16.0][43] (2024-07-14)

### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][44])
- **@-xun/run:** update to work with latest execa ([12ee54a][45])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][46])
- **src:** implement "lint" command ([346b4ac][47])

### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][48])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][49])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][50])
- **src:** ensure proper checks with various arguments ([c9e254a][51])

### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][52])
- **husky:** update lint script to use latest name ([ea6aaff][53])
- **package:** add final npm scripts ([eb5631b][54])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][55])
- **package:** update lint scripts to use xscripts ([7c1e7f1][56])
- **tsconfig:** remove packages glob from includes ([d3301ca][57])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.16.1][58] (2024-07-14)

#### 🪄 Fixes

- **src:** place --copy-files argument in proper order in babel build sub-command ([8f1d25d][59])

<br />

## [1.15.0][60] (2024-07-07)

### ✨ Features

- **src:** implement "test" script/command ([b665723][62])

### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][63])

<br />

## [1.14.0][64] (2024-07-07)

### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][65])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][66])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][67])

### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][68])
- **src:** add .tsx to babel --extensions arg ([68c5582][69])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][70])
- **src:** remove bad options references from "format" command ([cafeb73][71])

### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][72])

<br />

## [1.13.0][73] (2024-07-02)

### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][74])
- **src:** implement "build externals" script ([1336341][75])

### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][76])
- **tsconfig:** update includes ([c721fed][77])

<br />

## [1.12.0][78] (2024-07-01)

### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][79])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][80])
- **rejoinder:** add `getDisabledTags` function export ([534f398][81])
- **src:** implement "build changelog" script ([8d4bb6d][82])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][83])

### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][84])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][85])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][86])
- Ensure correct use of debug logger namespace in various places ([65e4330][87])

### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][88])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][89])
- Hide all warnings from nodejs ([c1a4b9c][90])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][91])
- **remarkrc:** always translate normal links into reference links ([99c7b33][92])

### 🔥 Reverted

- _"build(prettierignore): no longer ignore CHANGELOG.md when formatting"_ ([ddd9192][93])

<br />

## [1.11.0][94] (2024-06-30)

### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][95])
- **src:** add all-contributors regeneration to "format" command ([d74f099][96])

### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][97])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][98])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][99])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][100])
- **src:** fix fix fd86f3f ([e295a02][101])

### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][102])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][103])

<br />

## [1.10.0][104] (2024-06-29)

### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][105])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][106])
- **lib:** move `AsStrictExecutionContext` into @black-flag/extensions ([ae46adf][107])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][108])
- **src:** improve capabilities of "format" command ([7d33dfe][109])

### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][110])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][111])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.10.1][112] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][113])

<br />

## [1.9.0][114] (2024-06-28)

### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][115])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][116])

### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][117])

### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][118])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][119])

<br />

## [1.8.0][120] (2024-06-27)

### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][121])

### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][122])
- **gitignore:** do not ignore src files anymore ([fd210c5][123])

<br />

## [1.7.0][124] (2024-06-26)

### ✨ Features

- **src:** implement "format" script ([7824c25][125])

### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][126])

### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][127])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][128])

<br />

## [1.6.0][129] (2024-06-24)

### ✨ Features

- **src:** implement "deploy" script ([62e673b][130])

<br />

## [1.5.0][131] (2024-06-23)

### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][132])
- **lib:** commit @black-flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][133])

### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][134])
- **@black-flag/extensions:** add missing symbols ([17d53c3][135])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][136])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][137])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][138])
- **src:** use loose implications with deploy command ([8e11d66][139])

### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][140])
- **package:** disable tty in debug when running tests ([b57a6be][141])
- **package:** fix bad overwrite of ignore patterns ([8d03799][142])

<br />

## [1.4.0][143] (2024-06-01)

### ✨ Features

- **src:** implement "dev" script ([4eeba00][144])

### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][145])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.4.1][146] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][147])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][148])

<br />

## [1.3.0][149] (2024-06-01)

### ✨ Features

- **src:** implement "start" script ([cf66045][150])

### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][151])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][152])
- **src:** do not inherit IO when executing "clean" script ([380c055][153])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][154])

<br />

## [1.2.0][155] (2024-05-31)

### ✨ Features

- Implement "prepare" script ([6426d70][156])

<br />

## [1.1.0][157] (2024-05-31)

### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][158])

<br />

## [1.0.0][159] (2024-05-31)

### ✨ Features

- **src:** implement "clean" script ([89d81a3][160])

### ⚙️ Build System

- **package:** update build scripts ([589fcb0][161])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.19.1...v1.20.0
[4]: https://github.com/Xunnamius/xscripts/commit/d84b35ff2b28040920fb62a405e29f2e54d29d4f
[5]: https://github.com/Xunnamius/xscripts/commit/6ef0123a0d9d1668ce567cf526e04951a3d25dd1
[6]: https://github.com/Xunnamius/xscripts/commit/8cf99a986ddf05e8d2a740d58e9ccdf5a0675e43
[7]: https://github.com/Xunnamius/xscripts/commit/3dd5d787a3de11f375bb9ca815840400fbe8cdf3
[8]: https://github.com/Xunnamius/xscripts/commit/5c3ed7323a7bf5f3dd1a3d7dd73c8511ef04ff82
[9]: https://github.com/Xunnamius/xscripts/commit/c912b0992a3033ed5d978d7f5c139569f2bd0608
[10]: https://github.com/Xunnamius/xscripts/commit/9cb2d72efc872c4003dabc8c68856b72e8f7c3a4
[11]: https://github.com/Xunnamius/xscripts/commit/ce035004c4bea999ba5cf583c16fc1dbc8a232a6
[12]: https://github.com/Xunnamius/xscripts/commit/22f2f41be642d3d94fc4e5a50014a61ab68c50b4
[13]: https://github.com/Xunnamius/xscripts/compare/v1.18.0...v1.19.0
[14]: https://github.com/Xunnamius/xscripts/commit/0c199f69971688205b1ee027dce36c2bc6ab8a04
[15]: https://github.com/Xunnamius/xscripts/commit/587a354329e46ca03f056ca1414915145928736c
[16]: https://github.com/Xunnamius/xscripts/commit/92bb25fe5f8022271ae03ee56e18377ad02e392b
[17]: https://github.com/Xunnamius/xscripts/commit/909949d58e2ddecf4ad606fe0dd9525ec540a8fb
[18]: https://github.com/Xunnamius/xscripts/commit/59dd7523276ab48868124e8f76f06784bc59f794
[19]: https://github.com/Xunnamius/xscripts/compare/v1.19.0...v1.19.1
[20]: https://github.com/Xunnamius/xscripts/commit/d2011645a568e76bdf61dde14dd0e15dbce243dc
[21]: https://github.com/Xunnamius/xscripts/compare/v1.17.0...v1.18.0
[22]: https://github.com/Xunnamius/xscripts/commit/6c7ae27d3d93d36e7cbcae873b8717d252cf6670
[23]: https://github.com/Xunnamius/xscripts/commit/e833523e6085950c3477ca6e44ae92ef7b1fad46
[24]: https://github.com/Xunnamius/xscripts/commit/0383586f6ccbb0bc503df636f515d19618548f92
[25]: https://github.com/Xunnamius/xscripts/commit/3a3489c43d2ce10ac752d70ab23066bd3477a675
[26]: mailto:tsc@5.6-beta
[27]: https://github.com/Xunnamius/xscripts/commit/4e7509611f72d2c953572dbc67bb51aabf2304d6
[28]: https://github.com/Xunnamius/xscripts/commit/f6515ea793a72cfd42cb6d3f74675b2ae3a9b2e1
[29]: https://github.com/Xunnamius/xscripts/commit/01375f77f74bfaf0b38de5bdd30d162461aa6106
[30]: https://github.com/Xunnamius/xscripts/commit/df6116b1c5ad4c0f7c3152cc254d943a7b9e67e7
[31]: https://github.com/Xunnamius/xscripts/commit/8d7152112e4927f566e048c6b0be7dfce4a6c430
[32]: https://github.com/Xunnamius/xscripts/commit/d9b4b80db15e6104a2a3ab7325996a08a350ea6d
[33]: https://github.com/Xunnamius/xscripts/commit/64b7309fcb28c1214f1edcc8319960c1c94f72b0
[34]: https://github.com/Xunnamius/xscripts/compare/v1.16.1...v1.17.0
[35]: https://github.com/Xunnamius/xscripts/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[36]: https://github.com/Xunnamius/xscripts/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[37]: https://github.com/Xunnamius/xscripts/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[38]: https://github.com/Xunnamius/xscripts/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[39]: https://github.com/Xunnamius/xscripts/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[40]: https://github.com/Xunnamius/xscripts/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[41]: https://github.com/Xunnamius/xscripts/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[42]: https://github.com/Xunnamius/xscripts/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[43]: https://github.com/Xunnamius/xscripts/compare/v1.15.0...v1.16.0
[44]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[45]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[46]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[47]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[48]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[49]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[50]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[51]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[52]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[53]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[54]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[55]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[56]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[57]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[58]: https://github.com/Xunnamius/xscripts/compare/v1.16.0...v1.16.1
[59]: https://github.com/Xunnamius/xscripts/commit/8f1d25d7356419160a65f4a4dd764a6192df2f26
[60]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[61]: https://github.com/Xunnamius/xscripts/commit/8554e1a4fd20b72d6b917f92cdb9e084b4086b25
[62]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[63]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[64]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[65]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[66]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[67]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[68]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[69]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[70]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[71]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[72]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[73]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[74]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[75]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[76]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[77]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[78]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[79]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[80]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[81]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[82]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[83]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[84]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[85]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[86]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[87]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[88]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[89]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[90]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[91]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[92]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[93]: https://github.com/Xunnamius/xscripts/commit/ddd9192c05110fca3ae0d93bac276426932269ef
[94]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[95]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[96]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[97]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[98]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[99]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[100]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[101]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[102]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[103]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[104]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[105]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[106]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[107]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[108]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[109]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[110]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[111]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[112]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[113]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[114]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[115]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[116]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[117]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[118]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[119]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[120]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[121]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[122]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[123]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[124]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[125]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[126]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[127]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[128]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[129]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[130]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[131]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[132]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[133]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[134]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[135]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[136]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[137]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[138]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[139]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[140]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[141]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[142]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[143]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[144]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[145]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[146]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[147]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[148]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[149]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[150]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[151]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[152]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[153]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[154]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[155]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[156]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[157]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[158]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[159]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[160]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[161]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
