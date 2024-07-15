[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / retrieveAsset

# Function: retrieveAsset()

> **retrieveAsset**(`__namedParameters`): `Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

Retrieve an asset via its filename. For example, to retrieve an
`.eslintrc.js` file (the transformer source for which exists in
`./config/_.eslintrc.js.ts`), pass `".eslintrc.js"` as the `name` parameter.

Throws if no corresponding transformer for `name` can be found.

Expects an xscripts project init-time (or renovate-time) context object (i.e.
[TransformerContext](../type-aliases/TransformerContext.md) + [RequiredTransformerContext](../type-aliases/RequiredTransformerContext.md)).

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.context**: [`TransformerContext`](../type-aliases/TransformerContext.md) & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

• **\_\_namedParameters.name**: `string`

• **\_\_namedParameters.options?**: [`TransformerOptions`](../type-aliases/TransformerOptions.md) = `{}`

## Returns

`Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

## Defined in

[src/assets/index.ts:101](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/assets/index.ts#L101)
