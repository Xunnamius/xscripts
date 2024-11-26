[**@-xun/scripts**](../../../../../README.md) • **Docs**

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

[src/assets/config/\_release.config.cjs.ts:430](https://github.com/Xunnamius/xscripts/blob/5720c37375b8ffddbde03f8e53002853e0eeabbc/src/assets/config/_release.config.cjs.ts#L430)
