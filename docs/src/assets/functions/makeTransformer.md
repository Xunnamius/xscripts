[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / makeTransformer

# Function: makeTransformer()

> **makeTransformer**(`transform`): [`TransformerContainer`](../type-aliases/TransformerContainer.md)

Accepts a [Transform](../type-aliases/Transform.md) function and returns a
[TransformerContainer](../type-aliases/TransformerContainer.md) containing a single [Transformer](../type-aliases/Transformer.md).

[Transformer](../type-aliases/Transformer.md)s are responsible for returning only relevant asset paths
(and their lazily-generated contents) conditioned on the current context;
e.g.: when running `npx xscripts project renovate --regenerate-assets
--assets-preset=lib`.

## Parameters

### transform

[`Transform`](../type-aliases/Transform.md)

## Returns

[`TransformerContainer`](../type-aliases/TransformerContainer.md)

## Defined in

[src/assets.ts:411](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets.ts#L411)
