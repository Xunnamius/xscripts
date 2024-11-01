[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / runnerFactory

# Function: runnerFactory()

> **runnerFactory**(`file`, `args`?, `options`?): (`args`?, `options`?) => `Promise`\<`object`\>

## Parameters

• **file**: `string`

• **args?**: `string`[]

• **options?**: [`RunOptions`](../interfaces/RunOptions.md)

## Returns

`Function`

### Parameters

• **args?**: `string`[]

• **options?**: [`RunOptions`](../interfaces/RunOptions.md)

### Returns

`Promise`\<`object`\>

#### all

> **all**: `undefined` \| `string` \| `string`[] \| `unknown`[] \| `Uint8Array`

The output of the subprocess with `result.stdout` and `result.stderr` interleaved.

This requires the `all` option to be `true`.

This is `undefined` if both `stdout` and `stderr` options are set to only `'inherit'`, `'ignore'`, `Writable` or `integer`, or if the `buffer` option is `false`.

This is an array if the `lines` option is `true`, or if either the `stdout` or `stderr` option is a transform in object mode.

#### cause

> **cause**: `unknown`

Underlying error, if there is one. For example, this is set by `subprocess.kill(error)`.

This is usually an `Error` instance.

#### code

> **code**: `undefined` \| `string`

Node.js-specific [error code](https://nodejs.org/api/errors.html#errorcode), when available.

#### command

> **command**: `string`

The file and arguments that were run.

#### cwd

> **cwd**: `string`

The current directory in which the command was run.

#### durationMs

> **durationMs**: `number`

Duration of the subprocess, in milliseconds.

#### escapedCommand

> **escapedCommand**: `string`

Same as `command` but escaped.

#### exitCode?

> `optional` **exitCode**: `number`

The numeric [exit code](https://en.wikipedia.org/wiki/Exit_status) of the subprocess that was run.

This is `undefined` when the subprocess could not be spawned or was terminated by a signal.

#### failed

> **failed**: `boolean`

Whether the subprocess failed to run.

When this is `true`, the result is an `ExecaError` instance with additional error-related properties.

#### ipcOutput

> **ipcOutput**: [] \| (`null` \| `string` \| `number` \| `boolean` \| `object` \| readonly `JsonMessage`[] \| `object`)[]

All the messages sent by the subprocess to the current process.

This is empty unless the `ipc` option is `true`. Also, this is empty if the `buffer` option is `false`.

#### isCanceled

> **isCanceled**: `boolean`

Whether the subprocess was canceled using the `cancelSignal` option.

#### isForcefullyTerminated

> **isForcefullyTerminated**: `boolean`

Whether the subprocess was terminated by the `SIGKILL` signal sent by the `forceKillAfterDelay` option.

#### isGracefullyCanceled

> **isGracefullyCanceled**: `boolean`

Whether the subprocess was canceled using both the `cancelSignal` and the `gracefulCancel` options.

#### isMaxBuffer

> **isMaxBuffer**: `boolean`

Whether the subprocess failed because its output was larger than the `maxBuffer` option.

#### isTerminated

> **isTerminated**: `boolean`

Whether the subprocess was terminated by a signal (like `SIGTERM`) sent by either:
- The current process.
- Another process. This case is [not supported on Windows](https://nodejs.org/api/process.html#signal-events).

#### message

> **message**: `undefined` \| `string`

Error message when the subprocess failed to run.

#### name

> `readonly` **name**: `undefined` \| `string`

#### originalMessage

> **originalMessage**: `undefined` \| `string`

Original error message. This is the same as `error.message` excluding the subprocess output and some additional information added by Execa.

This exists only in specific instances, such as during a timeout.

#### pipedFrom

> **pipedFrom**: `Result`\<`Options`\>[]

Results of the other subprocesses that were piped into this subprocess.

This array is initially empty and is populated each time the `subprocess.pipe()` method resolves.

#### shortMessage

> **shortMessage**: `undefined` \| `string`

This is the same as `error.message` except it does not include the subprocess output.

#### signal?

> `optional` **signal**: `Signals`

The name of the signal (like `SIGTERM`) that terminated the subprocess, sent by either:
- The current process.
- Another process. This case is [not supported on Windows](https://nodejs.org/api/process.html#signal-events).

If a signal terminated the subprocess, this property is defined and included in the error message. Otherwise it is `undefined`.

#### signalDescription?

> `optional` **signalDescription**: `string`

A human-friendly description of the signal that was used to terminate the subprocess.

If a signal terminated the subprocess, this property is defined and included in the error message. Otherwise it is `undefined`. It is also `undefined` when the signal is very uncommon which should seldomly happen.

#### stack

> **stack**: `undefined` \| `string`

#### stderr

> **stderr**: `string`

#### stdio

> **stdio**: `MapResultStdio`\<readonly [`StdinOptionCommon`\<`false`, `false`\>, `StdoutStderrOptionCommon`\<`false`, `false`\>, `StdoutStderrOptionCommon`\<`false`, `false`\>, `StdioExtraOptionCommon`\<`false`\>] \| readonly [`undefined`, `undefined`, `undefined`] \| readonly [`"pipe"`, `"pipe"`, `"pipe"`] \| readonly [`"inherit"`, `"inherit"`, `"inherit"`] \| readonly [`"ignore"`, `"ignore"`, `"ignore"`] \| readonly [`"overlapped"`, `"overlapped"`, `"overlapped"`], `RunOptions`\>

The output of the subprocess on `stdin`, `stdout`, `stderr` and other file descriptors.

Items are `undefined` when their corresponding `stdio` option is set to only `'inherit'`, `'ignore'`, `Writable` or `integer`, or if the `buffer` option is `false`.

Items are arrays when their corresponding `stdio` option is a transform in object mode.

#### stdout

> **stdout**: `string`

#### timedOut

> **timedOut**: `boolean`

Whether the subprocess timed out due to the `timeout` option.

## Defined in

[test/setup.ts:655](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L655)
