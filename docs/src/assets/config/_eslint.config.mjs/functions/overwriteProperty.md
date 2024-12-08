[**@-xun/scripts**](../../../../../README.md)

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

### configs

`Config` | `Config`[]

### property

`T`

### value

`Config`\[`T`\]

## Returns

`Config`[]

## Defined in

[src/assets/config/\_eslint.config.mjs.ts:867](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets/config/_eslint.config.mjs.ts#L867)
