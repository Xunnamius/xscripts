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

[test/setup.ts:573](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L573)

***

### fileContents

> **fileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:572](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L572)

***

### options

> **options**: [`FixtureOptions`](FixtureOptions.md) & `CustomOptions`

#### Defined in

[test/setup.ts:570](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L570)

***

### root

> **root**: `string`

#### Defined in

[test/setup.ts:568](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L568)

***

### testIdentifier

> **testIdentifier**: `string`

#### Defined in

[test/setup.ts:569](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L569)

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

[test/setup.ts:578](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L578)

***

### treeOutput?

> `optional` **treeOutput**: `string`

#### Inherited from

`Partial.treeOutput`

#### Defined in

[test/setup.ts:583](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L583)

***

### using

> **using**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`object`\>\>[]

#### Defined in

[test/setup.ts:571](https://github.com/Xunnamius/xscripts/blob/05e56e787e73d42855fcd3ce10aff7f8f6e6c4c7/test/setup.ts#L571)
