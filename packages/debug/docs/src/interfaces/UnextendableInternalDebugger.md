[**@-xun/debug**](../../README.md) • **Docs**

***

[@-xun/debug](../../README.md) / [src](../README.md) / UnextendableInternalDebugger

# Interface: UnextendableInternalDebugger()

An instance of [InternalDebugger](InternalDebugger.md) that cannot be extended via
`InternalDebugger.extend`.

## Extends

- [`InternalDebugger`](InternalDebugger.md)

> **UnextendableInternalDebugger**(...`args`): `void`

An instance of [InternalDebugger](InternalDebugger.md) that cannot be extended via
`InternalDebugger.extend`.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[packages/debug/src/index.ts:57](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L57)

## Properties

### color

> **color**: `string`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`color`](InternalDebugger.md#color)

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`destroy`](InternalDebugger.md#destroy)

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`diff`](InternalDebugger.md#diff)

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`enabled`](InternalDebugger.md#enabled)

#### Defined in

node\_modules/@types/debug/index.d.ts:44

***

### extend()

> **extend**: (...`args`) => `never`

#### Parameters

• ...**args**: [`string`, `string`]

#### Returns

`never`

#### Overrides

[`InternalDebugger`](InternalDebugger.md).[`extend`](InternalDebugger.md#extend)

#### Defined in

[packages/debug/src/index.ts:58](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L58)

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`log`](InternalDebugger.md#log)

#### Defined in

[packages/debug/src/index.ts:51](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L51)

***

### namespace

> **namespace**: `string`

#### Inherited from

[`InternalDebugger`](InternalDebugger.md).[`namespace`](InternalDebugger.md#namespace)

#### Defined in

node\_modules/@types/debug/index.d.ts:46
