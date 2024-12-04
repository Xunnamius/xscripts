[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_jest.config.mjs](../README.md) / baseConfig

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

### collectCoverageFrom

> `readonly` **collectCoverageFrom**: [`"src/**/*.ts?(x)"`]

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

[src/assets/config/\_jest.config.mjs.ts:48](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets/config/_jest.config.mjs.ts#L48)
