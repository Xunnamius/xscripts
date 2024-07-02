[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / AsStrictExecutionContext

# Type Alias: AsStrictExecutionContext\<CustomExecutionContext\>

> **AsStrictExecutionContext**\<`CustomExecutionContext`\>: `OmitIndexSignature`\<`Exclude`\<`CustomExecutionContext`, `"state"`\>\> & `OmitIndexSignature`\<`CustomExecutionContext`\[`"state"`\]\>

Maps an ExecutionContext into an identical type that explicitly omits
its fallback indexers for unrecognized properties. Even though it is the
runtime equivalent of ExecutionContext, using this type allows
intellisense to report bad/misspelled/missing arguments from `context` in
various places where it otherwise couldn't.

**This type is intended for intellisense purposes only.**

## Type Parameters

• **CustomExecutionContext** *extends* `ExecutionContext`

## Defined in

[lib/@black-flag/extensions/index.ts:449](https://github.com/Xunnamius/xscripts/blob/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7/lib/@black-flag/extensions/index.ts#L449)