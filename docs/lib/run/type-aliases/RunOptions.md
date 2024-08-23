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

[lib/run/index.ts:15](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/run/index.ts#L15)
