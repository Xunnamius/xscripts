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

> **gitStatusOutput**: `undefined` \| `string` \| `string`[] \| `unknown`[] \| `Uint8Array`

### isDirty

> **isDirty**: `boolean`

## Defined in

[src/assets/config/\_release.config.cjs.ts:418](https://github.com/Xunnamius/xscripts/blob/91915b63e10dd6449ad16f4202f487b34227194a/src/assets/config/_release.config.cjs.ts#L418)
