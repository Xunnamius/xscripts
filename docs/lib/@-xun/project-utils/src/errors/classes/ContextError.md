[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / ContextError

# Class: ContextError

Represents an exception during context resolution.

## Extends

- `Error`

## Extended by

- [`PathIsNotAbsoluteError`](PathIsNotAbsoluteError.md)
- [`NotAGitRepositoryError`](NotAGitRepositoryError.md)
- [`NotAMonorepoError`](NotAMonorepoError.md)
- [`PackageJsonNotFoundError`](PackageJsonNotFoundError.md)
- [`BadPackageJsonError`](BadPackageJsonError.md)
- [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

## Constructors

### new ContextError()

> **new ContextError**(`message`?): [`ContextError`](ContextError.md)

#### Parameters

• **message?**: `string`

#### Returns

[`ContextError`](ContextError.md)

#### Inherited from

`Error.constructor`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

### new ContextError()

> **new ContextError**(`message`?, `options`?): [`ContextError`](ContextError.md)

#### Parameters

• **message?**: `string`

• **options?**: `ErrorOptions`

#### Returns

[`ContextError`](ContextError.md)

#### Inherited from

`Error.constructor`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:74

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`

#### Defined in

node\_modules/@types/node/globals.d.ts:67
