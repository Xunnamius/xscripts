[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_conventional.config.cjs](../README.md) / moduleExport

# Function: moduleExport()

> **moduleExport**(`__namedParameters`): `XchangelogConfig`

This function returns a `@-xun/changelog` configuration preset. See the
documentation for details.

`configOverrides`, if an object or undefined, is recursively merged into a
partially initialized XchangelogConfig object (overwriting same keys)
using `lodash.mergeWith`.

If `configOverrides` is a function, it will be passed said partially
initialized XchangelogConfig object and must return an object of the
same type.

If you are consuming this configuration object with the intent to invoke
`@-xun/changelog` directly (i.e. via its Node.js API), such as in the
`src/commands/build/changelog.ts` file, **you should call
patchSpawnChild as soon as possible** upon entering the handler and
call unpatchSpawnChild towards the end of the same scope.

This function also relies on a patched version of the global `Proxy` class so
that it returns the object its proxying as a property on the proxy object
accessible via the $proxiedTarget symbol. This is used to hack our
way around some questionable attempts at implementing immutable commit
objects in upstream conventional-commits-writer.

## Parameters

### \_\_namedParameters

#### configOverrides

(`config`) => `XchangelogConfig` \| `Partial`\<`XchangelogConfig`\> = `{}`

#### projectMetadata

`ProjectMetadata`

#### specialInitialCommit

`string`

## Returns

`XchangelogConfig`

## Defined in

[src/assets/transformers/\_conventional.config.cjs.ts:355](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets/transformers/_conventional.config.cjs.ts#L355)
