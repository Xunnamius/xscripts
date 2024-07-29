[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeCustomBuilderFunctionParameters

# Type Alias: BfeCustomBuilderFunctionParameters\<CustomCliArguments, CustomExecutionContext, P\>

> **BfeCustomBuilderFunctionParameters**\<`CustomCliArguments`, `CustomExecutionContext`, `P`\>: `P` *extends* [infer R, `...(infer S)`] ? `S` *extends* [infer T, `...(infer _U)`] ? [`R` & `object`, `T`, [`BfeStrictArguments`](BfeStrictArguments.md)\<`CustomCliArguments`, `CustomExecutionContext`\>] : [`R` & `object`, `...S`] : `never`

A version of Black Flag's `builder` function parameters that exclude yargs
methods that are not supported by BFE.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

• **P** = `Parameters`\<[`BfBuilderFunction`](BfBuilderFunction.md)\<`CustomCliArguments`, `CustomExecutionContext`\>\>

## See

[withBuilderExtensions](../functions/withBuilderExtensions.md)

## Defined in

[lib/@black-flag/extensions/index.ts:552](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/@black-flag/extensions/index.ts#L552)
