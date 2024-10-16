[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/configure](../README.md) / globalCliArguments

# Variable: globalCliArguments

> `const` **globalCliArguments**: `object`

This BfeBuilderObject instance describes the CLI arguments available
in the `argv` object of any command that uses [withGlobalBuilder](../../util/functions/withGlobalBuilder.md) to
construct its `builder`.

This object is manually synchronized with [GlobalCliArguments](../type-aliases/GlobalCliArguments.md), but the
keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).

## Type declaration

### scope

> `readonly` **scope**: `object`

### scope.choices

> `readonly` **choices**: [`GlobalScope`](../enumerations/GlobalScope.md)[]

### scope.default

> `readonly` **default**: [`ThisPackage`](../enumerations/GlobalScope.md#thispackage) = `GlobalScope.ThisPackage`

### scope.description

> `readonly` **description**: `"Which files this command will consider"` = `'Which files this command will consider'`

### scope.string

> `readonly` **string**: `true` = `true`

## See

StandardCommonCliArguments

## Defined in

[src/configure.ts:100](https://github.com/Xunnamius/xscripts/blob/86b76a595de7a0bbf273ef7bb201d4c62f5e3d77/src/configure.ts#L100)
