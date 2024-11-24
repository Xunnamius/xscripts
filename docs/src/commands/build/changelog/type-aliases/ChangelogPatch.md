[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/changelog](../README.md) / ChangelogPatch

# Type Alias: ChangelogPatch

> **ChangelogPatch**: [`string` \| `RegExp`, `string`]

A changelog patch that will be applied to the changelog file.

It mirrors the parameters of String.prototype.replace in form and
function. That is: each `ChangelogPatch` `searchValue` will be replaced by
`replaceValue` in the changelog file.

Note that replacements are made in-place, meaning order does matter.

## Defined in

[src/commands/build/changelog.ts:529](https://github.com/Xunnamius/xscripts/blob/f84693679e326b03b40dc7577e79e1f4160b286e/src/commands/build/changelog.ts#L529)
