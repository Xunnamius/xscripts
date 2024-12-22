[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/util](../README.md) / loadDotEnv

# Function: loadDotEnv()

## Call Signature

> **loadDotEnv**(`settings`): `DotenvParseOutput`

Loads environment variables from the given `dotEnvFilePaths` files, with
variables from files earlier in the list being overwritten by variables from
files later in the list.

`process.env` will be updated, and then an object containing only the loaded
environment variables is returned.

**Note that this function internally caches the result of loading the dotenv
files, meaning they'll only be read once.**

### Parameters

#### settings

`object` & `object`

### Returns

`DotenvParseOutput`

### Defined in

[src/util.ts:673](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L673)

## Call Signature

> **loadDotEnv**(`settings`): `DotenvParseOutput`

Loads environment variables from the given `dotEnvFilePaths` files, with
variables from files earlier in the list being overwritten by variables from
files later in the list.

An object containing only the loaded environment variables is returned.
**`process.env` will NOT be updated!**

**Note that this function internally caches the result of loading the dotenv
files, meaning they'll only be read once.**

### Parameters

#### settings

`object` & `object`

### Returns

`DotenvParseOutput`

### Defined in

[src/util.ts:687](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L687)

## Call Signature

> **loadDotEnv**(`expectedEnvironmentVariables`, `settings`): `DotenvParseOutput`

Loads environment variables from the given `dotEnvFilePaths` files, with
variables from files earlier in the list being overwritten by variables from
files later in the list.

`process.env` will be updated, and the resulting environment object (after
`overrides` and `updateProcessEnv` are considered) will be checked for the
existence of the variables in `expectedEnvironmentVariables`. If the check is
successful, an object containing only the loaded environment variables is
returned. Otherwise, an error is thrown.

**Note that this function internally caches the result of loading the dotenv
files, meaning they'll only be read once.**

### Parameters

#### expectedEnvironmentVariables

`string`[]

#### settings

`object` & `Pick`\<`DotenvConfigOptions`, `"override"`\> & `object`

### Returns

`DotenvParseOutput`

### Defined in

[src/util.ts:704](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L704)

## Call Signature

> **loadDotEnv**(`expectedEnvironmentVariables`, `settings`): `DotenvParseOutput`

Loads environment variables from the given `dotEnvFilePaths` files, with
variables from files earlier in the list being overwritten by variables from
files later in the list.

The resulting environment object (after `overrides` and `updateProcessEnv`
are considered) will be checked for the existence of the variables in
`expectedEnvironmentVariables`, but **`process.env` will NOT be updated!**.
If the check is successful, an object containing only the loaded environment
variables is returned. Otherwise, an error is thrown.

**Note that this function internally caches the result of loading the dotenv
files, meaning they'll only be read once.**

### Parameters

#### expectedEnvironmentVariables

`string`[]

#### settings

`object` & `Pick`\<`DotenvConfigOptions`, `"override"`\> & `object`

### Returns

`DotenvParseOutput`

### Defined in

[src/util.ts:722](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/util.ts#L722)
