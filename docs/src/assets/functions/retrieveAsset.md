[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / retrieveAsset

# Function: retrieveAsset()

> **retrieveAsset**(`__namedParameters`): `Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

Retrieve an asset via its filename. For example, to retrieve an
`eslint.config.js` file (the transformer source for which exists in
`./config/_eslint.config.js.ts`), pass `"eslint.config.js"` as the `name`
parameter.

Throws if no corresponding transformer for `name` can be found.

Expects an xscripts project init-time (or renovate-time) context object (i.e.
[TransformerContext](../type-aliases/TransformerContext.md) + [RequiredTransformerContext](../type-aliases/RequiredTransformerContext.md)).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.context**: [`TransformerContext`](../type-aliases/TransformerContext.md) & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

• **\_\_namedParameters.name**: `string`

• **\_\_namedParameters.options?**: `EmptyObject` = `{}`

## Returns

`Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

## Defined in

[src/assets/index.ts:100](https://github.com/Xunnamius/xscripts/blob/184c8e10da5407b40476129ff0f6e538d7df3af0/src/assets/index.ts#L100)
