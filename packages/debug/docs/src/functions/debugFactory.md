[**@-xun/debug**](../../README.md) • **Docs**

***

[@-xun/debug](../../README.md) / [src](../README.md) / debugFactory

# Function: debugFactory()

An `ExtendedDebug` instance that returns an [ExtendedDebugger](../interfaces/ExtendedDebugger.md) instance
via [extendDebugger](extendDebugger.md).

## debugFactory(args)

> **debugFactory**(...`args`): [`ExtendedDebugger`](../interfaces/ExtendedDebugger.md)

Send an optionally-formatted message to output.

### Parameters

• ...**args**: [`string`]

### Returns

[`ExtendedDebugger`](../interfaces/ExtendedDebugger.md)

### Defined in

[packages/debug/src/index.ts:181](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L181)

## debugFactory(args)

> **debugFactory**(...`args`): [`InternalDebugger`](../interfaces/InternalDebugger.md)

Create and return a new [InternalDebugger](../interfaces/InternalDebugger.md) instance.

### Parameters

• ...**args**: [`string`]

### Returns

[`InternalDebugger`](../interfaces/InternalDebugger.md)

### Defined in

[packages/debug/src/index.ts:181](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L181)

## debugFactory(namespace)

> **debugFactory**(`namespace`): `Debugger`

An `ExtendedDebug` instance that returns an [ExtendedDebugger](../interfaces/ExtendedDebugger.md) instance
via [extendDebugger](extendDebugger.md).

### Parameters

• **namespace**: `string`

### Returns

`Debugger`

### Defined in

[packages/debug/src/index.ts:181](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L181)
