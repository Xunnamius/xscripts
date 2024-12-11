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

[src/util.ts:512](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/util.ts#L512)
