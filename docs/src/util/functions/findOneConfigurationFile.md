[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / findOneConfigurationFile

# Function: findOneConfigurationFile()

> **findOneConfigurationFile**(`wellKnownFiles`, `configRoot`): `Promise`\<`undefined` \| `AbsolutePath`\>

Takes an array of `wellKnownFiles`, which can be filenames or paths (both
taken local to `configRoot`) and returns an absolute path to an existing
readable file from `wellKnownFiles` should one exist. If more than one file
in `wellKnownFiles` exists, this function will throw.

## Parameters

### wellKnownFiles

`string`[]

### configRoot

`AbsolutePath`

## Returns

`Promise`\<`undefined` \| `AbsolutePath`\>

## Defined in

[src/util.ts:307](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/util.ts#L307)
