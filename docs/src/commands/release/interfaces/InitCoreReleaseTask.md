[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / InitCoreReleaseTask

# Interface: InitCoreReleaseTask

A partially defined release-`type` [ReleaseTask](../type-aliases/ReleaseTask.md).

## Extends

- `Omit`\<[`BaseInitTask`](BaseInitTask.md), `"skippable"` \| `"npmScripts"` \| `"emoji"`\>

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Inherited from

`Omit.actionDescription`

#### Defined in

[src/commands/release.ts:180](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L180)

***

### emoji?

> `optional` **emoji**: `""`

#### Defined in

[src/commands/release.ts:232](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L232)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

`Omit.helpDescription`

#### Defined in

[src/commands/release.ts:184](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L184)

***

### io?

> `optional` **io**: `StdoutStderrOptionCommon`\<`false`\>

Determines how the process's `stdout` and `stdin` streams will be
configured when executing [npmScripts](BaseInitTask.md#npmscripts). Does not apply to `run` or
[InitReleaseTaskRunner](../type-aliases/InitReleaseTaskRunner.md).

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

[src/commands/release.ts:204](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L204)

***

### npmScripts?

> `optional` **npmScripts**: `never`[]

#### Defined in

[src/commands/release.ts:231](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L231)

***

### run?

> `optional` **run**: [`InitReleaseTaskRunner`](../type-aliases/InitReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

`Omit.run`

#### Defined in

[src/commands/release.ts:208](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L208)

***

### skippable?

> `optional` **skippable**: `false`

#### Defined in

[src/commands/release.ts:230](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/commands/release.ts#L230)
