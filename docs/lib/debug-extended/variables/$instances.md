[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/debug-extended](../README.md) / $instances

# Variable: $instances

> `const` **$instances**: *typeof* [`$instances`]($instances.md)

Represents a property on a "root" [ExtendedDebugger](../interfaces/ExtendedDebugger.md) instance that
returns an array of its [UnextendableInternalDebugger](../interfaces/UnextendableInternalDebugger.md) sub-instances
(e.g. "error", "warn", etc). The array will also include the root
[ExtendedDebugger](../interfaces/ExtendedDebugger.md) instance.

## Defined in

[lib/debug-extended/index.ts:16](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/lib/debug-extended/index.ts#L16)
