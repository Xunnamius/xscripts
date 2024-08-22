[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / enableLoggingByTag

# Function: enableLoggingByTag()

> **enableLoggingByTag**(`__namedParameters`): `void`

Allows logs with the specified tags to resume being sent to output. Only relevant as the inverse function of [disableLoggingByTag](disableLoggingByTag.md).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.tags**: `string`[]

The tags of messages that will resume being sent to output. If `tags` is
empty`, calling this function is effectively a noop.

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:428](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/rejoinder/index.ts#L428)
