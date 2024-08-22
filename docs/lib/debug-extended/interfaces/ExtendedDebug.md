[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/debug-extended](../README.md) / ExtendedDebug

# Interface: ExtendedDebug()

An InternalDebug factory interface that returns
[ExtendedDebugger](ExtendedDebugger.md) instances.

## Extends

- `InternalDebug`

> **ExtendedDebug**(...`args`): [`ExtendedDebugger`](ExtendedDebugger.md)

An InternalDebug factory interface that returns
[ExtendedDebugger](ExtendedDebugger.md) instances.

## Parameters

• ...**args**: [`string`]

## Returns

[`ExtendedDebugger`](ExtendedDebugger.md)

## Defined in

[lib/debug-extended/index.ts:68](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/debug-extended/index.ts#L68)

> **ExtendedDebug**(...`args`): `InternalDebugger`

An InternalDebug factory interface that returns
[ExtendedDebugger](ExtendedDebugger.md) instances.

## Parameters

• ...**args**: [`string`]

## Returns

`InternalDebugger`

## Defined in

[lib/debug-extended/index.ts:64](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/debug-extended/index.ts#L64)

> **ExtendedDebug**(`namespace`): `Debugger`

An InternalDebug factory interface that returns
[ExtendedDebugger](ExtendedDebugger.md) instances.

## Parameters

• **namespace**: `string`

## Returns

`Debugger`

## Defined in

[lib/debug-extended/index.ts:64](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/debug-extended/index.ts#L64)

## Properties

### coerce()

> **coerce**: (`val`) => `any`

#### Parameters

• **val**: `any`

#### Returns

`any`

#### Inherited from

`InternalDebug.coerce`

#### Defined in

node\_modules/@types/debug/index.d.ts:9

***

### disable()

> **disable**: (`namespace`?) => `string`

#### Parameters

• **namespace?**: `string`

#### Returns

`string`

#### Overrides

`InternalDebug.disable`

#### Defined in

[lib/debug-extended/index.ts:70](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/debug-extended/index.ts#L70)

***

### enable()

> **enable**: (`namespaces`) => `void`

#### Parameters

• **namespaces**: `string`

#### Returns

`void`

#### Inherited from

`InternalDebug.enable`

#### Defined in

node\_modules/@types/debug/index.d.ts:11

***

### enabled()

> **enabled**: (`namespaces`) => `boolean`

#### Parameters

• **namespaces**: `string`

#### Returns

`boolean`

#### Inherited from

`InternalDebug.enabled`

#### Defined in

node\_modules/@types/debug/index.d.ts:12

***

### formatArgs()

> **formatArgs**: (`this`, `args`) => `void`

#### Parameters

• **this**: `Debugger`

• **args**: `any`[]

#### Returns

`void`

#### Inherited from

`InternalDebug.formatArgs`

#### Defined in

node\_modules/@types/debug/index.d.ts:13

***

### formatters

> **formatters**: `Formatters`

#### Inherited from

`InternalDebug.formatters`

#### Defined in

node\_modules/@types/debug/index.d.ts:21

***

### humanize()

> **humanize**: (`value`, `options`?) => `string`(`value`) => `number`

Short/Long format for `value`.

#### Parameters

• **value**: `number`

• **options?**

• **options.long?**: `boolean`

#### Returns

`string`

Parse the given `value` and return milliseconds.

#### Parameters

• **value**: `string`

#### Returns

`number`

#### Inherited from

`InternalDebug.humanize`

#### Defined in

node\_modules/@types/debug/index.d.ts:16

***

### inspectOpts?

> `optional` **inspectOpts**: `object`

#### colors?

> `optional` **colors**: `null` \| `number` \| `boolean`

#### depth?

> `optional` **depth**: `null` \| `number` \| `boolean`

#### hideDate?

> `optional` **hideDate**: `null` \| `number` \| `boolean`

#### showHidden?

> `optional` **showHidden**: `null` \| `number` \| `boolean`

#### Inherited from

`InternalDebug.inspectOpts`

#### Defined in

node\_modules/@types/debug/index.d.ts:23

***

### log()

> **log**: (...`args`) => `any`

#### Parameters

• ...**args**: `any`[]

#### Returns

`any`

#### Inherited from

`InternalDebug.log`

#### Defined in

node\_modules/@types/debug/index.d.ts:14

***

### names

> **names**: `RegExp`[]

#### Inherited from

`InternalDebug.names`

#### Defined in

node\_modules/@types/debug/index.d.ts:18

***

### selectColor()

> **selectColor**: (`namespace`) => `string` \| `number`

#### Parameters

• **namespace**: `string`

#### Returns

`string` \| `number`

#### Inherited from

`InternalDebug.selectColor`

#### Defined in

node\_modules/@types/debug/index.d.ts:15

***

### skips

> **skips**: `RegExp`[]

#### Inherited from

`InternalDebug.skips`

#### Defined in

node\_modules/@types/debug/index.d.ts:19
