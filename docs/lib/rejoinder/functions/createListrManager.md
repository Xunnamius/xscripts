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

[lib/rejoinder/index.ts:260](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/lib/rejoinder/index.ts#L260)
