[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / generateRootOnlyAssets

# Function: generateRootOnlyAssets()

> **generateRootOnlyAssets**(`transformerContext`, `adder`): `Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

Takes a [TransformerContext](../type-aliases/TransformerContext.md) and an adder function and returns an array
of [Asset](../type-aliases/Asset.md)s when the current package is a RootPackage or scope
is set to [DefaultGlobalScope.Unlimited](../../configure/enumerations/DefaultGlobalScope.md#unlimited).

## Parameters

### transformerContext

[`TransformerContext`](../type-aliases/TransformerContext.md)

### adder

(`helpers`) => `Promisable`\<`undefined` \| [`Asset`](../type-aliases/Asset.md)[]\>

## Returns

`Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

## Defined in

[src/assets.ts:697](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/assets.ts#L697)
