# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## [1.19.0][3] (2024-07-29)

### ✨ Features

- **@black-flag/extensions:** add support for `vacuousImplications` option configuration key ([0c199f6][4])
- **src:** implement `--output-sort` for "build changelog"; integrate conventional core and drop cli ([587a354][5])

### ⚙️ Build System

- **babel:** disable explicit-exports-references for now ([92bb25f][6])
- **commitlint.config:** expand to include several useful rules ([909949d][7])
- **release:** take advantage of new `--output-sort` functionality ([59dd752][8])

٠ —– ٠ —— ٠ –— ٠  —– ٠<br />

### 🏗️ Patch [1.19.1][9] (2024-07-29)

#### 🪄 Fixes

- **package:** fix asset config import configuration ([d201164][10])

<br />

## [1.18.0][11] (2024-07-27)

### ✨ Features

- **src:** "build changelog" now accepts `--only-patch-changelog` and `--output-unreleased` ([6c7ae27][12])
- **src:** "lint" now accepts `--run-to-completion` and `--ignore-warnings` ([e833523][13])

### 🪄 Fixes

- **package:** downgrade @arethetypeswrong/cli to ^0.15.0 ([0383586][14])
- **src:** ensure node options are concatenated properly ([3a3489c][15])

### ⚡️ Optimizations

- **src:** take advantage of [tsc@5.6-beta][16] `--noCheck` argument in "build distributables" ([4e75096][17])

### ⚙️ Build System

- **eslint.config:** update @typescript-eslint/unbound-method linting config ([f6515ea][18])
- **release:** take advantage of new `--only-patch-changelog` flag ([01375f7][19])
- **tsconfig:** exclude test/ dir from "lint" command limited scope, include dotfiles under lib ([df6116b][20])
- Update source aliases to latest ([8d71521][21])
- **vscode:** take advantage of new `--run-to-completion` flag ([d9b4b80][22])
- **vscode:** update example with latest best practices ([64b7309][23])

<br />

## [1.17.0][24] (2024-07-23)

### ✨ Features

- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][25])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][26])

### ⚙️ Build System

- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][27])
- **husky:** update husky scripts ([e55a88e][28])
- **package:** add semver; force install alpha versions of typescript-eslint et al ([b56fd66][29])
- **package:** update exports, dependencies, and scripts ([323579d][30])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][31])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][32])

<br />

## [1.16.0][33] (2024-07-14)

### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][34])
- **@-xun/run:** update to work with latest execa ([12ee54a][35])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][36])
- **src:** implement "lint" command ([346b4ac][37])

### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][38])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][39])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][40])
- **src:** ensure proper checks with various arguments ([c9e254a][41])

### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][42])
- **husky:** update lint script to use latest name ([ea6aaff][43])
- **package:** add final npm scripts ([eb5631b][44])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][45])
- **package:** update lint scripts to use xscripts ([7c1e7f1][46])
- **tsconfig:** remove packages glob from includes ([d3301ca][47])

٠ —– ٠ —— ٠ –— ٠  —– ٠<br />

### 🏗️ Patch [1.16.1][48] (2024-07-14)

#### 🪄 Fixes

- **src:** place --copy-files argument in proper order in babel build sub-command ([8f1d25d][49])

<br />

## [1.15.0][50] (2024-07-07)

### ✨ Features

- **src:** implement "test" script/command ([b665723][52])

### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][53])

<br />

## [1.14.0][54] (2024-07-07)

### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][55])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][56])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][57])

### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][58])
- **src:** add .tsx to babel --extensions arg ([68c5582][59])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][60])
- **src:** remove bad options references from "format" command ([cafeb73][61])

### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][62])

<br />

## [1.13.0][63] (2024-07-02)

### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][64])
- **src:** implement "build externals" script ([1336341][65])

### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][66])
- **tsconfig:** update includes ([c721fed][67])

<br />

## [1.12.0][68] (2024-07-01)

### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][69])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][70])
- **rejoinder:** add `getDisabledTags` function export ([534f398][71])
- **src:** implement "build changelog" script ([8d4bb6d][72])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][73])

### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][74])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][75])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][76])
- Ensure correct use of debug logger namespace in various places ([65e4330][77])

### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][78])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][79])
- Hide all warnings from nodejs ([c1a4b9c][80])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][81])
- **remarkrc:** always translate normal links into reference links ([99c7b33][82])

### 🔥 Reverted

- _"build(prettierignore): no longer ignore CHANGELOG.md when formatting"_ ([ddd9192][83])

<br />

## [1.11.0][84] (2024-06-30)

### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][85])
- **src:** add all-contributors regeneration to "format" command ([d74f099][86])

### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][87])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][88])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][89])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][90])
- **src:** fix fix fd86f3f ([e295a02][91])

### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][92])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][93])

<br />

## [1.10.0][94] (2024-06-29)

### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][95])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][96])
- **lib:** move `AsStrictExecutionContext` into @black-flag/extensions ([ae46adf][97])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][98])
- **src:** improve capabilities of "format" command ([7d33dfe][99])

### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][100])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][101])

٠ —– ٠ —— ٠ –— ٠  —– ٠<br />

### 🏗️ Patch [1.10.1][102] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][103])

<br />

## [1.9.0][104] (2024-06-28)

### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][105])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][106])

### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][107])

### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][108])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][109])

<br />

## [1.8.0][110] (2024-06-27)

### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][111])

### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][112])
- **gitignore:** do not ignore src files anymore ([fd210c5][113])

<br />

## [1.7.0][114] (2024-06-26)

### ✨ Features

- **src:** implement "format" script ([7824c25][115])

### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][116])

### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][117])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][118])

<br />

## [1.6.0][119] (2024-06-24)

### ✨ Features

- **src:** implement "deploy" script ([62e673b][120])

<br />

## [1.5.0][121] (2024-06-23)

### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][122])
- **lib:** commit @black-flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][123])

### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][124])
- **@black-flag/extensions:** add missing symbols ([17d53c3][125])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][126])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][127])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][128])
- **src:** use loose implications with deploy command ([8e11d66][129])

### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][130])
- **package:** disable tty in debug when running tests ([b57a6be][131])
- **package:** fix bad overwrite of ignore patterns ([8d03799][132])

<br />

## [1.4.0][133] (2024-06-01)

### ✨ Features

- **src:** implement "dev" script ([4eeba00][134])

### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][135])

٠ —– ٠ —— ٠ –— ٠  —– ٠<br />

### 🏗️ Patch [1.4.1][136] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][137])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][138])

<br />

## [1.3.0][139] (2024-06-01)

### ✨ Features

- **src:** implement "start" script ([cf66045][140])

### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][141])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][142])
- **src:** do not inherit IO when executing "clean" script ([380c055][143])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][144])

<br />

## [1.2.0][145] (2024-05-31)

### ✨ Features

- Implement "prepare" script ([6426d70][146])

<br />

## [1.1.0][147] (2024-05-31)

### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][148])

<br />

## [1.0.0][149] (2024-05-31)

### ✨ Features

- **src:** implement "clean" script ([89d81a3][150])

### ⚙️ Build System

