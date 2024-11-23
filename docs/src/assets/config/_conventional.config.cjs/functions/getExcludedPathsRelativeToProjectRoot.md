[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.cjs](../README.md) / getExcludedPathsRelativeToProjectRoot

# Function: getExcludedPathsRelativeToProjectRoot()

> **getExcludedPathsRelativeToProjectRoot**(): `string`[]

Return directories that should be excluded from consideration depending on
the project structure and the current working directory.

This function takes into account WorkspaceAttribute.Shared packages.

Useful for narrowing the scope of `@-xun/changelog` and semantic-release
-based tooling like xchangelog and xrelease.

## Returns

`string`[]

## Defined in

[src/assets/config/\_conventional.config.cjs.ts:905](https://github.com/Xunnamius/xscripts/blob/91915b63e10dd6449ad16f4202f487b34227194a/src/assets/config/_conventional.config.cjs.ts#L905)
