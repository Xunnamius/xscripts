[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [lib/run](../README.md) / RunReturnType

# Interface: RunReturnType\<StdoutErrorType\>

Result of a child process execution. On success this is a plain object. On failure this is also an `Error` instance.

The child process fails when:
- its exit code is not `0`
- it was killed with a signal
- timing out
- being canceled
- there's not enough memory or there are already too many child processes

## Extends

- `ExecaSyncReturnValue`\<`StdoutErrorType`\>

## Type Parameters

• **StdoutErrorType** = `string`

## Properties

### all?

> `optional` **all**: `StdoutErrorType`

The output of the process with `stdout` and `stderr` interleaved.

This is `undefined` if either:
- the `all` option is `false` (default value)
- `execa.sync()` was used

#### Defined in

node\_modules/execa/index.d.ts:337

***

### command

> **command**: `string`

The file and arguments that were run, for logging purposes.

This is not escaped and should not be executed directly as a process, including using `execa()` or `execa.command()`.

#### Inherited from

`ExecaSyncReturnValue.command`

#### Defined in

node\_modules/execa/index.d.ts:259

***

### escapedCommand

> **escapedCommand**: `string`

Same as `command` but escaped.

This is meant to be copy and pasted into a shell, for debugging purposes.
Since the escaping is fairly basic, this should not be executed directly as a process, including using `execa()` or `execa.command()`.

#### Inherited from

`ExecaSyncReturnValue.escapedCommand`

#### Defined in

node\_modules/execa/index.d.ts:267

***

### exitCode

> **exitCode**: `number`

The numeric exit code of the process that was run.

#### Inherited from

`ExecaSyncReturnValue.exitCode`

#### Defined in

node\_modules/execa/index.d.ts:272

***

### failed

> **failed**: `boolean`

Whether the process failed to run.

#### Inherited from

`ExecaSyncReturnValue.failed`

#### Defined in

node\_modules/execa/index.d.ts:287

***

### isCanceled

> **isCanceled**: `boolean`

Whether the process was canceled.

#### Defined in

node\_modules/execa/index.d.ts:342

***

### killed

> **killed**: `boolean`

Whether the process was killed.

#### Inherited from

`ExecaSyncReturnValue.killed`

#### Defined in

node\_modules/execa/index.d.ts:297

***

### signal?

> `optional` **signal**: `string`

The name of the signal that was used to terminate the process. For example, `SIGFPE`.

If a signal terminated the process, this property is defined and included in the error message. Otherwise it is `undefined`.

#### Inherited from

`ExecaSyncReturnValue.signal`

#### Defined in

node\_modules/execa/index.d.ts:304

***

### signalDescription?

> `optional` **signalDescription**: `string`

A human-friendly description of the signal that was used to terminate the process. For example, `Floating point arithmetic error`.

If a signal terminated the process, this property is defined and included in the error message. Otherwise it is `undefined`. It is also `undefined` when the signal is very uncommon which should seldomly happen.

#### Inherited from

`ExecaSyncReturnValue.signalDescription`

#### Defined in

node\_modules/execa/index.d.ts:311

***

### stderr

> **stderr**: `StdoutErrorType`

The output of the process on stderr.

#### Inherited from

`ExecaSyncReturnValue.stderr`

#### Defined in

node\_modules/execa/index.d.ts:282

***

### stdout

> **stdout**: `StdoutErrorType`

The output of the process on stdout.

#### Inherited from

`ExecaSyncReturnValue.stdout`

#### Defined in

node\_modules/execa/index.d.ts:277

***

### timedOut

> **timedOut**: `boolean`

Whether the process timed out.

#### Inherited from

`ExecaSyncReturnValue.timedOut`

#### Defined in

node\_modules/execa/index.d.ts:292
