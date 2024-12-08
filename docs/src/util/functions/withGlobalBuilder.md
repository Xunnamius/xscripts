[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / withGlobalBuilder

# Function: withGlobalBuilder()

> **withGlobalBuilder**\<`CustomCliArguments`\>(...`__namedParameters`): `ReturnType`\<*typeof* `withStandardBuilder`\>

A version of withStandardBuilder that expects `CustomCliArguments` to
extend [GlobalCliArguments](../../configure/type-aliases/GlobalCliArguments.md).

When providing a `customBuilder` function or object, any key in the returned
object that is also a key in [globalCliArguments](../../configure/variables/globalCliArguments.md) will have its value
merged with the value in [globalCliArguments](../../configure/variables/globalCliArguments.md) _instead_ of fully
overwriting it. This means you can pass minimal configuration values for the
keys that are also in [globalCliArguments](../../configure/variables/globalCliArguments.md) and those values will be
merged over the corresponding default configuration value in
[globalCliArguments](../../configure/variables/globalCliArguments.md).

## Type Parameters

• **CustomCliArguments** *extends* [`GlobalCliArguments`](../../configure/type-aliases/GlobalCliArguments.md)\<`string`\>

## Parameters

### \_\_namedParameters

...[`BfeBuilderObject`\<`CustomCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\> \| (...`args`) => `void` \| `BfeBuilderObject`\<`CustomCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>, `Omit`\<`WithBuilderExtensionsConfig`\<`CustomCliArguments`\>, `"commonOptions"`\> & `object`?]

## Returns

`ReturnType`\<*typeof* `withStandardBuilder`\>

## Defined in

[src/util.ts:48](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/util.ts#L48)
