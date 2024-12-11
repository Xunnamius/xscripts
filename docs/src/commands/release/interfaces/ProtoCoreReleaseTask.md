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

[src/commands/release.ts:206](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L206)

***

### emoji?

> `optional` **emoji**: `""`

#### Defined in

[src/commands/release.ts:258](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L258)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

`Omit.helpDescription`

#### Defined in

[src/commands/release.ts:210](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L210)

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

[src/commands/release.ts:230](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L230)

***

### npmScripts?

> `optional` **npmScripts**: `never`[]

#### Defined in

[src/commands/release.ts:257](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L257)

***

### run?

> `optional` **run**: [`ProtoReleaseTaskRunner`](../type-aliases/ProtoReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

`Omit.run`

#### Defined in

[src/commands/release.ts:234](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L234)

***

### skippable?

> `optional` **skippable**: `false`

#### Defined in

[src/commands/release.ts:256](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/release.ts#L256)
