[**@-xun/scripts**](../../README.md) • **Docs**

---

[@-xun/scripts](../../README.md) / [error](../README.md) / ErrorMessage

# Variable: ErrorMessage

> `const` **ErrorMessage**: `object`

A collection of possible error and warning messages.

## Type Declaration

### Appvalidationfailure()

> **AppValidationFailure**: () => `string`

#### Returns

`string`

### Authfailure()

> **AuthFailure**: () => `string`

#### Returns

`string`

### Clientvalidationfailure()

> **ClientValidationFailure**: () => `string`

#### Returns

`string`

### Gurumeditation()

> **GuruMeditation**: () => `string`

#### Returns

`string`

### Httpfailure()

> **HttpFailure**: (`error`?) => `string`

#### Parameters

• **error?**: `string`

#### Returns

`string`

### Httpsubfailure()

> **HttpSubFailure**: (`error`, `statusCode`) => `string`

#### Parameters

• **error**: `null` | `string`

• **statusCode**: `number`

#### Returns

`string`

### Invalidappconfiguration()

> **InvalidAppConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### Invalidappenvironment()

> **InvalidAppEnvironment**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### Invalidclientconfiguration()

> **InvalidClientConfiguration**: (`details`?) => `string`

#### Parameters

• **details?**: `string`

#### Returns

`string`

### Invaliditem()

> **InvalidItem**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### Invalidsecret()

> **InvalidSecret**: (`secretType`) => `string`

#### Parameters

• **secretType**: `string`

#### Returns

`string`

### Itemnotfound()

> **ItemNotFound**: (`item`, `itemName`) => `string`

#### Parameters

• **item**: `unknown`

• **itemName**: `string`

#### Returns

`string`

### Itemoritemsnotfound()

> **ItemOrItemsNotFound**: (`itemsName`) => `string`

#### Parameters

• **itemsName**: `string`

#### Returns

`string`

### Notauthenticated()

> **NotAuthenticated**: () => `string`

#### Returns

`string`

### Notauthorized()

> **NotAuthorized**: () => `string`

#### Returns

`string`

### Notfound()

> **NotFound**: () => `string`

#### Returns

`string`

### Notimplemented()

> **NotImplemented**: () => `string`

#### Returns

`string`

### Validationfailure()

> **ValidationFailure**: () => `string`

#### Returns

`string`

### Assertionfailurebadconfigurationpath()

#### Parameters

• **path**: `unknown`

#### Returns

`string`

### Assertionfailurebadparametercombination()

#### Returns

`string`

### Assertionfailurecannotexecutemultipletimes()

#### Returns

`string`

### Assertionfailureconfigureexecutionepilogue()

#### Returns

`string`

### Assertionfailureduplicatecommandname()

#### Parameters

• **parentFullName**: `undefined` | `string`

• **name1**: `string`

• **type1**: `"name"` | `"alias"`

• **name2**: `string`

• **type2**: `"name"` | `"alias"`

#### Returns

`string`

### Assertionfailureinvalidcommandexport()

#### Parameters

• **name**: `string`

#### Returns

`string`

### Assertionfailureinvocationnotallowed()

#### Parameters

• **name**: `string`

#### Returns

`string`

### Assertionfailurenoconfigurationloaded()

#### Parameters

• **path**: `string`

#### Returns

`string`

### Assertionfailurereachedtheunreachable()

#### Returns

`string`

### Assertionfailureuseparseasyncinstead()

#### Returns

`string`

### Cannotbecliandnextjs()

#### Returns

`string`

### Cannotreadfile()

#### Parameters

• **expectedPath**: `string`

#### Returns

`string`

### Cannotrunoutsideroot()

#### Returns

`string`

### Checkfailed()

#### Parameters

• **currentArgument**: `string`

#### Returns

`string`

### Cleancalledwithoutforce()

#### Returns

`string`

### Commanddidnotcomplete()

#### Parameters

• **command**: `string`

#### Returns

`string`

### Commandnotimplemented()

#### Returns

`string`

### Configloadfailure()

#### Parameters

• **path**: `string`

#### Returns

`string`

### Conflictsviolation()

#### Parameters

• **conflicter**: `string`

• **seenConflictingKeyValues**: `ObjectEntries`<`object`>

#### Returns

`string`

### Demandgenericxorviolation()

#### Parameters

• **demanded**: `ObjectEntries`<`object`>

#### Returns

`string`

### Demandifviolation()

#### Parameters

• **demanded**: `string`

• **demander**: `ObjectEntry`<`object`>

#### Returns

`string`

### Demandorviolation()

#### Parameters

• **demanded**: `ObjectEntries`<`object`>

#### Returns

`string`

### Demandspecificxorviolation()

#### Parameters

• **firstArgument**: `ObjectEntry`<`object`>

• **secondArgument**: `ObjectEntry`<`object`>

#### Returns

`string`

### Frameworkerror()

#### Parameters

• **error**: `unknown`

#### Returns

`string`

### Generic()

#### Returns

`string`

### Gracefulearlyexit()

#### Returns

`string`

### Ignoredarguments()

#### Parameters

• **args**: `string`\[]

#### Returns

`string`

### Illegalhandlerinvocation()

#### Returns

`string`

### Impliesviolation()

#### Parameters

• **implier**: `string`

• **seenConflictingKeyValues**: `ObjectEntries`<`object`>

#### Returns

`string`

### Invalidcharacters()

#### Parameters

• **str**: `string`

• **violation**: `string`

#### Returns

`string`

### Invalidconfigureargumentsreturntype()

#### Returns

`string`

### Invalidconfigureexecutioncontextreturntype()

#### Returns

`string`

### Invalidsubcommandinvocation()

#### Returns

`string`

### Markdownnoundefinedreferences()

#### Returns

`string`

### Metadatainvariantviolated()

#### Parameters

• **afflictedKey**: `string`

#### Returns

`string`

### Mustchoosedeployenvironment()

#### Returns

`string`

### Requiresviolation()

#### Parameters

• **requirer**: `string`

• **missingRequiredKeyValues**: `ObjectEntries`<`object`>

#### Returns

`string`

### Unexpectedlyfalsydetailedarguments()

#### Returns

`string`

### Unsupportedcommand()

#### Returns

`string`

### Wrongprojectattributes()

#### Parameters

• **expected**: [`ProjectMetaAttribute`](../../util/enumerations/ProjectMetaAttribute.md)\[]

• **actual**: [`ProjectMetaAttribute`](../../util/enumerations/ProjectMetaAttribute.md)\[]

#### Returns

`string`

## Defined In

[src/error.ts:11](https://github.com/Xunnamius/xscripts/blob/e9f020c2a756a49be6cdccf55d88b926dd2645e9/src/error.ts#L11)
