[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/distributables](../README.md) / CustomCliArguments

# Type Alias: CustomCliArguments

> **CustomCliArguments**: `Omit`\<[`GlobalCliArguments`](../../../../configure/type-aliases/GlobalCliArguments.md), `"scope"`\> & `object`

## Type declaration

### cleanOutputDir

> **cleanOutputDir**: `boolean`

### excludeInternalFiles?

> `optional` **excludeInternalFiles**: (`AbsolutePath` \| `RelativePath`)[]

### generateIntermediatesFor?

> `optional` **generateIntermediatesFor**: [`IntermediateTranspilationEnvironment`](../enumerations/IntermediateTranspilationEnvironment.md)

### generateTypes?

> `optional` **generateTypes**: `boolean`

### includeExternalFiles?

> `optional` **includeExternalFiles**: (`AbsolutePath` \| `RelativePath`)[]

### linkCliIntoBin?

> `optional` **linkCliIntoBin**: `boolean`

### moduleSystem?

> `optional` **moduleSystem**: [`ModuleSystem`](../enumerations/ModuleSystem.md)

### outputExtension?

> `optional` **outputExtension**: `string`

### prependShebang?

> `optional` **prependShebang**: `boolean`

### scope

> **scope**: [`LimitedGlobalScope`](../../../../configure/enumerations/LimitedGlobalScope.md)

## Defined in

[src/commands/build/distributables.ts:103](https://github.com/Xunnamius/xscripts/blob/86b76a595de7a0bbf273ef7bb201d4c62f5e3d77/src/commands/build/distributables.ts#L103)
