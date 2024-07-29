[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / isolatedImport

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

[test/setup.ts:336](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/test/setup.ts#L336)
