[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / RunOptions

# Type Alias: RunOptions

> **RunOptions**: `Options` & `object`

## Type declaration

### useIntermediate()?

> `optional` **useIntermediate**: (`intermediateResult`) => `Promisable`\<`void`\>

Access the [RunIntermediateReturnType](RunIntermediateReturnType.md) object, a thin wrapper around
execa's ResultPromise, via this callback function.

#### Parameters

• **intermediateResult**: [`RunIntermediateReturnType`](RunIntermediateReturnType.md)

#### Returns

`Promisable`\<`void`\>

## Defined in

[lib/run/index.ts:15](https://github.com/Xunnamius/xscripts/blob/184c8e10da5407b40476129ff0f6e538d7df3af0/lib/run/index.ts#L15)
