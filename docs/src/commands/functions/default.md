[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/commands](../README.md) / default

# Function: default()

> **default**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**: [`AsStrictExecutionContext`](../../../lib/@black-flag/extensions/type-aliases/AsStrictExecutionContext.md)\<[`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

## Returns

`object`

### builder

> **builder**: [`BfeBuilderFunction`](../../../lib/@black-flag/extensions/type-aliases/BfeBuilderFunction.md)\<[`StandardCommonCliArguments`](../../../lib/@-xun/cli-utils/extensions/type-aliases/StandardCommonCliArguments.md), [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

### description

> **description**: `string` = `"A collection of commands for interacting with Xunnamius's NPM-based projects"`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<[`StandardCommonCliArguments`](../../../lib/@-xun/cli-utils/extensions/type-aliases/StandardCommonCliArguments.md), [`GlobalExecutionContext`](../../configure/type-aliases/GlobalExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### name

> **name**: `string` = `'xscripts'`

### usage

> **usage**: `string`

## Defined in

[src/commands/index.ts:15](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/index.ts#L15)
