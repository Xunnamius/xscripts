[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/debug-extended](../README.md) / ExtendedDebugger

# Interface: ExtendedDebugger()

A InternalDebugger interface extended with convenience methods.

## Extends

- `_InternalDebuggerNoExtends`.`DebuggerExtension`

> **ExtendedDebugger**(...`args`): `void`

Send an optionally-formatted message to output.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/debug-extended/index.ts:81](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L81)

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

[lib/debug-extended/index.ts:108](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L108)

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

[lib/debug-extended/index.ts:131](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L131)

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

[lib/debug-extended/index.ts:86](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L86)

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

[lib/debug-extended/index.ts:51](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L51)

***

### message

> **message**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting messages to the attention of the reader.

#### Inherited from

`DebuggerExtension.message`

#### Defined in

[lib/debug-extended/index.ts:127](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L127)

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

[lib/debug-extended/index.ts:90](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L90)

***

### warn

> **warn**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`DebuggerExtension.warn`

#### Defined in

[lib/debug-extended/index.ts:135](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L135)
