[**@-xun/scripts**](../../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../../README.md) / [lib/@-xun/project-utils/test/helpers/dummy-pkg](../README.md) / DummyPackageMetadata

# Type Alias: DummyPackageMetadata\<RequireObjectImports, RequireObjectExports\>

> **DummyPackageMetadata**\<`RequireObjectImports`, `RequireObjectExports`\>: `object`

Represents the dummy package metadata returned by the `getDummyPackage`
function.

## Type Parameters

• **RequireObjectImports** *extends* `boolean` = `false`

• **RequireObjectExports** *extends* `boolean` = `false`

## Type declaration

### exports

> **exports**: `RequireObjectExports` *extends* `true` ? `Exclude`\<`PackageJson.Exports`, `string` \| `undefined` \| `null` \| `unknown`[]\> : `PackageJson.Exports` \| `undefined`

### imports

> **imports**: `RequireObjectImports` *extends* `true` ? `Exclude`\<`PackageJson.Imports`, `string` \| `undefined` \| `null` \| `unknown`[]\> : `PackageJson.Imports` \| `undefined`

### name

> **name**: `string`

### packageJson

> **packageJson**: `PackageJson`

### path

> **path**: `string`

## Defined in

[lib/@-xun/project-utils/test/helpers/dummy-pkg.ts:26](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/test/helpers/dummy-pkg.ts#L26)
