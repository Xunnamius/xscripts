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

[src/assets.ts:233](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets.ts#L233)
