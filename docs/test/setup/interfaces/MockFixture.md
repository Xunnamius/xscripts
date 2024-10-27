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

[test/setup.ts:767](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/test/setup.ts#L767)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:766](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/test/setup.ts#L766)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:768](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/test/setup.ts#L768)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:769](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/test/setup.ts#L769)
