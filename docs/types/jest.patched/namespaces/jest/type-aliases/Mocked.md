[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / Mocked

# Type Alias: Mocked\<T\>

> **Mocked**\<`T`\>: `{ [P in keyof T]: T[P] extends Function ? MockInstance<ReturnType<T[P]>, ArgsType<T[P]>, C> : T[P] extends Constructable ? MockedClass<T[P]> : T[P] }` & `T`

Wrap an object or a module with mock definitions

## Type Parameters

• **T**

## Example

```ts
jest.mock("../api");
 import * as api from "../api";

 const mockApi = api as jest.Mocked<typeof api>;
 api.MyApi.prototype.myApiMethod.mockImplementation(() => "test");
```

## Defined in

node\_modules/@types/jest/index.d.ts:1309
