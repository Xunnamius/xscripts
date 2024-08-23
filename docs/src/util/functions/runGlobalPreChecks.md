[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / runGlobalPreChecks

# Function: runGlobalPreChecks()

> **runGlobalPreChecks**(`__namedParameters`): `Promise`\<`object`\>

This function runs common checks against the runtime to ensure the
environment is suitable for running xscripts.

This function should be called at the top of just about every command
handler.

This command also asserts that the `runtimeContext` property is defined by
returning it (or throwing a CliError if undefined).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.debug\_**: [`ExtendedDebugger`](../../../lib/debug-extended/interfaces/ExtendedDebugger.md)

• **\_\_namedParameters.runtimeContext\_**: `undefined` \| `MonorepoRunContext` \| `PolyrepoRunContext`

## Returns

`Promise`\<`object`\>

### runtimeContext

> **runtimeContext**: `NonNullable`\<[`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\[`"runtimeContext"`\]\>

## Defined in

[src/util.ts:30](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/src/util.ts#L30)
