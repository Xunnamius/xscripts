[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/extensions](../README.md) / StandardExecutionContext

# Type Alias: StandardExecutionContext

> **StandardExecutionContext**: `ExecutionContext` & `object` & `object` \| `object`

This ExecutionContext subtype contains state related to
[standardCommonCliArguments](../variables/standardCommonCliArguments.md), both of which are required for the proper
function of [withStandardBuilder](../functions/withStandardBuilder.md).

## Type declaration

### debug\_

> **debug\_**: [`ExtendedDebugger`](../../../../debug-extended/interfaces/ExtendedDebugger.md)

The [ExtendedDebugger](../../../../debug-extended/interfaces/ExtendedDebugger.md) for the CLI.

### log

> **log**: [`ExtendedLogger`](../../../../rejoinder/interfaces/ExtendedLogger.md)

The [ExtendedLogger](../../../../rejoinder/interfaces/ExtendedLogger.md) for the CLI.

### state

> **state**: `object`

### state.isHushed

> **isHushed**: `boolean`

If `true`, the program should output only the most pertinent information.

### state.isQuieted

> **isQuieted**: `boolean`

If `true`, the program should be dramatically less verbose. It also
implies `isHushed` is `true`.

### state.isSilenced

> **isSilenced**: `boolean`

If `true`, the program should not output anything at all. It also implies
`isQuieted` and `isHushed` are both `true`.

### state.startTime

> **startTime**: `Date`

A `Date` object representing the start time of execution.

## Defined in

[lib/@-xun/cli-utils/extensions.ts:40](https://github.com/Xunnamius/xscripts/blob/4c305ac01bcb5579e4796a0cd2b08508dc5de5e1/lib/@-xun/cli-utils/extensions.ts#L40)
