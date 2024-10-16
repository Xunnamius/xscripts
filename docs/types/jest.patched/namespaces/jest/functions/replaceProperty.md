[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / replaceProperty

# Function: replaceProperty()

> **replaceProperty**\<`T`, `K`\>(`obj`, `key`, `value`): [`ReplaceProperty`](../interfaces/ReplaceProperty.md)\<`T`\[`K`\]\>

Replaces property on an object with another value.

## Type Parameters

• **T** *extends* `object`

• **K** *extends* `string` \| `number` \| `symbol`

## Parameters

• **obj**: `T`

• **key**: `K`

• **value**: `T`\[`K`\]

## Returns

[`ReplaceProperty`](../interfaces/ReplaceProperty.md)\<`T`\[`K`\]\>

## Remarks

For mocking functions, and 'get' or 'set' accessors, use `jest.spyOn()` instead.

## Defined in

node\_modules/@types/jest/index.d.ts:291
