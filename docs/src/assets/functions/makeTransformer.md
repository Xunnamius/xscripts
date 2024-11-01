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

• **this**: `void`

• **context**: `Partial`\<`CustomTransformContext`\> & [`RequiredTransformerContext`](../type-aliases/RequiredTransformerContext.md)

• **options**: `EmptyObject` = `{}`

#### Returns

[`TransformerResult`](../type-aliases/TransformerResult.md)

## Defined in

[src/assets.ts:137](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/src/assets.ts#L137)
