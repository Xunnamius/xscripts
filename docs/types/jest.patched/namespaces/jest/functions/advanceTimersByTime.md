[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / advanceTimersByTime

# Function: advanceTimersByTime()

> **advanceTimersByTime**(`msToRun`): `void`

Advances all timers by `msToRun` milliseconds. All pending macro-tasks that have been
queued by `setTimeout()`, `setInterval()` and `setImmediate()`, and would be executed
within this time frame will be executed.

## Parameters

### msToRun

`number`

## Returns

`void`

## Defined in

node\_modules/@types/jest/index.d.ts:335
