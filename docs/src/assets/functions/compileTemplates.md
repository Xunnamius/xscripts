[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / compileTemplates

# Function: compileTemplates()

> **compileTemplates**(`templates`, `context`): `Promise`\<`Record`\<`string`, `string`\>\>

Takes an object of name-path pairs, each representing the name of a template
and the path to its contents (relative to the template asset directory), and
returns that same object with each path value replaced by the result of
calling [compileTemplate](compileTemplate.md) with said path as an argument.

Some template variables accept an optional `linkText` parameter which, if
given, will be replaced by a link of the form `[linkText](contextual-value)`;
e.g. `{{variableName:link text}}` will be replaced with `[link
text](variableName's-contextual-value)`.

Other template variables (defined as arrays) return multiple choices that the
user must manually narrow, similar to a merge conflict in git. See
[TransformerContext](../type-aliases/TransformerContext.md) for which template variables are affected.

## Parameters

### templates

`Record`\<`string`, `RelativePath`\>

### context

[`TransformerContext`](../type-aliases/TransformerContext.md)

## Returns

`Promise`\<`Record`\<`string`, `string`\>\>

## Defined in

[src/assets.ts:318](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/assets.ts#L318)
