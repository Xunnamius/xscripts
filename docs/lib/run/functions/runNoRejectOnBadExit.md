[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / runNoRejectOnBadExit

# Function: runNoRejectOnBadExit()

> **runNoRejectOnBadExit**(...`__namedParameters`): `Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

Runs (executes) `file` with the given `args` with respect to the given
`options`. This function DOES NOT REJECT on a non-zero exit code.

## Parameters

• ...**\_\_namedParameters**: [`string`, `string`[], [`RunOptions`](../interfaces/RunOptions.md)\<`string`\>]

## Returns

`Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

## Defined in

[lib/run/index.ts:50](https://github.com/Xunnamius/xscripts/blob/61a6185ffd6f73d4fe8e86fde7ca0e419bd4f892/lib/run/index.ts#L50)
