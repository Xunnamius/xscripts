[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / makeTransformer

# Function: makeTransformer()

> **makeTransformer**\<`CustomTransformContext`\>(`__namedParameters`): `object`

Create a transformer function that takes a custom [TransformerContext](../type-aliases/TransformerContext.md)
instance, and an optional [TransformerOptions](../type-aliases/TransformerOptions.md), and returns a
[TransformerResult](../type-aliases/TransformerResult.md).

## Type Parameters

• **CustomTransformContext** *extends* [`TransformerContext`](../type-aliases/TransformerContext.md) = [`TransformerContext`](../type-aliases/TransformerContext.md)

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.transform**

## Returns

`object`

### transformer()

#### Parameters

• **context**: `Partial`\<`CustomTransformContext`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

• **options**: [`TransformerOptions`](../type-aliases/TransformerOptions.md) = `{}`

#### Returns

[`TransformerResult`](../type-aliases/TransformerResult.md)

## Defined in

[src/assets/index.ts:126](https://github.com/Xunnamius/xscripts/blob/c4bd6059488244ad158454492e5cfe3fcc65a457/src/assets/index.ts#L126)
