[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / findProjectFiles

# Function: findProjectFiles()

> **findProjectFiles**(`useCached`): `Promise`\<`object`\>

Returns an array of various different file paths (strings):

- **`pkgFiles`** - `package.json` files at root or belonging to workspaces
- **`mdFiles`** - Markdown files not ignored by `.prettierignore`

## Parameters

• **useCached**: `boolean` = `true`

## Returns

`Promise`\<`object`\>

### mdFiles

> **mdFiles**: `string`[]

### pkgFiles

> **pkgFiles**: `string`[]

## Defined in

[src/util.ts:34](https://github.com/Xunnamius/xscripts/blob/9e4ae592d211ae39bacdc3f665b3078e69c73062/src/util.ts#L34)
