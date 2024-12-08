[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_eslint.config.mjs](../README.md) / legacyExtendsFactory

# Function: legacyExtendsFactory()

> **legacyExtendsFactory**(`flatCompat`): (`extension`, `name`) => `Config`

Returns a function that, when invoked, returns an `eslint@>=9` configuration
object that adapts a legacy `eslint@<9` plugin's exposed rule extension.

For example:

```typescript
const eslintConfig = makeTsEslintConfig(
  legacyExtends('plugin:import/recommended', 'eslint-plugin-import:recommended'),
  legacyExtends('plugin:import/typescript', 'eslint-plugin-import:typescript')
);
```

## Parameters

### flatCompat

`FlatCompat`

## Returns

`Function`

### Parameters

#### extension

`string`

#### name

`string`

### Returns

`Config`

## Defined in

[src/assets/config/\_eslint.config.mjs.ts:890](https://github.com/Xunnamius/xscripts/blob/cfe28e3d801ec1b719b0dedbda4e9f63d7924b77/src/assets/config/_eslint.config.mjs.ts#L890)
