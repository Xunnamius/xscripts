[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/error](../README.md) / BuildOutputCheckError

# Class: BuildOutputCheckError

Represents encountering a project that is not a git repository.

## Extends

- `ProjectError`

## Constructors

### new BuildOutputCheckError()

> **new BuildOutputCheckError**(): [`BuildOutputCheckError`](BuildOutputCheckError.md)

Represents encountering a project that is not a git repository.

#### Returns

[`BuildOutputCheckError`](BuildOutputCheckError.md)

#### Overrides

`ProjectError.constructor`

#### Defined in

[src/error.ts:45](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/error.ts#L45)

### new BuildOutputCheckError()

> **new BuildOutputCheckError**(`message`): [`BuildOutputCheckError`](BuildOutputCheckError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

##### message

`string`

#### Returns

[`BuildOutputCheckError`](BuildOutputCheckError.md)

#### Overrides

`ProjectError.constructor`

#### Defined in

[src/error.ts:50](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/error.ts#L50)

## Properties

### \[$type\]

> **\[$type\]**: `symbol`[]

#### Overrides

`ProjectError.[$type]`

#### Defined in

[src/error.ts:41](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/error.ts#L41)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`ProjectError.cause`

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:26

***

### message

> **message**: `string`

#### Inherited from

`ProjectError.message`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`ProjectError.name`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`ProjectError.stack`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`ProjectError.prepareStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`ProjectError.stackTraceLimit`

#### Defined in

node\_modules/@types/node/globals.d.ts:145

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`ProjectError.captureStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:136
