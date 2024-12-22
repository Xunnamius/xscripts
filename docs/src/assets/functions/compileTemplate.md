[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplate

# Function: compileTemplate()

> **compileTemplate**(`templatePath`, `context`): `Promise`\<`string`\>

Takes a path relative to the `src/assets/templates` directory and returns the
template at that path with all handlebars-style template variables (e.g.
`{{variableName}}`) with matching keys in `TemplateContext` replaced with
their contextual values.

## Parameters

### templatePath

`RelativePath`

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`Promise`\<`string`\>

## Defined in

[src/assets.ts:489](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets.ts#L489)
