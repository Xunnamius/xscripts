[**@-xun/debug**](../../README.md) • **Docs**

***

[@-xun/debug](../../README.md) / [src](../README.md) / finalizeDebugger

# Function: finalizeDebugger()

> **finalizeDebugger**(`instance`): [`UnextendableInternalDebugger`](../interfaces/UnextendableInternalDebugger.md)

Replace the `extend` method of an [InternalDebugger](../interfaces/InternalDebugger.md) instance with a
function that always throws.

## Parameters

• **instance**: [`InternalDebugger`](../interfaces/InternalDebugger.md)

## Returns

[`UnextendableInternalDebugger`](../interfaces/UnextendableInternalDebugger.md)

## Defined in

[packages/debug/src/index.ts:276](https://github.com/Xunnamius/xscripts/blob/d2db4f15931b0a090468a7f632e37a6ee627b667/packages/debug/src/index.ts#L276)
