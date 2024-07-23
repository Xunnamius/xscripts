[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / ConventionalChangelogCliConfig

# Type Alias: ConventionalChangelogCliConfig

> **ConventionalChangelogCliConfig**: `ConventionalChangelogConfigSpecOptions` & `ConventionalChangelogCoreOptions.Config.Object` & `object`

What seems to be the shape of a conventional changelog configuration file
with some custom additions. Note that this type is a best effort and may not
be perfectly accurate.

## Type declaration

### changelogTitle

> **changelogTitle**: `string`

This string is prepended to all generated `CHANGELOG.md` files.

### conventionalChangelog

> **conventionalChangelog**: `ConventionalChangelogCoreOptions.Config.Object`

Conventional Changelog Core options. Last time I scanned its source, it
seemed this key was required, so it is included here for now.
TODO: Verify that this key is still necessary.

### skipCommands

> **skipCommands**: `string`[]

Strings that, if present in a commit message, will indicate that CI/CD
pipelines should not be triggered by said commit.

## Defined in

[src/assets/config/\_conventional.config.js.ts:45](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/src/assets/config/_conventional.config.js.ts#L45)
