[**@-xun/scripts**](../../../README.md)

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

#### specialized.BabelCorejsDependencyMissing()

##### Parameters

###### coreJsLibraryVersion

`string`

###### CORE\_JS\_LIBRARY\_VERSION

`string`

###### cwdPackageCoreJsDependency

`undefined` | `string`

###### packageName

`undefined` | `string`

###### packageRoot

`string`

##### Returns

`string`

#### specialized.BabelCorejsEgregiousPackageJsonFileInBuildOutput()

##### Parameters

###### originalSpecifier

`string`

###### inputFilepath

`string`

##### Returns

`string`

#### specialized.BabelCorejsVersionUnresolvable()

##### Parameters

###### coreJsLibraryVersion

`string`

###### CORE\_JS\_LIBRARY\_VERSION

`string`

##### Returns

`string`

#### specialized.BuildOutputIntermediates()

##### Returns

`string`

#### specialized.BuildOutputPartial()

##### Returns

`string`

#### specialized.BuildSucceededButOutputCheckFailed()

##### Returns

`string`

#### specialized.DependenciesExtraneous()

##### Parameters

###### packagesMeta

[`string`, `string`][]

##### Returns

`string`

#### specialized.DistributablesSpecifiersDependenciesMissing()

##### Parameters

###### packageSpecifiers

[`AbsolutePath`, `string`, `string`][]

##### Returns

`string`

#### specialized.DistributablesSpecifiersPointOutsideDist()

##### Parameters

###### specifiers

`ImportSpecifier`[]

##### Returns

`string`

#### specialized.DistributablesSpecifiersPointToInaccessible()

##### Parameters

###### specifiers

`ImportSpecifier`[]

##### Returns

`string`

#### specialized.ExportSubpathsPointsToInaccessible()

##### Parameters

###### subpaths

[`string`, `string`][]

##### Returns

`string`

#### specialized.OthersSpecifiersDependenciesMissing()

##### Parameters

###### packageSpecifiers

[`AbsolutePath`, `string`, `string`][]

##### Returns

`string`

### ActionAttemptedWithADirtyRepo()

#### Parameters

##### actionNoun

`string`

#### Returns

`string`

### ArgumentMustBeNonNegative()

#### Parameters

##### name

`string`

#### Returns

`string`

### ArgumentMustNotBeFalsy()

#### Parameters

##### name

`string`

#### Returns

`string`

### AssetRetrievalFailed()

#### Parameters

##### path

`string`

#### Returns

`string`

### BabelCorejsInstalledVersionRangeNotSatisfactory()

#### Parameters

##### coreJsLibraryVersion

`string`

##### CORE\_JS\_LIBRARY\_VERSION

`string`

##### cwdPackageCoreJsDependency

`string`

##### packageName

`undefined` | `string`

##### packageRoot

`string`

#### Returns

`string`

### BabelCorejsInstalledVersionTooOld()

#### Parameters

##### coreJsLibraryVersion

`string`

##### CORE\_JS\_LIBRARY\_VERSION

`string`

##### resolvedCoreJsVersion

`string`

##### packageRoot

`string`

#### Returns

`string`

### BadAdditionalChangelogSection()

#### Parameters

##### path

`string`

#### Returns

`string`

### BadAssetContextKey()

#### Parameters

##### key

`string`

#### Returns

`string`

### BadEnginesNodeInPackageJson()

#### Parameters

##### path

`string`

#### Returns

`string`

### BadExportsInDistributablePackageJson()

#### Returns

`string`

### BadGeneratedChangelogSection()

#### Returns

`string`

### BadMjsImport()

#### Parameters

##### path

`string`

#### Returns

`string`

### BadParameter()

#### Parameters

##### name

`string`

#### Returns

`string`

### BadParserOpts()

#### Returns

`string`

### BadPostNpmInstallScript()

#### Parameters

##### path

`string`

#### Returns

`string`

### BadProjectNameInDistributablePackageJson()

#### Returns

`string`

### BadReleaseSectionPath()

#### Returns

`string`

