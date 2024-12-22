[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/commands/project/renovate](../README.md) / CustomCliArguments

# Type Alias: CustomCliArguments

> **CustomCliArguments**: [`GlobalCliArguments`](../../../../configure/type-aliases/GlobalCliArguments.md) & `object` & `CamelCasedProperties`\<`Record`\<keyof *typeof* [`renovationTasks`](../variables/renovationTasks.md), `boolean`\> & `Partial`\<`Record`\<`KeysOfUnion`\<*typeof* [`renovationTasks`](../variables/renovationTasks.md)\[keyof *typeof* [`renovationTasks`](../variables/renovationTasks.md)\]\[`"subOptions"`\]\>, `unknown`\>\>\>

## Type declaration

### force

> **force**: `boolean`

### parallel

> **parallel**: `boolean`

### runToCompletion

> **runToCompletion**: `boolean`

## Defined in

[src/commands/project/renovate.ts:243](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/commands/project/renovate.ts#L243)
