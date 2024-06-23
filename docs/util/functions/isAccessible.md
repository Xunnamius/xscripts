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

[src/util.ts:24](https://github.com/Xunnamius/xscripts/blob/4daa0986ccf09c4199915254d8a1d8095507731a/src/util.ts#L24)
