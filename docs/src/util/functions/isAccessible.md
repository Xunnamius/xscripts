[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / isAccessible

# Function: isAccessible()

> **isAccessible**(`path`, `fsConstants`): `Promise`\<`boolean`\>

Sugar for `await access(path, fsConstants)` that returns `true` or `false`
rather than throwing or returning `void`.

## Parameters

• **path**: `string`

The path to perform an access check against.

• **fsConstants**: `number` = `fs.constants.R_OK`

The type of access check to perform. Defaults to `fs.constants.R_OK`.

**See**

fs.constants

## Returns

`Promise`\<`boolean`\>

## Defined in

[src/util.ts:257](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/src/util.ts#L257)
