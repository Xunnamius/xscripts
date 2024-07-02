[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / UnextendableInternalLogger

# Interface: UnextendableInternalLogger()

An instance of [UnextendableInternalDebugger](../../debug-extended/interfaces/UnextendableInternalDebugger.md) that that belongs to an
[ExtendedLogger](ExtendedLogger.md).

## Extends

- [`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md)

> **UnextendableInternalLogger**(...`args`): `void`

Send an optionally-formatted message to output.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:79](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/lib/rejoinder/index.ts#L79)

> **UnextendableInternalLogger**(...`args`): `void`

Send a tagged optionally-formatted message to output.

## Parameters

• ...**args**: [`string`[], `any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:83](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/lib/rejoinder/index.ts#L83)

> **UnextendableInternalLogger**(...`args`): `void`

Send an optionally-formatted message to output.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:75](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/lib/rejoinder/index.ts#L75)

## Properties

### color

> **color**: `string`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`color`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#color)

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`destroy`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#destroy)

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`diff`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#diff)

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`enabled`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#enabled)

#### Defined in

node\_modules/@types/debug/index.d.ts:44

***

### extend()

> **extend**: (...`args`) => `never`

#### Parameters

• ...**args**: [`string`, `string`]

#### Returns

`never`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`extend`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#extend)

#### Defined in

[lib/debug-extended/index.ts:58](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/lib/debug-extended/index.ts#L58)

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`log`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#log)

#### Defined in

[lib/debug-extended/index.ts:51](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/lib/debug-extended/index.ts#L51)

***

### namespace

> **namespace**: `string`

#### Inherited from

[`UnextendableInternalDebugger`](../../debug-extended/interfaces/UnextendableInternalDebugger.md).[`namespace`](../../debug-extended/interfaces/UnextendableInternalDebugger.md#namespace)

#### Defined in

node\_modules/@types/debug/index.d.ts:46
