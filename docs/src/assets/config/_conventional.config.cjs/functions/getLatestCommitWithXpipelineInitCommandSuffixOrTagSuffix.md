[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.cjs](../README.md) / getLatestCommitWithXpipelineInitCommandSuffixOrTagSuffix

# Function: getLatestCommitWithXpipelineInitCommandSuffixOrTagSuffix()

> **getLatestCommitWithXpipelineInitCommandSuffixOrTagSuffix**(`tagPrefix`): `Promise`\<`string`\>

Return the commit-ish (SHA hash) of the most recent commit containing the
Xpipeline command suffix `[INIT]`, or being pointed to by a
`package-name@0.0.0-init` version tag. If no such commit could be found,
[noSpecialInitialCommitIndicator](../variables/noSpecialInitialCommitIndicator.md) is returned.

## Parameters

• **tagPrefix**: `string`

## Returns

`Promise`\<`string`\>

## See

XchangelogConfig

## Defined in

[src/assets/config/\_conventional.config.cjs.ts:955](https://github.com/Xunnamius/xscripts/blob/f84693679e326b03b40dc7577e79e1f4160b286e/src/assets/config/_conventional.config.cjs.ts#L955)
