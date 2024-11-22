[**@-xun/debug**](../../README.md) • **Docs**

***

[@-xun/debug](../../README.md) / [src](../README.md) / ExtendedDebugger

# Interface: ExtendedDebugger()

A [InternalDebugger](InternalDebugger.md) interface extended with convenience methods.

## Extends

- `_InternalDebuggerNoExtends`.`DebuggerExtension`

> **ExtendedDebugger**(...`args`): `void`

A [InternalDebugger](InternalDebugger.md) interface extended with convenience methods.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[packages/debug/src/index.ts:79](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L79)

## Properties

### \[$instances\]

> **\[$instances\]**: `object`

An array of sub-instances (e.g. "error", "warn", etc), including the root
instance.

#### $log

> **$log**: [`ExtendedDebugger`](ExtendedDebugger.md)

A cyclical reference to the current logger.

#### error

> **error**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting error messages.

#### message

> **message**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting messages to the attention of the reader.

#### warn

> **warn**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`DebuggerExtension.[$instances]`

#### Defined in

[packages/debug/src/index.ts:106](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L106)

***

### color

> **color**: `string`

#### Inherited from

`_InternalDebuggerNoExtends.color`

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

`_InternalDebuggerNoExtends.destroy`

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

`_InternalDebuggerNoExtends.diff`

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

`_InternalDebuggerNoExtends.enabled`

#### Defined in

node\_modules/@types/debug/index.d.ts:44

***

### error

> **error**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting error messages.

#### Inherited from

`DebuggerExtension.error`

#### Defined in

[packages/debug/src/index.ts:129](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L129)

***

### extend()

> **extend**: (...`args`) => [`ExtendedDebugger`](ExtendedDebugger.md)

Creates a new instance by appending `namespace` to the current logger's
namespace.

#### Parameters

• ...**args**: [`string`, `string`]

#### Returns

[`ExtendedDebugger`](ExtendedDebugger.md)

#### Defined in

[packages/debug/src/index.ts:84](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L84)

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

`_InternalDebuggerNoExtends.log`

#### Defined in

[packages/debug/src/index.ts:51](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L51)

***

### message

> **message**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting messages to the attention of the reader.

#### Inherited from

`DebuggerExtension.message`

#### Defined in

[packages/debug/src/index.ts:125](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L125)

***

### namespace

> **namespace**: `string`

#### Inherited from

`_InternalDebuggerNoExtends.namespace`

#### Defined in

node\_modules/@types/debug/index.d.ts:46

***

### newline()

> **newline**: () => `void`

Send a blank newline to output.

#### Returns

`void`

#### Defined in

[packages/debug/src/index.ts:88](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L88)

***

### warn

> **warn**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`DebuggerExtension.warn`

#### Defined in

[packages/debug/src/index.ts:133](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L133)
