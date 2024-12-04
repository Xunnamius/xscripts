[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / runOnlyPendingTimersAsync

# Function: runOnlyPendingTimersAsync()

> **runOnlyPendingTimersAsync**(): `Promise`\<`void`\>

Asynchronous equivalent of `jest.runOnlyPendingTimers()`. It also yields to the event loop,
allowing any scheduled promise callbacks to execute _before_ running the timers.

## Returns

`Promise`\<`void`\>

## Remarks

Not available when using legacy fake timers implementation.

## Defined in

node\_modules/@types/jest/index.d.ts:329
