[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / Describe

# Interface: Describe()

> **Describe**(`name`, `fn`): `void`

## Parameters

• **name**: `string` \| `number` \| `Function` \| [`FunctionLike`](FunctionLike.md)

• **fn**: [`EmptyFunction`](../type-aliases/EmptyFunction.md)

## Returns

`void`

## Defined in

node\_modules/@types/jest/index.d.ts:614

## Properties

### each

> **each**: [`Each`](Each.md)

#### Defined in

node\_modules/@types/jest/index.d.ts:619

***

### noskip

> **noskip**: [`Describe`](Describe.md)

Ensures the test contained by this function are run regardless of the
invocation of `reconfigureJestGlobalsToSkipTestsInThisFileIfRequested`.

#### Defined in

[types/jest.patched.d.ts:7](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/types/jest.patched.d.ts#L7)

***

### only

> **only**: [`Describe`](Describe.md)

Only runs the tests inside this `describe` for the current file

#### Defined in

node\_modules/@types/jest/index.d.ts:616

***

### skip

> **skip**: [`Describe`](Describe.md)

Skips running the tests inside this `describe` for the current file

#### Defined in

node\_modules/@types/jest/index.d.ts:618
