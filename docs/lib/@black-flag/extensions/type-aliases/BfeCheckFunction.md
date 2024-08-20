[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeCheckFunction

# Type Alias: BfeCheckFunction()\<CustomCliArguments, CustomExecutionContext\>

> **BfeCheckFunction**\<`CustomCliArguments`, `CustomExecutionContext`\>: (`currentArgumentValue`, `argv`) => `Promisable`\<`unknown`\>

This function is used to validate an argument passed to Black Flag.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **currentArgumentValue**: `any`

• **argv**: `Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>

## Returns

`Promisable`\<`unknown`\>

## See

BfeBuilderObjectValueExtensions.check

## Defined in

[lib/@black-flag/extensions/index.ts:490](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/@black-flag/extensions/index.ts#L490)
