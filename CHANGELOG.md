# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/scripts[@1.30.0][3] (2024-11-25)

### ✨ Features

- **commands/list-tasks:** allow filtering tasks by string ([3710988][4])

### 🪄 Fixes

- **commands/release:** ensure codecov uploader is passed the proper arguments ([ca47d93][5])

<br />

### 🏗️ Patch @-xun/scripts[@1.30.3][6] (2024-12-04)

#### 🪄 Fixes

- **src:** allow testverse imports in non-source typescript files ([b923d6d][7])

<br />

### 🏗️ Patch @-xun/scripts[@1.30.2][8] (2024-11-26)

#### ⚙️ Build System

- **remarkrc:** ensure remark doesn't mangle GFM alerts with escape characters ([98a868e][9])

<br />

### 🏗️ Patch @-xun/scripts[@1.30.1][10] (2024-11-25)

#### 🪄 Fixes

- **config/conventional:** fix global patch detection logic ([89eebe7][11])

<br />

## @-xun/scripts[@1.29.0][12] (2024-11-24)

### ✨ Features

- **src:** add support for init version tag suffixes to "build changelog" ([002431f][13])

### 🪄 Fixes

- **src:** ensure "clean" command does not delete ignored packages ([65b8c0b][14])

<br />

### 🏗️ Patch @-xun/scripts[@1.29.2][15] (2024-11-25)

#### ⚙️ Build System

- **package:** upgrade @-xun/changelog to 1.0.0 ([d89809b][16])

<br />

### 🏗️ Patch @-xun/scripts[@1.29.1][17] (2024-11-24)

#### ⚙️ Build System

- **remarkrc:** fix faulty array reference ([8feaaa7][18])

<br />

## @-xun/scripts[@1.28.0][19] (2024-11-24)

### ✨ Features

- **babel:** use reverse entrypoint resolver to fix tsc output ([c3fc126][20])

### 🪄 Fixes

- **eslint:** do not collapse path group overrides ([71b17c8][21])
- Remove unnecessary restrictions on universe imports; bail out when an import is rejected ([11b585d][22])
- **src:** warn when release process ends with a dirty repo ([cf5b25b][23])

### ⚙️ Build System

- **babel:** add core-js validation checks ([55ee62d][24])
- **babel:** fix incorrect regexp stringification when using transform-rewrite-imports ([56b706a][25])

<br />

## @-xun/scripts[@1.27.0][26] (2024-11-23)

### ✨ Features

- **project-utils:** expose `process.cwd` replacement exports ([1a69887][27])

### 🪄 Fixes

- **distributables.ts:** do not output "build succeeded but" message unless build actually succeeded ([1262cc8][28])

### ⚙️ Build System

- **eslint:** add `instanceof` and `process.cwd` usage restrictions ([645473d][29])
- **package:** make scripts less verbose ([c5c742e][30])

<br />

## @-xun/scripts[@1.26.0][31] (2024-11-22)

### ✨ Features

- **src:** implement "release" command ([44be676][32])
- **src:** implement new graph algorithm for lint target determination ([3323fc3][33])
- **src:** implement new graph algorithm for test target determination ([8a67d70][34])

### 🪄 Fixes

- **src:** ignore root package properly when releasing package ([09373fa][35])
- **src:** improve dev version detection ([b3e95e7][36])
- **src:** improve outputs; fix crash due to shifting arg type ([d27007d][37])
- **src:** patch globals to deal with design decisions from upstream conventional-changelog-core ([998218d][38])

### ⚙️ Build System

- **eslint:** allow "arg" as a variable name ([9087086][39])
- **eslint:** update to use experimental features of @-xun/eslint-plugin-import-experimental ([36016b1][40])
- **jest:** ensure jest and jest-haste-map ignore ignored packages ([86fca58][41])
- **src:** update with latest launch.json ([bb6bde9][42])

<br />

## @-xun/scripts[@1.25.0][43] (2024-11-14)

### ✨ Features

- Integrate @-xun/changelog ([31c7bbb][44])
- Integrate @-xun/release ([4f807cf][45])
- Integrate @-xun/run ([d22cee3][46])
- Integrate Tstyche into "test" command ([9045cd7][47])
- **packages/project-utils:** add `typescriptTestFiles` to `ProjectFiles` objects ([e7c4b6e][48])
- **packages/test-utils:** split off test utilities into new package ([576dd64][49])
- **src:** "test" prevents propagation of DEBUG env var by default unless `--debug` given ([ffcad30][50])
- **src:** ensure "build changelog" prints out full package name and version ([4059ed7][51])
- **src:** ensure current package is always printed last for "list-tasks" ([5ea7f8a][52])
- **src:** expand "build" pre-check to include all of a package's TS files ([d4d3756][53])
- **src:** explicitly allow arbitrary options passed to executables in "lint" and "test" ([d915727][54])
- **src:** implement "build" support for partial builds via `--partial` ([5d61e87][55])

### 🪄 Fixes

- **assets/config:** update conventional configuration to support both monorepos and polyrepos ([1d0dee8][56])
- **babel:** fix bug in import target output path resolution algorithm ([4e85380][57])
- **src:** ambient types are only allowed at package root types/ dir ([81ba7bc][58])
- **src:** do not run prettier on files not targeted by `--files` ([128e83a][59])
- **src:** ensure "format" functions properly in a monorepo context given `--scope` ([c4016a8][60])
- **src:** ensure "lint" functions properly in monorepo context given `--scope` ([0f4c7b1][61])
- **src:** ensure "test" functions properly in a monorepo context given `--scope` ([1894d80][62])
- **src:** ensure BF context receives the correct version number from own package.json ([351ee50][63])
- **src:** ensure prettier always gets a pass at markdown and json files in "format" command ([74ab5d9][64])
- **src:** ensure tstyche is only run when type-only tests exist ([18dbad0][65])
- **src:** ensure version extraction regexp behaves robustly ([8e82ac1][66])
- **src:** improve "build distributables" options configuration ([f323a6a][67])
- **src:** improve command output aesthetics ([4a6e254][68])
- **src:** improved `--version` support ([4e3cdc0][69])
- **src:** include full package name and version in release commit subject ([5e00587][70])
- **src:** only match xpipeline commands that are proper suffixes ([9b8b41a][71])
- **src:** use proper gitLogOptions.paths property (fixes typo) ([e22403c][72])

### ⚙️ Build System

- **eslint:** ensure .transpiled directory is ignored ([c34a549][73])
- **gitignore:** upgrade to more robust .gitignore ([43da882][74])
- **husky:** add husky pre-push protective hook ([33af2bc][75])
- **jest:** ensure .transpiled directory is ignored ([c1ac811][76])
- **jest:** ensure .transpiled directory is ignored by jest-haste-map et al ([901d853][77])
- **jest:** ignore type-only tests ([1fb8568][78])
- **package:** correct typo in bug.url ([3373208][79])
- **packages/run:** narrow scope of the list-tasks npm script ([8cbc4e4][80])
- **packages/run:** take advantage of xscript scope-related features ([b1249ed][81])
- **package:** use `--no-parallel` in "release" script ([5eb9def][82])
- **prettierignore:** ignore license files ([b928e8a][83])
- **remarkrc:** never automatically capitalize our packages' names in markdown headings ([45bcd8c][84])
- **src:** patch both `Proxy` and `spawn` as a side effect ([f50abaf][85])
- Use consistent exclusions across TS configurations ([98a1dd7][86])

<br />

## @-xun/scripts[@1.24.0][87] (2024-11-01)

### 🪄 Fixes

- **src:** ensure build pre-checks run before the ./dist dir is cleared ([69f2dc0][88])
- **src:** ignore internal-resolution-errors with attw since we do our own internal checks ([8dc4a96][89])
- **src:** prevent clean command from obliterating cwd ([e3fa185][90])
- **src:** use upward root mode when searching for babel configs ([89b57c4][91])

### ⚡️ Optimizations

- **eslint:** use \_\_dirname assumption instead of analyzing the entire project ([b8b82d9][92])

### ⚙️ Build System

- **babel:** replace module-resolver and tsconfig-replace-paths with transform-rewrite-imports ([69ebf4a][93])
- **package:** narrow scope of the lint npm script ([556f17e][94])
- **package:** use no-hoist to block execa hoisting ([74d58d6][95])

