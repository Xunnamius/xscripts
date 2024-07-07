[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/changelog](../README.md) / ChangelogPatch

# Type Alias: ChangelogPatch

> **ChangelogPatch**: [`string` \| `RegExp`, `string`]

A changelog patch that will be applied to the contents of `CHANGELOG.md`.

It mirrors the parameters of String.prototype.replace in form and
function. That is: each `ChangelogPatch` `searchValue` will be replaced by
`replaceValue` in the contents of `CHANGELOG.md`.

Note that replacements are made in-place, meaning order does matter.

## Defined in

[src/commands/build/changelog.ts:236](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/build/changelog.ts#L236)
