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

[lib/run/index.ts:15](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/lib/run/index.ts#L15)
