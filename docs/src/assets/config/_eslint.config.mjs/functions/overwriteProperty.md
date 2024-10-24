[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_eslint.config.mjs](../README.md) / overwriteProperty

# Function: overwriteProperty()

> **overwriteProperty**\<`T`\>(`configs`, `property`, `value`): `Config`[]

Accepts an [EslintConfig](../type-aliases/EslintConfig.md) object (or an array of them) and returns a
flattened array with each object's `property` property overwritten by the
given `value`.

For example:

```typescript
const eslintConfig = makeTsEslintConfig({
  // some other configs...
},
...[
  legacyExtends('plugin:import/recommended', 'eslint-plugin-import:recommended'),
  legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript')
]).flatMap((configs) =>
  overwriteProperty(configs, 'files', ['*.{js,jsx,cjs,mjs}'])
);

## Type Parameters

• **T** *extends* keyof `Config`

## Parameters

• **configs**: `Config` \| `Config`[]

• **property**: `T`

• **value**: `Config`\[`T`\]

## Returns

`Config`[]

## Defined in

[src/assets/config/\_eslint.config.mjs.ts:540](https://github.com/Xunnamius/xscripts/blob/dc527d1504edcd9b99add252bcfe23abb9ef9d78/src/assets/config/_eslint.config.mjs.ts#L540)
