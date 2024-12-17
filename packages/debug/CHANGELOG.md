# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/debug\@1.0.0 (2024-11-22)

### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][3])
- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][4])
- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][5])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][6])
- **@-xun/run:** make intermediate result available ([1153f42][7])
- **@-xun/run:** update to work with latest execa ([12ee54a][8])
- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][9])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][10])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][11])
- **@black-flag/extensions:** add support for `vacuousImplications` option configuration key ([0c199f6][12])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][13])
- **babel:** replace tsconfig-replace-paths with babel-plugin-transform-rewrite-import ([1bdceca][14])
- Ensure `--changelog-file` is added to "build changelog" ([d84b35f][15])
- Implement "list-tasks" script ([ac5a9ba][16])
- Integrate @-xun/run ([d22cee3][17])
- Integrate Tstyche into "test" command ([9045cd7][18])
- **lib:** add `scriptBasename` ([f15a14d][19])
- **lib:** commit @black-flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][20])
- **lib:** move `AsStrictExecutionContext` into @black-flag/extensions ([ae46adf][21])
- **packages/debug:** add stub version information ([005ab26][22])
- **packages/debug:** differentiate root from nested namespaces ([467e884][23])
- **packages/test-utils:** split off test utilities into new package ([576dd64][24])
- **rejoinder:** add `getDisabledTags` function export ([534f398][25])
- **release:** support modern changelog generation flow ([6ef0123][26])
- **src:** implement "build changelog" script ([8d4bb6d][27])
- **src:** implement "format" script ([7824c25][28])
- **src:** implement "release" command ([44be676][29])
- **src:** implement new graph algorithm for lint target determination ([3323fc3][30])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][31])

### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][32])
- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][33])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][34])
- **@black-flag/extensions:** add missing symbols ([17d53c3][35])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][36])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][37])
- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][38])
- **babel:** fix bug in import target output path resolution algorithm ([4e85380][39])
- Ensure correct use of debug logger namespace in various places ([65e4330][40])
- **eslint:** disable no-unsupported-features checks, generalize `overwriteFileProperty`, fix eslint-plugin-n bug ([0c3f85c][41])
- **eslint:** use latest `analyzeProjectStructure()` function ([fa2a97f][42])
- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][43])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][44])
- **remarkrc:** improve output of "format" command" ([b4c296e][45])
- Remove deep import ([0bf89ca][46])
- **src:** ensure "lint" functions properly in monorepo context given `--scope` ([0f4c7b1][47])
- **tsc:** ensure monorepo package distributables are properly ignored ([646aa3c][48])

### ⚡️ Optimizations

- **eslint:** use \_\_dirname assumption instead of analyzing the entire project ([b8b82d9][49])

### ⚙️ Build System

