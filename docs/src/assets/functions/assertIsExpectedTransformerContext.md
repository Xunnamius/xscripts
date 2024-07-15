[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / assertIsExpectedTransformerContext

# Function: assertIsExpectedTransformerContext()

> **assertIsExpectedTransformerContext**\<`T`, `U`\>(`record`, `expectedKeys`): `Record`\<`U`\[`number`\], `string`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

Asserts `record` (a `Record<string, unknown>`) is actually a `Record<string,
string> & RequiredTransformerContext` that contains each string in
`expectedKeys` as a property with a non-empty string value.

## Type Parameters

• **T** *extends* `Record`\<`string`, `unknown`\>

• **U** *extends* `string`[]

## Parameters

• **record**: `T`

• **expectedKeys**: `U` = `...`

## Returns

`Record`\<`U`\[`number`\], `string`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

## Defined in

[src/assets/index.ts:165](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/assets/index.ts#L165)