<br />

## @-xun/scripts[@1.23.0][96] (2024-10-27)

### ✨ Features

- **babel:** replace tsconfig-replace-paths with babel-plugin-transform-rewrite-import ([1bdceca][97])
- **src:** perform validity and extraneity checks on build output for "build distributables" ([a1d3657][98])

### 🪄 Fixes

- **eslint:** use latest `analyzeProjectStructure()` function ([fa2a97f][99])

### ⚙️ Build System

- Add pseudodecorators where appropriate ([dc47cfb][100])
- **package:** fix dependency issues identified by xscripts when analyzing its own project structure ([ebb4fb5][101])
- **package:** remove extraneous dependencies ([ccc82b3][102])

<br />

## @-xun/scripts[@1.22.0][103] (2024-10-24)

### ✨ Features

- **src:** make `--run-to-completion` default to `true` for "lint" command ([8bdf28b][104])

### 🪄 Fixes

- **eslint:** disable no-unsupported-features checks, generalize `overwriteFileProperty`, fix eslint-plugin-n bug ([0c3f85c][105])
- **src:** ensure CannotRunOutsideRoot error only triggers when outside root ([531d3ea][106])
- **src:** properly add the development tag when using self-referential xscripts ([a7a66d9][107])

### ⚙️ Build System

- **eslint:** modernize eslint config ([e37006e][108])
- **package:** expand engines.node to all maintained node versions ([349cf20][109])
- **package:** remove more rarely used scripts ([d8b7442][110])
- **package:** use consistent script names ([c7fe410][111])
- **src:** fix import missing extension ([2c40974][112])
- **src:** fix import missing extension ([f5fb1bc][113])

<br />

## @-xun/scripts[@1.21.0][114] (2024-10-18)

### ✨ Features

- **src:** upgrade commands with scope (monorepo) support ([7ad96c5][115])

### 🪄 Fixes

- **src:** improve conventional-commits config monorepo support ([d54cfa0][116])
- **tsc:** ensure monorepo package distributables are properly ignored ([646aa3c][117])

### ⚙️ Build System

- **babel:** update with alias test and generally simplify configuration ([a08c9f1][118])
- **commitlint:** update commitlint configuration from cjs (js) to esm (mjs) ([cd82265][119])
- **eslint.config:** activate several new rules ([94a2253][120])
- **eslint:** update with alias test and latest rule updates ([db0c6d7][121])
- **eslint:** upgrade eslint-plugin-import usage to take advantage of v9 support ([7dcbf56][122])
- **jest:** update jest configuration from cjs (js) to esm (mjs) ([e334962][123])
- **lint-staged:** update lint-staged configuration from cjs (js) to esm (mjs) ([8833e0a][124])
- **ncurc:** pin non-broken remark-lint-no-inline-padding ([5070ab4][125])
- **package:** add dependency aliases for find-up\@5 and escape-string-regexp\@4 ([1eff5cb][126])
- **prettier:** update prettier configuration from cjs (js) to esm (mjs) ([0eb7fd3][127])
- Prevent automatic updates of super-pinned packages ([8d69310][128])
- **remarkrc:** add lint-no-undef NODE\_ENV support ([e169f47][129])
- Split tsconfig into project vs package configurations ([e7b8579][130])
- **turbo:** add stub turbo configuration ([2036da0][131])
- Update .gitignore and .prettierignore with improved documentation and latest best practices ([a35f4c0][132])
- **vscode:** update full project lint vscode task example ([3f1a5a9][133])

<br />

## @-xun/scripts[@1.20.0][134] (2024-08-20)

### ✨ Features

- Ensure `--changelog-file` is added to "build changelog" ([d84b35f][135])
- **release:** support modern changelog generation flow ([6ef0123][136])
- **src:** add `--import-section-file` and `--changelog-file` flags to "build changelog" ([8cf99a9][137])

### 🪄 Fixes

- **src:** ensure "format" ignores .remarkignore; ensure "lint" respects .remarkignore ([3dd5d78][138])
- **src:** ensure changelog prints patches (including imports) in proper order ([5c3ed73][139])
- **src:** properly section off patch notes using dividers ([c912b09][140])

### ⚙️ Build System

- **package:** update repository url to conform with GHA provenance guidelines ([9cb2d72][141])
- **src/assets:** disable remark-validate-links for template files ([ce03500][142])
- **tsconfig:** set declaration=false by default ([22f2f41][143])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.8][144] (2024-08-23)

#### 🪄 Fixes

- **src:** ensure release notes have headers at level 2 ([ce701f3][145])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.7][146] (2024-08-23)

#### 🪄 Fixes

- **src:** ensure only the start of the release notes are trimmed ([3c48ae1][147])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.6][148] (2024-08-23)

#### 🪄 Fixes

- **src/assets:** remove first line from semantic-release plugin generated release notes ([76992d9][149])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.5][150] (2024-08-22)

#### 🪄 Fixes

- Ensure xscripts supports limited invocations outside of project root ([0864f92][151])
- **src/commands/lint:** ensure no erroneous whitespaces are inserted between outputs ([ff3853f][152])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.4][153] (2024-08-21)

#### 🪄 Fixes

- Remove deep import ([0bf89ca][154])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.3][155] (2024-08-21)

#### 🪄 Fixes

- **src:** move deep import with respect to new deduped location ([dd265b4][156])
- **src:** remove utf8 symbols from changelog generator output ([cf21d7d][157])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.2][158] (2024-08-21)

#### 🪄 Fixes

- **src:** ensure calls to remark include an explicit --rc-path ([bc2a56b][159])
- **src:** ensure robust handling of formatter errors when running "format" ([5211547][160])
- **src:** make "build changelog" `CustomCliArguments` type more accurate ([8735f61][161])
- **src:** work around glob-gitignore bug in "format" ([a86884f][162])

#### ⚙️ Build System

- **eslint.config:** update @typescript-eslint/require-await linting config ([b23b12b][163])
- **release.config:** subsume semantic-release plugin functionality into custom release conf plugin ([8b54237][164])
- **release:** actually fix incorrect semantic-release plugin order during publish flow ([5719681][165])
- **release:** ensure temporary markdown files end with ".md" ([f2cb8fd][166])
- **release:** reactivate core release pipeline plugins ([3008cde][167])
- **src/assets:** move custom semantic-release plugin into config asset ([25e7a3b][168])
- **src:** ensure custom semantic-release plugin does not allow non-md files ([904c9ac][169])

<br />

### 🏗️ Patch @-xun/scripts[@1.20.1][170] (2024-08-20)

#### ⚙️ Build System

- **release:** fix incorrect use of lodash template evaluate delimiter ([35876a1][172])

<br />

## @-xun/scripts[@1.19.0][173] (2024-07-29)

### ✨ Features

- **@black-flag/extensions:** add support for `vacuousImplications` option configuration key ([0c199f6][174])
- **src:** implement `--output-sort` for "build changelog"; integrate conventional core and drop cli ([587a354][175])

### ⚙️ Build System

- **babel:** disable explicit-exports-references for now ([92bb25f][176])
- **commitlint.config:** expand to include several useful rules ([909949d][177])
- **release:** take advantage of new `--output-sort` functionality ([59dd752][178])

<br />

### 🏗️ Patch @-xun/scripts[@1.19.1][179] (2024-07-29)

#### 🪄 Fixes

- **package:** fix asset config import configuration ([d201164][180])

<br />

## @-xun/scripts[@1.18.0][181] (2024-07-27)

### ✨ Features

- **src:** "build changelog" now accepts `--only-patch-changelog` and `--output-unreleased` ([6c7ae27][182])
- **src:** "lint" now accepts `--run-to-completion` and `--ignore-warnings` ([e833523][183])

### 🪄 Fixes

- **package:** downgrade @arethetypeswrong/cli to ^0.15.0 ([0383586][184])
- **src:** ensure node options are concatenated properly ([3a3489c][185])

### ⚡️ Optimizations

- **src:** take advantage of [tsc@5.6-beta][186] `--noCheck` argument in "build distributables" ([4e75096][187])

### ⚙️ Build System

