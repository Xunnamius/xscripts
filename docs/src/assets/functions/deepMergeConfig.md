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

[src/assets.ts:429](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/assets.ts#L429)
