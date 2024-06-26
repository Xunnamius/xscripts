[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [error](../README.md) / ErrorMessage

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

### AssertionFailureCommandHandlerNotAFunction()

#### Returns

`string`

### AssertionFailureConfigureExecutionEpilogue()

#### Returns

`string`

### AssertionFailureDuplicateCommandName()

#### Parameters

• **parentFullName**: `undefined` \| `string`

• **name1**: `string`

• **type1**: `"name"` \| `"alias"`

• **name2**: `string`

• **type2**: `"name"` \| `"alias"`

#### Returns

`string`

### AssertionFailureFalsyCommand()

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

### BadChangelogPatcher()

#### Parameters

• **path**: `string`

#### Returns

`string`

### CannotBeCliAndNextJs()

#### Returns

`string`

### CannotReadFile()

#### Parameters

• **expectedPath**: `string`

#### Returns

`string`

### CannotRunOutsideRoot()

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

### CommandDidNotComplete()

#### Parameters

• **command**: `string`

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

### MarkdownNoUndefinedReferences()

#### Returns

`string`

### MetadataInvariantViolated()

#### Parameters

• **afflictedKey**: `string`

#### Returns

`string`

### MustChooseDeployEnvironment()

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

### UnexpectedlyFalsyDetailedArguments()

#### Returns

`string`

### UnsupportedCommand()

#### Returns

`string`

### WrongProjectAttributes()

#### Parameters

• **expected**: [`ProjectMetaAttribute`](../../util/enumerations/ProjectMetaAttribute.md)[]

• **actual**: [`ProjectMetaAttribute`](../../util/enumerations/ProjectMetaAttribute.md)[]

#### Returns

`string`

## Defined in

[src/error.ts:11](https://github.com/Xunnamius/xscripts/blob/7364616ea349761591231a3547bd697ec67ed34b/src/error.ts#L11)
