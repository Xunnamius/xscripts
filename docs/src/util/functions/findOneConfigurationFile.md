[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / findOneConfigurationFile

# Function: findOneConfigurationFile()

> **findOneConfigurationFile**(`wellKnownFiles`, `configRoot`): `Promise`\<`undefined` \| `AbsolutePath`\>

Takes an array of `wellKnownFiles`, which can be filenames or paths (both
taken local to `configRoot`) and returns an absolute path to an existing
readable file from `wellKnownFiles` should one exist. If more than one file
in `wellKnownFiles` exists, this function will throw.

## Parameters

• **wellKnownFiles**: `string`[]

• **configRoot**: `AbsolutePath`

## Returns

`Promise`\<`undefined` \| `AbsolutePath`\>

## Defined in

[src/util.ts:211](https://github.com/Xunnamius/xscripts/blob/f84693679e326b03b40dc7577e79e1f4160b286e/src/util.ts#L211)
