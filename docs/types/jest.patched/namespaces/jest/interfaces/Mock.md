[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / Mock

# Interface: Mock()\<T, Y, C\>

## Extends

- `Function`.[`MockInstance`](MockInstance.md)\<`T`, `Y`, `C`\>

## Type Parameters

• **T** = `any`

• **Y** *extends* `any`[] = `any`

• **C** = `any`

> **Mock**(`this`, ...`args`): `T`

## Parameters

• **this**: `C`

• ...**args**: `Y`

## Returns

`T`

## Defined in

node\_modules/@types/jest/index.d.ts:1212

## Constructors

### new Mock()

> **new Mock**(...`args`): `T`

#### Parameters

• ...**args**: `Y`

#### Returns

`T`

#### Inherited from

`Function.constructor`

#### Defined in

node\_modules/@types/jest/index.d.ts:1211

## Properties

### \[metadata\]

> **\[metadata\]**: `null` \| `DecoratorMetadataObject`

#### Inherited from

`Function.[metadata]`

#### Defined in

node\_modules/typescript/lib/lib.esnext.decorators.d.ts:27

***

### arguments

> **arguments**: `any`

#### Inherited from

`Function.arguments`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:305

***

### caller

> **caller**: `Function`

#### Inherited from

`Function.caller`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:306

***

### length

> `readonly` **length**: `number`

#### Inherited from

`Function.length`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:302

***

### mock

> **mock**: [`MockContext`](MockContext.md)\<`T`, `Y`, `C`\>

Provides access to the mock's metadata

#### Inherited from

[`MockInstance`](MockInstance.md).[`mock`](MockInstance.md#mock)

#### Defined in

node\_modules/@types/jest/index.d.ts:1322

***

### name

> `readonly` **name**: `string`

Returns the name of the function. Function names are read-only and can not be changed.

#### Inherited from

`Function.name`

#### Defined in

node\_modules/typescript/lib/lib.es2015.core.d.ts:97

***

### prototype

> **prototype**: `any`

#### Inherited from

`Function.prototype`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:301

## Methods

### \[hasInstance\]()

> **\[hasInstance\]**(`value`): `boolean`

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

#### Parameters

• **value**: `any`

#### Returns

`boolean`

#### Inherited from

`Function.[hasInstance]`

#### Defined in

node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:164

***

### apply()

> **apply**(`this`, `thisArg`, `argArray`?): `any`

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

#### Parameters

• **this**: `Function`

• **thisArg**: `any`

The object to be used as the this object.

• **argArray?**: `any`

A set of arguments to be passed to the function.

#### Returns

`any`

#### Inherited from

`Function.apply`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:281

***

### bind()

> **bind**(`this`, `thisArg`, ...`argArray`): `any`

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

#### Parameters

• **this**: `Function`

• **thisArg**: `any`

An object to which the this keyword can refer inside the new function.

• ...**argArray**: `any`[]

A list of arguments to be passed to the new function.

#### Returns

`any`

#### Inherited from

`Function.bind`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:296

***

### call()

> **call**(`this`, `thisArg`, ...`argArray`): `any`

Calls a method of an object, substituting another object for the current object.

#### Parameters

• **this**: `Function`

• **thisArg**: `any`

The object to be used as the current object.

• ...**argArray**: `any`[]

A list of arguments to be passed to the method.

#### Returns

`any`

#### Inherited from

`Function.call`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:288

***

### getMockImplementation()

> **getMockImplementation**(): `undefined` \| (...`args`) => `T`

Returns the function that was set as the implementation of the mock (using mockImplementation).

#### Returns

`undefined` \| (...`args`) => `T`

#### Inherited from

[`MockInstance`](MockInstance.md).[`getMockImplementation`](MockInstance.md#getmockimplementation)

#### Defined in

node\_modules/@types/jest/index.d.ts:1358

***

### getMockName()

> **getMockName**(): `string`

Returns the mock name string set by calling `mockFn.mockName(value)`.

#### Returns

`string`

#### Inherited from

[`MockInstance`](MockInstance.md).[`getMockName`](MockInstance.md#getmockname)

#### Defined in

node\_modules/@types/jest/index.d.ts:1320

***

### mockClear()

> **mockClear**(): `this`

Resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays.

Often this is useful when you want to clean up a mock's usage data between two assertions.

Beware that `mockClear` will replace `mockFn.mock`, not just `mockFn.mock.calls` and `mockFn.mock.instances`.
You should therefore avoid assigning mockFn.mock to other variables, temporary or not, to make sure you
don't access stale data.

#### Returns

`this`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockClear`](MockInstance.md#mockclear)

#### Defined in

node\_modules/@types/jest/index.d.ts:1332

***

### mockImplementation()

> **mockImplementation**(`fn`?): `this`

Accepts a function that should be used as the implementation of the mock. The mock itself will still record
all calls that go into and instances that come from itself – the only difference is that the implementation
will also be executed when the mock is called.

Note: `jest.fn(implementation)` is a shorthand for `jest.fn().mockImplementation(implementation)`.

#### Parameters

• **fn?**

#### Returns

`this`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockImplementation`](MockInstance.md#mockimplementation)

#### Defined in

node\_modules/@types/jest/index.d.ts:1366

***

### mockImplementationOnce()

> **mockImplementationOnce**(`fn`): `this`

Accepts a function that will be used as an implementation of the mock for one call to the mocked function.
Can be chained so that multiple function calls produce different results.

#### Parameters

• **fn**

#### Returns

`this`

#### Example

```ts
const myMockFn = jest
  .fn()
   .mockImplementationOnce(cb => cb(null, true))
   .mockImplementationOnce(cb => cb(null, false));

myMockFn((err, val) => console.log(val)); // true

myMockFn((err, val) => console.log(val)); // false
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockImplementationOnce`](MockInstance.md#mockimplementationonce)

#### Defined in

node\_modules/@types/jest/index.d.ts:1382

***

### mockName()

> **mockName**(`name`): `this`

Sets the name of the mock.

#### Parameters

• **name**: `string`

#### Returns

`this`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockName`](MockInstance.md#mockname)

#### Defined in

node\_modules/@types/jest/index.d.ts:1398

***

### mockRejectedValue()

> **mockRejectedValue**(`value`): `this`

Simple sugar function for: `jest.fn().mockImplementation(() => Promise.reject(value));`

#### Parameters

• **value**: [`RejectedValue`](../type-aliases/RejectedValue.md)\<`T`\>

#### Returns

`this`

#### Example

```ts
test('async test', async () => {
  const asyncMock = jest.fn().mockRejectedValue(new Error('Async error'));

  await asyncMock(); // throws "Async error"
});
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockRejectedValue`](MockInstance.md#mockrejectedvalue)

#### Defined in

node\_modules/@types/jest/index.d.ts:1471

***

### mockRejectedValueOnce()

> **mockRejectedValueOnce**(`value`): `this`

Simple sugar function for: `jest.fn().mockImplementationOnce(() => Promise.reject(value));`

#### Parameters

• **value**: [`RejectedValue`](../type-aliases/RejectedValue.md)\<`T`\>

#### Returns

`this`

#### Example

```ts
test('async test', async () => {
 const asyncMock = jest
   .fn()
   .mockResolvedValueOnce('first call')
   .mockRejectedValueOnce(new Error('Async error'));

 await asyncMock(); // first call
 await asyncMock(); // throws "Async error"
});
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockRejectedValueOnce`](MockInstance.md#mockrejectedvalueonce)

#### Defined in

node\_modules/@types/jest/index.d.ts:1488

***

### mockReset()

> **mockReset**(): `this`

Resets all information stored in the mock, including any initial implementation and mock name given.

This is useful when you want to completely restore a mock back to its initial state.

Beware that `mockReset` will replace `mockFn.mock`, not just `mockFn.mock.calls` and `mockFn.mock.instances`.
You should therefore avoid assigning mockFn.mock to other variables, temporary or not, to make sure you
don't access stale data.

#### Returns

`this`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockReset`](MockInstance.md#mockreset)

#### Defined in

node\_modules/@types/jest/index.d.ts:1342

***

### mockResolvedValue()

> **mockResolvedValue**(`value`): `this`

Simple sugar function for: `jest.fn().mockImplementation(() => Promise.resolve(value));`

#### Parameters

• **value**: [`ResolvedValue`](../type-aliases/ResolvedValue.md)\<`T`\>

#### Returns

`this`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockResolvedValue`](MockInstance.md#mockresolvedvalue)

#### Defined in

node\_modules/@types/jest/index.d.ts:1440

***

### mockResolvedValueOnce()

> **mockResolvedValueOnce**(`value`): `this`

Simple sugar function for: `jest.fn().mockImplementationOnce(() => Promise.resolve(value));`

#### Parameters

• **value**: [`ResolvedValue`](../type-aliases/ResolvedValue.md)\<`T`\>

#### Returns

`this`

#### Example

```ts
test('async test', async () => {
 const asyncMock = jest
   .fn()
   .mockResolvedValue('default')
   .mockResolvedValueOnce('first call')
   .mockResolvedValueOnce('second call');

 await asyncMock(); // first call
 await asyncMock(); // second call
 await asyncMock(); // default
 await asyncMock(); // default
});
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockResolvedValueOnce`](MockInstance.md#mockresolvedvalueonce)

#### Defined in

node\_modules/@types/jest/index.d.ts:1459

***

### mockRestore()

> **mockRestore**(): `void`

Does everything that `mockFn.mockReset()` does, and also restores the original (non-mocked) implementation.

This is useful when you want to mock functions in certain test cases and restore the original implementation in others.

Beware that `mockFn.mockRestore` only works when mock was created with `jest.spyOn`. Thus you have to take care of restoration
yourself when manually assigning `jest.fn()`.

The [`restoreMocks`](https://jestjs.io/docs/en/configuration.html#restoremocks-boolean) configuration option is available
to restore mocks automatically between tests.

#### Returns

`void`

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockRestore`](MockInstance.md#mockrestore)

#### Defined in

node\_modules/@types/jest/index.d.ts:1354

***

### mockReturnThis()

> **mockReturnThis**(): `this`

Just a simple sugar function for:

#### Returns

`this`

#### Example

```ts
jest.fn(function() {
    return this;
  });
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockReturnThis`](MockInstance.md#mockreturnthis)

#### Defined in

node\_modules/@types/jest/index.d.ts:1408

***

### mockReturnValue()

> **mockReturnValue**(`value`): `this`

Accepts a value that will be returned whenever the mock function is called.

#### Parameters

• **value**: `T`

#### Returns

`this`

#### Example

```ts
const mock = jest.fn();
mock.mockReturnValue(42);
mock(); // 42
mock.mockReturnValue(43);
mock(); // 43
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockReturnValue`](MockInstance.md#mockreturnvalue)

#### Defined in

node\_modules/@types/jest/index.d.ts:1420

***

### mockReturnValueOnce()

> **mockReturnValueOnce**(`value`): `this`

Accepts a value that will be returned for one call to the mock function. Can be chained so that
successive calls to the mock function return different values. When there are no more
`mockReturnValueOnce` values to use, calls will return a value specified by `mockReturnValue`.

#### Parameters

• **value**: `T`

#### Returns

`this`

#### Example

```ts
const myMockFn = jest.fn()
  .mockReturnValue('default')
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call');

// 'first call', 'second call', 'default', 'default'
console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
```

#### Inherited from

[`MockInstance`](MockInstance.md).[`mockReturnValueOnce`](MockInstance.md#mockreturnvalueonce)

#### Defined in

node\_modules/@types/jest/index.d.ts:1436

***

### toString()

> **toString**(): `string`

Returns a string representation of a function.

#### Returns

`string`

#### Inherited from

`Function.toString`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:299

***

### withImplementation()

#### withImplementation(fn, callback)

> **withImplementation**(`fn`, `callback`): `Promise`\<`void`\>

Temporarily overrides the default mock implementation within the callback,
then restores its previous implementation.

##### Parameters

• **fn**

• **callback**

##### Returns

`Promise`\<`void`\>

##### Remarks

If the callback is async or returns a `thenable`, `withImplementation` will return a promise.
Awaiting the promise will await the callback and reset the implementation.

##### Inherited from

[`MockInstance`](MockInstance.md).[`withImplementation`](MockInstance.md#withimplementation)

##### Defined in

node\_modules/@types/jest/index.d.ts:1391

#### withImplementation(fn, callback)

> **withImplementation**(`fn`, `callback`): `void`

Temporarily overrides the default mock implementation within the callback,
then restores its previous implementation.

##### Parameters

• **fn**

• **callback**

##### Returns

`void`

##### Inherited from

[`MockInstance`](MockInstance.md).[`withImplementation`](MockInstance.md#withimplementation)

##### Defined in

node\_modules/@types/jest/index.d.ts:1396
