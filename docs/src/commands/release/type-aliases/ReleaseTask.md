[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / ReleaseTask

# Type Alias: ReleaseTask

> **ReleaseTask**: \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `StringKeyOf`\<`OmitIndexSignature`\<`NonNullable`\<[`XPackageJson`](../../../assets/config/_package.json/type-aliases/XPackageJson.md)\[`"scripts"`\]\>\>\>[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `boolean`;`type`: `"pre"` \| `"post"`; \} \| \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `never`[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `false`;`type`: `"release"`; \}

A prerelease, release, or postrelease task to be executed by this command.

## Defined in

[src/commands/release.ts:162](https://github.com/Xunnamius/xscripts/blob/cfe28e3d801ec1b719b0dedbda4e9f63d7924b77/src/commands/release.ts#L162)
