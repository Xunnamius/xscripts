[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/debug-extended](../README.md) / UnextendableInternalDebugger

# Interface: UnextendableInternalDebugger()

An instance of InternalDebugger that cannot be extended via
`InternalDebugger.extend`.

## Extends

- `InternalDebugger`

## Extended by

- [`UnextendableInternalLogger`](../../rejoinder/interfaces/UnextendableInternalLogger.md)

> **UnextendableInternalDebugger**(...`args`): `void`

Send an optionally-formatted message to output.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/debug-extended/index.ts:57](https://github.com/Xunnamius/xscripts/blob/4c305ac01bcb5579e4796a0cd2b08508dc5de5e1/lib/debug-extended/index.ts#L57)

## Properties

### color

> **color**: `string`

#### Inherited from

`InternalDebugger.color`

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

`InternalDebugger.destroy`

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

`InternalDebugger.diff`

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

`InternalDebugger.enabled`

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

`InternalDebugger.extend`

#### Defined in

[lib/debug-extended/index.ts:58](https://github.com/Xunnamius/xscripts/blob/4c305ac01bcb5579e4796a0cd2b08508dc5de5e1/lib/debug-extended/index.ts#L58)

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

`InternalDebugger.log`

#### Defined in

[lib/debug-extended/index.ts:51](https://github.com/Xunnamius/xscripts/blob/4c305ac01bcb5579e4796a0cd2b08508dc5de5e1/lib/debug-extended/index.ts#L51)

***

### namespace

> **namespace**: `string`

#### Inherited from

`InternalDebugger.namespace`

#### Defined in

node\_modules/@types/debug/index.d.ts:46
