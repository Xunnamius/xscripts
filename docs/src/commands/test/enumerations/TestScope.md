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

[src/commands/test.ts:68](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/test.ts#L68)

***

### External

> **External**: `"external"`

Run tests under the ./tests directory except `Source`

#### Defined in

[src/commands/test.ts:60](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/test.ts#L60)

***

### Intermediate

> **Intermediate**: `"intermediate"`

Run tests under the ./.transpiled directory

#### Defined in

[src/commands/test.ts:64](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/test.ts#L64)

***

### Library

> **Library**: `"library"`

Run tests under the ./lib directory

#### Defined in

[src/commands/test.ts:56](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/test.ts#L56)

***

### Source

> **Source**: `"source"`

Run tests under the ./tests directory except `External`

#### Defined in

[src/commands/test.ts:52](https://github.com/Xunnamius/xscripts/blob/09056cae12d2b8f174c6d0ccc038e6099f396bc6/src/commands/test.ts#L52)
