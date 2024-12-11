[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplates

# Function: compileTemplates()

> **compileTemplates**(`templates`, `context`): `Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

This function takes an object of absolute path keys with relative path
values; each pair represents an output path and an input path relative to the
template asset directory. This function returns a [ReifiedAssets](../type-aliases/ReifiedAssets.md)
instance with values that lazily invoke [compileTemplate](compileTemplate.md).

Some template variables accept an optional `linkText` parameter which, if
given, will be replaced by a link of the form `[linkText](contextual-value)`;
e.g. `{{variableName:link text}}` will be replaced with `[link
text](variableName's-contextual-value)`.

Other template variables (defined as arrays) return multiple choices that the
user must manually narrow, similar to a merge conflict in git. See
[TransformerContext](../type-aliases/TransformerContext.md) for which template variables are affected.

## Parameters

### templates

`Record`\<`AbsolutePath`, `RelativePath`\>

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

## Defined in

[src/assets.ts:464](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets.ts#L464)
