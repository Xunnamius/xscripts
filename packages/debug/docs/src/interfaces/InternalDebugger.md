[**@-xun/debug**](../../README.md) • **Docs**

***

[@-xun/debug](../../README.md) / [src](../README.md) / InternalDebugger

# Interface: InternalDebugger()

The base `Debugger` interface coming from the [debug](https://npm.im/debug)
package.

## Extends

- `__Debugger`

## Extended by

- [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

> **InternalDebugger**(...`args`): `void`

The base `Debugger` interface coming from the [debug](https://npm.im/debug)
package.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[packages/debug/src/index.ts:47](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L47)

## Properties

### color

> **color**: `string`

#### Inherited from

`__Debugger.color`

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

`__Debugger.destroy`

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

`__Debugger.diff`

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

`__Debugger.enabled`

#### Defined in

node\_modules/@types/debug/index.d.ts:44

***

### extend()

> **extend**: (`namespace`, `delimiter`?) => `Debugger`

#### Parameters

• **namespace**: `string`

• **delimiter?**: `string`

#### Returns

`Debugger`

#### Inherited from

`__Debugger.extend`

#### Defined in

node\_modules/@types/debug/index.d.ts:48

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

`__Debugger.log`

#### Defined in

[packages/debug/src/index.ts:51](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L51)

***

### namespace

> **namespace**: `string`

#### Inherited from

`__Debugger.namespace`

#### Defined in

node\_modules/@types/debug/index.d.ts:46
