[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / determineRepoWorkingTreeDirty

# Function: determineRepoWorkingTreeDirty()

> **determineRepoWorkingTreeDirty**(): `Promise`\<\{ `gitStatusExitCode`: `undefined` \| `number`; `gitStatusOutput`: `undefined` \| `string` \| `unknown`[] \| `string`[] \| `Uint8Array`\<`ArrayBufferLike`\>; `isDirty`: `boolean`; \}\>

If `gitStatusOutput` is not empty or `gitStatusExitCode` is non-zero, then
the current working tree is dirty. This can be checked quickly via the
`isDirty` property.

## Returns

`Promise`\<\{ `gitStatusExitCode`: `undefined` \| `number`; `gitStatusOutput`: `undefined` \| `string` \| `unknown`[] \| `string`[] \| `Uint8Array`\<`ArrayBufferLike`\>; `isDirty`: `boolean`; \}\>

## Defined in

[src/util.ts:159](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/util.ts#L159)
