[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/project-utils](../README.md) / RootPackage

# Type Alias: RootPackage

> **RootPackage**: `object`

An object representing the root or "top-level" package in a monorepo or
polyrepo project.

## Type declaration

### json

> **json**: `PackageJsonWithConfig`

The contents of the root package.json file.

### packages

> **packages**: `Map`\<[`WorkspacePackageName`](WorkspacePackageName.md), [`WorkspacePackage`](WorkspacePackage.md)\> & `object` \| `null`

A mapping of sub-root package names to WorkspacePackage objects in a
monorepo or `null` in a polyrepo.

### root

> **root**: `string`

The absolute path to the root directory of the entire project.

## Defined in

[lib/@-xun/project-utils/src/project-utils.ts:33](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/project-utils.ts#L33)
