[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / retrieveConfigAsset

# Function: retrieveConfigAsset()

> **retrieveConfigAsset**(`__namedParameters`): `Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

Retrieve an asset via its identifier (typically a filename). For example, to
retrieve an `eslint.config.mjs` file, the transformer source for which exists
in `./config/_eslint.config.mjs.ts`, pass `"eslint.config.mjs"` as the
`asset` parameter.

Throws if no corresponding transformer for `asset` can be found.

Expects a full context object (i.e. [TransformerContext](../type-aliases/TransformerContext.md)).

## Parameters

### \_\_namedParameters

#### asset

`string`

#### context

`Omit`\<[`TransformerContext`](../type-aliases/TransformerContext.md), `"asset"`\>

#### options

[`TransformerOptions`](../type-aliases/TransformerOptions.md) & [`RetrievalOptions`](../type-aliases/RetrievalOptions.md) = `{}`

## Returns

`Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

## Defined in

[src/assets.ts:138](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets.ts#L138)
