[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / ReleaseTask

# Type Alias: ReleaseTask

> **ReleaseTask**: \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `StringKeyOf`\<`OmitIndexSignature`\<`NonNullable`\<[`XPackageJson`](../../../assets/config/_package.json/type-aliases/XPackageJson.md)\[`"scripts"`\]\>\>\>[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `boolean`;`type`: `"pre"` \| `"post"`; \} \| \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `never`[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `false`;`type`: `"release"`; \}

A prerelease, release, or postrelease task to be executed by this command.

## Defined in

[src/commands/release.ts:157](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L157)
