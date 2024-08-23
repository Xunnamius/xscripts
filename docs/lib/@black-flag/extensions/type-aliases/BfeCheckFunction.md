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

[lib/@black-flag/extensions/index.ts:490](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@black-flag/extensions/index.ts#L490)
