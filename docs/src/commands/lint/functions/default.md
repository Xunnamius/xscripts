[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/lint](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `Promise`\<`object`\>

## Parameters

### \_\_namedParameters

`AsStrictExecutionContext`\<[`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`Promise`\<`object`\>

### builder

> **builder**: `BfeBuilderFunction`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `'Run linters (e.g. eslint, remark) across all relevant files'`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

##### argv

`Arguments`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### usage

> **usage**: `string`

## Defined in

[src/commands/lint.ts:74](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/lint.ts#L74)
