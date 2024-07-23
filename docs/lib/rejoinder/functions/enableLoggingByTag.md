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

[lib/rejoinder/index.ts:423](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/lib/rejoinder/index.ts#L423)
