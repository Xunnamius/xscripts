[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / InitReleaseTaskRunner

# Type Alias: InitReleaseTaskRunner()

> **InitReleaseTaskRunner**: (`executionContext`, `argv`, `taskContext`) => `ReturnType`\<[`ReleaseTaskRunner`](ReleaseTaskRunner.md)\>

A partial release task with loose typings for quickly authoring new tasks.

## Parameters

• **executionContext**: [`ExecutionContextWithProjectMetadata`](ExecutionContextWithProjectMetadata.md)

• **argv**: `Parameters`\<`ReturnType`\<*typeof* [`default`](../functions/default.md)\>\[`"handler"`\]\>\[`0`\]

• **taskContext**: [`ReleaseTaskContext`](ReleaseTaskContext.md)

## Returns

`ReturnType`\<[`ReleaseTaskRunner`](ReleaseTaskRunner.md)\>

## Defined in

[src/commands/release.ts:134](https://github.com/Xunnamius/xscripts/blob/91915b63e10dd6449ad16f4202f487b34227194a/src/commands/release.ts#L134)
