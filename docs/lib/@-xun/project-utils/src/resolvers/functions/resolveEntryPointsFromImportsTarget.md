[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/resolvers](../README.md) / resolveEntryPointsFromImportsTarget

# Function: resolveEntryPointsFromImportsTarget()

> **resolveEntryPointsFromImportsTarget**(`__namedParameters`): `string`[]

Given `target` and `conditions`, this function returns an array of zero or
more entry points that are guaranteed to resolve to `target` when the exact
`conditions` are present. This is done by reverse-mapping `target` using
`imports` from `package.json`. `imports` is assumed to be valid.

Entry points are sorted in the order they're encountered with the caveat that
exact subpaths always come before subpath patterns. Note that, if `target`
contains one or more asterisks, the subpaths returned by this function will
also contain an asterisk. The only other time this function returns a subpath
with an asterisk is if the subpath is a "many-to-one" mapping; that is: the
subpath has an asterisk but its target does not. For instance:

## Parameters

• **\_\_namedParameters**: `object` & [`FlattenedImportsOption`](../type-aliases/FlattenedImportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md) & [`ReplaceSubpathAsterisksOption`](../type-aliases/ReplaceSubpathAsterisksOption.md)

## Returns

`string`[]

## Example

```json
{
  "imports": {
    "many-to-one-subpath/*": "target-with-no-asterisk.js"
  }
}
```

In this case, the asterisk can be replaced with literally anything and it
would still match. Hence, the replacement is left up to the caller.

## Defined in

[lib/@-xun/project-utils/src/resolvers.ts:201](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/resolvers.ts#L201)
