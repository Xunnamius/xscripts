[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / NotAMonorepoError

# Class: NotAMonorepoError

Represents unexpectedly encountering a project that is not a monorepo.

## Extends

- [`ContextError`](ContextError.md)

## Constructors

### new NotAMonorepoError()

> **new NotAMonorepoError**(): [`NotAMonorepoError`](NotAMonorepoError.md)

Represents unexpectedly encountering a project that is not a monorepo.

#### Returns

[`NotAMonorepoError`](NotAMonorepoError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:57](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/errors.ts#L57)

### new NotAMonorepoError()

> **new NotAMonorepoError**(`message`): [`NotAMonorepoError`](NotAMonorepoError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **message**: `string`

#### Returns

[`NotAMonorepoError`](NotAMonorepoError.md)

#### Overrides

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:62](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/project-utils/src/errors.ts#L62)

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
