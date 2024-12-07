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

[src/commands/release.ts:196](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L196)

***

### emoji?

> `optional` **emoji**: `""`

#### Defined in

[src/commands/release.ts:248](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L248)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

`Omit.helpDescription`

#### Defined in

[src/commands/release.ts:200](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L200)

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

[src/commands/release.ts:220](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L220)

***

### npmScripts?

> `optional` **npmScripts**: `never`[]

#### Defined in

[src/commands/release.ts:247](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L247)

***

### run?

> `optional` **run**: [`ProtoReleaseTaskRunner`](../type-aliases/ProtoReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

`Omit.run`

#### Defined in

[src/commands/release.ts:224](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L224)

***

### skippable?

> `optional` **skippable**: `false`

#### Defined in

[src/commands/release.ts:246](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L246)
