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

[lib/rejoinder/index.ts:301](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/rejoinder/index.ts#L301)
