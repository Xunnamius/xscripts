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

[types/glob-gitignore.d.ts:4](https://github.com/Xunnamius/xscripts/blob/59530a02df766279a72886cbc0ab5e0790db98cc/types/glob-gitignore.d.ts#L4)
