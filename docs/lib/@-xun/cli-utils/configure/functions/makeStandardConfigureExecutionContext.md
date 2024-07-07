[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/configure](../README.md) / makeStandardConfigureExecutionContext

# Function: makeStandardConfigureExecutionContext()

> **makeStandardConfigureExecutionContext**(`__namedParameters`): `ConfigureExecutionContext`\<[`StandardExecutionContext`](../../extensions/type-aliases/StandardExecutionContext.md)\>

Returns a ConfigureExecutionContext instance considered standard
across [Xunnamius](https://github.com/Xunnamius)'s CLI projects.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.rootDebugLogger**: [`ExtendedDebugger`](../../../../debug-extended/interfaces/ExtendedDebugger.md)

The generic logging function used whenever the CLI wants to send text to
stderr.

• **\_\_namedParameters.rootGenericLogger**: [`ExtendedLogger`](../../../../rejoinder/interfaces/ExtendedLogger.md)

The generic logging function used whenever the CLI wants to send text to
stdout.

• **\_\_namedParameters.withListr2Support?**: `boolean` = `false`

If `true`, support for Listr2 tasks will be enabled for this program.

**Default**

```ts
false
```

## Returns

`ConfigureExecutionContext`\<[`StandardExecutionContext`](../../extensions/type-aliases/StandardExecutionContext.md)\>

## Defined in

[lib/@-xun/cli-utils/configure.ts:28](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/@-xun/cli-utils/configure.ts#L28)
