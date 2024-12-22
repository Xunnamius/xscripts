[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / ProtoCoreReleaseTask

# Interface: ProtoCoreReleaseTask

A partially defined release-`type` [ReleaseTask](../type-aliases/ReleaseTask.md).

## Extends

- `Omit`\<[`BaseProtoTask`](BaseProtoTask.md), `"skippable"` \| `"npmScripts"` \| `"emoji"`\>

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Default

`Running task #${id}`

#### Inherited from

`Omit.actionDescription`

#### Defined in

[src/commands/release.ts:215](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L215)

***

### allowMissingNpmScripts?

> `optional` **allowMissingNpmScripts**: `boolean`

Whether the task will automatically fail if none of the scripts given in
`npmScripts` exist in the package's `package.json`.

#### Default

```ts
false
```

#### Inherited from

`Omit.allowMissingNpmScripts`

#### Defined in

[src/commands/release.ts:204](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L204)

***

### emoji?

> `optional` **emoji**: `""`

#### Defined in

[src/commands/release.ts:267](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L267)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

`Omit.helpDescription`

#### Defined in

[src/commands/release.ts:219](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L219)

***

### io?

> `optional` **io**: `StdoutStderrOptionCommon`\<`false`\>

Determines how the process's `stdout` and `stdin` streams will be
configured when executing [npmScripts](BaseProtoTask.md#npmscripts). Does not apply to `run` or
[ProtoReleaseTaskRunner](../type-aliases/ProtoReleaseTaskRunner.md).

This should always be left as `'pipe'` (the default) unless the task is the
only member of its task group (in which case `'inherit'` may be
appropriate).

Note that this value may be overridden (with `'ignore'`) if the user
supplies `--hush`/`--quiet`/`--silent`.

#### Default

```ts
'pipe'
```

#### Inherited from

`Omit.io`

#### Defined in

[src/commands/release.ts:239](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L239)

***

### npmScripts?

> `optional` **npmScripts**: `never`[]

#### Defined in

[src/commands/release.ts:266](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L266)

***

### run?

> `optional` **run**: [`ProtoReleaseTaskRunner`](../type-aliases/ProtoReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

`Omit.run`

#### Defined in

[src/commands/release.ts:243](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L243)

***

### skippable?

> `optional` **skippable**: `false`

#### Defined in

[src/commands/release.ts:265](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L265)
