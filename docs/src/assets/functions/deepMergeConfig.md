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

[src/assets.ts:573](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets.ts#L573)
