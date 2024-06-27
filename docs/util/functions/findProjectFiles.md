[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / findProjectFiles

# Function: findProjectFiles()

> **findProjectFiles**(`useCached`): `Promise`\<`object`\>

Returns an array of various different file paths (strings):

- **`pkgFiles`** - `package.json` files at root or belonging to workspaces or
  belonging to lib
- **`mdFiles`** - Markdown files not ignored by `.prettierignore`
- **`tsFiles`** - TypeScript (.ts, .tsx) files under any relative `src/`
  directory or under the root `lib/` directory

## Parameters

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

[src/util.ts:73](https://github.com/Xunnamius/xscripts/blob/fe8b5ad9410ab0311eb97e1f4a935ef57dccb99d/src/util.ts#L73)
