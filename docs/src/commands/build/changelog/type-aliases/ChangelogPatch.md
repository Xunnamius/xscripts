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

[src/commands/build/changelog.ts:234](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/build/changelog.ts#L234)
