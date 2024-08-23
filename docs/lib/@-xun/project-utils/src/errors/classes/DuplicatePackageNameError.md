[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/errors](../README.md) / DuplicatePackageNameError

# Class: DuplicatePackageNameError

Represents encountering a workspace package.json file with the same `"name"`
field as another workspace.

## Extends

- [`DuplicateWorkspaceError`](DuplicateWorkspaceError.md)

## Constructors

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

Represents encountering a workspace package.json file with the same
`"name"` field as another workspace.

#### Parameters

• **pkgName**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

#### Returns

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:133](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L133)

### new DuplicatePackageNameError()

> **new DuplicatePackageNameError**(`pkgName`, `firstPath`, `secondPath`, `message`): [`DuplicatePackageNameError`](DuplicatePackageNameError.md)

This constructor syntax is used by subclasses when calling this constructor
via `super`.

#### Parameters

• **pkgName**: `string`

• **firstPath**: `string`

• **secondPath**: `string`

• **message**: `string`

#### Returns

[`DuplicatePackageNameError`](DuplicatePackageNameError.md)

#### Overrides

[`DuplicateWorkspaceError`](DuplicateWorkspaceError.md).[`constructor`](DuplicateWorkspaceError.md#constructors)

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:138](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L138)

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

[lib/@-xun/project-utils/src/errors.ts:141](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L141)

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

### pkgName

> `readonly` **pkgName**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:140](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L140)

***

### secondPath

> `readonly` **secondPath**: `string`

#### Defined in

[lib/@-xun/project-utils/src/errors.ts:142](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/errors.ts#L142)

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
