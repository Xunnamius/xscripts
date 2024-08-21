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

[lib/@-xun/cli-utils/extensions.ts:93](https://github.com/Xunnamius/xscripts/blob/ea7b98342d9aa37d18f7398603d7c15f580a5312/lib/@-xun/cli-utils/extensions.ts#L93)
