[**@-xun/scripts**](../../../README.md) • **Docs**

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

[types/glob-gitignore.d.ts:4](https://github.com/Xunnamius/xscripts/blob/f84693679e326b03b40dc7577e79e1f4160b286e/types/glob-gitignore.d.ts#L4)
