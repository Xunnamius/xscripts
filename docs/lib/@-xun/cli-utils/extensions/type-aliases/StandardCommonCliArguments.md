[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/extensions](../README.md) / StandardCommonCliArguments

# Type Alias: StandardCommonCliArguments

> **StandardCommonCliArguments**: `object`

These properties will be available in the `argv` object of any command that
uses [withStandardBuilder](../functions/withStandardBuilder.md) to construct its `builder`.

This type is manually synchronized with [standardCommonCliArguments](../variables/standardCommonCliArguments.md),
but the keys may differ slightly (e.g. hyphens may be elided in favor of
camelCase).

Note that this type purposely excludes the `help` and `version` keys, which
are considered standard common CLI arguments by this package.

## Type declaration

### hush

> **hush**: `boolean`

### quiet

> **quiet**: `boolean`

### silent

> **silent**: `boolean`

## Defined in

[lib/@-xun/cli-utils/extensions.ts:93](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/cli-utils/extensions.ts#L93)
