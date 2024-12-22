[**@-xun/babel-plugin-metadata-accumulator**](../../README.md)

***

[@-xun/babel-plugin-metadata-accumulator](../../README.md) / [index](../README.md) / createMetadataAccumulatorPlugin

# Function: createMetadataAccumulatorPlugin()

> **createMetadataAccumulatorPlugin**(): [`PluginAndAccumulator`](../type-aliases/PluginAndAccumulator.md)

Create and return a metadata accumulator plugin and corresponding object
containing all accumulated metadata.

If analyzing source with no originating file path, the accumulator will map
retain its metadata under the `"/dev/null"` key.

## Returns

[`PluginAndAccumulator`](../type-aliases/PluginAndAccumulator.md)

## Defined in

[babel-plugin-metadata-accumulator/src/index.ts:65](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/packages/babel-plugin-metadata-accumulator/src/index.ts#L65)
