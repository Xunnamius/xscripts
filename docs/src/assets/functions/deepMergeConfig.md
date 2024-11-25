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

[src/assets.ts:186](https://github.com/Xunnamius/xscripts/blob/d89809b1811fb99fb24fbfe0c6960a0e087bcc27/src/assets.ts#L186)
