[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / MockFixture

# Interface: MockFixture\<Context\>

## Type Parameters

• **Context** = [`FixtureContext`](FixtureContext.md)

## Properties

### description

> **description**: `string` \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:657](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L657)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:656](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L656)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:658](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L658)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:659](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L659)
