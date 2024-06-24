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

[src/util.ts:24](https://github.com/Xunnamius/xscripts/blob/a81742e25e05086f0ea05fd2898f977d0cd4c168/src/util.ts#L24)
