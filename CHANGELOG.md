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

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.20.1][13] (2024-08-20)

#### ⚙️ Build System

- **release:** fix incorrect semantic-release plugin order during publish flow ([a2ea7df][14])
  <br />

## [1.19.0][15] (2024-07-29)

### ✨ Features

- **@black-flag/extensions:** add support for `vacuousImplications` option configuration key ([0c199f6][16])
- **src:** implement `--output-sort` for "build changelog"; integrate conventional core and drop cli ([587a354][17])

### ⚙️ Build System

- **babel:** disable explicit-exports-references for now ([92bb25f][18])
- **commitlint.config:** expand to include several useful rules ([909949d][19])
- **release:** take advantage of new `--output-sort` functionality ([59dd752][20])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.19.1][21] (2024-07-29)

#### 🪄 Fixes

- **package:** fix asset config import configuration ([d201164][22])

<br />

## [1.18.0][23] (2024-07-27)

### ✨ Features

- **src:** "build changelog" now accepts `--only-patch-changelog` and `--output-unreleased` ([6c7ae27][24])
- **src:** "lint" now accepts `--run-to-completion` and `--ignore-warnings` ([e833523][25])

### 🪄 Fixes

- **package:** downgrade @arethetypeswrong/cli to ^0.15.0 ([0383586][26])
- **src:** ensure node options are concatenated properly ([3a3489c][27])

### ⚡️ Optimizations

- **src:** take advantage of [tsc@5.6-beta][28] `--noCheck` argument in "build distributables" ([4e75096][29])

### ⚙️ Build System

- **eslint.config:** update @typescript-eslint/unbound-method linting config ([f6515ea][30])
- **release:** take advantage of new `--only-patch-changelog` flag ([01375f7][31])
- **tsconfig:** exclude test/ dir from "lint" command limited scope, include dotfiles under lib ([df6116b][32])
- Update source aliases to latest ([8d71521][33])
- **vscode:** take advantage of new `--run-to-completion` flag ([d9b4b80][34])
- **vscode:** update example with latest best practices ([64b7309][35])

<br />

## [1.17.0][36] (2024-07-23)

### ✨ Features

- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][37])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][38])

### ⚙️ Build System

- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][39])
- **husky:** update husky scripts ([e55a88e][40])
- **package:** add semver; force install alpha versions of typescript-eslint et al ([b56fd66][41])
- **package:** update exports, dependencies, and scripts ([323579d][42])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][43])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][44])

<br />

## [1.16.0][45] (2024-07-14)

### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][46])
- **@-xun/run:** update to work with latest execa ([12ee54a][47])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][48])
- **src:** implement "lint" command ([346b4ac][49])

### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][50])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][51])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][52])
- **src:** ensure proper checks with various arguments ([c9e254a][53])

### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][54])
- **husky:** update lint script to use latest name ([ea6aaff][55])
- **package:** add final npm scripts ([eb5631b][56])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][57])
- **package:** update lint scripts to use xscripts ([7c1e7f1][58])
- **tsconfig:** remove packages glob from includes ([d3301ca][59])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.16.1][60] (2024-07-14)

#### 🪄 Fixes

- **src:** place --copy-files argument in proper order in babel build sub-command ([8f1d25d][61])

<br />

## [1.15.0][62] (2024-07-07)

### ✨ Features

- **src:** implement "test" script/command ([b665723][64])

### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][65])

<br />

## [1.14.0][66] (2024-07-07)

### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][67])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][68])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][69])

### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][70])
- **src:** add .tsx to babel --extensions arg ([68c5582][71])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][72])
- **src:** remove bad options references from "format" command ([cafeb73][73])

### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][74])

<br />

## [1.13.0][75] (2024-07-02)

### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][76])
- **src:** implement "build externals" script ([1336341][77])

### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][78])
- **tsconfig:** update includes ([c721fed][79])

<br />

## [1.12.0][80] (2024-07-01)

### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][81])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][82])
- **rejoinder:** add `getDisabledTags` function export ([534f398][83])
- **src:** implement "build changelog" script ([8d4bb6d][84])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][85])

### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][86])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][87])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][88])
- Ensure correct use of debug logger namespace in various places ([65e4330][89])

### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][90])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][91])
- Hide all warnings from nodejs ([c1a4b9c][92])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][93])
- **remarkrc:** always translate normal links into reference links ([99c7b33][94])

### 🔥 Reverted

- _"build(prettierignore): no longer ignore CHANGELOG.md when formatting"_ ([ddd9192][95])

<br />

## [1.11.0][96] (2024-06-30)

### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][97])
- **src:** add all-contributors regeneration to "format" command ([d74f099][98])

### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][99])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][100])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][101])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][102])
- **src:** fix fix fd86f3f ([e295a02][103])

### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][104])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][105])

<br />

## [1.10.0][106] (2024-06-29)

### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][107])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][108])
- **lib:** move `AsStrictExecutionContext` into @black-flag/extensions ([ae46adf][109])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][110])
- **src:** improve capabilities of "format" command ([7d33dfe][111])

### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][112])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][113])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.10.1][114] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][115])

<br />

## [1.9.0][116] (2024-06-28)

### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][117])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][118])

### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][119])

### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][120])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][121])

<br />

## [1.8.0][122] (2024-06-27)

### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][123])

### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][124])
- **gitignore:** do not ignore src files anymore ([fd210c5][125])

<br />

## [1.7.0][126] (2024-06-26)

### ✨ Features

- **src:** implement "format" script ([7824c25][127])

### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][128])

### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][129])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][130])

<br />

## [1.6.0][131] (2024-06-24)

### ✨ Features

- **src:** implement "deploy" script ([62e673b][132])

<br />

## [1.5.0][133] (2024-06-23)

### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][134])
- **lib:** commit @black-flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][135])

### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][136])
- **@black-flag/extensions:** add missing symbols ([17d53c3][137])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][138])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][139])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][140])
- **src:** use loose implications with deploy command ([8e11d66][141])

### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][142])
- **package:** disable tty in debug when running tests ([b57a6be][143])
- **package:** fix bad overwrite of ignore patterns ([8d03799][144])

<br />

## [1.4.0][145] (2024-06-01)

### ✨ Features

- **src:** implement "dev" script ([4eeba00][146])

### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][147])

٠ –— ٠ —— ٠ —— ٠  —– ٠<br />

### 🏗️ Patch [1.4.1][148] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][149])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][150])

<br />

## [1.3.0][151] (2024-06-01)

### ✨ Features

- **src:** implement "start" script ([cf66045][152])

### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][153])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][154])
- **src:** do not inherit IO when executing "clean" script ([380c055][155])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][156])

<br />

## [1.2.0][157] (2024-05-31)

### ✨ Features

- Implement "prepare" script ([6426d70][158])

<br />

## [1.1.0][159] (2024-05-31)

### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][160])

<br />

## [1.0.0][161] (2024-05-31)

### ✨ Features

- **src:** implement "clean" script ([89d81a3][162])

### ⚙️ Build System

