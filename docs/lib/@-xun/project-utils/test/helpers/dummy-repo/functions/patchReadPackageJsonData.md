[**@-xun/scripts**](../../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../../README.md) / [lib/@-xun/project-utils/test/helpers/dummy-repo](../README.md) / patchReadPackageJsonData

# Function: patchReadPackageJsonData()

> **patchReadPackageJsonData**(`spec`, `options`?): `object`

Patch the package.json data returned by the `readPackageJson` function.
Successive calls to this function overwrite previous calls.

## Parameters

• **spec**

The `package.json` patches to apply per root path. When `root` is equal to
`"*"`, it will be used to patch all `package.json` imports but can be
overwritten by a more specific `root` string.

• **options?**

Options that influence the patching process.

• **options.replace?**: `boolean`

Whether to merely patch the actual package.json contents (`undefined`),
completely replace them (`true`), or only overwrite them if they don't
already exist (`false`).

**Default**

```ts
undefined
```

## Returns

`object`

## Defined in

[lib/@-xun/project-utils/test/helpers/dummy-repo.ts:15](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/test/helpers/dummy-repo.ts#L15)
