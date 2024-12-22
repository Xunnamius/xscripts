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

[src/util.ts:109](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L109)
