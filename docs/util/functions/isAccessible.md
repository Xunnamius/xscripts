[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [util](../README.md) / isAccessible

# Function: isAccessible()

> **isAccessible**(`path`, `fsConstants`): `Promise`\<`boolean`\>

Sugar for `await access(path, fsConstants)` that returns `true` or `false`
rather than throwing or returning `void`.

## Parameters

• **path**: `string`

The path to perform an access check against.

• **fsConstants**: `number` = `fs.constants.R_OK`

The type of access check to perform.

**Default**

```ts
fs.constants.R_OK
```

**See**

fs.constants

## Returns

`Promise`\<`boolean`\>

## Defined in

[src/util.ts:213](https://github.com/Xunnamius/xscripts/blob/99269ccded0ec7cc89215957b5aca27dbdc38070/src/util.ts#L213)
