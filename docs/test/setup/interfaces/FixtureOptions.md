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

[test/setup.ts:689](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L689)

***

### initialFileContents

> **initialFileContents**: `object`

#### Index Signature

 \[`filePath`: `string`\]: `string`

#### Defined in

[test/setup.ts:674](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L674)

***

### npmInstall?

> `optional` **npmInstall**: `string` \| `string`[]

#### Inherited from

`Partial.npmInstall`

#### Defined in

[test/setup.ts:694](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L694)

***

### performCleanup

> **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:672](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L672)

***

### runInstallScripts?

> `optional` **runInstallScripts**: `boolean`

#### Inherited from

`Partial.runInstallScripts`

#### Defined in

[test/setup.ts:695](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L695)

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

[test/setup.ts:696](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L696)

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

[test/setup.ts:684](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L684)

***

### use

> **use**: [`MockFixture`](MockFixture.md)\<[`FixtureContext`](FixtureContext.md)\<`Record`\<`string`, `unknown`\>\>\>[]

#### Defined in

[test/setup.ts:673](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L673)

***

### webpackVersion?

> `optional` **webpackVersion**: `string`

#### Inherited from

`Partial.webpackVersion`

#### Defined in

[test/setup.ts:679](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/test/setup.ts#L679)
