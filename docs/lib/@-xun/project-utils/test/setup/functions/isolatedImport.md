[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/test/setup](../README.md) / isolatedImport

# Function: isolatedImport()

> **isolatedImport**\<`T`\>(`args`): `T`

Performs a module import as if it were being imported for the first time.

Note that this function breaks the "require caching" expectation of Node.js
modules. Problems can arise, for example, when closing an app-wide database
connection in your test cleanup phase and expecting it to close for the
isolated module too. In this case, the isolated module has its own isolated
"app-wide" connection that would not actually be closed and could cause your
test to hang unexpectedly, even when all tests pass.

## Type Parameters

• **T** = `unknown`

## Parameters

• **args**

• **args.path**: `string`

Path to the module to import. Module resolution is handled by `require`.

• **args.useDefault?**: `boolean`

By default, if `module.__esModule === true`, the default export will be
returned instead. Use `useDefault` to override this behavior in either
direction.

## Returns

`T`

## Defined in

[lib/@-xun/project-utils/test/setup.ts:290](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/test/setup.ts#L290)
