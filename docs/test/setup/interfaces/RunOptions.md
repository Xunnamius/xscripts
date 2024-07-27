[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / RunOptions

# Interface: RunOptions

## Extends

- `Options`

## Properties

### all?

> `readonly` `optional` **all**: `boolean`

Add a `subprocess.all` stream and a `result.all` property. They contain the combined/interleaved output of the subprocess' `stdout` and `stderr`.

#### Default

```ts
false
```

#### Inherited from

`ExecaOptions.all`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:147

***

### argv0?

> `readonly` `optional` **argv0**: `string`

Value of [`argv[0]`](https://nodejs.org/api/process.html#processargv0) sent to the subprocess.

#### Default

```ts
file being executed
```

#### Inherited from

`ExecaOptions.argv0`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:347

***

### buffer?

> `readonly` `optional` **buffer**: `FdGenericOption`\<`boolean`\>

When `buffer` is `false`, the `result.stdout`, `result.stderr`, `result.all` and `result.stdio` properties are not set.

By default, this applies to both `stdout` and `stderr`, but different values can also be passed.

#### Default

```ts
true
```

#### Inherited from

`ExecaOptions.buffer`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:202

***

### cancelSignal?

> `readonly` `optional` **cancelSignal**: `AbortSignal`

When the `cancelSignal` is [aborted](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort), terminate the subprocess using a `SIGTERM` signal.

When aborted, `error.isCanceled` becomes `true`.

#### Example

```
import {execaNode} from 'execa';

const controller = new AbortController();
const cancelSignal = controller.signal;

setTimeout(() => {
	controller.abort();
}, 5000);

try {
	await execaNode({cancelSignal})`build.js`;
} catch (error) {
	if (error.isCanceled) {
		console.error('Canceled by cancelSignal.');
	}

	throw error;
}
```

#### Inherited from

`ExecaOptions.cancelSignal`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:283

***

### cleanup?

> `readonly` `optional` **cleanup**: `boolean`

Kill the subprocess when the current process exits.

#### Default

```ts
true
```

#### Inherited from

`ExecaOptions.cleanup`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:326

***

### cwd?

> `readonly` `optional` **cwd**: `string` \| `URL`

Current [working directory](https://en.wikipedia.org/wiki/Working_directory) of the subprocess.

This is also used to resolve the `nodePath` option when it is a relative path.

#### Default

```ts
process.cwd()
```

#### Inherited from

`ExecaOptions.cwd`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:71

***

### detached?

> `readonly` `optional` **detached**: `boolean`

Run the subprocess independently from the current process.

#### Default

```ts
false
```

#### Inherited from

`ExecaOptions.detached`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:319

***

### encoding?

> `readonly` `optional` **encoding**: `EncodingOption`

If the subprocess outputs text, specifies its character encoding, either [`'utf8'`](https://en.wikipedia.org/wiki/UTF-8) or [`'utf16le'`](https://en.wikipedia.org/wiki/UTF-16).

If it outputs binary data instead, this should be either:
- `'buffer'`: returns the binary output as an `Uint8Array`.
- [`'hex'`](https://en.wikipedia.org/wiki/Hexadecimal), [`'base64'`](https://en.wikipedia.org/wiki/Base64), [`'base64url'`](https://en.wikipedia.org/wiki/Base64#URL_applications), [`'latin1'`](https://nodejs.org/api/buffer.html#buffers-and-character-encodings) or [`'ascii'`](https://nodejs.org/api/buffer.html#buffers-and-character-encodings): encodes the binary output as a string.

The output is available with `result.stdout`, `result.stderr` and `result.stdio`.

#### Default

```ts
'utf8'
```

#### Inherited from

`ExecaOptions.encoding`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:160

***

### env?

> `readonly` `optional` **env**: `ProcessEnv`

[Environment variables](https://en.wikipedia.org/wiki/Environment_variable).

Unless the `extendEnv` option is `false`, the subprocess also uses the current process' environment variables ([`process.env`](https://nodejs.org/api/process.html#processenv)).

#### Default

```ts
[process.env](https://nodejs.org/api/process.html#processenv)
```

#### Inherited from

`ExecaOptions.env`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:80

***

### extendEnv?

> `readonly` `optional` **extendEnv**: `boolean`

If `true`, the subprocess uses both the `env` option and the current process' environment variables ([`process.env`](https://nodejs.org/api/process.html#processenv)).
If `false`, only the `env` option is used, not `process.env`.

#### Default

```ts
true
```

#### Inherited from

`ExecaOptions.extendEnv`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:88

***

### forceKillAfterDelay?

> `readonly` `optional` **forceKillAfterDelay**: `number` \| `boolean`

If the subprocess is terminated but does not exit, forcefully exit it by sending [`SIGKILL`](https://en.wikipedia.org/wiki/Signal_(IPC)#SIGKILL).

When this happens, `error.isForcefullyTerminated` becomes `true`.

#### Default

```ts
5000
```

#### Inherited from

`ExecaOptions.forceKillAfterDelay`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:303

***

### gid?

> `readonly` `optional` **gid**: `number`

Sets the [group identifier](https://en.wikipedia.org/wiki/Group_identifier) of the subprocess.

#### Default

```ts
current group identifier
```

#### Inherited from

`ExecaOptions.gid`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:340

***

### gracefulCancel?

> `readonly` `optional` **gracefulCancel**: `boolean`

When the `cancelSignal` option is [aborted](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort), do not send any `SIGTERM`. Instead, abort the [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) returned by `getCancelSignal()`. The subprocess should use it to terminate gracefully.

The subprocess must be a Node.js file.

When aborted, `error.isGracefullyCanceled` becomes `true`.

#### Default

```ts
false
```

#### Inherited from

`ExecaOptions.gracefulCancel`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:294

***

### input?

> `readonly` `optional` **input**: `string` \| `Uint8Array` \| `Readable`

Write some input to the subprocess' [`stdin`](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)).

See also the `inputFile` and `stdin` options.

#### Inherited from

`ExecaOptions.input`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:95

***

### inputFile?

> `readonly` `optional` **inputFile**: `string` \| `URL`

Use a file as input to the subprocess' [`stdin`](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)).

See also the `input` and `stdin` options.

#### Inherited from

`ExecaOptions.inputFile`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:102

***

### ipc?

> `readonly` `optional` **ipc**: `boolean`

Enables exchanging messages with the subprocess using `subprocess.sendMessage(message)`, `subprocess.getOneMessage()` and `subprocess.getEachMessage()`.

The subprocess must be a Node.js file.

#### Default

`true` if the `node`, `ipcInput` or `gracefulCancel` option is set, `false` otherwise

#### Inherited from

`ExecaOptions.ipc`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:211

***

### ipcInput?

> `readonly` `optional` **ipcInput**: `Message`

Sends an IPC message when the subprocess starts.

The subprocess must be a Node.js file. The value's type depends on the `serialization` option.

#### Inherited from

`ExecaOptions.ipcInput`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:225

***

### killSignal?

> `readonly` `optional` **killSignal**: `number` \| `Signals`

Default [signal](https://en.wikipedia.org/wiki/Signal_(IPC)) used to terminate the subprocess.

This can be either a name (like `'SIGTERM'`) or a number (like `9`).

#### Default

```ts
'SIGTERM'
```

#### Inherited from

`ExecaOptions.killSignal`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:312

***

### lines?

> `readonly` `optional` **lines**: `FdGenericOption`\<`boolean`\>

Set `result.stdout`, `result.stderr`, `result.all` and `result.stdio` as arrays of strings, splitting the subprocess' output into lines.

This cannot be used if the `encoding` option is binary.

By default, this applies to both `stdout` and `stderr`, but different values can also be passed.

#### Default

```ts
false
```

#### Inherited from

`ExecaOptions.lines`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:171

***

### localDir?

> `readonly` `optional` **localDir**: `string` \| `URL`

Preferred path to find locally installed binaries, when using the `preferLocal` option.

#### Default

`cwd` option

#### Inherited from

`ExecaOptions.localDir`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:24

***

### maxBuffer?

> `readonly` `optional` **maxBuffer**: `FdGenericOption`\<`number`\>

Largest amount of data allowed on `stdout`, `stderr` and `stdio`.

By default, this applies to both `stdout` and `stderr`, but different values can also be passed.

When reached, `error.isMaxBuffer` becomes `true`.

#### Default

```ts
100_000_000
```

#### Inherited from

`ExecaOptions.maxBuffer`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:193

***

### node?

> `readonly` `optional` **node**: `boolean`

If `true`, runs with Node.js. The first argument must be a Node.js file.

The subprocess inherits the current Node.js [CLI flags](https://nodejs.org/api/cli.html#options) and version. This can be overridden using the `nodeOptions` and `nodePath` options.

#### Default

`true` with `execaNode()`, `false` otherwise

#### Inherited from

`ExecaOptions.node`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:33

***

### nodeOptions?

> `readonly` `optional` **nodeOptions**: readonly `string`[]

List of [CLI flags](https://nodejs.org/api/cli.html#cli_options) passed to the Node.js executable.

Requires the `node` option to be `true`.

#### Default

[`process.execArgv`](https://nodejs.org/api/process.html#process_process_execargv) (current Node.js CLI flags)

#### Inherited from

`ExecaOptions.nodeOptions`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:42

***

### nodePath?

> `readonly` `optional` **nodePath**: `string` \| `URL`

Path to the Node.js executable.

Requires the `node` option to be `true`.

#### Default

[`process.execPath`](https://nodejs.org/api/process.html#process_process_execpath) (current Node.js executable)

#### Inherited from

`ExecaOptions.nodePath`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:51

***

### preferLocal?

> `readonly` `optional` **preferLocal**: `boolean`

Prefer locally installed binaries when looking for a binary to execute.

#### Default

`true` with `$`, `false` otherwise

#### Inherited from

`ExecaOptions.preferLocal`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:17

***

### reject?

> `optional` **reject**: `boolean`

Setting this to `true` rejects the promise instead of resolving it with the error.

#### Default

```ts
false
```

#### Overrides

`ExecaOptions.reject`

#### Defined in

[test/setup.ts:539](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/test/setup.ts#L539)

***

### serialization?

> `readonly` `optional` **serialization**: `"json"` \| `"advanced"`

Specify the kind of serialization used for sending messages between subprocesses when using the `ipc` option.

#### Default

```ts
'advanced'
```

#### Inherited from

`ExecaOptions.serialization`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:218

***

### shell?

> `readonly` `optional` **shell**: `string` \| `boolean` \| `URL`

If `true`, runs the command inside of a [shell](https://en.wikipedia.org/wiki/Shell_(computing)).

Uses [`/bin/sh`](https://en.wikipedia.org/wiki/Unix_shell) on UNIX and [`cmd.exe`](https://en.wikipedia.org/wiki/Cmd.exe) on Windows. A different shell can be specified as a string. The shell should understand the `-c` switch on UNIX or `/d /s /c` on Windows.

We recommend against using this option.

#### Default

```ts
false
```

#### Inherited from

`ExecaOptions.shell`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:62

***

### stderr?

> `readonly` `optional` **stderr**: `StdoutStderrOptionCommon`\<`false`\>

How to setup the subprocess' [standard error](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)). This can be `'pipe'`, `'overlapped'`, `'ignore`, `'inherit'`, a file descriptor integer, a Node.js `Writable` stream, a web `WritableStream`, a `{ file: 'path' }` object, a file URL, a generator function, a `Duplex` or a web `TransformStream`.

This can be an array of values such as `['inherit', 'pipe']` or `[fileUrl, 'pipe']`.

#### Default

```ts
'pipe'
```

#### Inherited from

`ExecaOptions.stderr`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:129

***

### stdin?

> `readonly` `optional` **stdin**: `StdinOptionCommon`\<`false`\>

How to setup the subprocess' [standard input](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)). This can be `'pipe'`, `'overlapped'`, `'ignore`, `'inherit'`, a file descriptor integer, a Node.js `Readable` stream, a web `ReadableStream`, a `{ file: 'path' }` object, a file URL, an `Iterable`, an `AsyncIterable`, an `Uint8Array`, a generator function, a `Duplex` or a web `TransformStream`.

This can be an array of values such as `['inherit', 'pipe']` or `[fileUrl, 'pipe']`.

#### Default

`'inherit'` with `$`, `'pipe'` otherwise

#### Inherited from

`ExecaOptions.stdin`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:111

***

### stdio?

> `readonly` `optional` **stdio**: `StdioOptionsProperty`\<`false`\>

Like the `stdin`, `stdout` and `stderr` options but for all [file descriptors](https://en.wikipedia.org/wiki/File_descriptor) at once. For example, `{stdio: ['ignore', 'pipe', 'pipe']}` is the same as `{stdin: 'ignore', stdout: 'pipe', stderr: 'pipe'}`.

A single string can be used as a shortcut.

The array can have more than 3 items, to create additional file descriptors beyond `stdin`/`stdout`/`stderr`.

#### Default

```ts
'pipe'
```

#### Inherited from

`ExecaOptions.stdio`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:140

***

### stdout?

> `readonly` `optional` **stdout**: `StdoutStderrOptionCommon`\<`false`\>

How to setup the subprocess' [standard output](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)). This can be `'pipe'`, `'overlapped'`, `'ignore`, `'inherit'`, a file descriptor integer, a Node.js `Writable` stream, a web `WritableStream`, a `{ file: 'path' }` object, a file URL, a generator function, a `Duplex` or a web `TransformStream`.

This can be an array of values such as `['inherit', 'pipe']` or `[fileUrl, 'pipe']`.

#### Default

```ts
'pipe'
```

#### Inherited from

`ExecaOptions.stdout`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:120

***

### stripFinalNewline?

> `readonly` `optional` **stripFinalNewline**: `FdGenericOption`\<`boolean`\>

Strip the final [newline character](https://en.wikipedia.org/wiki/Newline) from the output.

If the `lines` option is true, this applies to each output line instead.

By default, this applies to both `stdout` and `stderr`, but different values can also be passed.

#### Default

```ts
true
```

#### Inherited from

`ExecaOptions.stripFinalNewline`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:182

***

### timeout?

> `readonly` `optional` **timeout**: `number`

If `timeout` is greater than `0`, the subprocess will be terminated if it runs for longer than that amount of milliseconds.

On timeout, `error.timedOut` becomes `true`.

#### Default

```ts
0
```

#### Inherited from

`ExecaOptions.timeout`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:254

***

### uid?

> `readonly` `optional` **uid**: `number`

Sets the [user identifier](https://en.wikipedia.org/wiki/User_identifier) of the subprocess.

#### Default

```ts
current user identifier
```

#### Inherited from

`ExecaOptions.uid`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:333

***

### verbose?

> `readonly` `optional` **verbose**: `VerboseOption`

If `verbose` is `'short'`, prints the command on [`stderr`](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)): its file, arguments, duration and (if it failed) error message.

If `verbose` is `'full'` or a function, the command's [`stdout`](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)), `stderr` and IPC messages are also printed.

A function can be passed to customize logging.

By default, this applies to both `stdout` and `stderr`, but different values can also be passed.

#### Default

```ts
'none'
```

#### Inherited from

`ExecaOptions.verbose`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:238

***

### windowsHide?

> `readonly` `optional` **windowsHide**: `boolean`

On Windows, do not create a new console window.

#### Default

```ts
true
```

#### Inherited from

`ExecaOptions.windowsHide`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:354

***

### windowsVerbatimArguments?

> `readonly` `optional` **windowsVerbatimArguments**: `boolean`

If `false`, escapes the command arguments on Windows.

#### Default

`true` if the `shell` option is `true`, `false` otherwise

#### Inherited from

`ExecaOptions.windowsVerbatimArguments`

#### Defined in

node\_modules/execa/types/arguments/options.d.ts:361
