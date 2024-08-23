[**@-xun/scripts**](../../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../../README.md) / [lib/@-xun/project-utils/test/helpers/dummy-pkg](../README.md) / getDummyPackage

# Function: getDummyPackage()

> **getDummyPackage**\<`RequireObjectImports`, `RequireObjectExports`\>(`id`, `options`?): [`DummyPackageMetadata`](../type-aliases/DummyPackageMetadata.md)\<`RequireObjectImports`, `RequireObjectExports`\>

Return metadata about an available dummy package.

## Type Parameters

• **RequireObjectImports** *extends* `boolean` = `false`

• **RequireObjectExports** *extends* `boolean` = `false`

## Parameters

• **id**: `"simple"` \| `"root"` \| `"complex"` \| `"sugared"` \| `"unlimited"` \| `"defaults"`

• **options?**

• **options.requireObjectExports?**: `RequireObjectExports`

If `true`, `exports` must be an object and not `null`, `undefined`,
`string`, or an array.

**Default**

```ts
false
```

• **options.requireObjectImports?**: `RequireObjectImports`

If `true`, `imports` must be an object and not `null`, `undefined`,
`string`, or an array.

**Default**

```ts
false
```

## Returns

[`DummyPackageMetadata`](../type-aliases/DummyPackageMetadata.md)\<`RequireObjectImports`, `RequireObjectExports`\>

## Defined in

[lib/@-xun/project-utils/test/helpers/dummy-pkg.ts:55](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/test/helpers/dummy-pkg.ts#L55)
