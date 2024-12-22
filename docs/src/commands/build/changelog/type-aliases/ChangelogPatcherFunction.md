[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/changelog](../README.md) / ChangelogPatcherFunction

# Type Alias: ChangelogPatcherFunction()

> **ChangelogPatcherFunction**: (`changelog`, `patcher`) => `Promisable`\<`string`\>

A function that receives the current contents of the changelog file and a
`patcher` function. `ChangelogPatcherFunction` must return a string that will
become the new contents of the changelog file.

`patcher` is the optional second parameter of `ChangelogPatcherFunction` that
accepts a `changelog` string and `patches`, which is an array of
[ChangelogPatches](ChangelogPatches.md). `patcher` can be used to quickly apply an array of
`patches` to the given `changelog` string. Its use is entirely optional.

`changelog.patch.mjs` can export via default either
`ChangelogPatcherFunction` or a [ChangelogPatches](ChangelogPatches.md) array.

## Parameters

### changelog

`string`

### patcher

(`changelog`, `patches`) => `string`

## Returns

`Promisable`\<`string`\>

## Defined in

[src/commands/build/changelog.ts:98](https://github.com/Xunnamius/xscripts/blob/3a8e3952522a9aa3e84a1990f6fcb2207da32534/src/commands/build/changelog.ts#L98)
