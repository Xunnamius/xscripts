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

Whether a period will be appended to the resultant string or not. A
period is only appended if one is not already appended.

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

Whether `altDescription` will be `trim()`'d or not.

**Default**

```ts
true
```

## Returns

`string`

## Defined in

[packages/bfe/src/index.ts:1249](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/packages/bfe/src/index.ts#L1249)
