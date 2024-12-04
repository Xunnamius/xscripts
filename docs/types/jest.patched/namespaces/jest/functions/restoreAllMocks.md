[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / restoreAllMocks

# Function: restoreAllMocks()

> **restoreAllMocks**(): *typeof* [`jest`](../README.md)

Restores all mocks and replaced properties back to their original value.
Equivalent to calling `.mockRestore()` on every mocked function
and `.restore()` on every replaced property.

Beware that `jest.restoreAllMocks()` only works when the mock was created
with `jest.spyOn()`; other mocks will require you to manually restore them.

## Returns

*typeof* [`jest`](../README.md)

## Defined in

node\_modules/@types/jest/index.d.ts:146
