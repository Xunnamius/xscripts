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

[src/commands/deploy.ts:48](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/commands/deploy.ts#L48)
