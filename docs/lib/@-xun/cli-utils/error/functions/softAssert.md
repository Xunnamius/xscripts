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

[lib/@-xun/cli-utils/error.ts:43](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/cli-utils/error.ts#L43)

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

[lib/@-xun/cli-utils/error.ts:51](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@-xun/cli-utils/error.ts#L51)
