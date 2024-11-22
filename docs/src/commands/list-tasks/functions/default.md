[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/list-tasks](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**: `AsStrictExecutionContext`\<[`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`object`

### builder

> **builder**: `BfeBuilderFunction`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `'List all tasks (typically NPM scripts) supported by this project'`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<[`CustomCliArguments`](../type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### usage

> **usage**: `string`

## Defined in

[src/commands/list-tasks.ts:30](https://github.com/Xunnamius/xscripts/blob/59530a02df766279a72886cbc0ab5e0790db98cc/src/commands/list-tasks.ts#L30)
