[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / mocked

# Function: mocked()

## mocked(source, options)

> **mocked**\<`T`\>(`source`, `options`?): [`MaybeMockedDeep`](../type-aliases/MaybeMockedDeep.md)\<`T`\>

Wraps types of the `source` object and its deep members with type definitions
of Jest mock function. Pass `{shallow: true}` option to disable the deeply
mocked behavior.

### Type Parameters

• **T**

### Parameters

• **source**: `T`

• **options?**

• **options.shallow?**: `false`

### Returns

[`MaybeMockedDeep`](../type-aliases/MaybeMockedDeep.md)\<`T`\>

### Defined in

node\_modules/@types/jest/index.d.ts:248

## mocked(source, options)

> **mocked**\<`T`\>(`source`, `options`): [`MaybeMocked`](../type-aliases/MaybeMocked.md)\<`T`\>

Wraps types of the `source` object with type definitions of Jest mock function.

### Type Parameters

• **T**

### Parameters

• **source**: `T`

• **options**

• **options.shallow**: `true`

### Returns

[`MaybeMocked`](../type-aliases/MaybeMocked.md)\<`T`\>

### Defined in

node\_modules/@types/jest/index.d.ts:252
