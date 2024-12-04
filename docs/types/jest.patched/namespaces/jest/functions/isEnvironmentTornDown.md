[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / isEnvironmentTornDown

# Function: isEnvironmentTornDown()

> **isEnvironmentTornDown**(): `boolean`

Returns `true` if test environment has been torn down.

## Returns

`boolean`

## Example

```ts
if (jest.isEnvironmentTornDown()) {
  // The Jest environment has been torn down, so stop doing work
  return;
}
```

## Defined in

node\_modules/@types/jest/index.d.ts:233
