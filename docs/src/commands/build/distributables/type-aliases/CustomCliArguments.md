[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/distributables](../README.md) / CustomCliArguments

# Type Alias: CustomCliArguments

> **CustomCliArguments**: [`GlobalCliArguments`](../../../../configure/type-aliases/GlobalCliArguments.md)\<[`ThisPackageGlobalScope`](../../../../configure/enumerations/ThisPackageGlobalScope.md)\> & `object`

## Type declaration

### cleanOutputDir

> **cleanOutputDir**: `boolean`

### excludeInternalFiles?

> `optional` **excludeInternalFiles**: `Path`[]

### generateIntermediatesFor?

> `optional` **generateIntermediatesFor**: [`IntermediateTranspilationEnvironment`](../enumerations/IntermediateTranspilationEnvironment.md)

### generateTypes?

> `optional` **generateTypes**: `boolean`

### includeExternalFiles?

> `optional` **includeExternalFiles**: `Path`[]

### linkCliIntoBin?

> `optional` **linkCliIntoBin**: `boolean`

### moduleSystem?

> `optional` **moduleSystem**: [`ModuleSystem`](../enumerations/ModuleSystem.md)

### outputExtension?

> `optional` **outputExtension**: `string`

### partialFilter?

> `optional` **partialFilter**: `RegExp`[]

### prependShebang?

> `optional` **prependShebang**: `boolean`

### skipOutputChecks?

> `optional` **skipOutputChecks**: `boolean`

### skipOutputExtraneityCheckFor?

> `optional` **skipOutputExtraneityCheckFor**: (`string` \| `RegExp`)[]

### skipOutputValidityCheckFor?

> `optional` **skipOutputValidityCheckFor**: (`string` \| `RegExp`)[]

## Defined in

[src/commands/build/distributables.ts:148](https://github.com/Xunnamius/xscripts/blob/f84693679e326b03b40dc7577e79e1f4160b286e/src/commands/build/distributables.ts#L148)
