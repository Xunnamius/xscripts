[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/rejoinder](../README.md) / createListrManager

# Function: createListrManager()

> **createListrManager**\<`T`\>(`options`?): `Manager`\<`T`, `"default"`, `"simple"` \| `"verbose"`\>

Create and return a new Listr2 Manager instance pre-configured to
work in harmony with rejoinder.

Specifically, this instance:

  - Has good consistent defaults.

  - Switches to the verbose renderer when the DEBUG environment variable is
    present or any of the debug logger namespaces are enabled.

## Type Parameters

• **T** = `any`

## Parameters

• **options?**

• **options.overrides?**: `ListrBaseClassOptions`\<`any`, `"default"`, `"simple"`\>

Properties provided here will override the defaults passed to the
Manager constructor.

## Returns

`Manager`\<`T`, `"default"`, `"simple"` \| `"verbose"`\>

## Defined in

[lib/rejoinder/index.ts:260](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/lib/rejoinder/index.ts#L260)
