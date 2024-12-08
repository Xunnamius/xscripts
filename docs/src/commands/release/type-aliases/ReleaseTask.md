[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / ReleaseTask

# Type Alias: ReleaseTask

> **ReleaseTask**: \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `StringKeyOf`\<`OmitIndexSignature`\<`NonNullable`\<`XPackageJson`\[`"scripts"`\]\>\>\>[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `boolean`;`type`: `"pre"` \| `"post"`; \} \| \{`actionDescription`: `string`;`emoji`: `string`;`helpDescription`: `string`;`id`: `number`;`io`: `RunOptions`\[`"stdout"`\];`npmScripts`: `never`[];`run`: [`ReleaseTaskRunner`](ReleaseTaskRunner.md);`skippable`: `false`;`type`: `"release"`; \}

A prerelease, release, or postrelease task to be executed by this command.

## Defined in

[src/commands/release.ts:166](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/commands/release.ts#L166)
