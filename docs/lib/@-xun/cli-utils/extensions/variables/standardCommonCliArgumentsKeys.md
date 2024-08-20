[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/extensions](../README.md) / standardCommonCliArgumentsKeys

# Variable: standardCommonCliArgumentsKeys

> `const` **standardCommonCliArgumentsKeys**: (`"silent"` \| `"hush"` \| `"quiet"`)[]

This is an array of the keys in [standardCommonCliArguments](standardCommonCliArguments.md), each of
which have a one-to-one relation with a key of
[StandardCommonCliArguments](../type-aliases/StandardCommonCliArguments.md).

Note that this array purposely excludes `'help'` and `'version'`, which are
considered standard common CLI arguments by this package and are therefore
automatically included when appropriate.

## Defined in

[lib/@-xun/cli-utils/extensions.ts:140](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/@-xun/cli-utils/extensions.ts#L140)
