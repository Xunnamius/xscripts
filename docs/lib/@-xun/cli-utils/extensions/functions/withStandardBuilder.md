[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [lib/@-xun/cli-utils/extensions](../README.md) / withStandardBuilder

# Function: withStandardBuilder()

> **withStandardBuilder**\<`CustomCliArguments`, `CustomExecutionContext`\>(`customBuilder`?, `__namedParameters`?): [`WithBuilderExtensionsReturnType`](../../../../@black-flag/extensions/type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

This function enables several options-related units of functionality
considered standard across [Xunnamius](https://github.com/Xunnamius)'s CLI
projects.

This function is a relatively thin wrapper around
[withBuilderExtensions](../../../../@black-flag/extensions/functions/withBuilderExtensions.md). It also disables
[`duplicate-arguments-array`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#duplicate-arguments-array)
and enables
[`strip-dashed`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-dashed)
and
[`strip-aliased`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-aliased)
in yargs-parser.

## Type Parameters

• **CustomCliArguments** *extends* [`StandardCommonCliArguments`](../type-aliases/StandardCommonCliArguments.md)

• **CustomExecutionContext** *extends* [`StandardExecutionContext`](../type-aliases/StandardExecutionContext.md)

## Parameters

• **customBuilder?**: [`BfeBuilderObject`](../../../../@black-flag/extensions/type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| (...`args`) => `void` \| [`BfeBuilderObject`](../../../../@black-flag/extensions/type-aliases/BfeBuilderObject.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

• **\_\_namedParameters?**: `Omit`\<[`WithBuilderExtensionsConfig`](../../../../@black-flag/extensions/type-aliases/WithBuilderExtensionsConfig.md)\<`CustomCliArguments`\>, `"commonOptions"`\> & `object` = `{}`

## Returns

[`WithBuilderExtensionsReturnType`](../../../../@black-flag/extensions/type-aliases/WithBuilderExtensionsReturnType.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

## Defined in

[lib/@-xun/cli-utils/extensions.ts:158](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/@-xun/cli-utils/extensions.ts#L158)
