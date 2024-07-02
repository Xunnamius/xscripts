[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / run

# Function: run()

> **run**(`file`, `args`?, `options`?): `Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

Runs (executes) `file` with the given `args` with respect to the given
`options`.

Note that, by default, this function rejects on a non-zero exit code.
Set `reject: false` to override this, or use [runNoRejectOnBadExit](runNoRejectOnBadExit.md).

## Parameters

• **file**: `string`

• **args?**: `string`[]

• **options?**: [`RunOptions`](../interfaces/RunOptions.md)\<`string`\>

## Returns

`Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

## Defined in

[lib/run/index.ts:22](https://github.com/Xunnamius/xscripts/blob/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7/lib/run/index.ts#L22)