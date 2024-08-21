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

[src/assets/index.ts:185](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/src/assets/index.ts#L185)