- **package:** update build scripts ([589fcb0][163])

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
[13]: https://github.com/Xunnamius/xscripts/compare/v1.20.0...v1.20.1
[14]: https://github.com/Xunnamius/xscripts/commit/a2ea7df939d4f1e11e3904c653f35f87abe65651
[15]: https://github.com/Xunnamius/xscripts/compare/v1.18.0...v1.19.0
[16]: https://github.com/Xunnamius/xscripts/commit/0c199f69971688205b1ee027dce36c2bc6ab8a04
[17]: https://github.com/Xunnamius/xscripts/commit/587a354329e46ca03f056ca1414915145928736c
[18]: https://github.com/Xunnamius/xscripts/commit/92bb25fe5f8022271ae03ee56e18377ad02e392b
[19]: https://github.com/Xunnamius/xscripts/commit/909949d58e2ddecf4ad606fe0dd9525ec540a8fb
[20]: https://github.com/Xunnamius/xscripts/commit/59dd7523276ab48868124e8f76f06784bc59f794
[21]: https://github.com/Xunnamius/xscripts/compare/v1.19.0...v1.19.1
[22]: https://github.com/Xunnamius/xscripts/commit/d2011645a568e76bdf61dde14dd0e15dbce243dc
[23]: https://github.com/Xunnamius/xscripts/compare/v1.17.0...v1.18.0
[24]: https://github.com/Xunnamius/xscripts/commit/6c7ae27d3d93d36e7cbcae873b8717d252cf6670
[25]: https://github.com/Xunnamius/xscripts/commit/e833523e6085950c3477ca6e44ae92ef7b1fad46
[26]: https://github.com/Xunnamius/xscripts/commit/0383586f6ccbb0bc503df636f515d19618548f92
[27]: https://github.com/Xunnamius/xscripts/commit/3a3489c43d2ce10ac752d70ab23066bd3477a675
[28]: mailto:tsc@5.6-beta
[29]: https://github.com/Xunnamius/xscripts/commit/4e7509611f72d2c953572dbc67bb51aabf2304d6
[30]: https://github.com/Xunnamius/xscripts/commit/f6515ea793a72cfd42cb6d3f74675b2ae3a9b2e1
[31]: https://github.com/Xunnamius/xscripts/commit/01375f77f74bfaf0b38de5bdd30d162461aa6106
[32]: https://github.com/Xunnamius/xscripts/commit/df6116b1c5ad4c0f7c3152cc254d943a7b9e67e7
[33]: https://github.com/Xunnamius/xscripts/commit/8d7152112e4927f566e048c6b0be7dfce4a6c430
[34]: https://github.com/Xunnamius/xscripts/commit/d9b4b80db15e6104a2a3ab7325996a08a350ea6d
[35]: https://github.com/Xunnamius/xscripts/commit/64b7309fcb28c1214f1edcc8319960c1c94f72b0
[36]: https://github.com/Xunnamius/xscripts/compare/v1.16.1...v1.17.0
[37]: https://github.com/Xunnamius/xscripts/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[38]: https://github.com/Xunnamius/xscripts/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[39]: https://github.com/Xunnamius/xscripts/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[40]: https://github.com/Xunnamius/xscripts/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[41]: https://github.com/Xunnamius/xscripts/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[42]: https://github.com/Xunnamius/xscripts/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[43]: https://github.com/Xunnamius/xscripts/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[44]: https://github.com/Xunnamius/xscripts/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[45]: https://github.com/Xunnamius/xscripts/compare/v1.15.0...v1.16.0
[46]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[47]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[48]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[49]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[50]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[51]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[52]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[53]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[54]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[55]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[56]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[57]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[58]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[59]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[60]: https://github.com/Xunnamius/xscripts/compare/v1.16.0...v1.16.1
[61]: https://github.com/Xunnamius/xscripts/commit/8f1d25d7356419160a65f4a4dd764a6192df2f26
[62]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[63]: https://github.com/Xunnamius/xscripts/commit/8554e1a4fd20b72d6b917f92cdb9e084b4086b25
[64]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[65]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[66]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[67]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[68]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[69]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[70]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[71]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[72]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[73]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[74]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[75]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[76]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[77]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[78]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[79]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[80]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[81]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[82]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[83]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[84]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[85]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[86]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[87]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[88]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[89]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[90]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[91]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[92]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[93]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[94]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[95]: https://github.com/Xunnamius/xscripts/commit/ddd9192c05110fca3ae0d93bac276426932269ef
[96]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[97]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[98]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[99]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[100]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[101]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[102]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[103]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[104]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[105]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[106]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[107]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[108]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[109]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[110]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[111]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[112]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[113]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[114]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[115]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[116]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[117]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[118]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[119]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[120]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[121]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[122]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[123]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[124]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[125]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[126]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[127]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[128]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[129]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[130]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[131]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[132]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[133]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[134]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[135]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[136]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[137]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[138]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[139]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[140]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[141]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[142]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[143]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[144]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[145]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[146]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[147]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[148]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[149]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[150]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[151]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[152]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[153]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[154]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[155]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[156]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[157]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[158]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[159]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[160]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[161]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[162]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[163]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