- Add pseudodecorators where appropriate ([dc47cfb][50])
- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][51])
- **babel:** disable explicit-exports-references for now ([92bb25f][52])
- **babel:** generalize import rewrites ([ee5cf10][53])
- **babel:** manually fix index import rewrites ([2f5e8e9][54])
- **babel:** replace module-resolver and tsconfig-replace-paths with transform-rewrite-imports ([69ebf4a][55])
- **babel:** update core-js usage to 3.37 ([506bf2d][56])
- **babel:** update with alias test and generally simplify configuration ([a08c9f1][57])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][58])
- **commitlint.config:** expand to include several useful rules ([909949d][59])
- **commitlint:** update commitlint configuration from cjs (js) to esm (mjs) ([cd82265][60])
- Ensure local ecosystem ignores only relevant files ([e4a1e0b][61])
- **eslint.config:** activate several new rules ([94a2253][62])
- **eslint.config:** update @typescript-eslint/require-await linting config ([b23b12b][63])
- **eslint.config:** update @typescript-eslint/unbound-method linting config ([f6515ea][64])
- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][65])
- **eslint:** allow "arg" as a variable name ([9087086][66])
- **eslint:** ensure .transpiled directory is ignored ([c34a549][67])
- **eslint:** modernize eslint config ([e37006e][68])
- **eslintrc:** do not ignore src/build ([847cc63][69])
- **eslint:** update to use experimental features of @-xun/eslint-plugin-import-experimental ([36016b1][70])
- **eslint:** update with alias test and latest rule updates ([db0c6d7][71])
- **eslint:** upgrade eslint-plugin-import usage to take advantage of v9 support ([7dcbf56][72])
- **gitignore:** do not ignore src files anymore ([fd210c5][73])
- **gitignore:** upgrade to more robust .gitignore ([43da882][74])
- Hide all warnings from nodejs ([c1a4b9c][75])
- **husky:** add husky pre-push protective hook ([33af2bc][76])
- **husky:** update husky scripts ([e55a88e][77])
- **husky:** update lint script to use latest name ([ea6aaff][78])
- **jest:** ensure .transpiled directory is ignored ([c1ac811][79])
- **jest:** ensure .transpiled directory is ignored by jest-haste-map etc ([901d853][80])
- **jest:** ensure jest and jest-haste-map ignore ignored packages ([86fca58][81])
- **jest:** ignore type-only tests ([1fb8568][82])
- **jest:** update jest configuration from cjs (js) to esm (mjs) ([e334962][83])
- **lint-staged.config:** update to use xscripts ([d290ba5][84])
- **lint-staged:** update lint-staged configuration from cjs (js) to esm (mjs) ([8833e0a][85])
- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][86])
- **ncurc:** pin non-broken remark-lint-no-inline-padding ([5070ab4][87])
- **package:** add semver; force install alpha versions of typescript-eslint etc ([b56fd66][88])
- **package:** fix dependency issues identified by xscripts when analyzing its own project structure ([ebb4fb5][89])
- **package:** remove extraneous dependencies ([ccc82b3][90])
- **packages/run:** narrow scope of the list-tasks npm script ([8cbc4e4][91])
- **packages/run:** take advantage of xscript scope-related features ([b1249ed][92])
- **package:** update exports, dependencies, and scripts ([323579d][93])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][94])
- **package:** use consistent script names ([c7fe410][95])
- **prettierignore:** ignore license files ([b928e8a][96])
- **prettier:** update prettier configuration from cjs (js) to esm (mjs) ([0eb7fd3][97])
- Prevent automatic updates of super-pinned packages ([8d69310][98])
- **release.config:** subsume semantic-release plugin functionality into custom release conf plugin ([8b54237][99])
- **release:** actually fix incorrect semantic-release plugin order during publish flow ([5719681][100])
- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][101])
- **release:** ensure temporary markdown files end with ".md" ([f2cb8fd][102])
- **release:** fix incorrect semantic-release plugin order during publish flow ([a2ea7df][103])
- **release:** fix incorrect use of lodash template evaluate delimiter ([35876a1][104])
- **release:** reactivate core release pipeline plugins ([3008cde][105])
- **release:** take advantage of new `--only-patch-changelog` flag ([01375f7][106])
- **release:** take advantage of new `--output-sort` functionality ([59dd752][107])
- **remarkrc:** add lint-no-undef NODE\_ENV support ([e169f47][108])
- **remarkrc:** always translate normal links into reference links ([99c7b33][109])
- **remarkrc:** never automatically capitalize our packages' names in markdown headings ([45bcd8c][110])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][111])
- Split tsconfig into project vs package configurations ([e7b8579][112])
- **src/assets:** move custom semantic-release plugin into config asset ([25e7a3b][113])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][114])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][115])
- **tsconfig:** exclude test/ dir from "lint" command limited scope, include dotfiles under lib ([df6116b][116])
- **tsconfig:** remove packages glob from includes ([d3301ca][117])
- **tsconfig:** set declaration=false by default ([22f2f41][118])
- **tsconfig:** update includes ([c721fed][119])
- **turbo:** add stub turbo configuration ([2036da0][120])
- Update .gitignore and .prettierignore with improved documentation and latest best practices ([a35f4c0][121])
- Update source aliases to latest ([8d71521][122])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][123])
- Use consistent exclusions across TS configurations ([98a1dd7][124])
- **vscode:** take advantage of new `--run-to-completion` flag ([d9b4b80][125])
- **vscode:** update example with latest best practices ([64b7309][126])
- **vscode:** update full project lint vscode task example ([3f1a5a9][127])

### 🔥 Reverted

