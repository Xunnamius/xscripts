[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / ConstructorProperties

# Type Alias: ConstructorProperties\<T\>

> **ConstructorProperties**\<`T`\>: `{ [K in keyof RemoveIndex<T> as RemoveIndex<T>[K] extends Constructor ? K : never]: RemoveIndex<T>[K] }`

## Type Parameters

• **T**

## Defined in

node\_modules/@types/jest/index.d.ts:489
