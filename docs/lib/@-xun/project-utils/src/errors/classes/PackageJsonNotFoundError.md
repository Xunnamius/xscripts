[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / PackageJsonNotFoundError

# Class: PackageJsonNotFoundError

Represents a failure to find a package.json file.

## Extends

- [`ContextError`](ContextError.md)

## Constructors

### new PackageJsonNotFoundError()

> **new PackageJsonNotFoundError**(`reason`): [`PackageJsonNotFoundError`](PackageJsonNotFoundError.md)

Represents a failure to find a package.json file.

#### Parameters

• **reason**: `unknown`

#### Returns

[`PackageJsonNotFoundError`](PackageJsonNotFoundError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:79](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/errors.ts#L79)

### new PackageJsonNotFoundError()

> **new PackageJsonNotFoundError**(`reason`, `message`): [`PackageJsonNotFoundError`](PackageJsonNotFoundError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **reason**: `unknown`

• **message**: `string`

#### Returns

[`PackageJsonNotFoundError`](PackageJsonNotFoundError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:84](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/errors.ts#L84)

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

### reason

> `readonly` **reason**: `unknown`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:86](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/errors.ts#L86)

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
