[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / assertIsNonEmptyStrings

# Function: assertIsNonEmptyStrings()

> **assertIsNonEmptyStrings**\<`T`\>(`record`): `{ [K in keyof T]: Exclude<T[K], undefined> }`

Asserts `record` (a `Record<string, unknown>`) is actually a `Record<string,
string>`.

## Type Parameters

• **T** *extends* `Record`\<`string`, `unknown`\>

## Parameters

• **record**: `T`

## Returns

`{ [K in keyof T]: Exclude<T[K], undefined> }`

## Defined in

[src/assets/index.ts:151](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/src/assets/index.ts#L151)