- **eslint.config:** update @typescript-eslint/unbound-method linting config ([f6515ea][188])
- **release:** take advantage of new `--only-patch-changelog` flag ([01375f7][189])
- **tsconfig:** exclude test/ dir from "lint" command limited scope, include dotfiles under lib ([df6116b][190])
- Update source aliases to latest ([8d71521][191])
- **vscode:** take advantage of new `--run-to-completion` flag ([d9b4b80][192])
- **vscode:** update example with latest best practices ([64b7309][193])

<br />

## @-xun/scripts[@1.17.0][194] (2024-07-23)

### ✨ Features

- **@-xun/cli-utils:** add `interpolateTemplate` ([63354c7][195])
- **@-xun/cli-utils:** add `softAssert` and `hardAssert` ([369d969][196])

### ⚙️ Build System

- **eslint.config:** update to eslint flat config (eslint.config.mjs) ([609fca8][197])
- **husky:** update husky scripts ([e55a88e][198])
- **package:** add semver; force install alpha versions of typescript-eslint et al ([b56fd66][199])
- **package:** update exports, dependencies, and scripts ([323579d][200])
- **tsconfig:** ensure files from root dot folders are picked up by linters ([8609db7][201])
- Update to eslint\@9; begin transition to eslint.config.js flat ([52763c5][202])

<br />

## @-xun/scripts[@1.16.0][203] (2024-07-14)

### ✨ Features

- **@-xun/run:** make intermediate result available ([1153f42][204])
- **@-xun/run:** update to work with latest execa ([12ee54a][205])
- **@black-flag/extensions:** allow check property to accept an array of check functions ([0543cff][206])
- **src:** implement "lint" command ([346b4ac][207])

### 🪄 Fixes

- **package:** include missing listr2 dependency ([f42f4ab][208])
- **src:** ensure "build distributables" copies non-compiled files into ./dist ([e596e5b][209])
- **src:** ensure "lint" command linter subprocesses don't write to stdout or hang after error ([d96ae1d][210])
- **src:** ensure proper checks with various arguments ([c9e254a][211])

### ⚙️ Build System

- **babel:** allow babel to parse syntax attributes and ignore dynamic import transforms ([060ef01][212])
- **husky:** update lint script to use latest name ([ea6aaff][213])
- **package:** add final npm scripts ([eb5631b][214])
- **package:** replace typescript babel preset dependency with syntax plugin ([b72401a][215])
- **package:** update lint scripts to use xscripts ([7c1e7f1][216])
- **tsconfig:** remove packages glob from includes ([d3301ca][217])

<br />

### 🏗️ Patch @-xun/scripts[@1.16.1][218] (2024-07-14)

#### 🪄 Fixes

- **src:** place --copy-files argument in proper order in babel build sub-command ([8f1d25d][219])

<br />

## @-xun/scripts[@1.15.0][220] (2024-07-07)

### ✨ Features

- **src:** implement "test" script/command ([b665723][222])

### ⚙️ Build System

- **release:** add --renumber-references to CHANGELOG format sub-step in release flow ([49a3453][223])

<br />

## @-xun/scripts[@1.14.0][224] (2024-07-07)

### ✨ Features

- **src:** add --clean-output-dir option to "build distributables" command ([a507530][225])
- **src:** add struts for projector-js replacement "project" commands ([489e75a][226])
- **src:** merge "build distributables" and "build transpiled" commands ([1b6c72a][227])

### 🪄 Fixes

- **@black-flag/extensions:** support deep option aliasing & name expansion; fix several other issues ([82c2b0f][228])
- **src:** add .tsx to babel --extensions arg ([68c5582][229])
- **src:** ensure "build distributables" --generate-intermediates-for includes tests ([2ed4344][230])
- **src:** remove bad options references from "format" command ([cafeb73][231])

### ⚙️ Build System

- **maintaining:** note that resetting the working tree before publishing is optional ([f08250c][232])

<br />

## @-xun/scripts[@1.13.0][233] (2024-07-02)

### ✨ Features

- **src:** implement "build documentation" script ([05e56e7][234])
- **src:** implement "build externals" script ([1336341][235])

### ⚙️ Build System

- Ensure local ecosystem ignores only relevant files ([e4a1e0b][236])
- **tsconfig:** update includes ([c721fed][237])

<br />

## @-xun/scripts[@1.12.0][238] (2024-07-01)

### ✨ Features

- **@black-flag/extensions:** add `$artificiallyInvoked` argv support ([b64412c][239])
- **@black-flag/extensions:** add `getInvocableExtendedHandler` export ([feabe67][240])
- **rejoinder:** add `getDisabledTags` function export ([534f398][241])
- **src:** implement "build changelog" script ([8d4bb6d][242])
- Transmute "format" command's --skip-docs into the more versatile --skip-ignored ([7364616][243])

### 🪄 Fixes

- **@-xun/cli-utils:** do not lowercase 1st char in error message if 2nd char isn't already lowercase ([2f11281][244])
- **@-xun/cli-utils:** take advantage of `$artificiallyInvoked` to preserve output state ([9348ebb][245])
- **@black-flag/extensions:** implement better error handling on import failure ([626ee5a][246])
- Ensure correct use of debug logger namespace in various places ([65e4330][247])

### ⚙️ Build System

- **babel:** generalize import rewrites ([ee5cf10][248])
- **changelog:** add new CHANGELOG.md typo patches ([b9b106a][249])
- Hide all warnings from nodejs ([c1a4b9c][250])
- **package:** update scripts (and release.config.js) to use "build changelog" command ([5b11c68][251])
- **remarkrc:** always translate normal links into reference links ([99c7b33][252])

### 🔥 Reverted

- _"build(prettierignore): no longer ignore CHANGELOG.md when formatting"_ ([ddd9192][253])

<br />

## @-xun/scripts[@1.11.0][254] (2024-06-30)

### ✨ Features

- **@-xun/cli-utils:** add `ErrorMessage.RequiresMinArgs` ([618ce1a][255])
- **src:** add all-contributors regeneration to "format" command ([d74f099][256])

### 🪄 Fixes

- **src:** ensure --files never hands prettier paths it can't handle when running "format" command ([0f4dd16][257])
- **src:** ensure "format" command all-contributors regeneration only targets root README.md ([2cd56d1][258])
- **src:** ensure all glob relevant glob calls never return directories ([9764967][259])
- **src:** ensure, when --files is given, at least one option given for "format" command ([fd86f3f][260])
- **src:** fix fix fd86f3f ([e295a02][261])

### ⚙️ Build System

- **lint-staged.config:** update to use xscripts ([d290ba5][262])
- Reorganize deps/devdeps and re-enable commit-spell ([4ea8aa4][263])

<br />

## @-xun/scripts[@1.10.0][264] (2024-06-29)

### ✨ Features

- **@-xun/cli-utils:** add `AsStrictExecutionContext` intellisense type guard ([813b758][265])
- **@black-flag/extensions:** add and use `BfeStrictArguments` intellisense type guard ([42af69e][266])
- **lib:** move `AsStrictExecutionContext` into @black-flag/extensions ([ae46adf][267])
- **src:** add --prepend-shebang, Next.js support to "build distributables" command ([6575d49][268])
- **src:** improve capabilities of "format" command ([7d33dfe][269])

### 🪄 Fixes

- **src:** actually implement --skip-docs functionality in "format" command ([d535b78][270])
- **src:** restrict root/sub-root check to certain commands ([1b65f46][271])

<br />

### 🏗️ Patch @-xun/scripts[@1.10.1][272] (2024-06-29)

#### 🪄 Fixes

- **src:** ensure --files is respected by prettier in "format" command ([483f036][273])

<br />

## @-xun/scripts[@1.9.0][274] (2024-06-28)

### ✨ Features

- **src:** add `--full` argument to "list-tasks" command ([f47742b][275])
- **src:** prevent cli from running if not in root or sub-root ([4f280dc][276])

### 🪄 Fixes

- **src:** fix lib output and improve other aspects of the "build distributables" command ([159d771][277])

### ⚙️ Build System

- **babel:** update core-js usage to 3.37 ([506bf2d][278])
- **tsconfig:** ensure unnecessary types are excluded from distributables ([f7e65c3][279])

<br />

## @-xun/scripts[@1.8.0][280] (2024-06-27)

### ✨ Features

- **src:** commit initial version of "build" command ([c7b7623][281])

### ⚙️ Build System