### BadRepositoryInPackageJson()

#### Parameters

##### packageName

`string`

#### Returns

`string`

### BadSkipArgs()

#### Returns

`string`

### BadWriterOpts()

#### Returns

`string`

### BuildOutputChecksFailed()

#### Returns

`string`

### CannotAccessDirectory()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotCopyFile()

#### Parameters

##### from

`string`

##### to

`string`

#### Returns

`string`

### CannotImportConventionalConfig()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotImportTsconfig()

#### Returns

`string`

### CannotMakeDirectory()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotReadFile()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotRunInNonHybridMonorepoRootPackage()

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

##### path

`string`

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

##### url

`string`

#### Returns

`string`

### CommandDidNotComplete()

#### Parameters

##### command

`string`

#### Returns

`string`

### ConfigAssetEnvironmentValidationFailed()

#### Parameters

##### subject

`string`

##### badValue

`string`

##### validValues

readonly `string`[]

#### Returns

`string`

### DangerousRenovationRequiresForce()

#### Parameters

##### taskName

`string`

#### Returns

`string`

### DefaultImportFalsy()

#### Returns

`string`

### EslintPluginReturnedSomethingUnexpected()

#### Parameters

##### identifier

`string`

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

##### args

`string`[]

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

##### path

`string`

#### Returns

`string`

### MissingXscriptsEnvironmentVariable()

#### Parameters

##### variableName

`string`

#### Returns

`string`

### MonkeyPatchFailedToTake()

#### Parameters

##### filename

`string`

#### Returns

`string`

### MultipleConfigsWhenExpectingOnlyOne()

#### Parameters

##### filename1

`string`

##### filename2

`string`

#### Returns

`string`

### MustChooseDeployEnvironment()

#### Returns

`string`

### OptionValueMustBeAlone()

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`

### OptionValueMustBeAloneWhenBaseline()

#### Parameters

##### option

`string`

##### noun

`string`

#### Returns

`string`

### PreparationRunnerExecutionFailed()

#### Returns

`string`

### ReleaseEnvironmentValidationFailed()

#### Returns

`string`

### ReleaseFinishedWithADirtyRepo()

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

### RenovateEnvironmentValidationFailed()

#### Returns

`string`

### RenovationEncounteredObsoleteProtectionRules()

#### Parameters

##### branch

`string`

#### Returns

`string`

### RenovationRepositoryExtraneousRuleset()

#### Parameters

##### rulesetName

`string`

#### Returns

`string`

### RenovationRunnerExecutionFailed()

#### Returns

`string`

### RenovationSubtaskOperationFailed()

#### Parameters

##### index

`number`

#### Returns

`string`

### RequiresMinArgs()

#### Parameters

##### name

`string`

##### min

`number`

##### given?

`number`

##### adjective?

`string`

#### Returns

`string`

### TaskNotRunnable()

#### Parameters

##### id

`string`

##### npmScripts

`string`[]

#### Returns

`string`

### TestingFailed()

#### Returns

`string`

### TranspilationReturnedNothing()

#### Parameters

##### sourcePath

`string`

##### outputPath

`string`

#### Returns

`string`

### UnmatchedCommitType()

#### Parameters

##### type

`undefined` | `string`

##### variableName

`string`

#### Returns

`string`

### UnsupportedCommand()

#### Returns

`string`

### UnsupportedRenovationScope()

#### Parameters

##### taskName

`string`

##### givenScope

`string`

##### supportedScopes

`string`[]

#### Returns

`string`

### WrongProjectAttributes()

#### Parameters

##### expected

`ProjectAttribute`[]

##### actual

###### cjs

`boolean`

###### cli

`boolean`

###### esm

`boolean`

###### hybridrepo

`boolean`

###### monorepo

`boolean`

###### nextjs

`boolean`

###### polyrepo

`boolean`

###### private

`boolean`

###### vercel

`boolean`

###### webpack

`boolean`

##### preposition

`string` = `'with'`

#### Returns

`string`

## Defined in

[src/error.ts:63](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/error.ts#L63)
