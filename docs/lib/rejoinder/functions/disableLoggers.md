[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / disableLoggers

# Function: disableLoggers()

> **disableLoggers**(`__namedParameters`): `void`

Disable all logger instances (coarse-grain).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.filter?**: `string` \| `RegExp`

Optionally filter the loggers to be disabled. If `filter` is a string, only
loggers with namespaces equal to `filter` will be disabled. If `filter` is
a regular expression, only loggers with namespaces matching the expression
will be disabled.

• **\_\_namedParameters.type**: `"all"` \| `"stdout"` \| `"debug"`

The type of logging to disable. Valid values are one of:

- `stdout` disables loggers created via `createGenericLogger`

- `debug` disables loggers created via `createDebugLogger`

- `all` disables all loggers

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:331](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/rejoinder/index.ts#L331)
