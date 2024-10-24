[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / MockContext

# Interface: MockContext\<T, Y, C\>

## Type Parameters

• **T**

• **Y** *extends* `any`[]

• **C** = `any`

## Properties

### calls

> **calls**: `Y`[]

List of the call arguments of all calls that have been made to the mock.

#### Defined in

node\_modules/@types/jest/index.d.ts:1518

***

### contexts

> **contexts**: `C`[]

List of the call contexts of all calls that have been made to the mock.

#### Defined in

node\_modules/@types/jest/index.d.ts:1522

***

### instances

> **instances**: `T`[]

List of all the object instances that have been instantiated from the mock.

#### Defined in

node\_modules/@types/jest/index.d.ts:1526

***

### invocationCallOrder

> **invocationCallOrder**: `number`[]

List of the call order indexes of the mock. Jest is indexing the order of
invocations of all mocks in a test file. The index is starting with `1`.

#### Defined in

node\_modules/@types/jest/index.d.ts:1531

***

### lastCall?

> `optional` **lastCall**: `Y`

List of the call arguments of the last call that was made to the mock.
If the function was not called, it will return `undefined`.

#### Defined in

node\_modules/@types/jest/index.d.ts:1536

***

### results

> **results**: [`MockResult`](../type-aliases/MockResult.md)\<`T`\>[]

List of the results of all calls that have been made to the mock.

#### Defined in

node\_modules/@types/jest/index.d.ts:1540
