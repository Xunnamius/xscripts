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

[src/commands/build/changelog.ts:529](https://github.com/Xunnamius/xscripts/blob/5720c37375b8ffddbde03f8e53002853e0eeabbc/src/commands/build/changelog.ts#L529)
