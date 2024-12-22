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

[src/util.ts:109](https://github.com/Xunnamius/xscripts/blob/3a8e3952522a9aa3e84a1990f6fcb2207da32534/src/util.ts#L109)
