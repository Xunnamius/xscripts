[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / LoadDotEnvSettings

# Type Alias: LoadDotEnvSettings

> **LoadDotEnvSettings**: `object` & `Pick`\<`DotenvConfigOptions`, `"override"`\>

## Type declaration

### dotEnvFilePaths

> **dotEnvFilePaths**: `AbsolutePath`[]

Variables from files earlier in this list will be overwritten by
variables from files later in the list.

### failInstructions

> **failInstructions**: `string`

Further instructions for the user upon environment validation failure.

### force

> **force**: `boolean`

If `true`, do not throw on errors.

### log

> **log**: `ExtendedLogger`

### onFail()

> **onFail**: () => `void`

Action to take upon environment validation failure.

#### Returns

`void`

### updateProcessEnv?

> `optional` **updateProcessEnv**: `boolean`

If `true`, loaded environment variables will be added to `process.env`
with respect to `override`, and this function will return `void`. If
`false`, the environment variables will be returned instead and
`override` is ignored.

#### Default

```ts
true
```

## Defined in

[src/util.ts:619](https://github.com/Xunnamius/xscripts/blob/3a8e3952522a9aa3e84a1990f6fcb2207da32534/src/util.ts#L619)
