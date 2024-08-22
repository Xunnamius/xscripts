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

[lib/@-xun/cli-utils/extensions.ts:140](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/@-xun/cli-utils/extensions.ts#L140)
