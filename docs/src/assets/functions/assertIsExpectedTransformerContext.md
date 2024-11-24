[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / assertIsExpectedTransformerContext

# Function: assertIsExpectedTransformerContext()

> **assertIsExpectedTransformerContext**\<`U`\>(`record`, `expectedKeys`?): `Record`\<`U`\[`number`\], `string`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

Asserts `record` (a `Record<string, unknown>`) is actually a `Record<string,
string> & RequiredTransformerContext` that contains each string in
`expectedKeys` as a property with a non-empty string value.

## Type Parameters

• **U** *extends* `string`[] = `never`[]

## Parameters

• **record**: `Record`\<`string`, `unknown`\>

• **expectedKeys?**: `U`

## Returns

`Record`\<`U`\[`number`\], `string`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

## Defined in

[src/assets.ts:167](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/assets.ts#L167)
