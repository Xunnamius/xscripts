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

[src/assets.ts:167](https://github.com/Xunnamius/xscripts/blob/ba9f63839da3826ddc001b87c07464b3feaa49e7/src/assets.ts#L167)
