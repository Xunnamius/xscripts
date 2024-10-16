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

[src/commands/lint.ts:56](https://github.com/Xunnamius/xscripts/blob/86b76a595de7a0bbf273ef7bb201d4c62f5e3d77/src/commands/lint.ts#L56)

***

### UnlimitedSource

> **UnlimitedSource**: `"unlimited-source"`

Do not limit or exclude any _source_ files by default when running the
command. "Source files" includes Markdown files.

This is useful, for instance, when attempting to manually lint an entire
monorepo's source files at once; e.g. `npx xscripts lint
--scope=unlimited-source`.

#### Defined in

[src/commands/lint.ts:65](https://github.com/Xunnamius/xscripts/blob/86b76a595de7a0bbf273ef7bb201d4c62f5e3d77/src/commands/lint.ts#L65)
