[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeStrictArguments

# Type Alias: BfeStrictArguments\<CustomCliArguments, CustomExecutionContext\>

> **BfeStrictArguments**\<`CustomCliArguments`, `CustomExecutionContext`\>: `OmitIndexSignature`\<`Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>\> & `FrameworkArguments`\<`CustomExecutionContext`\> & `object`

A stricter version of Arguments that explicitly omits the fallback
indexer for unrecognized arguments. Even though it is the runtime equivalent
of Arguments, using this type allows intellisense to report
bad/misspelled/missing arguments from `argv` in various places where it
otherwise couldn't.

**This type is intended for intellisense purposes only.**

## Type declaration

### \[$artificiallyInvoked\]?

> `optional` **\[$artificiallyInvoked\]**: `boolean`

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Defined in

[lib/@black-flag/extensions/index.ts:432](https://github.com/Xunnamius/xscripts/blob/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7/lib/@black-flag/extensions/index.ts#L432)