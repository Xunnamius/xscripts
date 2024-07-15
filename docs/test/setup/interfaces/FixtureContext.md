[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / FixtureContext

# Interface: FixtureContext\<CustomOptions\>

## Extends

- `Partial`\<[`TestResultProvider`](TestResultProvider.md)\>.`Partial`\<[`TreeOutputProvider`](TreeOutputProvider.md)\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `object`

## Properties

### debug

> **debug**: `Debugger`

#### Defined in

[test/setup.ts:570](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L570)

***

### fileContents

> **fileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:569](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L569)

***

### options

> **options**: [`FixtureOptions`](FixtureOptions.md) & `CustomOptions`

#### Defined in

[test/setup.ts:567](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L567)

***

### root

> **root**: `string`

#### Defined in

[test/setup.ts:565](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L565)

***

### testIdentifier

> **testIdentifier**: `string`

#### Defined in

[test/setup.ts:566](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L566)

***

### testResult?

> `optional` **testResult**: `object`

#### code

> **code**: `number`

#### stderr

> **stderr**: `string`

#### stdout

> **stdout**: `string`

#### Inherited from

`Partial.testResult`

#### Defined in

[test/setup.ts:575](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L575)

***

### treeOutput?

> `optional` **treeOutput**: `string`

#### Inherited from

`Partial.treeOutput`

#### Defined in

[test/setup.ts:580](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L580)

***

### using

> **using**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`object`\>\>[]

#### Defined in

[test/setup.ts:568](https://github.com/Xunnamius/xscripts/blob/df637b64db981c14c22a425e27a52a97500c0199/test/setup.ts#L568)
