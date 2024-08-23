[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/resolvers](../README.md) / resolveImportsTargetsFromEntryPoint

# Function: resolveImportsTargetsFromEntryPoint()

> **resolveImportsTargetsFromEntryPoint**(`__namedParameters`): `string`[]

Given `entryPoint` and `conditions`, this function returns an array of zero
or more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are present. This is done by mapping `entryPoint` using
`imports` from `package.json`. `imports` is assumed to be valid.

## Parameters

• **\_\_namedParameters**: `object` & [`FlattenedImportsOption`](../type-aliases/FlattenedImportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md)

## Returns

`string`[]

## Defined in

[lib/@-xun/project-utils/src/resolvers.ts:232](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/resolvers.ts#L232)
