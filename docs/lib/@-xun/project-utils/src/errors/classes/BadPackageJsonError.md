[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / BadPackageJsonError

# Class: BadPackageJsonError

Represents encountering an unparsable package.json file.

## Extends

- [`ContextError`](ContextError.md)

## Constructors

### new BadPackageJsonError()

> **new BadPackageJsonError**(`packageJsonPath`, `reason`): [`BadPackageJsonError`](BadPackageJsonError.md)

Represents encountering an unparsable package.json file.

#### Parameters

• **packageJsonPath**: `string`

• **reason**: `unknown`

#### Returns

[`BadPackageJsonError`](BadPackageJsonError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:101](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L101)

### new BadPackageJsonError()

> **new BadPackageJsonError**(`packageJsonPath`, `reason`, `message`): [`BadPackageJsonError`](BadPackageJsonError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **packageJsonPath**: `string`

• **reason**: `unknown`

• **message**: `string`

#### Returns

[`BadPackageJsonError`](BadPackageJsonError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:106](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L106)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`ContextError`](ContextError.md).[`cause`](ContextError.md#cause)

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`message`](ContextError.md#message)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`name`](ContextError.md#name)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### packageJsonPath

> `readonly` **packageJsonPath**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:108](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L108)

***

### reason

> `readonly` **reason**: `unknown`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:109](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L109)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`ContextError`](ContextError.md).[`stack`](ContextError.md#stack)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

[`ContextError`](ContextError.md).[`prepareStackTrace`](ContextError.md#preparestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:74

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`ContextError`](ContextError.md).[`stackTraceLimit`](ContextError.md#stacktracelimit)

#### Defined in

node\_modules/@types/node/globals.d.ts:76

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

[`ContextError`](ContextError.md).[`captureStackTrace`](ContextError.md#capturestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:67
