[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeBuilderObjectValueWithoutExtensions

# Type Alias: BfeBuilderObjectValueWithoutExtensions

> **BfeBuilderObjectValueWithoutExtensions**: `Omit`\<[`BfGenericBuilderObjectValue`](BfGenericBuilderObjectValue.md), `"conflicts"` \| `"implies"` \| `"demandOption"` \| `"demand"` \| `"require"` \| `"required"` \| `"default"`\>

An object containing a subset of only those properties recognized by
Black Flag (and, consequentially, vanilla yargs). Also excludes
properties that conflict with [BfeBuilderObjectValueExtensions](BfeBuilderObjectValueExtensions.md) and/or
are deprecated by vanilla yargs.

This type + [BfeBuilderObjectValueExtensions](BfeBuilderObjectValueExtensions.md) =
[BfeBuilderObjectValue](BfeBuilderObjectValue.md).

This type is a subset of [BfBuilderObjectValue](BfBuilderObjectValue.md).

## Defined in

[lib/@black-flag/extensions/index.ts:417](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/lib/@black-flag/extensions/index.ts#L417)
