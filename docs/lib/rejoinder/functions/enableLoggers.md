[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / enableLoggers

# Function: enableLoggers()

> **enableLoggers**(`__namedParameters`): `void`

Enable all logger instances (coarse-grain).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.filter?**: `string` \| `RegExp`

Optionally filter the loggers to be enabled. If `filter` is a string, only
loggers with namespaces equal to `filter` will be enabled. If `filter` is a
regular expression, only loggers with namespaces matching the expression
will be enabled.

• **\_\_namedParameters.type**: `"all"` \| `"stdout"` \| `"debug"`

The type of logging to enable. Valid values are one of:

- `stdout` enables loggers created via `createGenericLogger`

- `debug` enables loggers created via `createDebugLogger`

- `all` enables all loggers

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:372](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/rejoinder/index.ts#L372)
