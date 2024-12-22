[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/configure](../README.md) / GlobalCliArguments

# Type Alias: GlobalCliArguments\<Scope\>

> **GlobalCliArguments**\<`Scope`\>: `StandardCommonCliArguments` & `object`

These properties will be available in the `argv` object of any command that
uses [withGlobalBuilder](../../util/functions/withGlobalBuilder.md) to construct its `builder`.

This type is manually synchronized with [globalCliArguments](../variables/globalCliArguments.md), but the
keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).

## Type declaration

### scope

> **scope**: `Scope`

## Type Parameters

• **Scope** *extends* `string` = [`DefaultGlobalScope`](../enumerations/DefaultGlobalScope.md)

## See

StandardCommonCliArguments

## Defined in

[src/configure.ts:107](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/configure.ts#L107)
