[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / DuplicatePackageIdError

# Class: DuplicatePackageIdError

Represents encountering an unnamed workspace with the same package-id as
another workspace.

## Extends

- [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

## Constructors

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

Represents encountering an unnamed workspace with the same package-id as
another workspace.

#### Parameters

• **id**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:164](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L164)

### new DuplicatePackageIdError()

> **new DuplicatePackageIdError**(`id`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageIdError`](DuplicatePackageIdError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **id**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

• **message**: `string`

#### Returns

[`DuplicatePackageIdError`](DuplicatePackageIdError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:169](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L169)

## Properties

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`cause`](DuplicateWorkspaceError.md#cause)

#### Defined in

node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### firstPath

> `readonly` **firstPath**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:172](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L172)

***

### id

> `readonly` **id**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:171](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L171)

***

### message

> **message**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`message`](DuplicateWorkspaceError.md#message)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`name`](DuplicateWorkspaceError.md#name)

#### Defined in

node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### secondPath

> `readonly` **secondPath**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:173](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L173)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`stack`](DuplicateWorkspaceError.md#stack)

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

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`prepareStackTrace`](DuplicateWorkspaceError.md#preparestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:74

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`stackTraceLimit`](DuplicateWorkspaceError.md#stacktracelimit)

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

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`captureStackTrace`](DuplicateWorkspaceError.md#capturestacktrace)

#### Defined in

node\_modules/@types/node/globals.d.ts:67
