[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/commands](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `object`

## Parameters

### \_\_namedParameters

`AsStrictExecutionContext`\<[`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`object`

### builder

> **builder**: `BfeBuilderFunction`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `"A collection of commands for interacting with Xunnamius's NPM-based projects"`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

##### argv

`Arguments`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### name

> **name**: `string` = `globalCliName`

### usage

> **usage**: `string`

## Defined in

[src/commands/index.ts:22](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/index.ts#L22)
