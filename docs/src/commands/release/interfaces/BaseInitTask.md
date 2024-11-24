[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / BaseInitTask

# Interface: BaseInitTask

## Extended by

- [`InitPrereleaseTask`](InitPrereleaseTask.md)
- [`InitPostreleaseTask`](InitPostreleaseTask.md)

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Defined in

[src/commands/release.ts:180](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L180)

***

### emoji?

> `optional` **emoji**: `string`

A symbol that will be placed before xscripts output text concerning this
task.

#### Defined in

[src/commands/release.ts:189](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L189)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

#### Defined in

[src/commands/release.ts:184](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L184)

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

#### Defined in

[src/commands/release.ts:204](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L204)

***

### npmScripts?

> `optional` **npmScripts**: (`"version"` \| `"prepublish"` \| `"prepare"` \| `"prepublishOnly"` \| `"prepack"` \| `"postpack"` \| `"publish"` \| `"postpublish"` \| `"preinstall"` \| `"install"` \| `"postinstall"` \| `"preuninstall"` \| `"uninstall"` \| `"postuninstall"` \| `"preversion"` \| `"postversion"` \| `"pretest"` \| `"test"` \| `"posttest"` \| `"prestop"` \| `"stop"` \| `"poststop"` \| `"prestart"` \| `"start"` \| `"poststart"` \| `"prerestart"` \| `"restart"` \| `"postrestart"` \| `"build"` \| `"build:changelog"` \| `"build:dist"` \| `"build:docs"` \| `"clean"` \| `"format"` \| `"info"` \| `"lint"` \| `"lint:package"` \| `"lint:packages"` \| `"lint:project"` \| `"list-tasks"` \| `"release"` \| `"renovate"` \| `"dev"` \| `"test:package:all"` \| `"test:package:e2e"` \| `"test:package:integration"` \| `"test:package:unit"` \| `"test:packages:all"`)[]

Run only the first NPM script in `npmScripts` that is found in the
package's `package.json`.

#### Defined in

[src/commands/release.ts:176](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L176)

***

### run?

> `optional` **run**: [`InitReleaseTaskRunner`](../type-aliases/InitReleaseTaskRunner.md)

A function called when the task is triggered.

#### Defined in

[src/commands/release.ts:208](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L208)

***

### skippable

> **skippable**: `boolean`

Whether the task can be skipped by the user or not.

#### Defined in

[src/commands/release.ts:171](https://github.com/Xunnamius/xscripts/blob/f4ec173014b41a5b69e2dbdb82e9f8b7ec9d9c86/src/commands/release.ts#L171)
