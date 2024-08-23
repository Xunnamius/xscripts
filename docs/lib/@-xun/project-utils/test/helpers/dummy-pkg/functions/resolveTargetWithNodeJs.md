[**@-xun/scripts**](../../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../../README.md) / [lib/@-xun/project-utils/test/helpers/dummy-pkg](../README.md) / resolveTargetWithNodeJs

# Function: resolveTargetWithNodeJs()

> **resolveTargetWithNodeJs**(`__namedParameters`): `Promise`\<[`ResolvedSummary`](../type-aliases/ResolvedSummary.md)\>

Resolves a subpath to a target using the Node.js runtime. This function is
used to ensure projector's resolver functions follow the Node.js resolver
spec.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.conditions**: `ExportCondition`[]

Conditions to match against during subpath resolution.

• **\_\_namedParameters.packageName**: `string`

Name of the package to resolve subpaths against.

• **\_\_namedParameters.rootPackagePath**: `string`

Path to the root of the package that contains the `packageName` package in
its `node_modules` directory if testing `exports` or the path to the root
of the `packageName` package if testing `imports`.

• **\_\_namedParameters.subpath**: `string`

The subpath to resolve against the `packageName` package. Must start with
either "#" or "./" or be "." exactly or the behavior of this function is
undefined.

## Returns

`Promise`\<[`ResolvedSummary`](../type-aliases/ResolvedSummary.md)\>

## Defined in

[lib/@-xun/project-utils/test/helpers/dummy-pkg.ts:132](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/test/helpers/dummy-pkg.ts#L132)