- **eslintrc:** do not ignore src/build ([847cc63][282])
- **gitignore:** do not ignore src files anymore ([fd210c5][283])

<br />

## @-xun/scripts[@1.7.0][284] (2024-06-26)

### ✨ Features

- **src:** implement "format" script ([7824c25][285])

### 🪄 Fixes

- **remarkrc:** improve output of "format" command" ([b4c296e][286])

### ⚙️ Build System

- **package:** replace format script with "format" command ([005e378][287])
- **package:** use --hush over --quiet for "format" command ([9e4ae59][288])

<br />

## @-xun/scripts[@1.6.0][289] (2024-06-24)

### ✨ Features

- **src:** implement "deploy" script ([62e673b][290])

<br />

## @-xun/scripts[@1.5.0][291] (2024-06-23)

### ✨ Features

- **lib:** add `scriptBasename` ([f15a14d][292])
- **lib:** commit @black-flag/extensions\@1.0.0 and @-xun/cli-utils\@1.0.0 ([c775d6e][293])

### 🪄 Fixes

- **@-xun/cli-utils:** extend error message deduplication to nested cause strings ([8181e74][294])
- **@black-flag/extensions:** add missing symbols ([17d53c3][295])
- **@black-flag/extensions:** allow subOptionOf sub-object to be given directly ([537df70][296])
- **clean.ts:** add .vercel to list of ignored directories ([fd903a4][297])
- **lib:** move `ansiRedColorCodes` into rejoinder ([4eabfb5][298])
- **src:** use loose implications with deploy command ([8e11d66][299])

### ⚙️ Build System

- **babel:** manually fix index import rewrites ([2f5e8e9][300])
- **package:** disable tty in debug when running tests ([b57a6be][301])
- **package:** fix bad overwrite of ignore patterns ([8d03799][302])

<br />

## @-xun/scripts[@1.4.0][303] (2024-06-01)

### ✨ Features

- **src:** implement "dev" script ([4eeba00][304])

### ⚙️ Build System

- **package:** use real path to devdep version of xscripts ([99d5786][305])

<br />

### 🏗️ Patch @-xun/scripts[@1.4.1][306] (2024-06-02)

#### 🪄 Fixes

- **src:** pass arbitrary args to downstream executable ([4b94a07][307])

#### ⚙️ Build System

- **package:** update "start" script to ensure arbitrary args are not erroneously parsed ([a8ddaa5][308])

<br />

## @-xun/scripts[@1.3.0][309] (2024-06-01)

### ✨ Features

- **src:** implement "start" script ([cf66045][310])

### 🪄 Fixes

- **lib:** add type safe guards for output properties when using runWithInheritedIo ([b26a175][311])
- **package:** add workaround for npx being unable to deal with this type of recursion ([b999593][312])
- **src:** do not inherit IO when executing "clean" script ([380c055][313])
- **src:** execute husky post-checkout hook if available ([f0b3b8c][314])

<br />

## @-xun/scripts[@1.2.0][315] (2024-05-31)

### ✨ Features

- Implement "prepare" script ([6426d70][316])

<br />

## @-xun/scripts[@1.1.0][317] (2024-05-31)

### ✨ Features

- Implement "list-tasks" script ([ac5a9ba][318])

<br />

## @-xun/scripts[@1.0.0][319] (2024-05-31)

### ✨ Features

- **src:** implement "clean" script ([89d81a3][320])

### ⚙️ Build System

