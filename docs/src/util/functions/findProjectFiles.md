[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / findProjectFiles

# Function: findProjectFiles()

> **findProjectFiles**(`runtimeContext`, `__namedParameters`): `Promise`\<`object`\>

Returns an array of various different absolute file paths (strings):

- **`pkgFiles`** - `package.json` files at root or belonging to workspaces or
  belonging to lib
- **`mdFiles`** - Markdown files not ignored by `.prettierignore`
- **`tsFiles`** - TypeScript (.ts, .tsx) files under any relative `src/`
  directory or under the root `lib/` directory

## Parameters

• **runtimeContext**: `MonorepoRunContext` \| `PolyrepoRunContext`

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.skipIgnored?**: `boolean` = `true`

If `true`, do not consider `.prettierignore` when sifting through and
returning project files.

• **\_\_namedParameters.skipUnknown?**: `boolean` = `false`

Skip files unknown to git (even if already ignored by
`.gitignore`/`.prettierignore`).

• **\_\_namedParameters.useCached?**: `boolean` = `true`

Use the internal cached result from a previous run, if available.

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

[src/util.ts:131](https://github.com/Xunnamius/xscripts/blob/61a6185ffd6f73d4fe8e86fde7ca0e419bd4f892/src/util.ts#L131)
