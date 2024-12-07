[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / ProtoPrereleaseTask

# Interface: ProtoPrereleaseTask

A partially defined prerelease-`type` [ReleaseTask](../type-aliases/ReleaseTask.md).

## Extends

- [`BaseProtoTask`](BaseProtoTask.md)

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Default

`Running task #${id}`

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`actionDescription`](BaseProtoTask.md#actiondescription)

#### Defined in

[src/commands/release.ts:196](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L196)

***

### emoji?

> `optional` **emoji**: `string`

A symbol that will be placed before xscripts output text concerning this
task.

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`emoji`](BaseProtoTask.md#emoji)

#### Defined in

[src/commands/release.ts:205](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L205)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`helpDescription`](BaseProtoTask.md#helpdescription)

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

[`BaseProtoTask`](BaseProtoTask.md).[`io`](BaseProtoTask.md#io)

#### Defined in

[src/commands/release.ts:220](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L220)

***

### npmScripts?

> `optional` **npmScripts**: (`"start"` \| `"version"` \| `"prepublish"` \| `"prepare"` \| `"prepublishOnly"` \| `"prepack"` \| `"postpack"` \| `"publish"` \| `"postpublish"` \| `"preinstall"` \| `"install"` \| `"postinstall"` \| `"preuninstall"` \| `"uninstall"` \| `"postuninstall"` \| `"preversion"` \| `"postversion"` \| `"pretest"` \| `"test"` \| `"posttest"` \| `"prestop"` \| `"stop"` \| `"poststop"` \| `"prestart"` \| `"poststart"` \| `"prerestart"` \| `"restart"` \| `"postrestart"` \| `"build"` \| `"build:changelog"` \| `"build:dist"` \| `"build:docs"` \| `"clean"` \| `"format"` \| `"info"` \| `"lint"` \| `"lint:package"` \| `"lint:packages"` \| `"lint:project"` \| `"list-tasks"` \| `"release"` \| `"renovate"` \| `"dev"` \| `"test:package:all"` \| `"test:package:e2e"` \| `"test:package:integration"` \| `"test:package:unit"` \| `"test:packages:all"`)[]

Run only the first NPM script in `npmScripts` that is found in the
package's `package.json`.

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`npmScripts`](BaseProtoTask.md#npmscripts)

#### Defined in

[src/commands/release.ts:190](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L190)

***

### run?

> `optional` **run**: [`ProtoReleaseTaskRunner`](../type-aliases/ProtoReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`run`](BaseProtoTask.md#run)

#### Defined in

[src/commands/release.ts:224](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L224)

***

### skippable

> **skippable**: `boolean`

Whether the task can be skipped by the user or not.

#### Inherited from

[`BaseProtoTask`](BaseProtoTask.md).[`skippable`](BaseProtoTask.md#skippable)

#### Defined in

[src/commands/release.ts:185](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L185)

***

### type?

> `optional` **type**: `"pre"`

#### Defined in

[src/commands/release.ts:231](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/release.ts#L231)
