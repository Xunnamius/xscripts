[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / deepMergeConfig

# Function: deepMergeConfig()

> **deepMergeConfig**\<`ConfigurationType`\>(`originalConfiguration`, `overwrites`, `customReplacer`?): `ConfigurationType`

A thin wrapper around lodash's mergeWith that does not mutate
`originalConfiguration`.

## Type Parameters

• **ConfigurationType**

## Parameters

• **originalConfiguration**: `ConfigurationType`

• **overwrites**: `EmptyObject` \| `ConfigurationType` = `{}`

• **customReplacer?**

## Returns

`ConfigurationType`

## Defined in

[src/assets/index.ts:185](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/src/assets/index.ts#L185)
