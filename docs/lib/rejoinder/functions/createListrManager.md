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

[lib/rejoinder/index.ts:255](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/lib/rejoinder/index.ts#L255)
