[**@-xun/babel-plugin-metadata-accumulator**](../../README.md)

***

[@-xun/babel-plugin-metadata-accumulator](../../README.md) / [index](../README.md) / AccumulatedMetadata

# Type Alias: AccumulatedMetadata

> **AccumulatedMetadata**: `object`

## Type declaration

### imports

> **imports**: `object`

Two sets, one containing the accumulated import metadata for all
"type-only" imports and the other containing the same information but for
all "normal" imports.

#### imports.normal

> **normal**: `Set`\<`string`\>

#### imports.typeOnly

> **typeOnly**: `Set`\<`string`\>

## Defined in

[babel-plugin-metadata-accumulator/src/index.ts:24](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/packages/babel-plugin-metadata-accumulator/src/index.ts#L24)
