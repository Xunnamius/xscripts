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

[test/setup.ts:579](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L579)

***

### initialFileContents

> **initialFileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:564](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L564)

***

### npmInstall?

> `optional` **npmInstall**: `string` \| `string`[]

#### Inherited from

`Partial.npmInstall`

#### Defined in

[test/setup.ts:584](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L584)

***

### performCleanup

> **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:562](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L562)

***

### runInstallScripts?

> `optional` **runInstallScripts**: `boolean`

#### Inherited from

`Partial.runInstallScripts`

#### Defined in

[test/setup.ts:585](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L585)

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

[test/setup.ts:586](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L586)

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

[test/setup.ts:574](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L574)

***

### use

> **use**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`Record`\<`string`, `unknown`\>\>\>[]

#### Defined in

[test/setup.ts:563](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L563)

***

### webpackVersion?

> `optional` **webpackVersion**: `string`

#### Inherited from

`Partial.webpackVersion`

#### Defined in

[test/setup.ts:569](https://github.com/Xunnamius/xscripts/blob/fc291d92ca0fdd07ba7e5cb19471e1a974cabac7/test/setup.ts#L569)
