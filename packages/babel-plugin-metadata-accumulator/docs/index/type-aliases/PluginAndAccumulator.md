[**@-xun/babel-plugin-metadata-accumulator**](../../README.md)

***

[@-xun/babel-plugin-metadata-accumulator](../../README.md) / [index](../README.md) / PluginAndAccumulator

# Type Alias: PluginAndAccumulator

> **PluginAndAccumulator**: `object`

## Type declaration

### accumulator

> **accumulator**: `Map`\<`AbsolutePath`, [`AccumulatedMetadata`](AccumulatedMetadata.md)\>

A Map mapping absolute file paths to their accumulated metadata.

### plugin

> **plugin**: `PluginObj`\<`State`\>

The actual metadata accumulator plugin itself. This should be passed into
Babel when calling `babel.transform` etc.

## See

[createMetadataAccumulatorPlugin](../functions/createMetadataAccumulatorPlugin.md)

## Defined in

[babel-plugin-metadata-accumulator/src/index.ts:36](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/packages/babel-plugin-metadata-accumulator/src/index.ts#L36)
