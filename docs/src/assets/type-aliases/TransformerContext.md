[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / TransformerContext

# Type Alias: TransformerContext

> **TransformerContext**: `object`

A union of well-known context keys passed directly to each transformer
[Transformer](Transformer.md).

**INSTANCES OF `TransformerContext` MUST NOT CONTAIN ANY SENSITIVE
INFORMATION!**

## Type declaration

### additionalRawAliasMappings

> **additionalRawAliasMappings**: `RawAliasMapping`[]

An array of RawAliasMappings that will be included when deriving
aliases during content generation.

### asset

> **asset**: `string`

The value of the `asset` parameter passed to
[gatherAssetsFromTransformer](../functions/gatherAssetsFromTransformer.md) and related functions.

For transformers returning a single asset, this can be used to construct
the asset path.

### assetPreset

> **assetPreset**: [`AssetPreset`](../enumerations/AssetPreset.md) \| `undefined`

A relevant [AssetPreset](../enumerations/AssetPreset.md) or `undefined` when generic versions of
assets should be generated.

### debug

> **debug**: `ExtendedDebugger`

Global debugging function.

### forceOverwritePotentiallyDestructive

> **forceOverwritePotentiallyDestructive**: `boolean`

Whether or not to overwrite certain files (such as .env files, and .md
files with replacer regions) in a potentially destructive way.

### log

> **log**: `ExtendedLogger`

Global logging function.

### projectMetadata

> **projectMetadata**: `ProjectMetadata`

#### See

ProjectMetadata

### repoName

> **repoName**: `string`

The name of the repository on GitHub or other service.

This string is always a URL-safe and valid GitHub repository name.

### repoOwner

> **repoOwner**: `string`

The owner of the repository on GitHub or other service.

This string is always a URL-safe and valid GitHub repository owner.

### scope

> **scope**: [`DefaultGlobalScope`](../../configure/enumerations/DefaultGlobalScope.md)

The scope to consider when determining which assets to return.

### shouldDeriveAliases

> **shouldDeriveAliases**: `boolean`

Whether or not to derive aliases and inject them into the configuration.

### toPackageAbsolutePath()

> **toPackageAbsolutePath**: (...`pathsLike`) => `AbsolutePath`

Takes a RelativePath-like object and joins it to `cwdPackage.root`
from ProjectMetadata.

#### Parameters

##### pathsLike

...(`RelativePath` \| `string`)[]

#### Returns

`AbsolutePath`

### toProjectAbsolutePath()

> **toProjectAbsolutePath**: (...`pathsLike`) => `AbsolutePath`

Takes a RelativePath-like object and joins it to `rootPackage.root`
from ProjectMetadata.

#### Parameters

##### pathsLike

...(`RelativePath` \| `string`)[]

#### Returns

`AbsolutePath`

### year

> **year**: `string`

The year as shown in various generated documents like `LICENSE.md`.

## Defined in

[src/assets.ts:205](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets.ts#L205)
