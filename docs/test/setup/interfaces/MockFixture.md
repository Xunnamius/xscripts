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

[test/setup.ts:657](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/test/setup.ts#L657)

***

### name

> **name**: `LiteralUnion`\<`"root"` \| `"describe-root"`, `string` \| `symbol`\> \| [`ReturnsString`](../type-aliases/ReturnsString.md)\<`Context`\>

#### Defined in

[test/setup.ts:656](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/test/setup.ts#L656)

***

### setup?

> `optional` **setup**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:658](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/test/setup.ts#L658)

***

### teardown?

> `optional` **teardown**: [`FixtureAction`](../type-aliases/FixtureAction.md)\<`Context`\>

#### Defined in

[test/setup.ts:659](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/test/setup.ts#L659)
