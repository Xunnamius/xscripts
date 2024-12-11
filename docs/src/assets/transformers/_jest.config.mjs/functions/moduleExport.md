[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_jest.config.mjs](../README.md) / moduleExport

# Function: moduleExport()

> **moduleExport**(`__namedParameters`): `object`

## Parameters

### \_\_namedParameters

#### derivedAliases

\{\}

#### isDebugging

`boolean`

#### skipSlowTestsLevel

`number`

Skip slow tests depending on the level given. `0` disables test skipping.
`1` implements the skip by augmenting jest globals. `2` has the same effect
as `1` while entirely skipping tests from files with names containing
`-slow.`.

## Returns

`object`

### clearMocks

> **clearMocks**: `true` = `true`

### maxConcurrency

> **maxConcurrency**: `number`

### moduleNameMapper

> **moduleNameMapper**: `object`

#### Index Signature

 \[`k`: `string`\]: `string`

### modulePathIgnorePatterns

> **modulePathIgnorePatterns**: [`"/test/fixtures/"`, `"/.transpiled/"`, `string`]

### resetMocks

> **resetMocks**: `true` = `true`

### restoreMocks

> **restoreMocks**: `true` = `true`

### setupFilesAfterEnv

> **setupFilesAfterEnv**: [`"./test/setup.ts"`]

### testEnvironment

> **testEnvironment**: `"node"` = `'node'`

### testPathIgnorePatterns

> **testPathIgnorePatterns**: [`"/node_modules/"`, `"/dist/"`, `"/src/"`, `"/.transpiled/"`, `string`, `string`]

### testRunner

> **testRunner**: `"jest-circus/runner"` = `'jest-circus/runner'`

### testTimeout

> **testTimeout**: `number`

### verbose

> **verbose**: `false` = `false`

## See

[assertEnvironment](assertEnvironment.md)

## Defined in

[src/assets/transformers/\_jest.config.mjs.ts:102](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets/transformers/_jest.config.mjs.ts#L102)