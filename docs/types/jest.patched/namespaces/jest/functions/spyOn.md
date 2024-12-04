[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / spyOn

# Function: spyOn()

## Call Signature

> **spyOn**\<`T`, `Key`, `A`, `Value`\>(`object`, `method`, `accessType`): `A` *extends* [`SetAccessor`](../type-aliases/SetAccessor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`void`, [`Value`]\> : `A` *extends* [`GetAccessor`](../type-aliases/GetAccessor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`Value`, []\> : `Value` *extends* [`Constructor`](../type-aliases/Constructor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`InstanceType`\<`Value`\>, [`ConstructorArgsType`](../type-aliases/ConstructorArgsType.md)\<`Value`\>\> : `Value` *extends* [`Func`](../type-aliases/Func.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`ReturnType`\<`Value`\>, [`ArgsType`](../type-aliases/ArgsType.md)\<`Value`\>\> : `never`

Creates a mock function similar to jest.fn but also tracks calls to `object[methodName]`

Note: By default, jest.spyOn also calls the spied method. This is different behavior from most
other test libraries.

### Type Parameters

• **T** *extends* `object`

• **Key** *extends* `string` \| `number` \| `symbol`

• **A** *extends* `"get"` \| `"set"` = [`PropertyAccessors`](../type-aliases/PropertyAccessors.md)\<`Key`, `T`\>

• **Value** = `Required`\<`T`\>\[`Key`\]

### Parameters

#### object

`T`

#### method

`Key`

#### accessType

`A`

### Returns

`A` *extends* [`SetAccessor`](../type-aliases/SetAccessor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`void`, [`Value`]\> : `A` *extends* [`GetAccessor`](../type-aliases/GetAccessor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`Value`, []\> : `Value` *extends* [`Constructor`](../type-aliases/Constructor.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`InstanceType`\<`Value`\>, [`ConstructorArgsType`](../type-aliases/ConstructorArgsType.md)\<`Value`\>\> : `Value` *extends* [`Func`](../type-aliases/Func.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`ReturnType`\<`Value`\>, [`ArgsType`](../type-aliases/ArgsType.md)\<`Value`\>\> : `never`

### Example

```ts
const video = require('./video');

test('plays video', () => {
  const spy = jest.spyOn(video, 'play');
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockReset();
  spy.mockRestore();
});
```

### Defined in

node\_modules/@types/jest/index.d.ts:389

## Call Signature

> **spyOn**\<`T`, `M`\>(`object`, `method`): [`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\] *extends* (...`args`) => `any` ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`InstanceType`\<[`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>, [`ConstructorArgsType`](../type-aliases/ConstructorArgsType.md)\<[`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>\> : `never`

Creates a mock function similar to jest.fn but also tracks calls to `object[methodName]`

Note: By default, jest.spyOn also calls the spied method. This is different behavior from most
other test libraries.

### Type Parameters

• **T** *extends* `object`

• **M** *extends* `string` \| `number` \| `symbol`

### Parameters

#### object

`T`

#### method

`M`

### Returns

[`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\] *extends* (...`args`) => `any` ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`InstanceType`\<[`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>, [`ConstructorArgsType`](../type-aliases/ConstructorArgsType.md)\<[`ConstructorProperties`](../type-aliases/ConstructorProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>\> : `never`

### Example

```ts
const video = require('./video');

test('plays video', () => {
  const spy = jest.spyOn(video, 'play');
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockReset();
  spy.mockRestore();
});
```

### Defined in

node\_modules/@types/jest/index.d.ts:403

## Call Signature

> **spyOn**\<`T`, `M`\>(`object`, `method`): [`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\] *extends* [`Func`](../type-aliases/Func.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`ReturnType`\<[`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>, [`ArgsType`](../type-aliases/ArgsType.md)\<[`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>\> : `never`

Creates a mock function similar to jest.fn but also tracks calls to `object[methodName]`

Note: By default, jest.spyOn also calls the spied method. This is different behavior from most
other test libraries.

### Type Parameters

• **T** *extends* `object`

• **M** *extends* `string` \| `number` \| `symbol`

### Parameters

#### object

`T`

#### method

`M`

### Returns

[`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\] *extends* [`Func`](../type-aliases/Func.md) ? [`SpyInstance`](../interfaces/SpyInstance.md)\<`ReturnType`\<[`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>, [`ArgsType`](../type-aliases/ArgsType.md)\<[`FunctionProperties`](../type-aliases/FunctionProperties.md)\<`Required`\<`T`\>\>\[`M`\]\>\> : `never`

### Example

```ts
const video = require('./video');

test('plays video', () => {
  const spy = jest.spyOn(video, 'play');
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);

  spy.mockReset();
  spy.mockRestore();
});
```

### Defined in

node\_modules/@types/jest/index.d.ts:411
