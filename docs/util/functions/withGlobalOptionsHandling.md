[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / withGlobalOptionsHandling

# Function: withGlobalOptionsHandling()

> **withGlobalOptionsHandling**\<`CustomCliArguments`\>(`builderData`, `customHandler`): `Promise`\<`Configuration`\<`CustomCliArguments`, [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)\>\[`"handler"`\]\>

Returns a handler function that wraps `customHandler` to provide the
functionality for the standard CLI options (i.e. silent, etc). Most if not
all commands should wrap their handler functions with this function.

## Type parameters

• **CustomCliArguments** *extends* [`GlobalCliArguments`](../type-aliases/GlobalCliArguments.md)

## Parameters

• **builderData**

• **builderData.handlerPreCheckData**

• **builderData.handlerPreCheckData.atLeastOneOfOptions**: `string`[][]

• **builderData.handlerPreCheckData.mutuallyConflictedOptions**: `string`[][]

• **customHandler**

## Returns

`Promise`\<`Configuration`\<`CustomCliArguments`, [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)\>\[`"handler"`\]\>

## Source

[src/util.ts:365](https://github.com/Xunnamius/xscripts/blob/7129e155987055d658c285b3a31d449ff5e71ba7/src/util.ts#L365)
