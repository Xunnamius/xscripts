[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [src/configure](../README.md) / DefaultGlobalScope

# Enumeration: DefaultGlobalScope

Determines which project files are considered within a command's purview.
Files outside of a command's purview will be treated by xscripts as if they
do not exist where possible.

This enum is essentially [ThisPackageGlobalScope](ThisPackageGlobalScope.md) +
[UnlimitedGlobalScope](UnlimitedGlobalScope.md).

## Enumeration Members

### ThisPackage

> **ThisPackage**: `"this-package"`

Limit the command to _all_ relevant files contained within the current
package (as determined by the current working directory), excluding the
files of any other (named) workspace packages. Hence, this scope is only
meaningful in a monorepo context.

This is the default scope for most commands.

#### Defined in

[src/configure.ts:61](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/configure.ts#L61)

***

### Unlimited

> **Unlimited**: `"unlimited"`

Do not limit or exclude any files by default when running the command.

This is useful, for instance, when attempting to manually lint an entire
monorepo at once; e.g. `npx xscripts lint --scope=unlimited`.

#### Defined in

[src/configure.ts:68](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/configure.ts#L68)
