[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/resolvers](../README.md) / ConditionsOption

# Type Alias: ConditionsOption

> **ConditionsOption**: `object`

## Type declaration

### conditions?

> `optional` **conditions**: `string`[]

Conditions to recursively match against. If none of the listed conditions
can be found and there are no matching `default` conditions, this function
returns an empty array.

In addition to `default` (which is always implicitly enabled), the
following are standard/well-known conditions:
  - `import`
  - `require`
  - `node`
  - `node-addons`
  - `types`
  - `deno`
  - `browser`
  - `react-native`
  - `electron`
  - `development`
  - `production`

Array order does not matter. Priority is determined by the property order
of conditions defined within a `package.json` `imports`/`exports` mapping.

#### See

https://nodejs.org/api/packages.html#community-conditions-definitions

## Defined in

[lib/@-xun/project-utils/src/resolvers.ts:5](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/resolvers.ts#L5)
