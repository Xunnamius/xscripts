[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / MockedObjectDeep

# Type Alias: MockedObjectDeep\<T\>

> **MockedObjectDeep**\<`T`\>: [`MaybeMockedConstructor`](MaybeMockedConstructor.md)\<`T`\> & `{ [K in MethodKeysOf<T>]: T[K] extends MockableFunction ? MockedFunctionDeep<T[K]> : T[K] }` & `{ [K in PropertyKeysOf<T>]: MaybeMockedDeep<T[K]> }`

## Type Parameters

• **T**

## Defined in

node\_modules/@types/jest/index.d.ts:459
