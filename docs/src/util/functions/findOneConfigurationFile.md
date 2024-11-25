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

[src/util.ts:211](https://github.com/Xunnamius/xscripts/blob/d89809b1811fb99fb24fbfe0c6960a0e087bcc27/src/util.ts#L211)
