# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

## [1.6.0][3] (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b][4])

## [1.5.0][5] (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][6])
- **lib:** commit [@black-][7]flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][8])

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][9])
- **@black-flag/extensions:** add missing symbols ([17d53c3][10])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][11])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][12])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][13])
- **src:** use loose implications with deploy command ([8e11d66][14])

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][15])
- **package:** disable tty in debug when running tests ([b57a6be][16])
- **package:** fix bad overwrite of ignore patterns ([8d03799][17])

### [1.4.1][18] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][19])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][20])

## [1.4.0][21] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][22])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][23])

## [1.3.0][24] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][25])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][26])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][27])
- **src:** do not inherit IO when executing "clean" script ([380c055][28])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][29])

## [1.2.0][30] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][31])

## [1.1.0][32] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][33])

## [1.0.0][34] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][35])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][36])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0
[4]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[5]: https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0
[6]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[7]: https://github.com/black-
[8]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[9]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[10]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[11]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[12]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[13]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[14]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[15]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[16]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[17]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[18]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[19]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[20]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[21]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[22]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[23]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[24]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[25]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[26]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[27]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[28]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[29]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[30]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[31]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[32]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[33]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[34]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[35]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[36]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
