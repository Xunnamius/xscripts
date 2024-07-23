[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/build](../README.md) / default

# Function: default()

> **default**(`globalExecutionContext`): `Promise`\<`object`\>

## Parameters

• **globalExecutionContext**: [`AsStrictExecutionContext`](../../../../lib/@black-flag/extensions/type-aliases/AsStrictExecutionContext.md)\<[`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`Promise`\<`object`\>

### aliases

> **aliases**: `never`[] = `[]`

### builder

> **builder**: [`BfeBuilderFunction`](../../../../lib/@black-flag/extensions/type-aliases/BfeBuilderFunction.md)\<[`CustomCliArguments`](../distributables/type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `'Transpile source and assets'`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<[`CustomCliArguments`](../distributables/type-aliases/CustomCliArguments.md), [`GlobalExecutionContext`](../../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### usage

> **usage**: `string`

## Defined in

[src/commands/build/index.ts:14](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/src/commands/build/index.ts#L14)
