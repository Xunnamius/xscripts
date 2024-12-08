[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / deepMergeConfig

# Function: deepMergeConfig()

> **deepMergeConfig**\<`ConfigurationType`\>(`originalConfiguration`, `overwrites`, `customReplacer`?): `ConfigurationType`

A thin wrapper around lodash's mergeWith that does not mutate
`originalConfiguration`.

## Type Parameters

• **ConfigurationType**

## Parameters

### originalConfiguration

`ConfigurationType`

### overwrites

`ConfigurationType` | `EmptyObject`

### customReplacer?

(`value`, `srcValue`, `key`, `object`, `source`) => `any`

## Returns

`ConfigurationType`

## Defined in

[src/assets.ts:429](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets.ts#L429)
