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

[src/assets.ts:202](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets.ts#L202)
