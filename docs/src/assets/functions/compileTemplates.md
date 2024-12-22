[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplates

# Function: compileTemplates()

> **compileTemplates**(`templates`, `context`): `Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

This function takes an object of absolute path keys with relative path
values; each pair represents an output path and an input path relative to the
template asset directory. This function returns a [ReifiedAssets](../type-aliases/ReifiedAssets.md)
instance with values that lazily invoke [compileTemplate](compileTemplate.md).

## Parameters

### templates

`Record`\<`AbsolutePath`, `RelativePath`\>

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

## Defined in

[src/assets.ts:468](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets.ts#L468)
