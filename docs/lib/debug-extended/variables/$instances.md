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

[lib/debug-extended/index.ts:15](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/lib/debug-extended/index.ts#L15)
