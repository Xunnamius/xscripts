# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits](https://conventionalcommits.org);
this project adheres to [Semantic Versioning](https://semver.org).

## [1.11.0](https://github.com/Xunnamius/xscripts/compare/v1.10.1...v1.11.0) (2024-06-30)

#### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a](https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82))
- **src:** add all-contributors regeneration to "format" command ([d74f099](https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f))

#### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16](https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c))
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1](https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98))
- **src:** ensure all glob relevant glob calls never return directories ([9764967](https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674))
- **src:** ensure, when --file is given, at least one option given for "format" command ([fd86f3f](https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16))
- **src:** fix fix fd86f3f ([e295a02](https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd))

#### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5](https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09))
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4](https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee))

### [1.10.1](https://github.com/Xunnamius/xscripts/compare/v1.10.0...v1.10.1) (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --file is respected by prettier in "format" command ([483f036](https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f))

## [1.10.0](https://github.com/Xunnamius/xscripts/compare/v1.9.0...v1.10.0) (2024-06-29)

#### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758](https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85))
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e](https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb))
- **lib:** move `AsStrictExecutionContext` into [@black-](https://github.com/black-)flag/extensions ([ae46adf](https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd))
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49](https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70))
- **src:** improve capabilities of "format" command ([7d33dfe](https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca))

#### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78](https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b))
- **src:** restrict root/sub-root check to certain commands ([1b65f46](https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9))

## [1.9.0](https://github.com/Xunnamius/xscripts/compare/v1.8.0...v1.9.0) (2024-06-28)

#### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b](https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39))
- **src:** prevent cli from running if not in root or sub-root ([4f280dc](https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04))

#### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771](https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff))

#### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d](https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7))
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3](https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c))

## [1.8.0](https://github.com/Xunnamius/xscripts/compare/v1.7.0...v1.8.0) (2024-06-27)

#### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623](https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d))

#### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63](https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6))
- **gitignore:** do not ignore src files anymore ([fd210c5](https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c))

## [1.7.0](https://github.com/Xunnamius/xscripts/compare/v1.6.0...v1.7.0) (2024-06-26)

#### ✨ Features

- **src:** implement "format" script ([7824c25](https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03))

#### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e](https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3))

#### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378](https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437))
- **package:** use --hush over --quiet for "format" command ([9e4ae59](https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062))

## [1.6.0](https://github.com/Xunnamius/xscripts/compare/v1.5.0...v1.6.0) (2024-06-24)

#### ✨ Features

- **src:** implement "deploy" script ([62e673b](https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff))

## [1.5.0](https://github.com/Xunnamius/xscripts/compare/v1.4.1...v1.5.0) (2024-06-23)

#### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d](https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d))
- **lib:** commit [@black-](https://github.com/black-)flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e](https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586))

#### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74](https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721))
- **@black-flag/extensions:** add missing symbols ([17d53c3](https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018))
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70](https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322))
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4](https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711))
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5](https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce))
- **src:** use loose implications with deploy command ([8e11d66](https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2))

#### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9](https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1))
- **package:** disable tty in debug when running tests ([b57a6be](https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b))
- **package:** fix bad overwrite of ignore patterns ([8d03799](https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15))

### [1.4.1](https://github.com/Xunnamius/xscripts/compare/v1.4.0...v1.4.1) (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07](https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180))

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5](https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc))

## [1.4.0](https://github.com/Xunnamius/xscripts/compare/v1.3.0...v1.4.0) (2024-06-01)

#### ✨ Features

- **src:** implement "dev" script ([4eeba00](https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a))

#### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786](https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5))

## [1.3.0](https://github.com/Xunnamius/xscripts/compare/v1.2.0...v1.3.0) (2024-06-01)

#### ✨ Features

- **src:** implement "start" script ([cf66045](https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15))

#### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175](https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e))
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593](https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1))
- **src:** do not inherit IO when executing "clean" script ([380c055](https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452))
- **src:** execute husky post-checkout hook if available ([f0b3b8c](https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42))

## [1.2.0](https://github.com/Xunnamius/xscripts/compare/v1.1.0...v1.2.0) (2024-05-31)

#### ✨ Features

- Implement "prepare" script ([6426d70](https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c))

## [1.1.0](https://github.com/Xunnamius/xscripts/compare/v1.0.0...v1.1.0) (2024-05-31)

#### ✨ Features

- Implement "list-tasks" script ([ac5a9ba](https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43))

## [1.0.0](https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...v1.0.0) (2024-05-31)

#### ✨ Features

- **src:** implement "clean" script ([89d81a3](https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e))

#### ⚙️ Build System

- **package:** update build scripts ([589fcb0](https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0))
