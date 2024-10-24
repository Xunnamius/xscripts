[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / MockedClass

# Type Alias: MockedClass\<T\>

> **MockedClass**\<`T`\>: [`MockInstance`](../interfaces/MockInstance.md)\<`InstanceType`\<`T`\>, `T` *extends* (...`args`) => `any` ? `P` : `never`, `T` *extends* (...`args`) => infer C ? `C` : `never`\> & `object` & `T`

Wrap a class with mock definitions

## Type declaration

### prototype

> **prototype**: `T` *extends* `object` ? [`Mocked`](Mocked.md)\<`T`\[`"prototype"`\]\> : `never`

## Type Parameters

• **T** *extends* [`Constructable`](../interfaces/Constructable.md)

## Example

```ts
import { MyClass } from "./library";
 jest.mock("./library");

 const mockedMyClass = MyClass as jest.MockedClass<typeof MyClass>;

 expect(mockedMyClass.mock.calls[0][0]).toBe(42); // Constructor calls
 expect(mockedMyClass.prototype.myMethod.mock.calls[0][0]).toBe(42); // Method calls
```

## Defined in

node\_modules/@types/jest/index.d.ts:1286
