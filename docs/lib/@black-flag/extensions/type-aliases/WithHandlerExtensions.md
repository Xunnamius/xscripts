[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / WithHandlerExtensions

# Type Alias: WithHandlerExtensions()\<CustomCliArguments, CustomExecutionContext\>

> **WithHandlerExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>: (`customHandler`?) => `Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"handler"`\]

This function implements several additional optionals-related units of
functionality. The return value of this function is meant to take the place
of a command's `handler` export.

This type cannot be instantiated by direct means. Instead, it is created and
returned by [withBuilderExtensions](../functions/withBuilderExtensions.md).

Note that `customHandler` provides a stricter constraint than Black Flag's
`handler` command export in that `customHandler`'s `argv` parameter type
explicitly omits the fallback indexer for unrecognized arguments. This
means all possible arguments must be included in [CustomCliArguments](WithHandlerExtensions.md).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **customHandler?**

## Returns

`Configuration`\<`CustomCliArguments`, `CustomExecutionContext`\>\[`"handler"`\]

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)

## Defined in

[lib/@black-flag/extensions/index.ts:544](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/@black-flag/extensions/index.ts#L544)
