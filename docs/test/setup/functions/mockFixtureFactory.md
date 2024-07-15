[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / mockFixtureFactory

# Function: mockFixtureFactory()

> **mockFixtureFactory**\<`CustomOptions`, `CustomContext`\>(`testIdentifier`, `options`?): (`fn`) => `Promise`\<`void`\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `object`

• **CustomContext** *extends* `Record`\<`string`, `unknown`\> = `object`

## Parameters

• **testIdentifier**: `string`

• **options?**: `Partial`\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `CustomOptions`\>

## Returns

`Function`

### Parameters

• **fn**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<[`FixtureContext`](../interfaces/FixtureContext.md)\<[`FixtureOptions`](../interfaces/FixtureOptions.md) & `Partial`\<`Record`\<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\>

### Returns

`Promise`\<`void`\>

## Defined in

[test/setup.ts:1103](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L1103)
