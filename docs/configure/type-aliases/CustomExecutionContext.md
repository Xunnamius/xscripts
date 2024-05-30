[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [configure](../README.md) / CustomExecutionContext

# Type alias: CustomExecutionContext

> **CustomExecutionContext**: `ExecutionContext` & `object`

## Type declaration

### debug\_

> **debug\_**: `ExtendedDebugger`

The ExtendedDebugger for the CLI.

### log

> **log**: `ExtendedLogger`

The ExtendedLogger for the CLI.

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

## Source

[src/configure.ts:34](https://github.com/Xunnamius/xscripts/blob/7129e155987055d658c285b3a31d449ff5e71ba7/src/configure.ts#L34)