- _"build(prettierignore): no longer ignore CHANGELOG.md when formatting"_ ([ddd9192][128])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/rejoinder/commit/813b7580971553cde14b4f278f31af7353384e85
[4]: https://github.com/Xunnamius/rejoinder/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[5]: https://github.com/Xunnamius/rejoinder/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[6]: https://github.com/Xunnamius/rejoinder/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[7]: https://github.com/Xunnamius/rejoinder/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[8]: https://github.com/Xunnamius/rejoinder/commit/12ee54a21f0004eb568763507540157371aa06be
[9]: https://github.com/Xunnamius/rejoinder/commit/b64412cd043877da93fa252bad0325bda73ea60c
[10]: https://github.com/Xunnamius/rejoinder/commit/feabe67a00aa2c970c3591110ec871f56626998f
[11]: https://github.com/Xunnamius/rejoinder/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[12]: https://github.com/Xunnamius/rejoinder/commit/0c199f69971688205b1ee027dce36c2bc6ab8a04
[13]: https://github.com/Xunnamius/rejoinder/commit/0543cff5d6e50a688365bf314837b54342106327
[14]: https://github.com/Xunnamius/rejoinder/commit/1bdceca9e23b28bffb12b84013ba95ef54c5ac81
[15]: https://github.com/Xunnamius/rejoinder/commit/d84b35ff2b28040920fb62a405e29f2e54d29d4f
[16]: https://github.com/Xunnamius/rejoinder/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[17]: https://github.com/Xunnamius/rejoinder/commit/d22cee3b292da80ab45e4513bba3b2157fa72245
[18]: https://github.com/Xunnamius/rejoinder/commit/9045cd704121600e07d84839c3e23b407e184f6b
[19]: https://github.com/Xunnamius/rejoinder/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[20]: https://github.com/Xunnamius/rejoinder/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[21]: https://github.com/Xunnamius/rejoinder/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[22]: https://github.com/Xunnamius/rejoinder/commit/005ab26c7be42aeec8a100753ba49f41b0d38550
[23]: https://github.com/Xunnamius/rejoinder/commit/467e88442c58320f1b65e6de3bd5e52c0220132b
[24]: https://github.com/Xunnamius/rejoinder/commit/576dd649da2775841e9a2e985b02e564a2be1caa
[25]: https://github.com/Xunnamius/rejoinder/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[26]: https://github.com/Xunnamius/rejoinder/commit/6ef0123a0d9d1668ce567cf526e04951a3d25dd1
[27]: https://github.com/Xunnamius/rejoinder/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[28]: https://github.com/Xunnamius/rejoinder/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[29]: https://github.com/Xunnamius/rejoinder/commit/44be676ca04207bd17553941d367abda2325c0ee
[30]: https://github.com/Xunnamius/rejoinder/commit/3323fc3580b663f00518e7ca7bd9f52a7e50b80f
[31]: https://github.com/Xunnamius/rejoinder/commit/7364616ea349761591231a3547bd697ec67ed34b
[32]: https://github.com/Xunnamius/rejoinder/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[33]: https://github.com/Xunnamius/rejoinder/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[34]: https://github.com/Xunnamius/rejoinder/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[35]: https://github.com/Xunnamius/rejoinder/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[36]: https://github.com/Xunnamius/rejoinder/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[37]: https://github.com/Xunnamius/rejoinder/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[38]: https://github.com/Xunnamius/rejoinder/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[39]: https://github.com/Xunnamius/rejoinder/commit/4e853808704a86d2f207aaa7cc0b5531cb05ad00
[40]: https://github.com/Xunnamius/rejoinder/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[41]: https://github.com/Xunnamius/rejoinder/commit/0c3f85c0e926cff1645b6a329edcc6304b8ac189
[42]: https://github.com/Xunnamius/rejoinder/commit/fa2a97f118389cdaf4227a07a9bf5a5bc4cc2dfe
[43]: https://github.com/Xunnamius/rejoinder/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[44]: https://github.com/Xunnamius/rejoinder/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[45]: https://github.com/Xunnamius/rejoinder/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[46]: https://github.com/Xunnamius/rejoinder/commit/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa
[47]: https://github.com/Xunnamius/rejoinder/commit/0f4c7b1e678f56ff0cb5112c8858f0da57254d91
[48]: https://github.com/Xunnamius/rejoinder/commit/646aa3cee846f4a6169ae05c91d5b4762e1c290e
[49]: https://github.com/Xunnamius/rejoinder/commit/b8b82d942c478673b10b2d071802c73461c42961
[50]: https://github.com/Xunnamius/rejoinder/commit/dc47cfbbdc869aa2d149924c72bb5414b0f46f07
[51]: https://github.com/Xunnamius/rejoinder/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[52]: https://github.com/Xunnamius/rejoinder/commit/92bb25fe5f8022271ae03ee56e18377ad02e392b
[53]: https://github.com/Xunnamius/rejoinder/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[54]: https://github.com/Xunnamius/rejoinder/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[55]: https://github.com/Xunnamius/rejoinder/commit/69ebf4a549a7ce9848c19c27035d77473f5707a8
[56]: https://github.com/Xunnamius/rejoinder/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[57]: https://github.com/Xunnamius/rejoinder/commit/a08c9f1fd5448c918aa65f09f1842dc46162fb8a
[58]: https://github.com/Xunnamius/rejoinder/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[59]: https://github.com/Xunnamius/rejoinder/commit/909949d58e2ddecf4ad606fe0dd9525ec540a8fb
[60]: https://github.com/Xunnamius/rejoinder/commit/cd82265731cd411d9b374c3bbe3c642c93a053fe
[61]: https://github.com/Xunnamius/rejoinder/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[62]: https://github.com/Xunnamius/rejoinder/commit/94a2253a2888d5d2b34290d7b0180fdee2a2a104
[63]: https://github.com/Xunnamius/rejoinder/commit/b23b12b64b968429652269db3ae710f79c3ce356
[64]: https://github.com/Xunnamius/rejoinder/commit/f6515ea793a72cfd42cb6d3f74675b2ae3a9b2e1
[65]: https://github.com/Xunnamius/rejoinder/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[66]: https://github.com/Xunnamius/rejoinder/commit/9087086d6944cb6a847f325142753a63be2ca30c
[67]: https://github.com/Xunnamius/rejoinder/commit/c34a5499cb58878fdaa42e83063e1c36a0582e06
[68]: https://github.com/Xunnamius/rejoinder/commit/e37006ee62471c2cf178a89023e34a9b691b7574
[69]: https://github.com/Xunnamius/rejoinder/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[70]: https://github.com/Xunnamius/rejoinder/commit/36016b10da47bb5799d3e558831a96eda878c10e
[71]: https://github.com/Xunnamius/rejoinder/commit/db0c6d71e780edd2d6ab295abc136ac3fa3979d7
[72]: https://github.com/Xunnamius/rejoinder/commit/7dcbf56f1d89bddc9ad635e47a6f27a13274e799
[73]: https://github.com/Xunnamius/rejoinder/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[74]: https://github.com/Xunnamius/rejoinder/commit/43da8828df733ab8fd835d1a40c2a2c0c98fdd9b
[75]: https://github.com/Xunnamius/rejoinder/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[76]: https://github.com/Xunnamius/rejoinder/commit/33af2bc79370b38bc94633617180bcd283b5a0bf
[77]: https://github.com/Xunnamius/rejoinder/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[78]: https://github.com/Xunnamius/rejoinder/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[79]: https://github.com/Xunnamius/rejoinder/commit/c1ac811d2d7500a4b665d4d1531b5d51a9da2c19
[80]: https://github.com/Xunnamius/rejoinder/commit/901d85357b06b854b6c37a34ac2b37948376660c
[81]: https://github.com/Xunnamius/rejoinder/commit/86fca5843564773f9e0ec53c454c72109befbec6
[82]: https://github.com/Xunnamius/rejoinder/commit/1fb8568e874687f25f13bcd31db7e94a8eb43282
[83]: https://github.com/Xunnamius/rejoinder/commit/e334962ae950f510b35d09bb5d6ed6326a586de0
[84]: https://github.com/Xunnamius/rejoinder/commit/d290ba57054479eb873d3cdc785db602432fca09
[85]: https://github.com/Xunnamius/rejoinder/commit/8833e0a06f0733e89b4496719aa8b71050783339
[86]: https://github.com/Xunnamius/rejoinder/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[87]: https://github.com/Xunnamius/rejoinder/commit/5070ab49e00314a91a6c87aa1715846939531023
[88]: https://github.com/Xunnamius/rejoinder/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[89]: https://github.com/Xunnamius/rejoinder/commit/ebb4fb597a47fa0d748735e3b0a2832434b7a637
[90]: https://github.com/Xunnamius/rejoinder/commit/ccc82b396baeb2445174d0c8b9da97522cb66066
[91]: https://github.com/Xunnamius/rejoinder/commit/8cbc4e40c61d48b61ab4ee2c34f679f6cd2ed0ab
[92]: https://github.com/Xunnamius/rejoinder/commit/b1249edd6124c7f86bc60288861d61854e30ff3d
[93]: https://github.com/Xunnamius/rejoinder/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[94]: https://github.com/Xunnamius/rejoinder/commit/5b11c68aebc8099007ffcf50444707165939e061
[95]: https://github.com/Xunnamius/rejoinder/commit/c7fe4109820fb109db7a0ea07985089d1b488535
[96]: https://github.com/Xunnamius/rejoinder/commit/b928e8a92064bcc4a0ef17b45eb6af40654208f2
[97]: https://github.com/Xunnamius/rejoinder/commit/0eb7fd3b75fe765781b5ca482abbd38e3b0a1a65
[98]: https://github.com/Xunnamius/rejoinder/commit/8d69310b68b2362d815e1e1e1d76d5688d6b46ff
[99]: https://github.com/Xunnamius/rejoinder/commit/8b54237af01ef168984d9b306063e60e7914c936
[100]: https://github.com/Xunnamius/rejoinder/commit/571968164a4defe8eefdb81341cd7a0664079a66
[101]: https://github.com/Xunnamius/rejoinder/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[102]: https://github.com/Xunnamius/rejoinder/commit/f2cb8fd3a8ad8a0ea642b34a1cca9159bb51b101
[103]: https://github.com/Xunnamius/rejoinder/commit/a2ea7df939d4f1e11e3904c653f35f87abe65651
[104]: https://github.com/Xunnamius/rejoinder/commit/35876a1903ae9180624905e176f7c4b2e1d870a1
[105]: https://github.com/Xunnamius/rejoinder/commit/3008cde37d490c51b2c1ab549ad4faa847d8266d
[106]: https://github.com/Xunnamius/rejoinder/commit/01375f77f74bfaf0b38de5bdd30d162461aa6106
[107]: https://github.com/Xunnamius/rejoinder/commit/59dd7523276ab48868124e8f76f06784bc59f794
[108]: https://github.com/Xunnamius/rejoinder/commit/e169f47888b112eda08cb8518b69ba3bfd9f2b26
[109]: https://github.com/Xunnamius/rejoinder/commit/99c7b3396ff73868208060410f7430538f6d48d6
[110]: https://github.com/Xunnamius/rejoinder/commit/45bcd8c56f38ccbc330b4088c6f8a5812714611a
[111]: https://github.com/Xunnamius/rejoinder/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[112]: https://github.com/Xunnamius/rejoinder/commit/e7b857926d572780c951aa1161133186d2cf1784
[113]: https://github.com/Xunnamius/rejoinder/commit/25e7a3b93bd0cfd32df2aaaa83ee055bc7ba1c92
[114]: https://github.com/Xunnamius/rejoinder/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[115]: https://github.com/Xunnamius/rejoinder/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[116]: https://github.com/Xunnamius/rejoinder/commit/df6116b1c5ad4c0f7c3152cc254d943a7b9e67e7
[117]: https://github.com/Xunnamius/rejoinder/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[118]: https://github.com/Xunnamius/rejoinder/commit/22f2f41be642d3d94fc4e5a50014a61ab68c50b4
[119]: https://github.com/Xunnamius/rejoinder/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[120]: https://github.com/Xunnamius/rejoinder/commit/2036da0350a573c7ae9179d6cdd794e91935c9ae
[121]: https://github.com/Xunnamius/rejoinder/commit/a35f4c0e581dff4a7667277284052a7fa71b672e
[122]: https://github.com/Xunnamius/rejoinder/commit/8d7152112e4927f566e048c6b0be7dfce4a6c430
[123]: https://github.com/Xunnamius/rejoinder/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[124]: https://github.com/Xunnamius/rejoinder/commit/98a1dd7eacac964a7fbab47ded92c33173383f11
[125]: https://github.com/Xunnamius/rejoinder/commit/d9b4b80db15e6104a2a3ab7325996a08a350ea6d
[126]: https://github.com/Xunnamius/rejoinder/commit/64b7309fcb28c1214f1edcc8319960c1c94f72b0
[127]: https://github.com/Xunnamius/rejoinder/commit/3f1a5a9a6c7ce7cd8aba5c521fb95c6beed3394e
[128]: https://github.com/Xunnamius/rejoinder/commit/ddd9192c05110fca3ae0d93bac276426932269ef
