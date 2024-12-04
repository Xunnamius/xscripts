[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplateInMemory

# Function: compileTemplateInMemory()

> **compileTemplateInMemory**(`rawTemplate`, `context`): `string`

Takes a string and returns that string with all handlebars-style template
variables (e.g. `{{variableName}}`) with matching keys in `TemplateContext`
replaced with their contextual values.

## Parameters

### rawTemplate

`string`

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`string`

## Defined in

[src/assets.ts:204](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets.ts#L204)
