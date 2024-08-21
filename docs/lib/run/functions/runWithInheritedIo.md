[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / runWithInheritedIo

# Function: runWithInheritedIo()

> **runWithInheritedIo**(...`__namedParameters`): `Promise`\<`object` & `object`\>

Runs (executes) `file` with the given `args` with respect to the given
`options` (merged with `{ stdout: 'inherit', stderr: 'inherit' }`).

Note that, by default, this function rejects on a non-zero exit code.
Set `reject: false` to override this, or use [runNoRejectOnBadExit](runNoRejectOnBadExit.md).

## Parameters

• ...**\_\_namedParameters**: [`string`, `string`[], `RunOptions?`]

## Returns

`Promise`\<`object` & `object`\>

## Defined in

[lib/run/index.ts:69](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/lib/run/index.ts#L69)
