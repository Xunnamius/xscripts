[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / ExtendedLogger

# Interface: ExtendedLogger()

A wrapper around [ExtendedDebugger](../../debug-extended/interfaces/ExtendedDebugger.md) representing the extension from
mere "debug" logger to general purpose "logger".

## Extends

- `_ExtendedLogger`\<[`ExtendedLogger`](ExtendedLogger.md)\>

> **ExtendedLogger**(...`args`): `void`

Send an optionally-formatted message to output.

## Parameters

• ...**args**: [`any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:94](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/rejoinder/index.ts#L94)

> **ExtendedLogger**(...`args`): `void`

Send a tagged optionally-formatted message to output.

## Parameters

• ...**args**: [`string`[], `any`, `...args: any[]`]

## Returns

`void`

## Defined in

[lib/rejoinder/index.ts:98](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/rejoinder/index.ts#L98)

## Properties

### \[$instances\]

> **\[$instances\]**: `object`

An array of sub-instances (e.g. "error", "warn", etc), including the root
instance.

#### $log

> **$log**: [`ExtendedLogger`](ExtendedLogger.md)

A cyclical reference to the current logger.

#### error

> **error**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting error messages.

#### message

> **message**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting messages to the attention of the reader.

#### warn

> **warn**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`_ExtendedLogger.[$instances]`

#### Defined in

[lib/debug-extended/index.ts:108](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/debug-extended/index.ts#L108)

***

### color

> **color**: `string`

#### Inherited from

`_ExtendedLogger.color`

#### Defined in

node\_modules/@types/debug/index.d.ts:42

***

### destroy()

> **destroy**: () => `boolean`

#### Returns

`boolean`

#### Inherited from

`_ExtendedLogger.destroy`

#### Defined in

node\_modules/@types/debug/index.d.ts:47

***

### diff

> **diff**: `number`

#### Inherited from

`_ExtendedLogger.diff`

#### Defined in

node\_modules/@types/debug/index.d.ts:43

***

### enabled

> **enabled**: `boolean`

#### Inherited from

`_ExtendedLogger.enabled`

#### Defined in

node\_modules/@types/debug/index.d.ts:44

***

### error

> **error**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting error messages.

#### Inherited from

`_ExtendedLogger.error`

#### Defined in

[lib/debug-extended/index.ts:131](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/debug-extended/index.ts#L131)

***

### log()?

> `optional` **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

`_ExtendedLogger.log`

#### Defined in

[lib/debug-extended/index.ts:51](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/debug-extended/index.ts#L51)

***

### message

> **message**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting messages to the attention of the reader.

#### Inherited from

`_ExtendedLogger.message`

#### Defined in

[lib/debug-extended/index.ts:127](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/debug-extended/index.ts#L127)

***

### namespace

> **namespace**: `string`

#### Inherited from

`_ExtendedLogger.namespace`

#### Defined in

node\_modules/@types/debug/index.d.ts:46

***

### warn

> **warn**: [`UnextendableInternalLogger`](UnextendableInternalLogger.md)

A sub-instance for outputting warning messages.

#### Inherited from

`_ExtendedLogger.warn`

#### Defined in

[lib/debug-extended/index.ts:135](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/debug-extended/index.ts#L135)

## Methods

### extend()

> **extend**(...`args`): [`ExtendedLogger`](ExtendedLogger.md)

Creates a new instance by appending `namespace` to the current logger's
namespace.

#### Parameters

• ...**args**: [`string`, `string`]

#### Returns

[`ExtendedLogger`](ExtendedLogger.md)

#### Defined in

[lib/rejoinder/index.ts:128](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/rejoinder/index.ts#L128)

***

### newline()

#### newline(args)

> **newline**(...`args`): `void`

Send a blank newline to output.

##### Parameters

• ...**args**: [`string`[], `"default"` \| `"alternate"`]

##### Returns

`void`

##### Defined in

[lib/rejoinder/index.ts:107](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/rejoinder/index.ts#L107)

#### newline(args)

> **newline**(...`args`): `void`

Send a blank newline to output.

##### Parameters

• ...**args**: [`"default"` \| `"alternate"`]

##### Returns

`void`

##### Defined in

[lib/rejoinder/index.ts:121](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/lib/rejoinder/index.ts#L121)
