[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / setSystemTime

# Function: setSystemTime()

> **setSystemTime**(`now`?): `void`

Set the current system time used by fake timers. Simulates a user
changing the system clock while your program is running. It affects the
current time but it does not in itself cause e.g. timers to fire; they
will fire exactly as they would have done without the call to
jest.setSystemTime().

> Note: This function is only available when using modern fake timers
> implementation

## Parameters

### now?

`number` | `Date`

## Returns

`void`

## Defined in

node\_modules/@types/jest/index.d.ts:167
