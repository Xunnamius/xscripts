[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / moduleExport

# Function: moduleExport()

> **moduleExport**(`configOverrides`): [`ConventionalChangelogCliConfig`](../type-aliases/ConventionalChangelogCliConfig.md)

This function returns an "unconventional" conventional-changelog
configuration preset. See the documentation for details on the differences
between this and the official `conventional-changelog-conventionalcommits`
package.

`configOverrides`, if an object or undefined, is recursively merged into a
partially initialized [ConventionalChangelogCliConfig](../type-aliases/ConventionalChangelogCliConfig.md) object
(overwriting same keys) using `lodash.mergeWith`.

If `configOverrides` is a function, it will be passed said partially
initialized [ConventionalChangelogCliConfig](../type-aliases/ConventionalChangelogCliConfig.md) object and must return a
an object of the same type.

## Parameters

• **configOverrides**: (`config`) => [`ConventionalChangelogCliConfig`](../type-aliases/ConventionalChangelogCliConfig.md) \| `Partial`\<[`ConventionalChangelogCliConfig`](../type-aliases/ConventionalChangelogCliConfig.md)\> = `{}`

## Returns

[`ConventionalChangelogCliConfig`](../type-aliases/ConventionalChangelogCliConfig.md)

## Defined in

[src/assets/config/\_conventional.config.js.ts:182](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/src/assets/config/_conventional.config.js.ts#L182)