- **package:** update build scripts ([589fcb0][151])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.18.0...v1.19.0
[4]: https://github.com/Xunnamius/xscripts/commit/0c199f69971688205b1ee027dce36c2bc6ab8a04
[5]: https://github.com/Xunnamius/xscripts/commit/587a354329e46ca03f056ca1414915145928736c
[6]: https://github.com/Xunnamius/xscripts/commit/92bb25fe5f8022271ae03ee56e18377ad02e392b
[7]: https://github.com/Xunnamius/xscripts/commit/909949d58e2ddecf4ad606fe0dd9525ec540a8fb
[8]: https://github.com/Xunnamius/xscripts/commit/59dd7523276ab48868124e8f76f06784bc59f794
[9]: https://github.com/Xunnamius/xscripts/compare/v1.19.0...v1.19.1
[10]: https://github.com/Xunnamius/xscripts/commit/d2011645a568e76bdf61dde14dd0e15dbce243dc
[11]: https://github.com/Xunnamius/xscripts/compare/v1.17.0...v1.18.0
[12]: https://github.com/Xunnamius/xscripts/commit/6c7ae27d3d93d36e7cbcae873b8717d252cf6670
[13]: https://github.com/Xunnamius/xscripts/commit/e833523e6085950c3477ca6e44ae92ef7b1fad46
[14]: https://github.com/Xunnamius/xscripts/commit/0383586f6ccbb0bc503df636f515d19618548f92
[15]: https://github.com/Xunnamius/xscripts/commit/3a3489c43d2ce10ac752d70ab23066bd3477a675
[16]: mailto:tsc@5.6-beta
[17]: https://github.com/Xunnamius/xscripts/commit/4e7509611f72d2c953572dbc67bb51aabf2304d6
[18]: https://github.com/Xunnamius/xscripts/commit/f6515ea793a72cfd42cb6d3f74675b2ae3a9b2e1
[19]: https://github.com/Xunnamius/xscripts/commit/01375f77f74bfaf0b38de5bdd30d162461aa6106
[20]: https://github.com/Xunnamius/xscripts/commit/df6116b1c5ad4c0f7c3152cc254d943a7b9e67e7
[21]: https://github.com/Xunnamius/xscripts/commit/8d7152112e4927f566e048c6b0be7dfce4a6c430
[22]: https://github.com/Xunnamius/xscripts/commit/d9b4b80db15e6104a2a3ab7325996a08a350ea6d
[23]: https://github.com/Xunnamius/xscripts/commit/64b7309fcb28c1214f1edcc8319960c1c94f72b0
[24]: https://github.com/Xunnamius/xscripts/compare/v1.16.1...v1.17.0
[25]: https://github.com/Xunnamius/xscripts/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[26]: https://github.com/Xunnamius/xscripts/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[27]: https://github.com/Xunnamius/xscripts/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[28]: https://github.com/Xunnamius/xscripts/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[29]: https://github.com/Xunnamius/xscripts/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[30]: https://github.com/Xunnamius/xscripts/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[31]: https://github.com/Xunnamius/xscripts/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[32]: https://github.com/Xunnamius/xscripts/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[33]: https://github.com/Xunnamius/xscripts/compare/v1.15.0...v1.16.0
[34]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[35]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[36]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[37]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[38]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[39]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[40]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[41]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[42]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[43]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[44]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[45]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[46]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[47]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[48]: https://github.com/Xunnamius/xscripts/compare/v1.16.0...v1.16.1
[49]: https://github.com/Xunnamius/xscripts/commit/8f1d25d7356419160a65f4a4dd764a6192df2f26
[50]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[51]: https://github.com/Xunnamius/xscripts/commit/8554e1a4fd20b72d6b917f92cdb9e084b4086b25
[52]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[53]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[54]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[55]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[56]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[57]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[58]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[59]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[60]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[61]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[62]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[63]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[64]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[65]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[66]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[67]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[68]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[69]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[70]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[71]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[72]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[73]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[74]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[75]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[76]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[77]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[78]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[79]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[80]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[81]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[82]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[83]: https://github.com/Xunnamius/xscripts/commit/ddd9192c05110fca3ae0d93bac276426932269ef
[84]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[85]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[86]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[87]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[88]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[89]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[90]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[91]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[92]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[93]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[94]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[95]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[96]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[97]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[98]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[99]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[100]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[101]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[102]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[103]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[104]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[105]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[106]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[107]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[108]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[109]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[110]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[111]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[112]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[113]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[114]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[115]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[116]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[117]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[118]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[119]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[120]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[121]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[122]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[123]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[124]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[125]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[126]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[127]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[128]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[129]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[130]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[131]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[132]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[133]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[134]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[135]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[136]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[137]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[138]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[139]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[140]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[141]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[142]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[143]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[144]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[145]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[146]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[147]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[148]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[149]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[150]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[151]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
