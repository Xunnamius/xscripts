[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / run

# Function: run()

> **run**(`file`, `args`?, `__namedParameters`?): `Promise`\<[`RunReturnType`](../type-aliases/RunReturnType.md)\>

Runs (executes) `file` with the given `args` with respect to the given
`options`.

Note that, by default, this function rejects on a non-zero exit code.
Set `reject: false` to override this, or use [runNoRejectOnBadExit](runNoRejectOnBadExit.md).

## Parameters

• **file**: `string`

• **args?**: `string`[]

• **\_\_namedParameters?**: [`RunOptions`](../type-aliases/RunOptions.md) = `{}`

## Returns

`Promise`\<[`RunReturnType`](../type-aliases/RunReturnType.md)\>

## Defined in

[lib/run/index.ts:41](https://github.com/Xunnamius/xscripts/blob/ea7b98342d9aa37d18f7398603d7c15f580a5312/lib/run/index.ts#L41)
