[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/error](../README.md) / softAssert

# Function: softAssert()

## softAssert(message)

> **softAssert**(`message`): `never`

Throw a CliError with the given string message, which
causes Black Flag to exit with the FrameworkExitCode.DefaultError
status code.

Use this function to assert end user error.

### Parameters

• **message**: `string`

### Returns

`never`

### Defined in

[lib/@-xun/cli-utils/error.ts:41](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/lib/@-xun/cli-utils/error.ts#L41)

## softAssert(value, message)

> **softAssert**(`value`, `message`): `asserts value`

If `value` is falsy, throw a CliError with the given string message,
which causes Black Flag to exit with the
FrameworkExitCode.DefaultError status code.

Use this function to assert end user error.

### Parameters

• **value**: `unknown`

• **message**: `string`

### Returns

`asserts value`

### Defined in

[lib/@-xun/cli-utils/error.ts:49](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/lib/@-xun/cli-utils/error.ts#L49)
