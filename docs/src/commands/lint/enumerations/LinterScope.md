[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/lint](../README.md) / LinterScope\_

# Enumeration: LinterScope\_

## Enumeration Members

### ThisPackageSource

> **ThisPackageSource**: `"this-package-source"`

Limit the command to _source_ files contained within the current package
(as determined by the current working directory), excluding non-source
files and the files of any other (named) workspace packages. "Source files"
includes Markdown files.

This is the default scope for the `lint` command.

#### Defined in

[src/commands/lint.ts:61](https://github.com/Xunnamius/xscripts/blob/5eb9deff748ee6e4af3c57a16f6370d16bb97bfb/src/commands/lint.ts#L61)

***

### UnlimitedSource

> **UnlimitedSource**: `"unlimited-source"`

Do not limit or exclude any _source_ files by default when running the
command. "Source files" includes Markdown files.

This is useful, for instance, when attempting to manually lint an entire
monorepo's source files at once; e.g. `npx xscripts lint
--scope=unlimited-source`.

#### Defined in

[src/commands/lint.ts:70](https://github.com/Xunnamius/xscripts/blob/5eb9deff748ee6e4af3c57a16f6370d16bb97bfb/src/commands/lint.ts#L70)
