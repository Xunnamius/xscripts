[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / withMockedFixture

# Function: withMockedFixture()

> **withMockedFixture**\<`CustomOptions`, `CustomContext`\>(`__namedParameters`): `Promise`\<`void`\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `object`

• **CustomContext** *extends* `Record`\<`string`, `unknown`\> = `object`

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.fn**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<[`FixtureContext`](../interfaces/FixtureContext.md)\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `Partial`\<`Record`\<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\>

• **\_\_namedParameters.options?**: `Partial`\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `CustomOptions`\>

• **\_\_namedParameters.testIdentifier**: `string`

## Returns

`Promise`\<`void`\>

## Defined in

[test/setup.ts:990](https://github.com/Xunnamius/xscripts/blob/e4a1e0b3d6a20ae598f5a6feb2cf2b7ba077b6a7/test/setup.ts#L990)
