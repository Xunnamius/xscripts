[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_jest.config.mjs](../README.md) / baseConfig

# Function: baseConfig()

> **baseConfig**(`__namedParameters`): `object`

Return a partial configuration that must be initialized further.

## Parameters

### \_\_namedParameters

#### isDebugging

`boolean` = `false`

**Default**

```ts
false
```

## Returns

`object`

### clearMocks

> `readonly` **clearMocks**: `true` = `true`

### maxConcurrency

> `readonly` **maxConcurrency**: `number`

### modulePathIgnorePatterns

> `readonly` **modulePathIgnorePatterns**: [`"/test/fixtures/"`, `"/.transpiled/"`, `string`]

### resetMocks

> `readonly` **resetMocks**: `true` = `true`

### restoreMocks

> `readonly` **restoreMocks**: `true` = `true`

### setupFilesAfterEnv

> `readonly` **setupFilesAfterEnv**: [`"./test/setup.ts"`]

### testEnvironment

> `readonly` **testEnvironment**: `"node"` = `'node'`

### testPathIgnorePatterns

> `readonly` **testPathIgnorePatterns**: [`"/node_modules/"`, `"/dist/"`, `"/src/"`, `"/.transpiled/"`, `string`, `string`]

### testRunner

> `readonly` **testRunner**: `"jest-circus/runner"` = `'jest-circus/runner'`

### testTimeout

> `readonly` **testTimeout**: `number`

### verbose

> `readonly` **verbose**: `false` = `false`

## Defined in

[src/assets/transformers/\_jest.config.mjs.ts:49](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/assets/transformers/_jest.config.mjs.ts#L49)
