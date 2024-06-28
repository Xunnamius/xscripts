[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [commands](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**: [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)

## Returns

`object`

### builder

> **builder**: `BfeBuilderFunction`\<`StandardCommonCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `"A collection of commands for interacting with Xunnamius's NPM-based projects"`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<`StandardCommonCliArguments`, [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### name

> **name**: `string` = `'xscripts'`

### usage

> **usage**: `string`

## Defined in

[src/commands/index.ts:13](https://github.com/Xunnamius/xscripts/blob/e9f020c2a756a49be6cdccf55d88b926dd2645e9/src/commands/index.ts#L13)
