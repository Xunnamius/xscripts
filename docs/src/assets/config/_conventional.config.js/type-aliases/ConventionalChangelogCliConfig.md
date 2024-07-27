[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / ConventionalChangelogCliConfig

# Type Alias: ConventionalChangelogCliConfig

> **ConventionalChangelogCliConfig**: `ConventionalChangelogConfigSpecOptions` & `ConventionalChangelogCoreOptions.Config.Object` & `object`

What seems to be the shape of a conventional changelog configuration file
with some custom additions. Note that this type is a best effort and may not
be perfectly accurate.

## Type declaration

### changelogTopmatter

> **changelogTopmatter**: `string`

This string is prepended to all generated `CHANGELOG.md` files.

### conventionalChangelog

> **conventionalChangelog**: `ConventionalChangelogCoreOptions.Config.Object`

Conventional Changelog Core options.

### skipCommands

> **skipCommands**: `string`[]

Strings that, if present in a commit message, will indicate that CI/CD
pipelines should not be triggered by said commit.

## Defined in

[src/assets/config/\_conventional.config.js.ts:66](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/src/assets/config/_conventional.config.js.ts#L66)
