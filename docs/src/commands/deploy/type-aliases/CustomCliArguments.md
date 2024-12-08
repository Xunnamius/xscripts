[**@-xun/scripts**](../../../../README.md)

***

[@-xun/scripts](../../../../README.md) / [src/commands/deploy](../README.md) / CustomCliArguments

# Type Alias: CustomCliArguments

> **CustomCliArguments**: [`GlobalCliArguments`](../../../configure/type-aliases/GlobalCliArguments.md)\<[`ThisPackageGlobalScope`](../../../configure/enumerations/ThisPackageGlobalScope.md)\> & `object` & \{`preview`: `boolean`;`previewUrl`: `string`;`production`: `boolean`;`target`: [`Vercel`](../enumerations/DeployTarget.md#vercel); \} \| \{`host`: `string`;`target`: [`Ssh`](../enumerations/DeployTarget.md#ssh);`toPath`: `string`; \}

## Type declaration

### bumpVersion?

> `optional` **bumpVersion**: `boolean`

### target

> **target**: [`DeployTarget`](../enumerations/DeployTarget.md)

## Defined in

[src/commands/deploy.ts:48](https://github.com/Xunnamius/xscripts/blob/cfe28e3d801ec1b719b0dedbda4e9f63d7924b77/src/commands/deploy.ts#L48)
