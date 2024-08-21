[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeSubOptionOfExtensionValue

# Type Alias: BfeSubOptionOfExtensionValue\<CustomCliArguments, CustomExecutionContext\>

> **BfeSubOptionOfExtensionValue**\<`CustomCliArguments`, `CustomExecutionContext`\>: `object`

The array element type of
BfeBuilderObjectValueExtensions.subOptionOf.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Type declaration

### update

> **update**: (`oldOptionConfig`, `argv`) => [`BfeBuilderObjectValueWithoutSubOptionOfExtension`](BfeBuilderObjectValueWithoutSubOptionOfExtension.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`BfeBuilderObjectValueWithoutSubOptionOfExtension`](BfeBuilderObjectValueWithoutSubOptionOfExtension.md)\<`CustomCliArguments`, `CustomExecutionContext`\>

This function receives the current configuration for this option
(`oldOptionConfig`) and the fully parsed `argv`, and must return the new
configuration for this option.

This configuration will completely overwrite the old configuration. To
extend the old configuration instead, spread it. For example:

```javascript
return {
  ...oldOptionConfig,
  description: 'New description'
}
```

### when()

> **when**: (`superOptionValue`, `argv`) => `boolean`

This function receives the `superOptionValue` of the "super option" (i.e.
the key in `{ subOptionOf: { key: { when: ... }}}`), which you are free to
type as you please, and the fully parsed `argv`. This function must return
a boolean indicating whether the `update` function should run or not.

#### Parameters

• **superOptionValue**: `any`

• **argv**: `Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>

#### Returns

`boolean`

## Defined in

[lib/@black-flag/extensions/index.ts:438](https://github.com/Xunnamius/xscripts/blob/ea7b98342d9aa37d18f7398603d7c15f580a5312/lib/@black-flag/extensions/index.ts#L438)