- **package:** update build scripts ([589fcb0][321])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.29.2...@-xun/scripts@1.30.0
[4]: https://github.com/Xunnamius/xscripts/commit/3710988e3577a60357c780a19fa9a28e0dd58332
[5]: https://github.com/Xunnamius/xscripts/commit/ca47d93f4c507108c23cfd2e613ff758fd56d1c9
[6]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.30.2...@-xun/scripts@1.30.3
[7]: https://github.com/Xunnamius/xscripts/commit/b923d6daa24240ab9930bade670683e950e36e30
[8]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.30.1...@-xun/scripts@1.30.2
[9]: https://github.com/Xunnamius/xscripts/commit/98a868e21d0126772abbbb69bb64a9b56da229ac
[10]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.30.0...@-xun/scripts@1.30.1
[11]: https://github.com/Xunnamius/xscripts/commit/89eebe76ad675b35907b3379b29bfde27fd5a5b8
[12]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.28.0...@-xun/scripts@1.29.0
[13]: https://github.com/Xunnamius/xscripts/commit/002431f7c880bdd55c6cc71f7660dec8ba84966f
[14]: https://github.com/Xunnamius/xscripts/commit/65b8c0b01acf9c60fc3cb5a1904832fd99f95329
[15]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.29.1...@-xun/scripts@1.29.2
[16]: https://github.com/Xunnamius/xscripts/commit/d89809b1811fb99fb24fbfe0c6960a0e087bcc27
[17]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.29.0...@-xun/scripts@1.29.1
[18]: https://github.com/Xunnamius/xscripts/commit/8feaaa78a9f524f02e4cc9204ef84f329d31ab94
[19]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.27.0...@-xun/scripts@1.28.0
[20]: https://github.com/Xunnamius/xscripts/commit/c3fc1264932eb8224289ef973366fc0cb5435f59
[21]: https://github.com/Xunnamius/xscripts/commit/71b17c8574fe55da23831cd1be11457e7cb4bdb5
[22]: https://github.com/Xunnamius/xscripts/commit/11b585ddfa1954ce0380fa64b5c4120773dc55d2
[23]: https://github.com/Xunnamius/xscripts/commit/cf5b25b85bacd164e57f5e26863cf6c1581d8c68
[24]: https://github.com/Xunnamius/xscripts/commit/55ee62d4a379fc1aae845c6847adc0a9c8a8db6f
[25]: https://github.com/Xunnamius/xscripts/commit/56b706a90fbab254ee74509f45cf632157a0cfdc
[26]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.26.0...@-xun/scripts@1.27.0
[27]: https://github.com/Xunnamius/xscripts/commit/1a69887158a00db7133cf0a2eee85146ec6d1399
[28]: https://github.com/Xunnamius/xscripts/commit/1262cc85e615a3e0ac7766099e166aeae6a1e3e1
[29]: https://github.com/Xunnamius/xscripts/commit/645473d084f3d4033afe39d72802b0a2a89e112d
[30]: https://github.com/Xunnamius/xscripts/commit/c5c742e64b9a56894866c0110cb3161ae3321b0f
[31]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.25.0...@-xun/scripts@1.26.0
[32]: https://github.com/Xunnamius/xscripts/commit/44be676ca04207bd17553941d367abda2325c0ee
[33]: https://github.com/Xunnamius/xscripts/commit/3323fc3580b663f00518e7ca7bd9f52a7e50b80f
[34]: https://github.com/Xunnamius/xscripts/commit/8a67d707c540f5e23d6f3ad8f6efe2d79cb35361
[35]: https://github.com/Xunnamius/xscripts/commit/09373fa4830377ba42824797eb0791655da0fa34
[36]: https://github.com/Xunnamius/xscripts/commit/b3e95e72ccfdce365933aeb27afe5a8bb64bdec5
[37]: https://github.com/Xunnamius/xscripts/commit/d27007d1ebda295a05b6ed116a0421d7610aff42
[38]: https://github.com/Xunnamius/xscripts/commit/998218d7d3f3a654dcdd33e2e1c5ce033927774e
[39]: https://github.com/Xunnamius/xscripts/commit/9087086d6944cb6a847f325142753a63be2ca30c
[40]: https://github.com/Xunnamius/xscripts/commit/36016b10da47bb5799d3e558831a96eda878c10e
[41]: https://github.com/Xunnamius/xscripts/commit/86fca5843564773f9e0ec53c454c72109befbec6
[42]: https://github.com/Xunnamius/xscripts/commit/bb6bde93dffe0a8f565dace3bfc970b52ff88c79
[43]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.24.0...@-xun/scripts@1.25.0
[44]: https://github.com/Xunnamius/xscripts/commit/31c7bbb45d313ca9a1edaf9c682da438fde76830
[45]: https://github.com/Xunnamius/xscripts/commit/4f807cf260af20ae6a60138dae1e4b7204eed570
[46]: https://github.com/Xunnamius/xscripts/commit/d22cee3b292da80ab45e4513bba3b2157fa72245
[47]: https://github.com/Xunnamius/xscripts/commit/9045cd704121600e07d84839c3e23b407e184f6b
[48]: https://github.com/Xunnamius/xscripts/commit/e7c4b6e1bc996d5a975a497cd3ca0e4774a39a85
[49]: https://github.com/Xunnamius/xscripts/commit/576dd649da2775841e9a2e985b02e564a2be1caa
[50]: https://github.com/Xunnamius/xscripts/commit/ffcad30844a8223d29369bb5303468f1534176a4
[51]: https://github.com/Xunnamius/xscripts/commit/4059ed7d534afa9b74bd93f761f92e5d5996990a
[52]: https://github.com/Xunnamius/xscripts/commit/5ea7f8a45c16bd07ff0f5bcdc8e4f6fa82908df0
[53]: https://github.com/Xunnamius/xscripts/commit/d4d37566ea09a69679ec61da20c3a5aca9a8720f
[54]: https://github.com/Xunnamius/xscripts/commit/d91572787be84252d2b37f3f6c1fa72e7528c62b
[55]: https://github.com/Xunnamius/xscripts/commit/5d61e8783923775def0a0fcd1fc9fd57e65ab184
[56]: https://github.com/Xunnamius/xscripts/commit/1d0dee8044cdd8cd88c6d8ccfe10c95c7b6a36bd
[57]: https://github.com/Xunnamius/xscripts/commit/4e853808704a86d2f207aaa7cc0b5531cb05ad00
[58]: https://github.com/Xunnamius/xscripts/commit/81ba7bcaea006b1094131d0f0bb3c3dd0828cf13
[59]: https://github.com/Xunnamius/xscripts/commit/128e83acfd2dd1f5b3ffca6b1feb7892a2fa38b3
[60]: https://github.com/Xunnamius/xscripts/commit/c4016a8318afb13d6fd6ff9b5bf58a30231e5002
[61]: https://github.com/Xunnamius/xscripts/commit/0f4c7b1e678f56ff0cb5112c8858f0da57254d91
[62]: https://github.com/Xunnamius/xscripts/commit/1894d80efed02438233672074116dfa06e0c91f7
[63]: https://github.com/Xunnamius/xscripts/commit/351ee50466956e8fc31eeaf1de79418f8ab04c16
[64]: https://github.com/Xunnamius/xscripts/commit/74ab5d91a21dd66aa7a0412fb3ce2ad89de3c1bc
[65]: https://github.com/Xunnamius/xscripts/commit/18dbad0840fc762fab169d38d606afd41316dd1b
[66]: https://github.com/Xunnamius/xscripts/commit/8e82ac18456a552cdf55fe75be9e7e11f958aa65
[67]: https://github.com/Xunnamius/xscripts/commit/f323a6ad34c69bca84a2618598f0801f26a0df82
[68]: https://github.com/Xunnamius/xscripts/commit/4a6e25433385507c2d326f40c56093bcd54b171d
[69]: https://github.com/Xunnamius/xscripts/commit/4e3cdc092ad2bf0f716a41ff16e2d6fb2267cc5a
[70]: https://github.com/Xunnamius/xscripts/commit/5e0058708501603a5ed40fbd3934a2d01842c3fa
[71]: https://github.com/Xunnamius/xscripts/commit/9b8b41a72605c3beabdf11c9155733bf1eb99ec0
[72]: https://github.com/Xunnamius/xscripts/commit/e22403c276eda0e6281085198933d6df3a1dcc90
[73]: https://github.com/Xunnamius/xscripts/commit/c34a5499cb58878fdaa42e83063e1c36a0582e06
[74]: https://github.com/Xunnamius/xscripts/commit/43da8828df733ab8fd835d1a40c2a2c0c98fdd9b
[75]: https://github.com/Xunnamius/xscripts/commit/33af2bc79370b38bc94633617180bcd283b5a0bf
[76]: https://github.com/Xunnamius/xscripts/commit/c1ac811d2d7500a4b665d4d1531b5d51a9da2c19
[77]: https://github.com/Xunnamius/xscripts/commit/901d85357b06b854b6c37a34ac2b37948376660c
[78]: https://github.com/Xunnamius/xscripts/commit/1fb8568e874687f25f13bcd31db7e94a8eb43282
[79]: https://github.com/Xunnamius/xscripts/commit/3373208a68bb1c11e75e68b0c53ff04cb0446035
[80]: https://github.com/Xunnamius/xscripts/commit/8cbc4e40c61d48b61ab4ee2c34f679f6cd2ed0ab
[81]: https://github.com/Xunnamius/xscripts/commit/b1249edd6124c7f86bc60288861d61854e30ff3d
[82]: https://github.com/Xunnamius/xscripts/commit/5eb9deff748ee6e4af3c57a16f6370d16bb97bfb
[83]: https://github.com/Xunnamius/xscripts/commit/b928e8a92064bcc4a0ef17b45eb6af40654208f2
[84]: https://github.com/Xunnamius/xscripts/commit/45bcd8c56f38ccbc330b4088c6f8a5812714611a
[85]: https://github.com/Xunnamius/xscripts/commit/f50abaf0309ca2e0e0f21b429683c8369e5e2210
[86]: https://github.com/Xunnamius/xscripts/commit/98a1dd7eacac964a7fbab47ded92c33173383f11
[87]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.23.0...@-xun/scripts@1.24.0
[88]: https://github.com/Xunnamius/xscripts/commit/69f2dc0d929150f46c3fc4990a37338111d1a4f6
[89]: https://github.com/Xunnamius/xscripts/commit/8dc4a962ae457c82585e3c34d1ee02c731aedec3
[90]: https://github.com/Xunnamius/xscripts/commit/e3fa185ffa33d801bc1f7d9faeda1d40eaa8a117
[91]: https://github.com/Xunnamius/xscripts/commit/89b57c4e38f74970a301e6261acdfeca27982d44
[92]: https://github.com/Xunnamius/xscripts/commit/b8b82d942c478673b10b2d071802c73461c42961
[93]: https://github.com/Xunnamius/xscripts/commit/69ebf4a549a7ce9848c19c27035d77473f5707a8
[94]: https://github.com/Xunnamius/xscripts/commit/556f17ec5b274c0bf08d364905a99b8e27bfff63
[95]: https://github.com/Xunnamius/xscripts/commit/74d58d66649401b6e8f17e53076ea4972bc1d888
[96]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.22.0...@-xun/scripts@1.23.0
[97]: https://github.com/Xunnamius/xscripts/commit/1bdceca9e23b28bffb12b84013ba95ef54c5ac81
[98]: https://github.com/Xunnamius/xscripts/commit/a1d36577666cddfce19970975144e085c7a0c353
[99]: https://github.com/Xunnamius/xscripts/commit/fa2a97f118389cdaf4227a07a9bf5a5bc4cc2dfe
[100]: https://github.com/Xunnamius/xscripts/commit/dc47cfbbdc869aa2d149924c72bb5414b0f46f07
[101]: https://github.com/Xunnamius/xscripts/commit/ebb4fb597a47fa0d748735e3b0a2832434b7a637
[102]: https://github.com/Xunnamius/xscripts/commit/ccc82b396baeb2445174d0c8b9da97522cb66066
[103]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.21.0...@-xun/scripts@1.22.0
[104]: https://github.com/Xunnamius/xscripts/commit/8bdf28b7ba33aae68f04ee62f6b2d72d39c62012
[105]: https://github.com/Xunnamius/xscripts/commit/0c3f85c0e926cff1645b6a329edcc6304b8ac189
[106]: https://github.com/Xunnamius/xscripts/commit/531d3eae3ffb883e69799688a89c28e55cdcf177
[107]: https://github.com/Xunnamius/xscripts/commit/a7a66d9ffeecb4ba1d8b8519a97fc10f1fea72a6
[108]: https://github.com/Xunnamius/xscripts/commit/e37006ee62471c2cf178a89023e34a9b691b7574
[109]: https://github.com/Xunnamius/xscripts/commit/349cf201e0cbfdc2b925690744b4ff6737a008b3
[110]: https://github.com/Xunnamius/xscripts/commit/d8b7442d320a4c4efbe03cb0a502ad337211caee
[111]: https://github.com/Xunnamius/xscripts/commit/c7fe4109820fb109db7a0ea07985089d1b488535
[112]: https://github.com/Xunnamius/xscripts/commit/2c40974df517c6226d351e0ab9d8f66675792272
[113]: https://github.com/Xunnamius/xscripts/commit/f5fb1bcbafb797b2c7d88655895e185b03f2e1db
[114]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.8...@-xun/scripts@1.21.0
[115]: https://github.com/Xunnamius/xscripts/commit/7ad96c5edd2c8a6275e94cde9a1c5721cdd88dda
[116]: https://github.com/Xunnamius/xscripts/commit/d54cfa03ffcfc52779cb283802e447df42a0cfed
[117]: https://github.com/Xunnamius/xscripts/commit/646aa3cee846f4a6169ae05c91d5b4762e1c290e
[118]: https://github.com/Xunnamius/xscripts/commit/a08c9f1fd5448c918aa65f09f1842dc46162fb8a
[119]: https://github.com/Xunnamius/xscripts/commit/cd82265731cd411d9b374c3bbe3c642c93a053fe
[120]: https://github.com/Xunnamius/xscripts/commit/94a2253a2888d5d2b34290d7b0180fdee2a2a104
[121]: https://github.com/Xunnamius/xscripts/commit/db0c6d71e780edd2d6ab295abc136ac3fa3979d7
[122]: https://github.com/Xunnamius/xscripts/commit/7dcbf56f1d89bddc9ad635e47a6f27a13274e799
[123]: https://github.com/Xunnamius/xscripts/commit/e334962ae950f510b35d09bb5d6ed6326a586de0
[124]: https://github.com/Xunnamius/xscripts/commit/8833e0a06f0733e89b4496719aa8b71050783339
[125]: https://github.com/Xunnamius/xscripts/commit/5070ab49e00314a91a6c87aa1715846939531023
[126]: https://github.com/Xunnamius/xscripts/commit/1eff5cb11f90533bd4ceeca8c269e8a4e5b998c0
[127]: https://github.com/Xunnamius/xscripts/commit/0eb7fd3b75fe765781b5ca482abbd38e3b0a1a65
[128]: https://github.com/Xunnamius/xscripts/commit/8d69310b68b2362d815e1e1e1d76d5688d6b46ff
[129]: https://github.com/Xunnamius/xscripts/commit/e169f47888b112eda08cb8518b69ba3bfd9f2b26
[130]: https://github.com/Xunnamius/xscripts/commit/e7b857926d572780c951aa1161133186d2cf1784
[131]: https://github.com/Xunnamius/xscripts/commit/2036da0350a573c7ae9179d6cdd794e91935c9ae
[132]: https://github.com/Xunnamius/xscripts/commit/a35f4c0e581dff4a7667277284052a7fa71b672e
[133]: https://github.com/Xunnamius/xscripts/commit/3f1a5a9a6c7ce7cd8aba5c521fb95c6beed3394e
[134]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.19.1...@-xun/scripts@1.20.0
[135]: https://github.com/Xunnamius/xscripts/commit/d84b35ff2b28040920fb62a405e29f2e54d29d4f
[136]: https://github.com/Xunnamius/xscripts/commit/6ef0123a0d9d1668ce567cf526e04951a3d25dd1
[137]: https://github.com/Xunnamius/xscripts/commit/8cf99a986ddf05e8d2a740d58e9ccdf5a0675e43
[138]: https://github.com/Xunnamius/xscripts/commit/3dd5d787a3de11f375bb9ca815840400fbe8cdf3
[139]: https://github.com/Xunnamius/xscripts/commit/5c3ed7323a7bf5f3dd1a3d7dd73c8511ef04ff82
[140]: https://github.com/Xunnamius/xscripts/commit/c912b0992a3033ed5d978d7f5c139569f2bd0608
[141]: https://github.com/Xunnamius/xscripts/commit/9cb2d72efc872c4003dabc8c68856b72e8f7c3a4
[142]: https://github.com/Xunnamius/xscripts/commit/ce035004c4bea999ba5cf583c16fc1dbc8a232a6
[143]: https://github.com/Xunnamius/xscripts/commit/22f2f41be642d3d94fc4e5a50014a61ab68c50b4
[144]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.7...@-xun/scripts@1.20.8
[145]: https://github.com/Xunnamius/xscripts/commit/ce701f3d57da9f82ee0036320bc62d5c51233011
[146]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.6...@-xun/scripts@1.20.7
[147]: https://github.com/Xunnamius/xscripts/commit/3c48ae1560cd1d689340739f550f4feb18754e81
[148]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.5...@-xun/scripts@1.20.6
[149]: https://github.com/Xunnamius/xscripts/commit/76992d930b92919b8ab95f195cec98ddb91fb390
[150]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.4...@-xun/scripts@1.20.5
[151]: https://github.com/Xunnamius/xscripts/commit/0864f9221ff2134311ba716cc2eca83aa044fa12
[152]: https://github.com/Xunnamius/xscripts/commit/ff3853fa7835e9b2f89e2a9a846db76d6b2dd4a5
[153]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.3...@-xun/scripts@1.20.4
[154]: https://github.com/Xunnamius/xscripts/commit/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa
[155]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.2...@-xun/scripts@1.20.3
[156]: https://github.com/Xunnamius/xscripts/commit/dd265b47f6ff85a27a80867a60ffbc8aa87e15de
[157]: https://github.com/Xunnamius/xscripts/commit/cf21d7d56b8d28fe14e87a975ec151c9f16e4717
[158]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.1...@-xun/scripts@1.20.2
[159]: https://github.com/Xunnamius/xscripts/commit/bc2a56b8e3bb237caba1768c1673d3848d97e0d6
[160]: https://github.com/Xunnamius/xscripts/commit/52115470ce25670c0355bba2653789a6df8b3aaa
[161]: https://github.com/Xunnamius/xscripts/commit/8735f612072b02c3af08054d8f858b5764aab92d
[162]: https://github.com/Xunnamius/xscripts/commit/a86884fbde354ac7d2cbd5c355d67b536e90f3e6
[163]: https://github.com/Xunnamius/xscripts/commit/b23b12b64b968429652269db3ae710f79c3ce356
[164]: https://github.com/Xunnamius/xscripts/commit/8b54237af01ef168984d9b306063e60e7914c936
[165]: https://github.com/Xunnamius/xscripts/commit/571968164a4defe8eefdb81341cd7a0664079a66
[166]: https://github.com/Xunnamius/xscripts/commit/f2cb8fd3a8ad8a0ea642b34a1cca9159bb51b101
[167]: https://github.com/Xunnamius/xscripts/commit/3008cde37d490c51b2c1ab549ad4faa847d8266d
[168]: https://github.com/Xunnamius/xscripts/commit/25e7a3b93bd0cfd32df2aaaa83ee055bc7ba1c92
[169]: https://github.com/Xunnamius/xscripts/commit/904c9ac9bb6b4b1d3b047124e749c9f33f8878c9
[170]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.20.0...@-xun/scripts@1.20.1
[171]: https://github.com/Xunnamius/xscripts/commit/a2ea7df939d4f1e11e3904c653f35f87abe65651
[172]: https://github.com/Xunnamius/xscripts/commit/35876a1903ae9180624905e176f7c4b2e1d870a1
[173]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.18.0...@-xun/scripts@1.19.0
[174]: https://github.com/Xunnamius/xscripts/commit/0c199f69971688205b1ee027dce36c2bc6ab8a04
[175]: https://github.com/Xunnamius/xscripts/commit/587a354329e46ca03f056ca1414915145928736c
[176]: https://github.com/Xunnamius/xscripts/commit/92bb25fe5f8022271ae03ee56e18377ad02e392b
[177]: https://github.com/Xunnamius/xscripts/commit/909949d58e2ddecf4ad606fe0dd9525ec540a8fb
[178]: https://github.com/Xunnamius/xscripts/commit/59dd7523276ab48868124e8f76f06784bc59f794
[179]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.19.0...@-xun/scripts@1.19.1
[180]: https://github.com/Xunnamius/xscripts/commit/d2011645a568e76bdf61dde14dd0e15dbce243dc
[181]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.17.0...@-xun/scripts@1.18.0
[182]: https://github.com/Xunnamius/xscripts/commit/6c7ae27d3d93d36e7cbcae873b8717d252cf6670
[183]: https://github.com/Xunnamius/xscripts/commit/e833523e6085950c3477ca6e44ae92ef7b1fad46
[184]: https://github.com/Xunnamius/xscripts/commit/0383586f6ccbb0bc503df636f515d19618548f92
[185]: https://github.com/Xunnamius/xscripts/commit/3a3489c43d2ce10ac752d70ab23066bd3477a675
[186]: mailto:tsc@5.6-beta
[187]: https://github.com/Xunnamius/xscripts/commit/4e7509611f72d2c953572dbc67bb51aabf2304d6
[188]: https://github.com/Xunnamius/xscripts/commit/f6515ea793a72cfd42cb6d3f74675b2ae3a9b2e1
[189]: https://github.com/Xunnamius/xscripts/commit/01375f77f74bfaf0b38de5bdd30d162461aa6106
[190]: https://github.com/Xunnamius/xscripts/commit/df6116b1c5ad4c0f7c3152cc254d943a7b9e67e7
[191]: https://github.com/Xunnamius/xscripts/commit/8d7152112e4927f566e048c6b0be7dfce4a6c430
[192]: https://github.com/Xunnamius/xscripts/commit/d9b4b80db15e6104a2a3ab7325996a08a350ea6d
[193]: https://github.com/Xunnamius/xscripts/commit/64b7309fcb28c1214f1edcc8319960c1c94f72b0
[194]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.16.1...@-xun/scripts@1.17.0
[195]: https://github.com/Xunnamius/xscripts/commit/63354c710f8cfe21d274c7083eecd28da66c57c9
[196]: https://github.com/Xunnamius/xscripts/commit/369d9690614b09b8a2a9efe4321a2786a60e2f20
[197]: https://github.com/Xunnamius/xscripts/commit/609fca8cde508ecdb6c74ff8d1884821afdd5eb3
[198]: https://github.com/Xunnamius/xscripts/commit/e55a88e728a9c4ccbd38648e85328ab563add014
[199]: https://github.com/Xunnamius/xscripts/commit/b56fd666cfcccbc7d941df7afb6fcfc74ec0ae56
[200]: https://github.com/Xunnamius/xscripts/commit/323579d026f46d2d0f70aa44440543eecbc7b4e2
[201]: https://github.com/Xunnamius/xscripts/commit/8609db712c80439ee26966b638b8d6a9cb6e0d59
[202]: https://github.com/Xunnamius/xscripts/commit/52763c5b795e9ee0485e9a20a4cb5264eae0ef3c
[203]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.15.0...@-xun/scripts@1.16.0
[204]: https://github.com/Xunnamius/xscripts/commit/1153f424ae97b339f1ae345269663ddc5d3458d7
[205]: https://github.com/Xunnamius/xscripts/commit/12ee54a21f0004eb568763507540157371aa06be
[206]: https://github.com/Xunnamius/xscripts/commit/0543cff5d6e50a688365bf314837b54342106327
[207]: https://github.com/Xunnamius/xscripts/commit/346b4ac5d27ea045cd037c4987401786f7fa572b
[208]: https://github.com/Xunnamius/xscripts/commit/f42f4ab7c83a05fed253475de7bf2df4ce53d48f
[209]: https://github.com/Xunnamius/xscripts/commit/e596e5bc36b9ed024f8c524cd6d55f15b813bcfc
[210]: https://github.com/Xunnamius/xscripts/commit/d96ae1df1940941fbdf491e0b36c200574179bea
[211]: https://github.com/Xunnamius/xscripts/commit/c9e254a5eece3c3ed51348d28897ed354725643f
[212]: https://github.com/Xunnamius/xscripts/commit/060ef01a19f9a5022dcc855291e04ea6f8013c09
[213]: https://github.com/Xunnamius/xscripts/commit/ea6aafff5d49f6acd8cac65b3c92e6cfd940e4b5
[214]: https://github.com/Xunnamius/xscripts/commit/eb5631b6a316d808bb88928e27fe88ee818d230b
[215]: https://github.com/Xunnamius/xscripts/commit/b72401ad18cead8a6d8571d8e35a6235c23b5381
[216]: https://github.com/Xunnamius/xscripts/commit/7c1e7f14e28518285bc554c730f7eaea933a2e52
[217]: https://github.com/Xunnamius/xscripts/commit/d3301ca5284ba96b750be48f12ecd3c821d27654
[218]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.16.0...@-xun/scripts@1.16.1
[219]: https://github.com/Xunnamius/xscripts/commit/8f1d25d7356419160a65f4a4dd764a6192df2f26
[220]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.14.0...@-xun/scripts@1.15.0
[221]: https://github.com/Xunnamius/xscripts/commit/8554e1a4fd20b72d6b917f92cdb9e084b4086b25
[222]: https://github.com/Xunnamius/xscripts/commit/b66572376dd63858df091755bb1eb184b56f2c7b
[223]: https://github.com/Xunnamius/xscripts/commit/49a3453b25941eecf6a498aa1462aed83f71eaa1
[224]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.13.0...@-xun/scripts@1.14.0
[225]: https://github.com/Xunnamius/xscripts/commit/a5075305e5d9a3cf5451ca5c156c3ffe307f7018
[226]: https://github.com/Xunnamius/xscripts/commit/489e75a7916d4b77b6a37f6b557cbbd4b7c15e5e
[227]: https://github.com/Xunnamius/xscripts/commit/1b6c72ae8007c801207547a74de598d38b769968
[228]: https://github.com/Xunnamius/xscripts/commit/82c2b0fd8a9bc35bda01c3f48001032bd3ba66e2
[229]: https://github.com/Xunnamius/xscripts/commit/68c55821991d1eaf821dfe603cfee1a9aca83d4f
[230]: https://github.com/Xunnamius/xscripts/commit/2ed43444661b4fba89c20bb5f2a0341faf535a9b
[231]: https://github.com/Xunnamius/xscripts/commit/cafeb73773b2e08137d9c6d7f7432802cc9d3b88
[232]: https://github.com/Xunnamius/xscripts/commit/f08250c17077cff70cdf722d2e9c3b16d3841ebf
[233]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.12.0...@-xun/scripts@1.13.0
[234]: https://github.com/Xunnamius/xscripts/commit/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7
[235]: https://github.com/Xunnamius/xscripts/commit/133634118118c7cff04eaaf7a65ead7c80329234
[236]: https://github.com/Xunnamius/xscripts/commit/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7
[237]: https://github.com/Xunnamius/xscripts/commit/c721fed5363109fddbf7c8e5e7dc98c33e023e38
[238]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.11.0...@-xun/scripts@1.12.0
[239]: https://github.com/Xunnamius/xscripts/commit/b64412cd043877da93fa252bad0325bda73ea60c
[240]: https://github.com/Xunnamius/xscripts/commit/feabe67a00aa2c970c3591110ec871f56626998f
[241]: https://github.com/Xunnamius/xscripts/commit/534f3988d4d436fb8136bf60d56498c7b02941ea
[242]: https://github.com/Xunnamius/xscripts/commit/8d4bb6d52de509c2ad8c5c82c8953d51e17c2d85
[243]: https://github.com/Xunnamius/xscripts/commit/7364616ea349761591231a3547bd697ec67ed34b
[244]: https://github.com/Xunnamius/xscripts/commit/2f11281f9d3c07b1a37440cbdbad51deeea7d503
[245]: https://github.com/Xunnamius/xscripts/commit/9348ebba5102d85115a9e443c38032661a9fc0ed
[246]: https://github.com/Xunnamius/xscripts/commit/626ee5aadb360db6d521683dff0f35269a736fc0
[247]: https://github.com/Xunnamius/xscripts/commit/65e433056c8e6800d00202fe709d868d7c4713fb
[248]: https://github.com/Xunnamius/xscripts/commit/ee5cf1030a76a5f0b2793d58a9db52d1ebc8a791
[249]: https://github.com/Xunnamius/xscripts/commit/b9b106aff4ff729fb1f8e70efe295ba058a50cfb
[250]: https://github.com/Xunnamius/xscripts/commit/c1a4b9cb21d1c3e6941d6fbd6108edc694c2d4ed
[251]: https://github.com/Xunnamius/xscripts/commit/5b11c68aebc8099007ffcf50444707165939e061
[252]: https://github.com/Xunnamius/xscripts/commit/99c7b3396ff73868208060410f7430538f6d48d6
[253]: https://github.com/Xunnamius/xscripts/commit/ddd9192c05110fca3ae0d93bac276426932269ef
[254]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.10.1...@-xun/scripts@1.11.0
[255]: https://github.com/Xunnamius/xscripts/commit/618ce1a1ae9132dbb54dc52c60c96aea17897b82
[256]: https://github.com/Xunnamius/xscripts/commit/d74f099ac798fd0c925ea4aad0b1860b8a8a741f
[257]: https://github.com/Xunnamius/xscripts/commit/0f4dd160eb1181306899031186b4a3c7e64d936c
[258]: https://github.com/Xunnamius/xscripts/commit/2cd56d132e3cd7318744839cbf119b126cc35c98
[259]: https://github.com/Xunnamius/xscripts/commit/9764967b4ca5aab46b32317ddb14bc4e843d8674
[260]: https://github.com/Xunnamius/xscripts/commit/fd86f3f321889f759eda02880982117b5a0aba16
[261]: https://github.com/Xunnamius/xscripts/commit/e295a0270f8ae743771d79966cccb3fdb14f19fd
[262]: https://github.com/Xunnamius/xscripts/commit/d290ba57054479eb873d3cdc785db602432fca09
[263]: https://github.com/Xunnamius/xscripts/commit/4ea8aa453186568651849102a2ade4df2f6c5cee
[264]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.9.0...@-xun/scripts@1.10.0
[265]: https://github.com/Xunnamius/xscripts/commit/813b7580971553cde14b4f278f31af7353384e85
[266]: https://github.com/Xunnamius/xscripts/commit/42af69ecc8f70e6c55eceeda802bce1752f81bfb
[267]: https://github.com/Xunnamius/xscripts/commit/ae46adf477f55440bb18e627ca1674d6d80be7fd
[268]: https://github.com/Xunnamius/xscripts/commit/6575d493c2c0ff291a3bd7bf4b595198c46c0c70
[269]: https://github.com/Xunnamius/xscripts/commit/7d33dfe2ea50a0fbf45641ef997ce2b7d0265aca
[270]: https://github.com/Xunnamius/xscripts/commit/d535b785c9d45c87b29a5fbe5698c6021067570b
[271]: https://github.com/Xunnamius/xscripts/commit/1b65f4667e138907ac8a1b90f06937f5fa4eb1b9
[272]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.10.0...@-xun/scripts@1.10.1
[273]: https://github.com/Xunnamius/xscripts/commit/483f03697f1cf01847759fa5c1cf61f5af578a3f
[274]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.8.0...@-xun/scripts@1.9.0
[275]: https://github.com/Xunnamius/xscripts/commit/f47742b0bca31b054ec83d5b01089715e9925e39
[276]: https://github.com/Xunnamius/xscripts/commit/4f280dc3af5bf633259d80cc8733fae31c903e04
[277]: https://github.com/Xunnamius/xscripts/commit/159d771c90a65e05194cde9b8aec2478be7b97ff
[278]: https://github.com/Xunnamius/xscripts/commit/506bf2dc5317ec891efa5e8eb9ed91235794c9f7
[279]: https://github.com/Xunnamius/xscripts/commit/f7e65c34cd7088fa866530b60de4db3d1f77453c
[280]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.7.0...@-xun/scripts@1.8.0
[281]: https://github.com/Xunnamius/xscripts/commit/c7b7623d68bde02438cbd8cbc80302079356914d
[282]: https://github.com/Xunnamius/xscripts/commit/847cc63e9965c6c970e63d351fe8388ef666a1b6
[283]: https://github.com/Xunnamius/xscripts/commit/fd210c55c4aff0ad663381a67b8b591dffc2a49c
[284]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.6.0...@-xun/scripts@1.7.0
[285]: https://github.com/Xunnamius/xscripts/commit/7824c25d1d5db8ab824960b502c41e54a1f9ee03
[286]: https://github.com/Xunnamius/xscripts/commit/b4c296eb75a142ede16da32a997e9999dd8074f3
[287]: https://github.com/Xunnamius/xscripts/commit/005e378059ba0b3181031ff938854f54898e0437
[288]: https://github.com/Xunnamius/xscripts/commit/9e4ae592d211ae39bacdc3f665b3078e69c73062
[289]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.5.0...@-xun/scripts@1.6.0
[290]: https://github.com/Xunnamius/xscripts/commit/62e673b1ab8679e586b1b4337fe20c537c408fff
[291]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.4.1...@-xun/scripts@1.5.0
[292]: https://github.com/Xunnamius/xscripts/commit/f15a14d33b9ccaf514a7f6ed0417cb9f5a42c99d
[293]: https://github.com/Xunnamius/xscripts/commit/c775d6e3564c8772dde082d6ef243a56da79c586
[294]: https://github.com/Xunnamius/xscripts/commit/8181e74d4a9020b45fa0182f3f7136b48e4a6721
[295]: https://github.com/Xunnamius/xscripts/commit/17d53c3b83fc6ed799b5b2ab1da5feefe4e37018
[296]: https://github.com/Xunnamius/xscripts/commit/537df70bd21a7b18b1ccc64e83ff6db63440a322
[297]: https://github.com/Xunnamius/xscripts/commit/fd903a41ad88342ebd1896ffe3e46a6b81583711
[298]: https://github.com/Xunnamius/xscripts/commit/4eabfb57d1addf0a2e8994c11b59bc122138b8ce
[299]: https://github.com/Xunnamius/xscripts/commit/8e11d6670bec0c605d781ecec695de4d6af1edd2
[300]: https://github.com/Xunnamius/xscripts/commit/2f5e8e9fc2a1983f0b259c70f7be957f80c8c3c1
[301]: https://github.com/Xunnamius/xscripts/commit/b57a6be3f30c8c0a2692b256135acbd661d0e92b
[302]: https://github.com/Xunnamius/xscripts/commit/8d03799cbd574e0eed0667f1d91827116da6ff15
[303]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.3.0...@-xun/scripts@1.4.0
[304]: https://github.com/Xunnamius/xscripts/commit/4eeba0093c58c5ae075542203854b4a3add2907a
[305]: https://github.com/Xunnamius/xscripts/commit/99d57864cb024e23115bc3b9c4b1529d2f3d9bf5
[306]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.4.0...@-xun/scripts@1.4.1
[307]: https://github.com/Xunnamius/xscripts/commit/4b94a07feff53f35ff23d5c0456edd00b2e9f180
[308]: https://github.com/Xunnamius/xscripts/commit/a8ddaa595b00d4730cdce60f5340175b3e9afbcc
[309]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.2.0...@-xun/scripts@1.3.0
[310]: https://github.com/Xunnamius/xscripts/commit/cf660452df6ac9781bd9b61d4cc225e926cd4e15
[311]: https://github.com/Xunnamius/xscripts/commit/b26a175f616e9c1fa333a0b8858507439449a32e
[312]: https://github.com/Xunnamius/xscripts/commit/b999593e14846c8f87949286cd995e7ef92177a1
[313]: https://github.com/Xunnamius/xscripts/commit/380c055b2920c8b96b65dc89b97b6497f996c452
[314]: https://github.com/Xunnamius/xscripts/commit/f0b3b8ce97a389c4656d37f4745eaedb7d684f42
[315]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.1.0...@-xun/scripts@1.2.0
[316]: https://github.com/Xunnamius/xscripts/commit/6426d70a844a1c3242d719bd648b2a5caf61a12c
[317]: https://github.com/Xunnamius/xscripts/compare/@-xun/scripts@1.0.0...@-xun/scripts@1.1.0
[318]: https://github.com/Xunnamius/xscripts/commit/ac5a9ba2ac77873619069cecc5a364cd09a74d43
[319]: https://github.com/Xunnamius/xscripts/compare/589fcb01d65182c25a9604c55909b2667bd1b1e0...@-xun/scripts@1.0.0
[320]: https://github.com/Xunnamius/xscripts/commit/89d81a3e405096de202bc1f6be61ab5d58fc3e1e
[321]: https://github.com/Xunnamius/xscripts/commit/589fcb01d65182c25a9604c55909b2667bd1b1e0
