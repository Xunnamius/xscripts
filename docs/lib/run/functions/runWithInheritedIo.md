[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / runWithInheritedIo

# Function: runWithInheritedIo()

> **runWithInheritedIo**(...`__namedParameters`): `Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\> & `object`\>

Runs (executes) `file` with the given `args` with respect to the given
`options` (merged with `{ stdout: 'inherit', stderr: 'inherit' }`).

Note that, by default, this function rejects on a non-zero exit code.
Set `reject: false` to override this, or use [runNoRejectOnBadExit](runNoRejectOnBadExit.md).

## Parameters

• ...**\_\_namedParameters**: [`string`, `string`[], [`RunOptions`](../interfaces/RunOptions.md)\<`string`\>]

## Returns

`Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\> & `object`\>

## Defined in

[lib/run/index.ts:38](https://github.com/Xunnamius/xscripts/blob/61a6185ffd6f73d4fe8e86fde7ca0e419bd4f892/lib/run/index.ts#L38)
