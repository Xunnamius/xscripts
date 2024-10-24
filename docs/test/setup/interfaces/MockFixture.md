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

[test/setup.ts:765](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L765)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:764](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L764)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:766](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L766)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:767](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L767)
