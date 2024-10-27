[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / It

# Interface: It()

Creates a test closure

> **It**(`name`, `fn`?, `timeout`?): `void`

Creates a test closure

## Parameters

• **name**: `string`

The name of your test

• **fn?**: [`ProvidesCallback`](../type-aliases/ProvidesCallback.md)

The function for your test

• **timeout?**: `number`

The timeout for an async function test

## Returns

`void`

## Defined in

node\_modules/@types/jest/index.d.ts:546

## Properties

### concurrent

> **concurrent**: [`It`](It.md)

Experimental and should be avoided.

#### Defined in

node\_modules/@types/jest/index.d.ts:568

***

### each

> **each**: [`Each`](Each.md)

Use if you keep duplicating the same test with different data. `.each` allows you to write the
test once and pass data in.

`.each` is available with two APIs:

#### 1  `test.each(table)(name, fn)`

- `table`: Array of Arrays with the arguments that are passed into the test fn for each row.
- `name`: String the title of the test block.
- `fn`: Function the test to be run, this is the function that will receive the parameters in each row as function arguments.

#### 2  `test.each table(name, fn)`

- `table`: Tagged Template Literal
- `name`: String the title of the test, use `$variable` to inject test data into the test title from the tagged template expressions.
- `fn`: Function the test to be run, this is the function that will receive the test data object.

#### Example

```ts
// API 1
test.each([[1, 1, 2], [1, 2, 3], [2, 1, 3]])(
  '.add(%i, %i)',
  (a, b, expected) => {
    expect(a + b).toBe(expected);
  },
);

// API 2
test.each`
a    | b    | expected
${1} | ${1} | ${2}
${1} | ${2} | ${3}
${2} | ${1} | ${3}
`('returns $expected when $a is added $b', ({a, b, expected}) => {
   expect(a + b).toBe(expected);
});
```

#### Defined in

node\_modules/@types/jest/index.d.ts:607

***

### failing

> **failing**: [`It`](It.md)

Mark this test as expecting to fail.

Only available in the default `jest-circus` runner.

#### Defined in

node\_modules/@types/jest/index.d.ts:556

***

### noskip

> **noskip**: [`It`](It.md)

Ensures this test is run regardless of the invocation of
`reconfigureJestGlobalsToSkipTestsInThisFileIfRequested`.

#### Defined in

[types/jest.patched.d.ts:15](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/types/jest.patched.d.ts#L15)

***

### only

> **only**: [`It`](It.md)

Only runs this test in the current file.

#### Defined in

node\_modules/@types/jest/index.d.ts:550

***

### skip

> **skip**: [`It`](It.md)

Skips running this test in the current file.

#### Defined in

node\_modules/@types/jest/index.d.ts:560

***

### todo()

> **todo**: (`name`) => `void`

Sketch out which tests to write in the future.

#### Parameters

• **name**: `string`

#### Returns

`void`

#### Defined in

node\_modules/@types/jest/index.d.ts:564
