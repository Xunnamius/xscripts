# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

### [1.4.1][3] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][4])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][5])

## [1.4.0][6] (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00][7])

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][8])

## [1.3.0][9] (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045][10])

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][11])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][12])
- **src:** do not inherit IO when executing "clean" script ([380c055][13])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][14])

## [1.2.0][15] (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70][16])

## [1.1.0][17] (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][18])

## [1.0.0][19] (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3][20])

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0][21])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1
[4]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[5]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[6]: https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0
[7]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[8]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[9]: https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0
[10]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[11]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[12]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[13]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[14]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[15]: https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0
[16]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[17]: https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0
[18]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[19]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0
[20]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[21]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
