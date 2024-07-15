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

[lib/@black-flag/extensions/index.ts:469](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/lib/@black-flag/extensions/index.ts#L469)
