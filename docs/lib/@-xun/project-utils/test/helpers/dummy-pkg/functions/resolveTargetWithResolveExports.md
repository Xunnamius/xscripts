[**@-xun/scripts**](../../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../../README.md) / [lib/@-xun/project-utils/test/helpers/dummy-pkg](../README.md) / resolveTargetWithResolveExports

# Function: resolveTargetWithResolveExports()

> **resolveTargetWithResolveExports**(`__namedParameters`): [`ResolvedSummary`](../type-aliases/ResolvedSummary.md) & `object`

Resolves a subpath to a target using the resolve.exports library. This
function is used to ensure projector's resolver functions return results that
coincide with resolve.exports in the interest of ecosystem interoperability.

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.conditions**: `ExportCondition`[]

Conditions to match against during target resolution.

• **\_\_namedParameters.packageJson**: `PackageJson`

Contents of the `package.json` file of the package under test.

• **\_\_namedParameters.subpath**: `string`

The subpath to resolve against the `packageName` package. Must start with
either "#" or "./" or be "." exactly.

## Returns

[`ResolvedSummary`](../type-aliases/ResolvedSummary.md) & `object`

## Defined in

[lib/@-xun/project-utils/test/helpers/dummy-pkg.ts:214](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/helpers/dummy-pkg.ts#L214)
