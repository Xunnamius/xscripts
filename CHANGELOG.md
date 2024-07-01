# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.12.0][3] (2024-07-01)

#### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][4])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][5])
- **rejoinder:** add `getDisabledTags` function export ([534f398][6])
- **src:** implement "build changelog" script ([8d4bb6d][7])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][8])

#### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][9])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][10])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][11])
- Ensure correct use of debug logger namespace in various places ([65e4330][12])

#### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][13])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][14])
- Hide all warnings from nodejs ([c1a4b9c][15])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][16])
- **remarkrc:** always translate normal links into reference links ([99c7b33][17])

## [1.11.0][18] (2024-06-30)

#### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][19])
- **src:** add all-contributors regeneration to "format" command ([d74f099][20])

#### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][21])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][22])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][23])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][24])
- **src:** fix fix fd86f3f ([e295a02][25])

#### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][26])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][27])

### [1.10.1][28] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][29])

## [1.10.0][30] (2024-06-29)

#### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][31])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][32])
- **lib:** move `AsStrictExecutionContext` into [@black-][33]flag/extensions ([ae46adf][34])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][35])
- **src:** improve capabilities of "format" command ([7d33dfe][36])

#### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][37])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][38])

## [1.9.0][39] (2024-06-28)

#### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][40])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][41])

#### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][42])

#### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][43])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][44])

## [1.8.0][45] (2024-06-27)

#### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][46])

#### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][47])
- **gitignore:** do not ignore src files anymore ([fd210c5][48])

## [1.7.0][49] (2024-06-26)

#### ✨ Features

- **src:** implement "format" script ([7824c25][50])

#### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][51])

#### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][52])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][53])

## [1.6.0][54] (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b][55])

## [1.5.0][56] (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][57])
- **lib:** commit [@black-][33]flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][58])

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][59])
- **@black-flag/extensions:** add missing symbols ([17d53c3][60])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][61])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][62])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][63])
- **src:** use loose implications with deploy command ([8e11d66][64])

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][65])
- **package:** disable tty in debug when running tests ([b57a6be][66])
- **package:** fix bad overwrite of ignore patterns ([8d03799][67])

### [1.4.1][68] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][69])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][70])

## [1.4.0][71] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][72])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][73])

## [1.3.0][74] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][75])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][76])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][77])
- **src:** do not inherit IO when executing "clean" script ([380c055][78])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][79])

## [1.2.0][80] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][81])

## [1.1.0][82] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][83])

## [1.0.0][84] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][85])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][86])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.11.0...v1.12.0
[4]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[5]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[6]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[7]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[8]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[9]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[10]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[11]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[12]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[13]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[14]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[15]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[16]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[17]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[18]: https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0
[19]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[20]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[21]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[22]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[23]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[24]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[25]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[26]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[27]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[28]: https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1
[29]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[30]: https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0
[31]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[32]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[33]: https://github.com/black-
[34]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[35]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[36]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[37]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[38]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[39]: https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0
[40]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[41]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[42]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[43]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[44]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[45]: https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0
[46]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[47]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[48]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[49]: https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0
[50]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[51]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[52]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[53]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[54]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[55]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[56]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[57]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[58]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[59]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[60]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[61]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[62]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[63]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[64]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[65]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[66]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[67]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[68]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[69]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[70]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[71]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[72]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[73]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[74]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[75]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[76]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[77]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[78]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[79]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[80]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[81]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[82]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[83]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[84]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[85]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[86]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
