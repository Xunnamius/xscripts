[**@-xun/scripts**](../../../README.md) • **Docs**

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

• **\_\_namedParameters**

• **\_\_namedParameters.debug\_**: `ExtendedDebugger`

• **\_\_namedParameters.projectMetadata\_**: `undefined` \| `ProjectMetadata`

## Returns

`Promise`\<`object`\>

### projectMetadata

> **projectMetadata**: `NonNullable`\<[`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\[`"projectMetadata"`\]\>

## Defined in

[src/util.ts:96](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/src/util.ts#L96)
