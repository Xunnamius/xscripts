[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / RawAliasMapperFunction

# Type Alias: RawAliasMapperFunction()

> **RawAliasMapperFunction**: (`projectMetadata`, `outputFunctions`) => `RawAliasMapping`[]

A function that receives the current ProjectMetadata and must return
an array of RawAliasMappings.

`aliases.config.mjs` can export via default either `RawAliasMapperFunction`
or an array of RawAliasMappings.

## Parameters

### projectMetadata

`ProjectMetadata`

### outputFunctions

#### debug

`ExtendedDebugger`

#### log

`ExtendedLogger`

## Returns

`RawAliasMapping`[]

## Defined in

[src/util.ts:109](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/util.ts#L109)
