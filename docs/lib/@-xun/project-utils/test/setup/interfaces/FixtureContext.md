[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/test/setup](../README.md) / FixtureContext

# Interface: FixtureContext\<CustomOptions\>

## Extends

- `Partial`\<[`TestResultProvider`](TestResultProvider.md)\>.`Partial`\<[`TreeOutputProvider`](TreeOutputProvider.md)\>

## Type Parameters

• **CustomOptions** *extends* `Record`\<`string`, `unknown`\> = `object`

## Properties

### debug

> **debug**: `Debugger`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:485](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L485)

***

### fileContents

> **fileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:484](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L484)

***

### options

> **options**: [`FixtureOptions`](FixtureOptions.md) & `CustomOptions`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:482](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L482)

***

### root

> **root**: `string`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:480](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L480)

***

### testIdentifier

> **testIdentifier**: `string`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:481](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L481)

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

[lib/@-xun/project-utils/test/setup.ts:490](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L490)

***

### treeOutput?

> `optional` **treeOutput**: `string`

#### Inherited from

`Partial.treeOutput`

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:495](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L495)

***

### using

> **using**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`object`\>\>[]

#### Defined in

[lib/@-xun/project-utils/test/setup.ts:483](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/test/setup.ts#L483)
