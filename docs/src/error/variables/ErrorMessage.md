[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/error](../README.md) / ErrorMessage

# Variable: ErrorMessage

> `const` **ErrorMessage**: `object`

A collection of possible error and warning messages.

## Type declaration

### AppValidationFailure()

> **AppValidationFailure**: () => `string`

#### Returns

`string`

### AuthFailure()

> **AuthFailure**: () => `string`

#### Returns

`string`

### ClientValidationFailure()

> **ClientValidationFailure**: () => `string`

#### Returns

`string`

### GuruMeditation()

> **GuruMeditation**: () => `string`

#### Returns

`string`

### HttpFailure()

> **HttpFailure**: (`error`?) => `string`

#### Parameters

• **error?**: `string`

#### Returns

`string`

### HttpSubFailure()

> **HttpSubFailure**: (`error`, `statusCode`) => `string`

#### Parameters

• **error**: `null` \| `string`

• **statusCode**: `number`

#### Returns

`string`

### InvalidAppConfiguration()

> **InvalidAppConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidAppEnvironment()

> **InvalidAppEnvironment**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidClientConfiguration()

> **InvalidClientConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### InvalidItem()

> **InvalidItem**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### InvalidSecret()

> **InvalidSecret**: (`secretType`) => `string`

#### Parameters

• **secretType**: `string`

#### Returns

`string`

### ItemNotFound()

> **ItemNotFound**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### ItemOrItemsNotFound()

> **ItemOrItemsNotFound**: (`itemsName`) => `string`

#### Parameters

• **itemsName**: `string`

#### Returns

`string`

### NotAuthenticated()

> **NotAuthenticated**: () => `string`

#### Returns

`string`

### NotAuthorized()

> **NotAuthorized**: () => `string`

#### Returns

`string`

### NotFound()

> **NotFound**: () => `string`

#### Returns

`string`

### NotImplemented()

> **NotImplemented**: () => `string`

#### Returns

`string`

### ValidationFailure()

> **ValidationFailure**: () => `string`

#### Returns

`string`

### AllOptionValueMustBeAlone()

#### Parameters

• **noun**: `string`

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

### AssertionFailureBadConfigurationPath()

#### Parameters

• **path**: `unknown`

#### Returns

`string`

### AssertionFailureBadParameterCombination()

#### Returns

`string`

### AssertionFailureCannotExecuteMultipleTimes()

#### Returns

`string`

### AssertionFailureConfigureExecutionEpilogue()

#### Returns

`string`

### AssertionFailureDuplicateCommandName()

#### Parameters

• **parentFullName**: `undefined` \| `string`

• **name1**: `string`

• **type1**: `"alias"` \| `"name"`

• **name2**: `string`

• **type2**: `"alias"` \| `"name"`

#### Returns

`string`

### AssertionFailureInvalidCommandExport()

#### Parameters

• **name**: `string`

#### Returns

`string`

### AssertionFailureInvocationNotAllowed()

#### Parameters

• **name**: `string`

#### Returns

`string`

### AssertionFailureNoConfigurationLoaded()

#### Parameters

• **path**: `string`

#### Returns

`string`

### AssertionFailureReachedTheUnreachable()

#### Returns

`string`

### AssertionFailureUseParseAsyncInstead()

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

### CheckFailed()

#### Parameters

• **currentArgument**: `string`

#### Returns

`string`

### CleanCalledWithoutForce()

#### Returns

`string`

### CliProjectHasBadBinConfig()

#### Returns

`string`

### CommandDidNotComplete()

#### Parameters

• **command**: `string`

#### Returns

`string`

### CommandHandlerNotAFunction()

#### Returns

`string`

### CommandNotImplemented()

#### Returns

`string`

### ConfigLoadFailure()

#### Parameters

• **path**: `string`

#### Returns

`string`

### ConflictsViolation()

#### Parameters

• **conflicter**: `string`

• **seenConflictingKeyValues**: `ObjectEntries`\<`object`\>

#### Returns

`string`

### DefaultImportFalsy()

#### Returns

`string`

### DemandGenericXorViolation()

#### Parameters

• **demanded**: `ObjectEntries`\<`object`\>

#### Returns

`string`

### DemandIfViolation()

#### Parameters

• **demanded**: `string`

• **demander**: `ObjectEntry`\<`object`\>

#### Returns

`string`

### DemandOrViolation()

#### Parameters

• **demanded**: `ObjectEntries`\<`object`\>

#### Returns

`string`

### DemandSpecificXorViolation()

#### Parameters

• **firstArgument**: `ObjectEntry`\<`object`\>

• **secondArgument**: `ObjectEntry`\<`object`\>

#### Returns

`string`

### DuplicateOptionName()

#### Parameters

• **name**: `string`

#### Returns

`string`

### EslintPluginReturnedSomethingUnexpected()

#### Parameters

• **identifier**: `string`

#### Returns

`string`

### FalsyCommandExport()

#### Returns

`string`

### FrameworkError()

#### Parameters

• **error**: `unknown`

#### Returns

`string`

### Generic()

#### Returns

`string`

### GracefulEarlyExit()

#### Returns

`string`

### IgnoredArguments()

#### Parameters

• **args**: `string`[]

#### Returns

`string`

### IllegalExplicitlyUndefinedDefault()

#### Returns

`string`

### IllegalHandlerInvocation()

#### Returns

`string`

### ImpliesViolation()

#### Parameters

• **implier**: `string`

• **seenConflictingKeyValues**: `ObjectEntries`\<`object`\>

#### Returns

`string`

### InvalidCharacters()

#### Parameters

• **str**: `string`

• **violation**: `string`

#### Returns

`string`

### InvalidConfigureArgumentsReturnType()

#### Returns

`string`

### InvalidConfigureExecutionContextReturnType()

#### Returns

`string`

### InvalidSubCommandInvocation()

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

### MetadataInvariantViolated()

#### Parameters

• **afflictedKey**: `string`

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

### ReferencedNonExistentOption()

#### Parameters

• **referrerName**: `string`

• **doesNotExistName**: `string`

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

### RequiresViolation()

#### Parameters

• **requirer**: `string`

• **missingRequiredKeyValues**: `ObjectEntries`\<`object`\>

#### Returns

`string`

### RetrievalFailed()

#### Parameters

• **path**: `string`

#### Returns

`string`

### TranspilationReturnedNothing()

#### Parameters

• **sourcePath**: `string`

• **outputPath**: `string`

#### Returns

`string`

### UnexpectedlyFalsyDetailedArguments()

#### Returns

`string`

### UnexpectedValueFromInternalYargsMethod()

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

[src/error.ts:11](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/src/error.ts#L11)
