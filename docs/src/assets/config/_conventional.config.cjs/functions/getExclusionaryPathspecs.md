[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.cjs](../README.md) / getExclusionaryPathspecs

# Function: getExclusionaryPathspecs()

> **getExclusionaryPathspecs**(): `string`[]

Return pathspecs for excluding certain paths from consideration depending on
the project structure and the current working directory.

This function takes into account WorkspaceAttribute.Shared packages.

Useful for narrowing the scope of `@-xun/changelog` and semantic-release
-based tooling like xchangelog and xrelease.

## Returns

`string`[]

## Defined in

[src/assets/config/\_conventional.config.cjs.ts:916](https://github.com/Xunnamius/xscripts/blob/5720c37375b8ffddbde03f8e53002853e0eeabbc/src/assets/config/_conventional.config.cjs.ts#L916)
