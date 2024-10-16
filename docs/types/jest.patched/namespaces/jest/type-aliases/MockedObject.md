[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / MockedObject

# Type Alias: MockedObject\<T\>

> **MockedObject**\<`T`\>: [`MaybeMockedConstructor`](MaybeMockedConstructor.md)\<`T`\> & `{ [K in MethodKeysOf<T>]: T[K] extends MockableFunction ? MockedFn<T[K]> : T[K] }` & `{ [K in PropertyKeysOf<T>]: T[K] }`

## Type Parameters

• **T**

## Defined in

node\_modules/@types/jest/index.d.ts:453
