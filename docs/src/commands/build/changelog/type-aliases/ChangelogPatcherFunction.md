[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/changelog](../README.md) / ChangelogPatcherFunction

# Type Alias: ChangelogPatcherFunction()

> **ChangelogPatcherFunction**: (`changelog`, `patcher`) => `Promisable`\<`string`\>

A function that receives the current contents of `CHANGELOG.md` and a
`patcher` function. `ChangelogPatcherFunction` must return a string that will
become the new contents of `CHANGELOG.md`.

`patcher` is the optional second parameter of `ChangelogPatcherFunction` that
accepts a `changelog` string and `patches`, which is an array of
[ChangelogPatches](ChangelogPatches.md). `patcher` can be used to quickly apply an array of
`patches` to the given `changelog` string. Its use is entirely optional.

`changelog.patch.js` (or `changelog.patch.[cm]js`) can export via default
either `ChangelogPatcherFunction` or a [ChangelogPatches](ChangelogPatches.md) array.

## Parameters

• **changelog**: `string`

• **patcher**

## Returns

`Promisable`\<`string`\>

## Defined in

[src/commands/build/changelog.ts:259](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/build/changelog.ts#L259)
