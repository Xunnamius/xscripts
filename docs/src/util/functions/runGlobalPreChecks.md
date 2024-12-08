[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / runGlobalPreChecks

# Function: runGlobalPreChecks()

> **runGlobalPreChecks**(`__namedParameters`): `Promise`\<`object`\>

This function runs common checks against the runtime to ensure the
environment is suitable for running xscripts.

This function should be called at the top of just about every command
handler.

This command also asserts that the `projectMetadata` property is defined by
returning it (or throwing a CliError if undefined).

## Parameters

### \_\_namedParameters

#### debug_

`ExtendedDebugger`

#### projectMetadata_

`undefined` \| `ProjectMetadata`

## Returns

`Promise`\<`object`\>

### projectMetadata

> **projectMetadata**: `NonNullable`\<[`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\[`"projectMetadata"`\]\>

## Defined in

[src/util.ts:106](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/util.ts#L106)
