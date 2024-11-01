[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / reconfigureJestGlobalsToSkipTestsInThisFileIfRequested

# Function: reconfigureJestGlobalsToSkipTestsInThisFileIfRequested()

> **reconfigureJestGlobalsToSkipTestsInThisFileIfRequested**(`targets`?): `object`

This function replaces Jest's `describe`, `test`, and `it` functions in the
current file with `describe.skip`, `test.skip`, and `it.skip` if
`process.env.XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS >= 1`. The replaced functions
also have a `noskip` method which are aliases for their respective original
versions.

Essentially, this function changes Jest's execution semantics such that all
tests in a given file are skipped by default. Use the `noskip` method to opt
a test into always being run.

To prevent a file from being executed in its entirety (for example, a test
file with hundreds or thousands of tests that still take a noticeable amount
of time to skip), include the string `-slow.` in the file's name, e.g.
`unit-my-slow.test.ts`, and set
`process.env.XSCRIPTS_TEST_JEST_SKIP_SLOW_TESTS >= 2`.

## Parameters

• **targets?**

Determines which Jest globals are targeted for reconfiguration.

By default, only `describe` is reconfigured while `test` and `it` are left
alone. This makes it easier to apply `noskip` to a collection of tests, but
sometimes it's prudent to reconfigure the other globals as well.

• **targets.describe?**: `boolean`

**Default**

```ts
true
```

• **targets.it?**: `boolean`

**Default**

```ts
false
```

• **targets.test?**: `boolean`

**Default**

```ts
false
```

## Returns

`object`

### describe

> **describe**: [`Describe`](../../../types/jest.patched/namespaces/jest/interfaces/Describe.md) = `describe_`

### it

> **it**: [`It`](../../../types/jest.patched/namespaces/jest/interfaces/It.md) = `it_`

### test

> **test**: [`It`](../../../types/jest.patched/namespaces/jest/interfaces/It.md) = `test_`

## Defined in

[test/setup.ts:66](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L66)
