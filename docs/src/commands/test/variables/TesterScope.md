[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/test](../README.md) / TesterScope

# Variable: TesterScope

> **TesterScope**: `object`

The context in which to search for test files.

## Type declaration

### ThisPackage

> **ThisPackage**: `"this-package"`

Limit the command to _all_ relevant files contained within the current
package (as determined by the current working directory), excluding the
files of any other (named) workspace packages. Hence, this scope is only
meaningful in a monorepo context.

This is the default scope for most commands.

### ThisPackageIntermediates

> **ThisPackageIntermediates**: `"this-package-intermediates"`

Limit the command to relevant _transpiled_ tests (aka "intermediates")
within `./.transpiled` (with respect to the current working directory).

### Unlimited

> **Unlimited**: `"unlimited"`

Do not limit or exclude any files by default when running the command.

This is useful, for instance, when attempting to manually lint an entire
monorepo at once; e.g. `npx xscripts lint --scope=unlimited`.

## Defined in

[src/commands/test.ts:101](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/commands/test.ts#L101)
