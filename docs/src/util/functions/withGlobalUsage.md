[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / withGlobalUsage

# Function: withGlobalUsage()

> **withGlobalUsage**(`altDescription`, `options`?): `string`

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`$1.`

## Parameters

• **altDescription**: `string` = `'$1.'`

• **options?**

• **options.appendPeriod?**: `boolean`

Whether a period will be appended to `altDescription` or not.

**Default**

```ts
true
```

• **options.prependNewlines?**: `boolean`

Whether newlines will be prepended to `altDescription` or not.

**Default**

```ts
true
```

• **options.trim?**: `boolean`

Whether the entire string will be trimmed or not.

**Default**

```ts
true
```

## Returns

`string`

## Defined in

[packages/bfe/src/index.ts:1223](https://github.com/Xunnamius/xscripts/blob/5720c37375b8ffddbde03f8e53002853e0eeabbc/packages/bfe/src/index.ts#L1223)
