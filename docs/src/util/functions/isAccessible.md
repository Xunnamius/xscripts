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

[src/util.ts:225](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/util.ts#L225)
