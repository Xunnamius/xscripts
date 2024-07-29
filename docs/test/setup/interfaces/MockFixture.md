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

[test/setup.ts:655](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/test/setup.ts#L655)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:654](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/test/setup.ts#L654)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:656](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/test/setup.ts#L656)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:657](https://github.com/Xunnamius/xscripts/blob/4fd96d6123f1ac889c89848efd750e2454f43e43/test/setup.ts#L657)
