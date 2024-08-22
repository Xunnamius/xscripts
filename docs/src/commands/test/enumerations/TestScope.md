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

[src/commands/test.ts:73](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/src/commands/test.ts#L73)

***

### External

> **External**: `"external"`

Run tests under the ./tests directory except `Source`

#### Defined in

[src/commands/test.ts:65](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/src/commands/test.ts#L65)

***

### Intermediate

> **Intermediate**: `"intermediate"`

Run tests under the ./.transpiled directory

#### Defined in

[src/commands/test.ts:69](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/src/commands/test.ts#L69)

***

### Library

> **Library**: `"library"`

Run tests under the ./lib directory

#### Defined in

[src/commands/test.ts:61](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/src/commands/test.ts#L61)

***

### Source

> **Source**: `"source"`

Run tests under the ./tests directory except `External`

#### Defined in

[src/commands/test.ts:57](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/src/commands/test.ts#L57)
