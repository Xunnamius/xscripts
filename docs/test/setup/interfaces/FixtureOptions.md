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

[test/setup.ts:573](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L573)

***

### initialFileContents

> **initialFileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:558](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L558)

***

### npmInstall?

> `optional` **npmInstall**: `string` \| `string`[]

#### Inherited from

`Partial.npmInstall`

#### Defined in

[test/setup.ts:578](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L578)

***

### performCleanup

> **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:556](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L556)

***

### runInstallScripts?

> `optional` **runInstallScripts**: `boolean`

#### Inherited from

`Partial.runInstallScripts`

#### Defined in

[test/setup.ts:579](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L579)

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

[test/setup.ts:580](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L580)

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

[test/setup.ts:568](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L568)

***

### use

> **use**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`Record`\<`string`, `unknown`\>\>\>[]

#### Defined in

[test/setup.ts:557](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L557)

***

### webpackVersion?

> `optional` **webpackVersion**: `string`

#### Inherited from

`Partial.webpackVersion`

#### Defined in

[test/setup.ts:563](https://github.com/Xunnamius/xscripts/blob/98c638c52caf3664112e7ea66eccd36ad205df77/test/setup.ts#L563)
