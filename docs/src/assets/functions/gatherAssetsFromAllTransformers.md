[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / gatherAssetsFromAllTransformers

# Function: gatherAssetsFromAllTransformers()

> **gatherAssetsFromAllTransformers**(`__namedParameters`): `Promise`\<[`ReifiedAssets`](../type-aliases/ReifiedAssets.md)\>

Retrieve all available assets conditioned on `transformerContext`. Since
computing asset file contents are deferred until the generator function is
called, calling this function is **quick and safe** and will _not_
immediately load a bunch of assets into memory.

## Parameters

### \_\_namedParameters

#### options

[`MakeTransformerOptions`](../type-aliases/MakeTransformerOptions.md) = `{}`

#### transformerContext

[`IncomingTransformerContext`](../type-aliases/IncomingTransformerContext.md)

## Returns

`Promise`\<[`ReifiedAssets`](../type-aliases/ReifiedAssets.md)\>

## See

[gatherAssetsFromTransformer](gatherAssetsFromTransformer.md)

## Defined in

[src/assets.ts:374](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets.ts#L374)
