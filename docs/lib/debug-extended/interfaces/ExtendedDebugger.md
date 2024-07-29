[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/debug-extended](../README.md) / ExtendedDebugger

# Interface: ExtendedDebugger()

A InternalDebugger interface extended with convenience methods.

## Extends

- `_InternalDebuggerNoExtends`.`DebuggerExtension`

> **ExtendedDebugger**(...`args`): `void`

A InternalDebugger interface extended with convenience methods.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/debug-extended/index.ts:80](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L80)

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

[lib/debug-extended/index.ts:107](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L107)

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

[lib/debug-extended/index.ts:130](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L130)

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

[lib/debug-extended/index.ts:85](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L85)

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

[lib/debug-extended/index.ts:50](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L50)

***

### message

> **message**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting messages to the attention of the reader.

#### Inherited from

`DebuggerExtension.message`

#### Defined in

[lib/debug-extended/index.ts:126](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L126)

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

[lib/debug-extended/index.ts:89](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L89)

***

### warn

> **warn**: [`UnextendableInternalDebugger`](UnextendableInternalDebugger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`DebuggerExtension.warn`

#### Defined in

[lib/debug-extended/index.ts:134](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L134)
