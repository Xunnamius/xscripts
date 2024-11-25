[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/error](../README.md) / ErrorMessage

# Variable: ErrorMessage

> `const` **ErrorMessage**: `object`

A collection of possible error and warning messages.

## Type declaration

### specialized

> **specialized**: `object`

These are "error" messages that are not necessarily meant to be the message
of an Error instance, but are reported to the user in other ways
(such as via `rejoinder`). They may not follow the same standard
punctuation and capitalization rules as the other error messages.

### specialized.BuildOutputIntermediates()

#### Returns

`string`

### specialized.BuildOutputPartial()

#### Returns

`string`

### specialized.BuildSucceededButOutputCheckFailed()

#### Returns

`string`

### specialized.DependenciesExtraneous()

#### Parameters

• **packagesMeta**: [`string`, `string`][]

#### Returns

`string`

### specialized.DistributablesSpecifiersDependenciesMissing()

#### Parameters

• **packageSpecifiers**: [`AbsolutePath`, `string`, `string`][]

#### Returns

`string`

### specialized.DistributablesSpecifiersPointOutsideDist()

#### Parameters

• **specifiers**: `ImportSpecifier`[]

#### Returns

`string`

### specialized.DistributablesSpecifiersPointToInaccessible()

#### Parameters

• **specifiers**: `ImportSpecifier`[]

#### Returns

`string`

### specialized.ExportSubpathsPointsToInaccessible()

#### Parameters

• **subpaths**: [`string`, `string`][]

#### Returns

`string`

### specialized.OthersSpecifiersDependenciesMissing()

#### Parameters

• **packageSpecifiers**: [`AbsolutePath`, `string`, `string`][]

#### Returns

`string`

### ArgumentMustBeNonNegative()

#### Parameters

• **name**: `string`

#### Returns

`string`

### ArgumentMustNotBeFalsy()

#### Parameters

• **name**: `string`

#### Returns

`string`

### AssetRetrievalFailed()

#### Parameters

• **path**: `string`

#### Returns

`string`

### BadAdditionalChangelogSection()

#### Parameters

• **path**: `string`

#### Returns

`string`

### BadAssetContextKey()

#### Parameters

• **key**: `string`

#### Returns

`string`

### BadChangelogPatcher()

#### Parameters

• **path**: `string`

#### Returns

`string`

### BadGeneratedChangelogSection()

#### Returns

`string`

### BadPackageExportsInPackageJson()

#### Returns

`string`

### BadParameter()

#### Parameters

• **name**: `string`

#### Returns

`string`

### BadPostNpmInstallScript()

#### Parameters

• **path**: `string`

#### Returns

`string`

### BadProjectNameInPackageJson()

#### Returns

`string`

### BadSkipArgs()

#### Returns

`string`

### BuildOutputChecksFailed()

#### Returns

`string`

### CannotAccessDirectory()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CannotCopyFile()

#### Parameters

• **from**: `string`

• **to**: `string`

#### Returns

`string`

### CannotImportConventionalConfig()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CannotMakeDirectory()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CannotReadFile()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CannotRunOutsideRoot()

#### Returns

`string`

### CannotUseIgnoresWithPathsOutsideProjectRoot()

#### Returns

`string`

### CannotWriteFile()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CleanCalledWithoutForce()

#### Returns

`string`

### CliProjectHasBadBinConfig()

#### Returns

`string`

### CodecovDownloaderOnlySupportsLinux()

#### Returns

`string`

### CodecovRetrievalFailed()

#### Parameters

• **url**: `string`

#### Returns

`string`

### CommandDidNotComplete()

#### Parameters

• **command**: `string`

#### Returns

`string`

### DefaultImportFalsy()

#### Returns

`string`

### EslintPluginReturnedSomethingUnexpected()

#### Parameters

• **identifier**: `string`

#### Returns

`string`

### FailedToInstallCodecov()

#### Returns

`string`

### GuruMeditation()

#### Returns

`string`

### IgnoredArguments()

#### Parameters

• **args**: `string`[]

#### Returns

`string`

### IssuePrefixContainsIllegalCharacters()

#### Returns

`string`

### LintingFailed()

#### Returns

`string`

### MarkdownNoUndefinedReferences()

#### Returns

`string`

### MissingConfigurationFile()

#### Parameters

• **path**: `string`

#### Returns

`string`

### MissingXscriptsEnvironmentVariable()

#### Parameters

• **variableName**: `string`

#### Returns

`string`

### MonkeyPatchFailedToTake()

#### Parameters

• **filename**: `string`

#### Returns

`string`

### MultipleConfigsWhenExpectingOnlyOne()

#### Parameters

• **filename1**: `string`

• **filename2**: `string`

#### Returns

`string`

### MustChooseDeployEnvironment()

#### Returns

`string`

### OptionValueMustBeAlone()

#### Parameters

• **option**: `string`

• **noun**: `string`

#### Returns

`string`

### OptionValueMustBeAloneWhenBaseline()

#### Parameters

• **option**: `string`

• **noun**: `string`

#### Returns

`string`

### ReleaseEnvironmentValidationFailed()

#### Returns

`string`

### ReleaseRepositoryNoCurrentBranch()

#### Returns

`string`

### ReleaseRepositoryStateValidationFailed()

#### Returns

`string`

### ReleaseRunnerExecutionFailed()

#### Returns

`string`

### ReleaseScriptExecutionFailed()

#### Returns

`string`

### RequiresMinArgs()

#### Parameters

• **name**: `string`

• **min**: `number`

• **given?**: `number`

• **adjective?**: `string`

#### Returns

`string`

### TaskNotRunnable()

#### Parameters

• **id**: `string`

• **npmScripts**: `string`[]

#### Returns

`string`

### TestingFailed()

#### Returns

`string`

### TranspilationReturnedNothing()

#### Parameters

• **sourcePath**: `string`

• **outputPath**: `string`

#### Returns

`string`

### UnmatchedCommitType()

#### Parameters

• **type**: `undefined` \| `string`

• **variableName**: `string`

#### Returns

`string`

### UnsupportedCommand()

#### Returns

`string`

### WrongProjectAttributes()

#### Parameters

• **expected**: `ProjectAttribute`[]

• **actual**

• **actual.cjs**: `undefined` \| `boolean`

• **actual.cli**: `undefined` \| `boolean`

• **actual.esm**: `undefined` \| `boolean`

• **actual.hybridrepo**: `undefined` \| `boolean`

• **actual.monorepo**: `undefined` \| `boolean`

• **actual.next**: `undefined` \| `boolean`

• **actual.polyrepo**: `undefined` \| `boolean`

• **actual.private**: `undefined` \| `boolean`

• **actual.vercel**: `undefined` \| `boolean`

• **actual.webpack**: `undefined` \| `boolean`

• **preposition**: `string` = `'with'`

#### Returns

`string`

## Defined in

[src/error.ts:61](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/error.ts#L61)
