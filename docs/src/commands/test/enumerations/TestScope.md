[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/test](../README.md) / TestScope

# Enumeration: TestScope

The context in which to search for tests to run.

## Enumeration Members

### All

> **All**: `"all"`

Run tests across all scopes except `Intermediate`.

#### Defined in

[src/commands/test.ts:72](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/test.ts#L72)

***

### External

> **External**: `"external"`

Run tests under the ./tests directory except `Source`

#### Defined in

[src/commands/test.ts:64](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/test.ts#L64)

***

### Intermediate

> **Intermediate**: `"intermediate"`

Run tests under the ./.transpiled directory

#### Defined in

[src/commands/test.ts:68](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/test.ts#L68)

***

### Library

> **Library**: `"library"`

Run tests under the ./lib directory

#### Defined in

[src/commands/test.ts:60](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/test.ts#L60)

***

### Source

> **Source**: `"source"`

Run tests under the ./tests directory except `External`

#### Defined in

[src/commands/test.ts:56](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/src/commands/test.ts#L56)
