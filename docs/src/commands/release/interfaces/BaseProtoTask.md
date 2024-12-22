[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/release](../README.md) / BaseProtoTask

# Interface: BaseProtoTask

## Extended by

- [`ProtoPrereleaseTask`](ProtoPrereleaseTask.md)
- [`ProtoPostreleaseTask`](ProtoPostreleaseTask.md)

## Properties

### actionDescription?

> `optional` **actionDescription**: `string`

The description reported to the user when the task is run.

#### Default

`Running task #${id}`

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

#### Defined in

[src/commands/release.ts:204](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L204)

***

### emoji?

> `optional` **emoji**: `string`

A symbol that will be placed before xscripts output text concerning this
task.

#### Defined in

[src/commands/release.ts:224](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L224)

***

### helpDescription

> **helpDescription**: `string`

The description reported to the user when `--help` is called.

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

#### Defined in

[src/commands/release.ts:239](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L239)

***

### npmScripts?

> `optional` **npmScripts**: (`"version"` \| `"prepublish"` \| `"prepare"` \| `"prepublishOnly"` \| `"prepack"` \| `"postpack"` \| `"publish"` \| `"postpublish"` \| `"preinstall"` \| `"install"` \| `"postinstall"` \| `"preuninstall"` \| `"uninstall"` \| `"postuninstall"` \| `"preversion"` \| `"postversion"` \| `"pretest"` \| `"test"` \| `"posttest"` \| `"prestop"` \| `"stop"` \| `"poststop"` \| `"prestart"` \| `"start"` \| `"poststart"` \| `"prerestart"` \| `"restart"` \| `"postrestart"` \| `"build"` \| `"build:changelog"` \| `"build:dist"` \| `"build:docs"` \| `"clean"` \| `"deploy"` \| `"format"` \| `"info"` \| `"lint"` \| `"lint:package"` \| `"lint:packages"` \| `"lint:project"` \| `"list-tasks"` \| `"release"` \| `"renovate"` \| `"dev"` \| `"test:package:all"` \| `"test:package:e2e"` \| `"test:package:integration"` \| `"test:package:unit"` \| `"test:packages:all"`)[]

Run only the first NPM script in `npmScripts` that is found in the
package's `package.json`.

#### Defined in

[src/commands/release.ts:209](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L209)

***

### run?

> `optional` **run**: [`ProtoReleaseTaskRunner`](../type-aliases/ProtoReleaseTaskRunner.md)

A function called when the task is triggered.

#### Defined in

[src/commands/release.ts:243](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L243)

***

### skippable

> **skippable**: `boolean`

Whether the task can be skipped by the user or not.

#### Defined in

[src/commands/release.ts:197](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/release.ts#L197)
