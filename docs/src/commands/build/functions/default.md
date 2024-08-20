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

[src/commands/build/index.ts:15](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/src/commands/build/index.ts#L15)
