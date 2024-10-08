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

[lib/@black-flag/extensions/index.ts:542](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@black-flag/extensions/index.ts#L542)
