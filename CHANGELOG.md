# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.16.0][3] (2024-07-14)

#### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][4])
- **@-xun/run:** update to work with latest execa ([12ee54a][5])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][6])
- **src:** implement "lint" command ([346b4ac][7])

#### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][8])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][9])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][10])
- **src:** ensure proper checks with various arguments ([c9e254a][11])

#### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][12])
- **husky:** update lint script to use latest name ([ea6aaff][13])
- **package:** add final npm scripts ([eb5631b][14])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][15])
- **package:** update lint scripts to use xscripts ([7c1e7f1][16])
- **tsconfig:** remove packages glob from includes ([d3301ca][17])

## [1.15.0][18] (2024-07-07)

#### ✨ Features

- **src:** implement "test" script/command ([b665723][19])

#### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][20])

## [1.14.0][21] (2024-07-07)

#### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][22])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][23])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][24])

#### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][25])
- **src:** add .tsx to babel --extensions arg ([68c5582][26])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][27])
- **src:** remove bad options references from "format" command ([cafeb73][28])

#### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][29])

## [1.13.0][30] (2024-07-02)

#### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][31])
- **src:** implement "build externals" script ([1336341][32])

#### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][33])
- **tsconfig:** update includes ([c721fed][34])

## [1.12.0][35] (2024-07-01)

#### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][36])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][37])
- **rejoinder:** add `getDisabledTags` function export ([534f398][38])
- **src:** implement "build changelog" script ([8d4bb6d][39])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][40])

#### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][41])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][42])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][43])
- Ensure correct use of debug logger namespace in various places ([65e4330][44])

#### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][45])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][46])
- Hide all warnings from nodejs ([c1a4b9c][47])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][48])
- **remarkrc:** always translate normal links into reference links ([99c7b33][49])

## [1.11.0][50] (2024-06-30)

#### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][51])
- **src:** add all-contributors regeneration to "format" command ([d74f099][52])

#### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][53])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][54])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][55])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][56])
- **src:** fix fix fd86f3f ([e295a02][57])

#### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][58])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][59])

### [1.10.1][60] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][61])

## [1.10.0][62] (2024-06-29)

#### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][63])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][64])
- **lib:** move `AsStrictExecutionContext` into [@black-][65]flag/extensions ([ae46adf][66])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][67])
- **src:** improve capabilities of "format" command ([7d33dfe][68])

#### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][69])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][70])

## [1.9.0][71] (2024-06-28)

#### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][72])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][73])

#### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][74])

#### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][75])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][76])

## [1.8.0][77] (2024-06-27)

#### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][78])

#### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][79])
- **gitignore:** do not ignore src files anymore ([fd210c5][80])

## [1.7.0][81] (2024-06-26)

#### ✨ Features

- **src:** implement "format" script ([7824c25][82])

#### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][83])

#### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][84])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][85])

## [1.6.0][86] (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b][87])

## [1.5.0][88] (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][89])
- **lib:** commit [@black-][65]flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][90])

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][91])
- **@black-flag/extensions:** add missing symbols ([17d53c3][92])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][93])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][94])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][95])
- **src:** use loose implications with deploy command ([8e11d66][96])

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][97])
- **package:** disable tty in debug when running tests ([b57a6be][98])
- **package:** fix bad overwrite of ignore patterns ([8d03799][99])

### [1.4.1][100] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][101])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][102])

## [1.4.0][103] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][104])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][105])

## [1.3.0][106] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][107])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][108])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][109])
- **src:** do not inherit IO when executing "clean" script ([380c055][110])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][111])

## [1.2.0][112] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][113])

## [1.1.0][114] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][115])

## [1.0.0][116] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][117])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][118])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.15.0...v1.16.0
[4]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[5]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[6]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[7]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[8]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[9]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[10]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[11]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[12]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[13]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[14]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[15]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[16]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[17]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[18]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[19]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[20]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[21]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[22]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[23]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[24]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[25]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[26]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[27]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[28]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[29]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[30]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[31]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[32]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[33]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[34]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[35]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[36]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[37]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[38]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[39]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[40]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[41]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[42]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[43]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[44]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[45]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[46]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[47]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[48]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[49]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[50]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[51]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[52]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[53]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[54]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[55]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[56]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[57]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[58]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[59]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[60]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[61]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[62]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[63]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[64]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[65]: https://github.com/black-
[66]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[67]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[68]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[69]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[70]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[71]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[72]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[73]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[74]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[75]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[76]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[77]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[78]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[79]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[80]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[81]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[82]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[83]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[84]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[85]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[86]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[87]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[88]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[89]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[90]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[91]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[92]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[93]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[94]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[95]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[96]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[97]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[98]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[99]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[100]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[101]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[102]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[103]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[104]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[105]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[106]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[107]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[108]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[109]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[110]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[111]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[112]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[113]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[114]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[115]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[116]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[117]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[118]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
