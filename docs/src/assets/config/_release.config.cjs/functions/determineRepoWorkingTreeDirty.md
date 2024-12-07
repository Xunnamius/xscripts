[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_release.config.cjs](../README.md) / determineRepoWorkingTreeDirty

# Function: determineRepoWorkingTreeDirty()

> **determineRepoWorkingTreeDirty**(): `Promise`\<`object`\>

If `gitStatusOutput` is not empty or `gitStatusExitCode` is non-zero, then
the current working tree is dirty. This can be checked quickly via the
`isDirty` property.

## Returns

`Promise`\<`object`\>

### gitStatusExitCode

> **gitStatusExitCode**: `undefined` \| `number`

### gitStatusOutput

> **gitStatusOutput**: `undefined` \| `string` \| `string`[] \| `unknown`[] \| `Uint8Array`\<`ArrayBufferLike`\>

### isDirty

> **isDirty**: `boolean`

## Defined in

[src/assets/config/\_release.config.cjs.ts:443](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/assets/config/_release.config.cjs.ts#L443)
