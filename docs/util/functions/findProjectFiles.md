[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / findProjectFiles

# Function: findProjectFiles()

> **findProjectFiles**(`runtimeContext`, `useCached`): `Promise`\<`object`\>

Returns an array of various different file paths (strings):

- **`pkgFiles`** - `package.json` files at root or belonging to workspaces or
  belonging to lib
- **`mdFiles`** - Markdown files not ignored by `.prettierignore`
- **`tsFiles`** - TypeScript (.ts, .tsx) files under any relative `src/`
  directory or under the root `lib/` directory

## Parameters

• **runtimeContext**: `MonorepoRunContext` \| `PolyrepoRunContext`

• **useCached**: `boolean` = `true`

## Returns

`Promise`\<`object`\>

### mdFiles

> **mdFiles**: `string`[]

The project's Markdown files.

### pkgFiles

> **pkgFiles**: `object`

The project's relevant package.json files.

### pkgFiles.lib

> **lib**: `string`[]

Each lib sub-project's package.json file.

### pkgFiles.root

> **root**: `string`

The project's root package.json file.

### pkgFiles.workspaces

> **workspaces**: `string`[]

Each workspace package.json file in the project.

### tsFiles

> **tsFiles**: `object`

The project's relevant TypeScript files.

### tsFiles.lib

> **lib**: `string`[]

TypeScript files under root `lib/`.

### tsFiles.src

> **src**: `string`[]

TypeScript files under any `src/` directory or subdirectory relative to
the current working directory.

## Defined in

[src/util.ts:98](https://github.com/Xunnamius/xscripts/blob/e9f020c2a756a49be6cdccf55d88b926dd2645e9/src/util.ts#L98)
