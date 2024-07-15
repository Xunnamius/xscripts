[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/format](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**: [`AsStrictExecutionContext`](../../../../lib/@black-flag/extensions/type-aliases/AsStrictExecutionContext.md)\<[`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`object`

### builder

> **builder**: [`BfeBuilderFunction`](../../../../lib/@black-flag/extensions/type-aliases/BfeBuilderFunction.md)\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `'Run formatters (e.g. prettier, remark) across all relevant files'`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### usage

> **usage**: `string`

## Defined in

[src/commands/format.ts:43](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/format.ts#L43)
