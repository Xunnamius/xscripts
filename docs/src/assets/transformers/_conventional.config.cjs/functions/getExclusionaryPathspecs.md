[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_conventional.config.cjs](../README.md) / getExclusionaryPathspecs

# Function: getExclusionaryPathspecs()

> **getExclusionaryPathspecs**(`__namedParameters`): `string`[]

Return pathspecs for excluding certain paths from consideration depending on
the project structure and the current working directory.

This function takes into account WorkspaceAttribute.Shared packages
and is useful for narrowing the scope of tooling like xchangelog and
xrelease.

## Parameters

### \_\_namedParameters

#### projectMetadata

`ProjectMetadata`

## Returns

`string`[]

## Defined in

[src/assets/transformers/\_conventional.config.cjs.ts:933](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets/transformers/_conventional.config.cjs.ts#L933)
