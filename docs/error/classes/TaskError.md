[**@-xun/scripts**](../../README.md) • **Docs**

---

[@-xun/scripts](../../README.md) / [error](../README.md) / TaskError

# Class: TaskError

An `Error` class where the first letter of the message is capitalized.

## Extends

- `Error`

## Constructors

### New Taskerror()

> **new TaskError**(...`args`): [`TaskError`](TaskError.md)

#### Parameters

• ...**args**: \[`string`, `ErrorOptions`]

#### Returns

[`TaskError`](TaskError.md)

#### Overrides

`Error.constructor`

#### Defined In

[lib/@-xun/cli-utils/error.ts:8](https://github.com/Xunnamius/xscripts/blob/e9f020c2a756a49be6cdccf55d88b926dd2645e9/lib/@-xun/cli-utils/error.ts#L8)

## Properties

### Cause?

> `optional` **cause**: `unknown`

#### Inherited From

`Error.cause`

#### Defined In

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

---

### Message

> **message**: `string`

#### Inherited From

`Error.message`

#### Defined In

node\_modules/typescript/lib/lib.es5.d.ts:1077

---

### Name

> **name**: `string`

#### Inherited From

`Error.name`

#### Defined In

node\_modules/typescript/lib/lib.es5.d.ts:1076

---

### Stack?

> `optional` **stack**: `string`

#### Inherited From

`Error.stack`

#### Defined In

node\_modules/typescript/lib/lib.es5.d.ts:1078

---

### Preparestacktrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

<https://v8.dev/docs/stack-trace-api#customizing-stack-traces>

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`\[]

#### Returns

`any`

#### Inherited From

`Error.prepareStackTrace`

#### Defined In

node\_modules/@types/node/globals.d.ts:28

---

### Stacktracelimit

> `static` **stackTraceLimit**: `number`

#### Inherited From

`Error.stackTraceLimit`

#### Defined In

node\_modules/@types/node/globals.d.ts:30

## Methods

### Capturestacktrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited From

`Error.captureStackTrace`

#### Defined In

node\_modules/@types/node/globals.d.ts:21
