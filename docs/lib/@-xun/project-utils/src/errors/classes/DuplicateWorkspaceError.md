[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / DuplicateWorkspaceError

# Class: DuplicateWorkspaceError

Represents encountering two or more workspaces that cannot be differentiated
from each other.

## Extends

- [`ContextError`](ContextError.md)

## Extended by

- [`DuplicatePackageNameError`](DuplicatePackageNameError.md)
- [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

## Constructors

### new DuplicateWorkspaceError()

> **new DuplicateWorkspaceError**(`message`?): [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

#### Parameters

• **message?**: `string`

#### Returns

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

#### Inherited from

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

### new DuplicateWorkspaceError()

> **new DuplicateWorkspaceError**(`message`?, `options`?): [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

#### Parameters

• **message?**: `string`

• **options?**: `ErrorOptions`

#### Returns

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

#### Inherited from

[`ContextError`](ContextError.md).[`constructor`](ContextError.md#constructors)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1082

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
