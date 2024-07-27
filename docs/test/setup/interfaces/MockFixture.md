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

[test/setup.ts:655](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/test/setup.ts#L655)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:654](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/test/setup.ts#L654)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:656](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/test/setup.ts#L656)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:657](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/test/setup.ts#L657)
