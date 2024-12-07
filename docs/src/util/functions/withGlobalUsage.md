[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / withGlobalUsage

# Function: withGlobalUsage()

> **withGlobalUsage**(`altDescription`, `options`?): `string`

Generate command usage text consistently yet flexibly.

Defaults to: `Usage: $000\n\n${altDescription}` where `altDescription` is
`$1.`

## Parameters

### altDescription

`string` = `'$1.'`

### options?

#### appendPeriod

`boolean`

Whether a period will be appended to `altDescription` or not.

**Default**

```ts
true
```

#### prependNewlines

`boolean`

Whether newlines will be prepended to `altDescription` or not.

**Default**

```ts
true
```

#### trim

`boolean`

Whether the entire string will be trimmed or not.

**Default**

```ts
true
```

## Returns

`string`

## Defined in

[packages/bfe/src/index.ts:1230](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/packages/bfe/src/index.ts#L1230)
