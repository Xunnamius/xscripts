[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / withGlobalBuilder

# Function: withGlobalBuilder()

> **withGlobalBuilder**\<`CustomCliArguments`\>(...`__namedParameters`): `ReturnType`\<*typeof* `withStandardBuilder`\>

A version of withStandardBuilder that expects `CustomCliArguments` to
extend [GlobalCliArguments](../../configure/type-aliases/GlobalCliArguments.md).

## Type Parameters

• **CustomCliArguments** *extends* `Omit`\<[`GlobalCliArguments`](../../configure/type-aliases/GlobalCliArguments.md), `"scope"`\> & `object`

## Parameters

• ...**\_\_namedParameters**: [`BfeBuilderObject`\<`CustomCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\> \| (...`args`) => `void` \| `BfeBuilderObject`\<`CustomCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>, `(Omit<WithBuilderExtensionsConfig<CustomCliArguments>, "commonOptions"> & Object)?`]

## Returns

`ReturnType`\<*typeof* `withStandardBuilder`\>

## Defined in

[src/util.ts:27](https://github.com/Xunnamius/xscripts/blob/86b76a595de7a0bbf273ef7bb201d4c62f5e3d77/src/util.ts#L27)
