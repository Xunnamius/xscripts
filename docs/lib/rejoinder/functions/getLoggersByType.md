[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / getLoggersByType

# Function: getLoggersByType()

> **getLoggersByType**(`__namedParameters`): ([`ExtendedDebugger`](../../debug-extended/interfaces/ExtendedDebugger.md) \| [`ExtendedLogger`](../interfaces/ExtendedLogger.md))[]

Return an array of all known loggers of a specific type: either `stdout`,
`debug`, or both (`all`).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.type**: `"all"` \| `"stdout"` \| `"debug"`

The type of loggers to return. Valid values are one of:

- `stdout` returns loggers created via `createGenericLogger`

- `debug` returns loggers created via `createDebugLogger`

- `all` returns all loggers

## Returns

([`ExtendedDebugger`](../../debug-extended/interfaces/ExtendedDebugger.md) \| [`ExtendedLogger`](../interfaces/ExtendedLogger.md))[]

## Defined in

[lib/rejoinder/index.ts:301](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/rejoinder/index.ts#L301)
