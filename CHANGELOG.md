# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.15.0][3] (2024-07-07)

#### ✨ Features

- **src:** commit initial version of "test" command ([8554e1a][4])
- **src:** implement "test" script/command ([b665723][5])

#### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][6])

## [1.14.0][7] (2024-07-07)

#### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][8])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][9])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][10])

#### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][11])
- **src:** add .tsx to babel --extensions arg ([68c5582][12])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][13])
- **src:** remove bad options references from "format" command ([cafeb73][14])

#### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][15])

## [1.13.0][16] (2024-07-02)

#### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][17])
- **src:** implement "build externals" script ([1336341][18])

#### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][19])
- **tsconfig:** update includes ([c721fed][20])

## [1.12.0][21] (2024-07-01)

#### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][22])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][23])
- **rejoinder:** add `getDisabledTags` function export ([534f398][24])
- **src:** implement "build changelog" script ([8d4bb6d][25])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][26])

#### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][27])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][28])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][29])
- Ensure correct use of debug logger namespace in various places ([65e4330][30])

#### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][31])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][32])
- Hide all warnings from nodejs ([c1a4b9c][33])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][34])
- **remarkrc:** always translate normal links into reference links ([99c7b33][35])

## [1.11.0][36] (2024-06-30)

#### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][37])
- **src:** add all-contributors regeneration to "format" command ([d74f099][38])

#### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][39])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][40])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][41])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][42])
- **src:** fix fix fd86f3f ([e295a02][43])

#### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][44])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][45])

### [1.10.1][46] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][47])

## [1.10.0][48] (2024-06-29)

#### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][49])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][50])
- **lib:** move `AsStrictExecutionContext` into [@black-][51]flag/extensions ([ae46adf][52])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][53])
- **src:** improve capabilities of "format" command ([7d33dfe][54])

#### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][55])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][56])

## [1.9.0][57] (2024-06-28)

#### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][58])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][59])

#### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][60])

#### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][61])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][62])

## [1.8.0][63] (2024-06-27)

#### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][64])

#### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][65])
- **gitignore:** do not ignore src files anymore ([fd210c5][66])

## [1.7.0][67] (2024-06-26)

#### ✨ Features

- **src:** implement "format" script ([7824c25][68])

#### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][69])

#### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][70])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][71])

## [1.6.0][72] (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b][73])

## [1.5.0][74] (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][75])
- **lib:** commit [@black-][51]flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][76])

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][77])
- **@black-flag/extensions:** add missing symbols ([17d53c3][78])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][79])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][80])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][81])
- **src:** use loose implications with deploy command ([8e11d66][82])

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][83])
- **package:** disable tty in debug when running tests ([b57a6be][84])
- **package:** fix bad overwrite of ignore patterns ([8d03799][85])

### [1.4.1][86] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][87])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][88])

## [1.4.0][89] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][90])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][91])

## [1.3.0][92] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][93])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][94])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][95])
- **src:** do not inherit IO when executing "clean" script ([380c055][96])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][97])

## [1.2.0][98] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][99])

## [1.1.0][100] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][101])

## [1.0.0][102] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][103])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][104])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.14.0...v1.15.0
[4]: https://github.com/Xunnamius/xscripts/commit/8554e1a4fd20b72d6b917f92cdb9e084b4086b25
[5]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[6]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[7]: https://github.com/Xunnamius/xscripts/compare/v1.13.0...v1.14.0
[8]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[9]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[10]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[11]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[12]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[13]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[14]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[15]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[16]: https://github.com/Xunnamius/xscripts/compare/v1.12.0...v1.13.0
[17]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[18]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[19]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[20]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[21]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[22]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[23]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[24]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[25]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[26]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[27]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[28]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[29]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[30]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[31]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[32]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[33]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[34]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[35]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[36]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[37]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[38]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[39]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[40]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[41]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[42]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[43]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[44]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[45]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[46]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[47]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[48]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[49]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[50]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[51]: https://github.com/black-
[52]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[53]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[54]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[55]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[56]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[57]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[58]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[59]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[60]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[61]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[62]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[63]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[64]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[65]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[66]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[67]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[68]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[69]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[70]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[71]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[72]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[73]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[74]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[75]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[76]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[77]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[78]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[79]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[80]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[81]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[82]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[83]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[84]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[85]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[86]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[87]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[88]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[89]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[90]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[91]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[92]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[93]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[94]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[95]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[96]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[97]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[98]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[99]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[100]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[101]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[102]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[103]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[104]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
