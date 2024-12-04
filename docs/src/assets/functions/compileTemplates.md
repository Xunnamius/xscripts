[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplates

# Function: compileTemplates()

> **compileTemplates**(`templates`, `context`): `Promise`\<`Record`\<`string`, `string`\>\>

Takes an object of name-path pairs, each representing the name of a template
and the path to its contents (relative to the template asset directory), and
returns that same object with each path value replaced by the result of
calling [compileTemplate](compileTemplate.md) with said path as an argument.

## Parameters

### templates

`Record`\<`string`, `RelativePath`\>

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`Promise`\<`Record`\<`string`, `string`\>\>

## Defined in

[src/assets.ts:232](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets.ts#L232)
