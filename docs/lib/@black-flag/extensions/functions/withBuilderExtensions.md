[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / withBuilderExtensions

# Function: withBuilderExtensions()

> **withBuilderExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>(`customBuilder`?, `__namedParameters`?): [`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

This function enables several additional options-related units of
functionality via analysis of the returned options configuration object and
the parsed command line arguments (argv).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **customBuilder?**: [`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| (...`args`) => `void` \| [`BfeBuilderObject`](../type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

• **\_\_namedParameters?**: [`WithBuilderExtensionsConfig`](../type-aliases/WithBuilderExtensionsConfig.md)\<`CustomCliArguments`\> = `{}`

## Returns

[`WithBuilderExtensionsReturnType`](../type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## See

[WithBuilderExtensionsReturnType](../type-aliases/WithBuilderExtensionsReturnType.md)

## Defined in

[lib/@black-flag/extensions/index.ts:644](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/@black-flag/extensions/index.ts#L644)
