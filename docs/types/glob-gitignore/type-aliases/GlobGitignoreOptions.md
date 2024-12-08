[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [types/glob-gitignore](../README.md) / GlobGitignoreOptions

# Type Alias: GlobGitignoreOptions

> **GlobGitignoreOptions**: `Omit`\<`GlobOptions`, `"ignore"`\> & `object`

## Type declaration

### ignore?

> `optional` **ignore**: `string` \| `string`[]

A string or array of strings used to determine which globbed paths are
ignored. Typically this is the result of parsing a .gitignore file (or file
with compatible format) split by `"\n"`.

## Defined in

[types/glob-gitignore.d.ts:4](https://github.com/Xunnamius/xscripts/blob/cfe28e3d801ec1b719b0dedbda4e9f63d7924b77/types/glob-gitignore.d.ts#L4)
