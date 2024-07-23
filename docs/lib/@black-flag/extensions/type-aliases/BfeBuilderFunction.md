[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeBuilderFunction

# Type Alias: BfeBuilderFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderFunction**\<`CustomCliArguments`, `CustomExecutionContext`\>: (...`args`) => [`BfBuilderObject`](BfBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

This function implements several additional optionals-related units of
functionality. This function is meant to take the place of a command's
`builder` export.

This type cannot be instantiated by direct means. Instead, it is created and
returned by [withBuilderExtensions](../functions/withBuilderExtensions.md).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• ...**args**: `Parameters`\<[`BfBuilderFunction`](BfBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

## Returns

[`BfBuilderObject`](BfBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)

## Defined in

[lib/@black-flag/extensions/index.ts:489](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/lib/@black-flag/extensions/index.ts#L489)
