[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/lint](../README.md) / LinterScope

# Variable: LinterScope

> **LinterScope**: `object`

The context in which to search for files to lint.

## Type declaration

### ThisPackage

> **ThisPackage**: `"this-package"`

Limit the command to _all_ relevant files contained within the current
package (as determined by the current working directory), excluding the
files of any other (named) workspace packages. Hence, this scope is only
meaningful in a monorepo context.

This is the default scope for most commands.

### ThisPackageSource

> **ThisPackageSource**: `"this-package-source"`

Limit the command to _source_ files contained within the current package
(as determined by the current working directory), excluding non-source
files and the files of any other (named) workspace packages. "Source files"
includes Markdown files.

This is the default scope for the `lint` command.

### Unlimited

> **Unlimited**: `"unlimited"`

Do not limit or exclude any files by default when running the command.

This is useful, for instance, when attempting to manually lint an entire
monorepo at once; e.g. `npx xscripts lint --scope=unlimited`.

### UnlimitedSource

> **UnlimitedSource**: `"unlimited-source"`

Do not limit or exclude any _source_ files by default when running the
command. "Source files" includes Markdown files.

This is useful, for instance, when attempting to manually lint an entire
monorepo's source files at once; e.g. `npx xscripts lint
--scope=unlimited-source`.

## Defined in

[src/commands/lint.ts:78](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/src/commands/lint.ts#L78)
