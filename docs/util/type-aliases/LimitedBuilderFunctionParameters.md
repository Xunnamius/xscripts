[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / LimitedBuilderFunctionParameters

# Type alias: LimitedBuilderFunctionParameters\<CustomCliArguments, P\>

> **LimitedBuilderFunctionParameters**\<`CustomCliArguments`, `P`\>: `P` *extends* [infer R, `...(infer S)`] ? [`R` & `object`, `...S`] : `never`

## Type parameters

• **CustomCliArguments** *extends* [`GlobalCliArguments`](GlobalCliArguments.md)

• **P** = `Parameters`\<[`BuilderFunction`](BuilderFunction.md)\<`CustomCliArguments`\>\>

## Source

[src/util.ts:121](https://github.com/Xunnamius/xscripts/blob/b453fa840778101fac1e5f79d0e006f610b3882e/src/util.ts#L121)
