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

[src/commands/build/changelog.ts:255](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/src/commands/build/changelog.ts#L255)
