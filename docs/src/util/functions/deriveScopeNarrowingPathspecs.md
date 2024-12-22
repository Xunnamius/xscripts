[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / deriveScopeNarrowingPathspecs

# Function: deriveScopeNarrowingPathspecs()

> **deriveScopeNarrowingPathspecs**(`__namedParameters`): `string`[]

Return pathspecs for including only certain paths for consideration depending
on the project structure and the current working directory.

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

[src/util.ts:523](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L523)
