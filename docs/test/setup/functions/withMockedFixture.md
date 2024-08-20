[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / withMockedFixture

# Function: withMockedFixture()

> **withMockedFixture**\<`CustomOptions`, `CustomContext`\>(`__namedParameters`): `Promise`\<`void`\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomContext** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.options?**: `Partial`\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `CustomOptions`\>

• **\_\_namedParameters.test**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<[`FixtureContext`](../interfaces/FixtureContext.md)\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `Partial`\<`Record`\<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\>

• **\_\_namedParameters.testIdentifier**: `string`

## Returns

`Promise`\<`void`\>

## Defined in

[test/setup.ts:1054](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L1054)
