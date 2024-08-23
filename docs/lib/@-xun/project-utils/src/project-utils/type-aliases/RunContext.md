[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/project-utils](../README.md) / RunContext

# Type Alias: RunContext

> **RunContext**: `object`

An object representing a runtime context.

## Type declaration

### context

> **context**: `"monorepo"` \| `"polyrepo"`

Whether node is executing in a monorepo or a polyrepo context.

### package

> **package**: [`WorkspacePackage`](WorkspacePackage.md) \| `null`

An object representing the current sub-root (determined by cwd) in a
monorepo context, or `null` if in a polyrepo context or when cwd is not
within any sub-root in a monorepo context.

### project

> **project**: [`RootPackage`](RootPackage.md)

Repository root package data.

## Defined in

[lib/@-xun/project-utils/src/project-utils.ts:93](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/project-utils.ts#L93)
