[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/resolvers](../README.md) / resolveExportsTargetsFromEntryPoint

# Function: resolveExportsTargetsFromEntryPoint()

> **resolveExportsTargetsFromEntryPoint**(`__namedParameters`): `string`[]

Given `entryPoint` and `conditions`, this function returns an array of zero
or more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are present. This is done by mapping `entryPoint` using
`exports` from `package.json`. `exports` is assumed to be valid.

## Parameters

• **\_\_namedParameters**: `object` & [`FlattenedExportsOption`](../type-aliases/FlattenedExportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md)

## Returns

`string`[]

## Defined in

[lib/@-xun/project-utils/src/resolvers.ts:154](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/resolvers.ts#L154)
