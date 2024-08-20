[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/error](../README.md) / hardAssert

# Function: hardAssert()

## hardAssert(message)

> **hardAssert**(`message`): `never`

Throw a so-called "FrameworkError" with the given string message, which
causes Black Flag to exit with the FrameworkExitCode.AssertionFailed
status code.

Use this function to throw developer errors that end users can do nothing
about.

### Parameters

• **message**: `string`

### Returns

`never`

### Defined in

[lib/@-xun/cli-utils/error.ts:78](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/@-xun/cli-utils/error.ts#L78)

## hardAssert(value, message)

> **hardAssert**(`value`, `message`): `asserts value`

If `value` is falsy, throw a so-called "FrameworkError" with the given string
message, which causes Black Flag to exit with the
FrameworkExitCode.AssertionFailed status code.

Use this function to assert developer errors that end users can do nothing
about.

### Parameters

• **value**: `unknown`

• **message**: `string`

### Returns

`asserts value`

### Defined in

[lib/@-xun/cli-utils/error.ts:87](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/lib/@-xun/cli-utils/error.ts#L87)
