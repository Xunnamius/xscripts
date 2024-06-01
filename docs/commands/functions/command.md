[**@-xun/scripts**](../../README.md) • **Docs**

***

[@-xun/scripts](../../README.md) / [commands](../README.md) / command

# Function: command()

> **command**(`__namedParameters`): `Promise`\<`object`\>

## Parameters

• **\_\_namedParameters**: [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)

## Returns

`Promise`\<`object`\>

### builder()

> **builder**: (...`args`) => `object`

#### Parameters

• ...**args**: [`Omit`\<`EffectorProgram`\<[`GlobalCliArguments`](../../util/type-aliases/GlobalCliArguments.md), [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)\>, `"command"` \| `"fail"` \| `"parseAsync"` \| `"command_deferred"` \| `"command_finalize_deferred"`\>, `boolean`, `Arguments`\<[`GlobalCliArguments`](../../util/type-aliases/GlobalCliArguments.md), [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)\>]

#### Returns

`object`

### description

> **description**: `string` = `"A collection of commands for interacting with Xunnamius's NPM-based projects"`

### handler()

> **handler**: (`argv`) => `Promisable`\<`void`\>

#### Parameters

• **argv**: `Arguments`\<[`GlobalCliArguments`](../../util/type-aliases/GlobalCliArguments.md), [`CustomExecutionContext`](../../configure/type-aliases/CustomExecutionContext.md)\>

#### Returns

`Promisable`\<`void`\>

### name

> **name**: `string` = `'xscripts'`

### usage

> **usage**: `string`

## Source

[src/commands/index.ts:15](https://github.com/Xunnamius/xscripts/blob/380c055b2920c8b96b65dc89b97b6497f996c452/src/commands/index.ts#L15)
