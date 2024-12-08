[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.cjs](../README.md) / getExclusionaryPathspecs

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

[src/assets/config/\_conventional.config.cjs.ts:927](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets/config/_conventional.config.cjs.ts#L927)
