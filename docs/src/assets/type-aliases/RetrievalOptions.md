[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / RetrievalOptions

# Type Alias: RetrievalOptions

> **RetrievalOptions**: `object`

Options to tweak the runtime of [retrieveConfigAsset](../functions/retrieveConfigAsset.md).

## Type declaration

### assetContainerFiletype?

> `optional` **assetContainerFiletype**: `"js"` \| `"ts"`

Whether an attempt should be made to retrieve an asset ending in `.js`
versus `.ts`.

This is primarily useful in testing contexts where we do not have access to
the transpiled `.js` versions of the source `.ts` files.

#### Default

```ts
'js'
```

## Defined in

[src/assets.ts:107](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets.ts#L107)
