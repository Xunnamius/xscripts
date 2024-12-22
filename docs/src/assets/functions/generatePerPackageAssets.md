[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / generatePerPackageAssets

# Function: generatePerPackageAssets()

> **generatePerPackageAssets**(`transformerContext`, `adder`, `__namedParameters`): `Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

Takes a [TransformerContext](../type-aliases/TransformerContext.md) and an adder function and returns an array
of [Asset](../type-aliases/Asset.md)s generated per each package in ProjectMetadata,
including the root package in hybridrepos and polyrepos (but not in
non-hybrid monorepos).

## Parameters

### transformerContext

[`TransformerContext`](../type-aliases/TransformerContext.md)

### adder

(`helpers`) => `Promisable`\<`undefined` \| [`Asset`](../type-aliases/Asset.md)[]\>

### \_\_namedParameters

#### includeRootPackageInNonHybridMonorepo

`boolean` = `false`

If `true`, the root workspace package will be included among the
Packages passed to `adder` even when the ProjectMetadata
indicates that this monorepo does not actually have a publishable root
package containing source code or tests.

Note that, if `cwdPackage` in [TransformerContext.projectMetadata](../type-aliases/TransformerContext.md#projectmetadata)
is the non-hybrid monorepo root and scope is `"this-package"`, the
package will be included regardless of this option.

**Default**

```ts
false
```

## Returns

`Promise`\<[`Asset`](../type-aliases/Asset.md)[]\>

## Defined in

[src/assets.ts:624](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/assets.ts#L624)
