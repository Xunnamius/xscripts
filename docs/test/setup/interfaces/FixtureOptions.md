[**@-xun/scripts**](../../../README.md) • **Docs**

***

[@-xun/scripts](../../../README.md) / [test/setup](../README.md) / FixtureOptions

# Interface: FixtureOptions

## Extends

- `Partial`\<[`WebpackTestFixtureOptions`](WebpackTestFixtureOptions.md)\>.`Partial`\<[`GitRepositoryFixtureOptions`](GitRepositoryFixtureOptions.md)\>.`Partial`\<[`NodeImportTestFixtureOptions`](NodeImportTestFixtureOptions.md)\>.`Partial`\<[`DummyDirectoriesFixtureOptions`](DummyDirectoriesFixtureOptions.md)\>

## Properties

### directoryPaths?

> `optional` **directoryPaths**: `string`[]

#### Inherited from

`Partial.directoryPaths`

#### Defined in

[test/setup.ts:684](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L684)

***

### initialFileContents

> **initialFileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:669](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L669)

***

### npmInstall?

> `optional` **npmInstall**: `string` \| `string`[]

#### Inherited from

`Partial.npmInstall`

#### Defined in

[test/setup.ts:689](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L689)

***

### performCleanup

> **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:667](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L667)

***

### runInstallScripts?

> `optional` **runInstallScripts**: `boolean`

#### Inherited from

`Partial.runInstallScripts`

#### Defined in

[test/setup.ts:690](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L690)

***

### runWith?

> `optional` **runWith**: `object`

#### args?

> `optional` **args**: `string`[]

#### binary?

> `optional` **binary**: `string`

#### opts?

> `optional` **opts**: `Record`\<`string`, `unknown`\>

#### Inherited from

`Partial.runWith`

#### Defined in

[test/setup.ts:691](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L691)

***

### setupGit()?

> `optional` **setupGit**: (`git`) => `Promisable`\<`void`\>

#### Parameters

• **git**: `SimpleGit`

#### Returns

`Promisable`\<`void`\>

#### Inherited from

`Partial.setupGit`

#### Defined in

[test/setup.ts:679](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L679)

***

### use

> **use**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`Record`\<`string`, `unknown`\>\>\>[]

#### Defined in

[test/setup.ts:668](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L668)

***

### webpackVersion?

> `optional` **webpackVersion**: `string`

#### Inherited from

`Partial.webpackVersion`

#### Defined in

[test/setup.ts:674](https://github.com/Xunnamius/xscripts/blob/dab28cbd16e1a8b65bb5fd311af787e2401e7d30/test/setup.ts#L674)
