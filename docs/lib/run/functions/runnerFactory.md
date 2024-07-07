[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / runnerFactory

# Function: runnerFactory()

> **runnerFactory**(`file`, `args`?, `options`?): (`args`?, `options`?) => `Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

Returns a function that, when called, runs (executes) `file` with the given
`args` with respect to the given `options`. These parameters can be
overridden during individual invocations.

## Parameters

• **file**: `string`

• **args?**: `string`[]

• **options?**: [`RunOptions`](../interfaces/RunOptions.md)\<`string`\>

## Returns

`Function`

### Parameters

• **args?**: `string`[]

• **options?**: [`RunOptions`](../interfaces/RunOptions.md)\<`string`\>

### Returns

`Promise`\<[`RunReturnType`](../interfaces/RunReturnType.md)\<`string`\>\>

## Defined in

[lib/run/index.ts:61](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/run/index.ts#L61)
