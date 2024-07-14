[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / retrieveAsset

# Function: retrieveAsset()

> **retrieveAsset**(`__namedParameters`): `Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

Retrieve an asset via its filename. For example, to retrieve an
`.eslintrc.js` file (the transformer source for which exists in
`./configs/_.eslintrc.js.ts`), pass `".eslintrc.js"` as the `name` parameter.

Throws if no corresponding transformer for `name` can be found.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.context**: [`TransformerContext`](../type-aliases/TransformerContext.md) & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

• **\_\_namedParameters.name**: `string`

• **\_\_namedParameters.options?**: [`TransformerOptions`](../type-aliases/TransformerOptions.md) = `{}`

## Returns

`Promise`\<[`TransformerResult`](../type-aliases/TransformerResult.md)\>

## Defined in

[src/assets/index.ts:88](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/src/assets/index.ts#L88)
