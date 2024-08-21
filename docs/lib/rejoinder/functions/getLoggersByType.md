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

[lib/rejoinder/index.ts:301](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/lib/rejoinder/index.ts#L301)
