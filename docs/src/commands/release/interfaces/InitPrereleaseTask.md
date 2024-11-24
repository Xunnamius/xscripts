[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / InitPrereleaseTask

# Interface: InitPrereleaseTask

A partially defined prerelease-`type` [ReleaseTask](../type-aliases/ReleaseTask.md).

## Extends

- [`BaseInitTask`](BaseInitTask.md)

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`actionDescription`](BaseInitTask.md#actiondescription)

#### Defined in

[src/commands/release.ts:180](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L180)

***

### emoji?

> `optional` **emoji**: `string`

A symbol that will be placed before xscripts output text concerning this
task.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`emoji`](BaseInitTask.md#emoji)

#### Defined in

[src/commands/release.ts:189](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L189)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`helpDescription`](BaseInitTask.md#helpdescription)

#### Defined in

[src/commands/release.ts:184](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L184)

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

[`BaseInitTask`](BaseInitTask.md).[`io`](BaseInitTask.md#io)

#### Defined in

[src/commands/release.ts:204](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L204)

***

### npmScripts?

> `optional` **npmScripts**: (`"version"` \| `"prepublish"` \| `"prepare"` \| `"prepublishOnly"` \| `"prepack"` \| `"postpack"` \| `"publish"` \| `"postpublish"` \| `"preinstall"` \| `"install"` \| `"postinstall"` \| `"preuninstall"` \| `"uninstall"` \| `"postuninstall"` \| `"preversion"` \| `"postversion"` \| `"pretest"` \| `"test"` \| `"posttest"` \| `"prestop"` \| `"stop"` \| `"poststop"` \| `"prestart"` \| `"start"` \| `"poststart"` \| `"prerestart"` \| `"restart"` \| `"postrestart"` \| `"build"` \| `"build:changelog"` \| `"build:dist"` \| `"build:docs"` \| `"clean"` \| `"format"` \| `"info"` \| `"lint"` \| `"lint:package"` \| `"lint:packages"` \| `"lint:project"` \| `"list-tasks"` \| `"release"` \| `"renovate"` \| `"dev"` \| `"test:package:all"` \| `"test:package:e2e"` \| `"test:package:integration"` \| `"test:package:unit"` \| `"test:packages:all"`)[]

Run only the first NPM script in `npmScripts` that is found in the
package's `package.json`.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`npmScripts`](BaseInitTask.md#npmscripts)

#### Defined in

[src/commands/release.ts:176](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L176)

***

### run?

> `optional` **run**: [`InitReleaseTaskRunner`](../type-aliases/InitReleaseTaskRunner.md)

A function called when the task is triggered.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`run`](BaseInitTask.md#run)

#### Defined in

[src/commands/release.ts:208](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L208)

***

### skippable

> **skippable**: `boolean`

Whether the task can be skipped by the user or not.

#### Inherited from

[`BaseInitTask`](BaseInitTask.md).[`skippable`](BaseInitTask.md#skippable)

#### Defined in

[src/commands/release.ts:171](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L171)

***

### type?

> `optional` **type**: `"pre"`

#### Defined in

[src/commands/release.ts:215](https://github.com/Xunnamius/xscripts/blob/8feaaa78a9f524f02e4cc9204ef84f329d31ab94/src/commands/release.ts#L215)
