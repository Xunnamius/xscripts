[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/alias-utils](../README.md) / getProcessedAliasMapping

# Function: getProcessedAliasMapping()

> **getProcessedAliasMapping**(`__namedParameters`): readonly [`object`, `object`]

Takes an alias mapping, validates it, and returns its constituent parts.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.issueTypescriptWarning?**: `boolean` = `false`

If true, attempting to resolve an alias at runtime, which TypeScript does
not support, will trigger a TypeScript-specific warning.

**Default**

```ts
false
```

• **\_\_namedParameters.mapping**: [`string`, `string`]

A single mapping between an alias `key` and its real path `value`.

## Returns

readonly [`object`, `object`]

## Defined in

[lib/@-xun/project-utils/src/alias-utils.ts:54](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/alias-utils.ts#L54)
