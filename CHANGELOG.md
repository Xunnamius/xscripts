# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.17.0][3] (2024-07-23)

#### ✨ Features

- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][4])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][5])

#### ⚙️ Build System

- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][6])
- **husky:** update husky scripts ([e55a88e][7])
- **package:** add semver; force install alpha versions of typescript-eslint et al ([b56fd66][8])
- **package:** update exports, dependencies, and scripts ([323579d][9])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][10])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][11])

### [1.16.1][12] (2024-07-14)

#### 🪄 Fixes

- **src:** place --copy-files argument in proper order in babel build sub-command ([8f1d25d][13])

## [1.16.0][14] (2024-07-14)

#### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][15])
- **@-xun/run:** update to work with latest execa ([12ee54a][16])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][17])
- **src:** implement "lint" command ([346b4ac][18])

#### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][19])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][20])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][21])
- **src:** ensure proper checks with various arguments ([c9e254a][22])

#### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][23])
- **husky:** update lint script to use latest name ([ea6aaff][24])
- **package:** add final npm scripts ([eb5631b][25])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][26])
- **package:** update lint scripts to use xscripts ([7c1e7f1][27])
- **tsconfig:** remove packages glob from includes ([d3301ca][28])

## [1.15.0][29] (2024-07-07)

#### ✨ Features

- **src:** implement "test" script/command ([b665723][30])

#### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][31])

## [1.14.0][32] (2024-07-07)

#### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][33])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][34])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][35])

#### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][36])
- **src:** add .tsx to babel --extensions arg ([68c5582][37])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][38])
- **src:** remove bad options references from "format" command ([cafeb73][39])

#### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][40])

## [1.13.0][41] (2024-07-02)

#### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][42])
- **src:** implement "build externals" script ([1336341][43])

#### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][44])
- **tsconfig:** update includes ([c721fed][45])

## [1.12.0][46] (2024-07-01)

#### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][47])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][48])
- **rejoinder:** add `getDisabledTags` function export ([534f398][49])
- **src:** implement "build changelog" script ([8d4bb6d][50])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][51])

#### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][52])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][53])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][54])
- Ensure correct use of debug logger namespace in various places ([65e4330][55])

#### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][56])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][57])
- Hide all warnings from nodejs ([c1a4b9c][58])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][59])
- **remarkrc:** always translate normal links into reference links ([99c7b33][60])

## [1.11.0][61] (2024-06-30)

#### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][62])
- **src:** add all-contributors regeneration to "format" command ([d74f099][63])

#### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][64])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][65])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][66])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][67])
- **src:** fix fix fd86f3f ([e295a02][68])

#### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][69])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][70])

### [1.10.1][71] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][72])

## [1.10.0][73] (2024-06-29)

#### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][74])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][75])
- **lib:** move `AsStrictExecutionContext` into [@black-][76]flag/extensions ([ae46adf][77])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][78])
- **src:** improve capabilities of "format" command ([7d33dfe][79])

#### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][80])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][81])

## [1.9.0][82] (2024-06-28)

#### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][83])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][84])

#### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][85])

#### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][86])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][87])

## [1.8.0][88] (2024-06-27)

#### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][89])

#### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][90])
- **gitignore:** do not ignore src files anymore ([fd210c5][91])

## [1.7.0][92] (2024-06-26)

#### ✨ Features

- **src:** implement "format" script ([7824c25][93])

#### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][94])

#### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][95])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][96])

## [1.6.0][97] (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b][98])

## [1.5.0][99] (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][100])
- **lib:** commit [@black-][76]flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][101])

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][102])
- **@black-flag/extensions:** add missing symbols ([17d53c3][103])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][104])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][105])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][106])
- **src:** use loose implications with deploy command ([8e11d66][107])

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][108])
- **package:** disable tty in debug when running tests ([b57a6be][109])
- **package:** fix bad overwrite of ignore patterns ([8d03799][110])

### [1.4.1][111] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][112])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][113])

## [1.4.0][114] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][115])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][116])

## [1.3.0][117] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][118])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][119])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][120])
- **src:** do not inherit IO when executing "clean" script ([380c055][121])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][122])

## [1.2.0][123] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][124])

## [1.1.0][125] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][126])

## [1.0.0][127] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][128])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][129])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.16.1...v1.17.0
[4]: https://github.com/Xunnamius/xscripts/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[5]: https://github.com/Xunnamius/xscripts/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[6]: https://github.com/Xunnamius/xscripts/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[7]: https://github.com/Xunnamius/xscripts/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[8]: https://github.com/Xunnamius/xscripts/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[9]: https://github.com/Xunnamius/xscripts/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[10]: https://github.com/Xunnamius/xscripts/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[11]: https://github.com/Xunnamius/xscripts/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[12]: https://github.com/Xunnamius/xscripts/compare/v1.16.0...v1.16.1
[13]: https://github.com/Xunnamius/xscripts/commit/8f1d25d7356419160a65f4a4dd764a6192df2f26
[14]: https://github.com/Xunnamius/xscripts/compare/v1.15.0...v1.16.0
[15]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[16]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[17]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[18]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[19]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[20]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[21]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[22]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[23]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[24]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[25]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[26]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[27]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[28]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[29]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[30]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[31]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[32]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[33]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[34]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[35]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[36]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[37]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[38]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[39]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[40]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[41]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[42]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[43]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[44]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[45]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[46]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[47]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[48]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[49]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[50]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[51]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[52]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[53]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[54]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[55]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[56]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[57]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[58]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[59]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[60]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[61]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[62]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[63]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[64]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[65]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[66]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[67]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[68]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[69]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[70]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[71]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[72]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[73]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[74]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[75]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[76]: https://github.com/black-
[77]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[78]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[79]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[80]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[81]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[82]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[83]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[84]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[85]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[86]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[87]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[88]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[89]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[90]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[91]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[92]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[93]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[94]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[95]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[96]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[97]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[98]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[99]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[100]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[101]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[102]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[103]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[104]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[105]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[106]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[107]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[108]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[109]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[110]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[111]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[112]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[113]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[114]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[115]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[116]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[117]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[118]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[119]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[120]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[121]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[122]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[123]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[124]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[125]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[126]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[127]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[128]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[129]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
