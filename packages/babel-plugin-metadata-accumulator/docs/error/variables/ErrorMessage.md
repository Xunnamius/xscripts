[**@-xun/babel-plugin-metadata-accumulator**](../../README.md)

***

[@-xun/babel-plugin-metadata-accumulator](../../README.md) / [error](../README.md) / ErrorMessage

# Variable: ErrorMessage

> `const` **ErrorMessage**: `object`

A collection of possible error and warning messages.

## Type declaration

### AssertionFailedWantedPathIsNotSeenPath()

#### Returns

`string`

### BadProjectTypeInPackageJson()

#### Parameters

##### path

`string`

#### Returns

`string`

### CannotBeCliAndNextJs()

#### Returns

`string`

### DeriverAsyncConfigurationConflict()

#### Returns

`string`

### DuplicatePackageId()

#### Parameters

##### id

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

`string`

### DuplicatePackageName()

#### Parameters

##### packageName

`string`

##### firstPath

`string`

##### secondPath

`string`

#### Returns

`string`

### EncounteredEmptyImportCallExpression()

#### Parameters

##### isRequire

`boolean`

#### Returns

`string`

### Generic()

#### Returns

`string`

### GuruMeditation()

#### Returns

`string`

### IllegalAliasBadSuffix()

#### Parameters

##### key

`string`

#### Returns

`string`

### IllegalAliasKeyInvalidCharacters()

#### Parameters

##### key

`string`

##### invalids

`string` | `RegExp`

#### Returns

`string`

### IllegalAliasValueInvalidCharacters()

#### Parameters

##### key

`string`

##### path

`string`

##### invalids

`string` | `RegExp`

#### Returns

`string`

### IllegalAliasValueInvalidSeparatorAdfix()

#### Parameters

##### key

`string`

##### path

`string`

#### Returns

`string`

### MissingNameInPackageJson()

#### Parameters

##### path

`string`

#### Returns

`string`

### MissingOptionalBabelDependency()

#### Parameters

##### caller

`string`

#### Returns

`string`

### NotAGitRepositoryError()

#### Returns

`string`

### NotAMonorepoError()

#### Returns

`string`

### NotParsable()

#### Parameters

##### path

`string`

##### type

`string` = `'json'`

#### Returns

`string`

### NotReadable()

#### Parameters

##### path

`string`

#### Returns

`string`

### NotWritable()

#### Parameters

##### path

`string`

#### Returns

`string`

### PackageJsonNotParsable()

#### Parameters

##### packageJsonPath

`string`

##### reason

`unknown`

#### Returns

`string`

### PathIsNotAbsolute()

#### Parameters

##### path

`string`

#### Returns

`string`

### PathIsNotRelative()

#### Parameters

##### path

`string`

#### Returns

`string`

### PathOutsideRoot()

#### Parameters

##### path

`string`

#### Returns

`string`

### SpecifierNotOkEmpty()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkMissingExtension()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkRelativeNotRootverse()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkSelfReferential()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkUnnecessaryIndex()

#### Parameters

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### SpecifierNotOkVerseNotAllowed()

#### Parameters

##### verse

`WellKnownImportAlias`

##### specifier

`string`

##### path?

`string`

#### Returns

`string`

### UnknownWorkspacePackageName()

#### Parameters

##### name

`string`

#### Returns

`string`

### UnsupportedFeature()

#### Parameters

##### feature

`string`

#### Returns

`string`

## Defined in

[babel-plugin-metadata-accumulator/src/error.ts:7](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/packages/babel-plugin-metadata-accumulator/src/error.ts#L7)
