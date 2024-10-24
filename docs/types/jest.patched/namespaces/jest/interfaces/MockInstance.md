[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / MockInstance

# Interface: MockInstance\<T, Y, C\>

## Extended by

- [`MockWithArgs`](MockWithArgs.md)
- [`Mock`](Mock.md)
- [`SpyInstance`](SpyInstance.md)

## Type Parameters

• **T**

• **Y** *extends* `any`[]

• **C** = `any`

## Properties

### mock

> **mock**: [`MockContext`](MockContext.md)\<`T`, `Y`, `C`\>

Provides access to the mock's metadata

#### Defined in

node\_modules/@types/jest/index.d.ts:1321

## Methods

### getMockImplementation()

> **getMockImplementation**(): `undefined` \| (...`args`) => `T`

Returns the function that was set as the implementation of the mock (using mockImplementation).

#### Returns

`undefined` \| (...`args`) => `T`

#### Defined in

node\_modules/@types/jest/index.d.ts:1357

***

### getMockName()

> **getMockName**(): `string`

Returns the mock name string set by calling `mockFn.mockName(value)`.

#### Returns

`string`

#### Defined in

node\_modules/@types/jest/index.d.ts:1319

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1331

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1365

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1381

***

### mockName()

> **mockName**(`name`): `this`

Sets the name of the mock.

#### Parameters

• **name**: `string`

#### Returns

`this`

#### Defined in

node\_modules/@types/jest/index.d.ts:1397

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1470

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1487

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1341

***

### mockResolvedValue()

> **mockResolvedValue**(`value`): `this`

Simple sugar function for: `jest.fn().mockImplementation(() => Promise.resolve(value));`

#### Parameters

• **value**: [`ResolvedValue`](../type-aliases/ResolvedValue.md)\<`T`\>

#### Returns

`this`

#### Defined in

node\_modules/@types/jest/index.d.ts:1439

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1458

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1353

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1407

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1419

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

#### Defined in

node\_modules/@types/jest/index.d.ts:1435

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

##### Defined in

node\_modules/@types/jest/index.d.ts:1390

#### withImplementation(fn, callback)

> **withImplementation**(`fn`, `callback`): `void`

Temporarily overrides the default mock implementation within the callback,
then restores its previous implementation.

##### Parameters

• **fn**

• **callback**

##### Returns

`void`

##### Defined in

node\_modules/@types/jest/index.d.ts:1395
