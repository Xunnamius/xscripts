[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / mockFixtureFactory

# Function: mockFixtureFactory()

> **mockFixtureFactory**\<`CustomOptions`, `CustomContext`\>(`testIdentifier`, `options`?): (`test`) => `Promise`\<`void`\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

• **CustomContext** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Parameters

• **testIdentifier**: `string`

• **options?**: `Partial`\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `CustomOptions`\>

## Returns

`Function`

### Parameters

• **test**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<[`FixtureContext`](../interfaces/FixtureContext.md)\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `Partial`\<`Record`\<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\>

### Returns

`Promise`\<`void`\>

## Defined in

[test/setup.ts:1182](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L1182)
