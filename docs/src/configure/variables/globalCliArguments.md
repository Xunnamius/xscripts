[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/configure](../README.md) / globalCliArguments

# Variable: globalCliArguments

> `const` **globalCliArguments**: `object`

This BfeBuilderObject instance describes the CLI arguments available
in the `argv` object of any command that uses [withGlobalBuilder](../../util/functions/withGlobalBuilder.md) to
construct its `builder`.

This object is manually synchronized with [GlobalCliArguments](../type-aliases/GlobalCliArguments.md), but the
keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).

When providing a custom BfeBuilderObject instance to
[withGlobalBuilder](../../util/functions/withGlobalBuilder.md), any key specified in that instance that is also a
key in this object (`globalCliArguments`) will have its value merged with the
value in this object _instead_ of fully overwriting it. This means you can
pass minimal configuration values for the keys that are also in
`globalCliArguments` and those values will be merged over the corresponding
default configuration value in `globalCliArguments`.

## Type declaration

### scope

> **scope**: `object`

#### scope.choices

> **choices**: [`DefaultGlobalScope`](../enumerations/DefaultGlobalScope.md)[]

#### scope.default

> **default**: [`DefaultGlobalScope`](../enumerations/DefaultGlobalScope.md) = `DefaultGlobalScope.ThisPackage`

#### scope.description

> **description**: `string` = `'Which files this command will consider when scanning the filesystem'`

#### scope.string

> **string**: `true` = `true`

## See

StandardCommonCliArguments

## Defined in

[src/configure.ts:130](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/configure.ts#L130)
