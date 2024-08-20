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

An instance of InternalDebugger that cannot be extended via
`InternalDebugger.extend`.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/debug-extended/index.ts:56](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/debug-extended/index.ts#L56)

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

[lib/debug-extended/index.ts:57](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/debug-extended/index.ts#L57)

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

[lib/debug-extended/index.ts:50](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/debug-extended/index.ts#L50)

***

### namespace

> **namespace**: `string`

#### Inherited from

`InternalDebugger.namespace`

#### Defined in

node\_modules/@types/debug/index.d.ts:46
