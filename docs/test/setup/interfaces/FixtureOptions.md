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

[test/setup.ts:687](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L687)

***

### initialFileContents

> **initialFileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:672](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L672)

***

### npmInstall?

> `optional` **npmInstall**: `string` \| `string`[]

#### Inherited from

`Partial.npmInstall`

#### Defined in

[test/setup.ts:692](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L692)

***

### performCleanup

> **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:670](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L670)

***

### runInstallScripts?

> `optional` **runInstallScripts**: `boolean`

#### Inherited from

`Partial.runInstallScripts`

#### Defined in

[test/setup.ts:693](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L693)

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

[test/setup.ts:694](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L694)

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

[test/setup.ts:682](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L682)

***

### use

> **use**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`Record`\<`string`, `unknown`\>\>\>[]

#### Defined in

[test/setup.ts:671](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L671)

***

### webpackVersion?

> `optional` **webpackVersion**: `string`

#### Inherited from

`Partial.webpackVersion`

#### Defined in

[test/setup.ts:677](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/test/setup.ts#L677)
