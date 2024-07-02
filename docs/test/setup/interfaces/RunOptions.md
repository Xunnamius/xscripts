[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / RunOptions

# Interface: RunOptions

## Extends

- [`RunOptions`](../../../lib/run/interfaces/RunOptions.md)

## Properties

### all?

> `readonly` `optional` **all**: `boolean`

Add an `.all` property on the promise and the resolved value. The property contains the output of the process with `stdout` and `stderr` interleaved.

#### Default

```ts
false
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`all`](../../../lib/run/interfaces/RunOptions.md#all)

#### Defined in

node\_modules/execa/index.d.ts:96

***

### argv0?

> `readonly` `optional` **argv0**: `string`

Explicitly set the value of `argv[0]` sent to the child process. This will be set to `command` or `file` if not specified.

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`argv0`](../../../lib/run/interfaces/RunOptions.md#argv0)

#### Defined in

node\_modules/execa/index.d.ts:129

***

### buffer?

> `readonly` `optional` **buffer**: `boolean`

Buffer the output from the spawned process. When set to `false`, you must read the output of `stdout` and `stderr` (or `all` if the `all` option is `true`). Otherwise the returned promise will not be resolved/rejected.

If the spawned process fails, `error.stdout`, `error.stderr`, and `error.all` will contain the buffered data.

#### Default

```ts
true
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`buffer`](../../../lib/run/interfaces/RunOptions.md#buffer)

#### Defined in

node\_modules/execa/index.d.ts:61

***

### cleanup?

> `readonly` `optional` **cleanup**: `boolean`

Kill the spawned process when the parent process exits unless either:
	- the spawned process is [`detached`](https://nodejs.org/api/child_process.html#child_process_options_detached)
	- the parent process is terminated abruptly, for example, with `SIGKILL` as opposed to `SIGTERM` or a normal exit

#### Default

```ts
true
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`cleanup`](../../../lib/run/interfaces/RunOptions.md#cleanup)

#### Defined in

node\_modules/execa/index.d.ts:23

***

### cwd?

> `readonly` `optional` **cwd**: `string`

Current working directory of the child process.

#### Default

```ts
process.cwd()
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`cwd`](../../../lib/run/interfaces/RunOptions.md#cwd)

#### Defined in

node\_modules/execa/index.d.ts:117

***

### detached?

> `readonly` `optional` **detached**: `boolean`

Prepare child to run independently of its parent process. Specific behavior [depends on the platform](https://nodejs.org/api/child_process.html#child_process_options_detached).

#### Default

```ts
false
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`detached`](../../../lib/run/interfaces/RunOptions.md#detached)

#### Defined in

node\_modules/execa/index.d.ts:156

***

### encoding?

> `readonly` `optional` **encoding**: `string`

Specify the character encoding used to decode the `stdout` and `stderr` output. If set to `null`, then `stdout` and `stderr` will be a `Buffer` instead of a string.

#### Default

```ts
'utf8'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`encoding`](../../../lib/run/interfaces/RunOptions.md#encoding)

#### Defined in

node\_modules/execa/index.d.ts:185

***

### env?

> `readonly` `optional` **env**: `ProcessEnv`

Environment key-value pairs. Extends automatically from `process.env`. Set `extendEnv` to `false` if you don't want this.

#### Default

```ts
process.env
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`env`](../../../lib/run/interfaces/RunOptions.md#env)

#### Defined in

node\_modules/execa/index.d.ts:124

***

### execPath?

> `readonly` `optional` **execPath**: `string`

Path to the Node.js executable to use in child processes.

This can be either an absolute path or a path relative to the `cwd` option.

Requires `preferLocal` to be `true`.

For example, this can be used together with [`get-node`](https://github.com/ehmicky/get-node) to run a specific Node.js version in a child process.

#### Default

```ts
process.execPath
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`execPath`](../../../lib/run/interfaces/RunOptions.md#execpath)

#### Defined in

node\_modules/execa/index.d.ts:52

***

### extendEnv?

> `readonly` `optional` **extendEnv**: `boolean`

Set to `false` if you don't want to extend the environment variables when providing the `env` property.

#### Default

```ts
true
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`extendEnv`](../../../lib/run/interfaces/RunOptions.md#extendenv)

#### Defined in

node\_modules/execa/index.d.ts:110

***

### gid?

> `readonly` `optional` **gid**: `number`

Sets the group identity of the process.

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`gid`](../../../lib/run/interfaces/RunOptions.md#gid)

#### Defined in

node\_modules/execa/index.d.ts:166

***

### input?

> `readonly` `optional` **input**: `string` \| `Buffer` \| `Readable`

Write some input to the `stdin` of your binary.

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`input`](../../../lib/run/interfaces/RunOptions.md#input)

#### Defined in

node\_modules/execa/index.d.ts:227

***

### killSignal?

> `readonly` `optional` **killSignal**: `string` \| `number`

Signal value to be used when the spawned process will be killed.

#### Default

```ts
'SIGTERM'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`killSignal`](../../../lib/run/interfaces/RunOptions.md#killsignal)

#### Defined in

node\_modules/execa/index.d.ts:206

***

### localDir?

> `readonly` `optional` **localDir**: `string`

Preferred path to find locally installed binaries in (use with `preferLocal`).

#### Default

```ts
process.cwd()
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`localDir`](../../../lib/run/interfaces/RunOptions.md#localdir)

#### Defined in

node\_modules/execa/index.d.ts:39

***

### maxBuffer?

> `readonly` `optional` **maxBuffer**: `number`

Largest amount of data in bytes allowed on `stdout` or `stderr`. Default: 100 MB.

#### Default

```ts
100_000_000
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`maxBuffer`](../../../lib/run/interfaces/RunOptions.md#maxbuffer)

#### Defined in

node\_modules/execa/index.d.ts:199

***

### preferLocal?

> `readonly` `optional` **preferLocal**: `boolean`

Prefer locally installed binaries when looking for a binary to execute.

If you `$ npm install foo`, you can then `execa('foo')`.

#### Default

```ts
false
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`preferLocal`](../../../lib/run/interfaces/RunOptions.md#preferlocal)

#### Defined in

node\_modules/execa/index.d.ts:32

***

### reject?

> `optional` **reject**: `boolean`

Setting this to `true` rejects the promise instead of resolving it with the error.

#### Default

```ts
false
```

#### Overrides

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`reject`](../../../lib/run/interfaces/RunOptions.md#reject)

#### Defined in

[test/setup.ts:497](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L497)

***

### serialization?

> `readonly` `optional` **serialization**: `"json"` \| `"advanced"`

Specify the kind of serialization used for sending messages between processes when using the `stdio: 'ipc'` option or `execa.node()`:
	- `json`: Uses `JSON.stringify()` and `JSON.parse()`.
	- `advanced`: Uses [`v8.serialize()`](https://nodejs.org/api/v8.html#v8_v8_serialize_value)

Requires Node.js `13.2.0` or later.

[More info.](https://nodejs.org/api/child_process.html#child_process_advanced_serialization)

#### Default

```ts
'json'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`serialization`](../../../lib/run/interfaces/RunOptions.md#serialization)

#### Defined in

node\_modules/execa/index.d.ts:149

***

### shell?

> `readonly` `optional` **shell**: `string` \| `boolean`

If `true`, runs `command` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows. A different shell can be specified as a string. The shell should understand the `-c` switch on UNIX or `/d /s /c` on Windows.

We recommend against using this option since it is:
- not cross-platform, encouraging shell-specific syntax.
- slower, because of the additional shell interpretation.
- unsafe, potentially allowing command injection.

#### Default

```ts
false
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`shell`](../../../lib/run/interfaces/RunOptions.md#shell)

#### Defined in

node\_modules/execa/index.d.ts:178

***

### stderr?

> `readonly` `optional` **stderr**: `StdioOption`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### Default

```ts
'pipe'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`stderr`](../../../lib/run/interfaces/RunOptions.md#stderr)

#### Defined in

node\_modules/execa/index.d.ts:82

***

### stdin?

> `readonly` `optional` **stdin**: `StdioOption`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### Default

```ts
'pipe'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`stdin`](../../../lib/run/interfaces/RunOptions.md#stdin)

#### Defined in

node\_modules/execa/index.d.ts:68

***

### stdio?

> `readonly` `optional` **stdio**: `"pipe"` \| `"ignore"` \| `"inherit"` \| readonly `StdioOption`[]

Child's [stdio](https://nodejs.org/api/child_process.html#child_process_options_stdio) configuration.

#### Default

```ts
'pipe'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`stdio`](../../../lib/run/interfaces/RunOptions.md#stdio)

#### Defined in

node\_modules/execa/index.d.ts:136

***

### stdout?

> `readonly` `optional` **stdout**: `StdioOption`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### Default

```ts
'pipe'
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`stdout`](../../../lib/run/interfaces/RunOptions.md#stdout)

#### Defined in

node\_modules/execa/index.d.ts:75

***

### stripFinalNewline?

> `readonly` `optional` **stripFinalNewline**: `boolean`

Strip the final [newline character](https://en.wikipedia.org/wiki/Newline) from the output.

#### Default

```ts
true
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`stripFinalNewline`](../../../lib/run/interfaces/RunOptions.md#stripfinalnewline)

#### Defined in

node\_modules/execa/index.d.ts:103

***

### timeout?

> `readonly` `optional` **timeout**: `number`

If `timeout` is greater than `0`, the parent will send the signal identified by the `killSignal` property (the default is `SIGTERM`) if the child runs longer than `timeout` milliseconds.

#### Default

```ts
0
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`timeout`](../../../lib/run/interfaces/RunOptions.md#timeout)

#### Defined in

node\_modules/execa/index.d.ts:192

***

### uid?

> `readonly` `optional` **uid**: `number`

Sets the user identity of the process.

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`uid`](../../../lib/run/interfaces/RunOptions.md#uid)

#### Defined in

node\_modules/execa/index.d.ts:161

***

### windowsHide?

> `readonly` `optional` **windowsHide**: `boolean`

On Windows, do not create a new console window. Please note this also prevents `CTRL-C` [from working](https://github.com/nodejs/node/issues/29837) on Windows.

#### Default

```ts
true
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`windowsHide`](../../../lib/run/interfaces/RunOptions.md#windowshide)

#### Defined in

node\_modules/execa/index.d.ts:220

***

### windowsVerbatimArguments?

> `readonly` `optional` **windowsVerbatimArguments**: `boolean`

If `true`, no quoting or escaping of arguments is done on Windows. Ignored on other platforms. This is set to `true` automatically when the `shell` option is `true`.

#### Default

```ts
false
```

#### Inherited from

[`RunOptions`](../../../lib/run/interfaces/RunOptions.md).[`windowsVerbatimArguments`](../../../lib/run/interfaces/RunOptions.md#windowsverbatimarguments)

#### Defined in

node\_modules/execa/index.d.ts:213
