[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplateInMemory

# Function: compileTemplateInMemory()

> **compileTemplateInMemory**(`rawTemplate`, `context`): `string`

Takes a string and returns that string with all handlebars-style template
variables (e.g. `{{variableName}}`) with matching keys in `TemplateContext`
replaced with their contextual values.

Some template variables accept an optional `linkText` parameter which, if
given, will be replaced by a link of the form `[linkText](contextual-value)`;
e.g. `{{variableName:link text}}` will be replaced with `[link
text](variableName's-contextual-value)`.

Other template variables (defined as arrays) return multiple choices that the
user must manually narrow, similar to a merge conflict in git. See
[TransformerContext](../type-aliases/TransformerContext.md) for which template variables are affected.

## Parameters

### rawTemplate

`string`

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`string`

## Defined in

[src/assets.ts:523](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets.ts#L523)
