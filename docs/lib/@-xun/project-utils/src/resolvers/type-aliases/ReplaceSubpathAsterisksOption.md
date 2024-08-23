[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/resolvers](../README.md) / ReplaceSubpathAsterisksOption

# Type Alias: ReplaceSubpathAsterisksOption

> **ReplaceSubpathAsterisksOption**: `object`

## Type declaration

### replaceSubpathAsterisks?

> `optional` **replaceSubpathAsterisks**: `boolean`

When returning a subpath pattern, i.e. a subpath containing an asterisk
("*"), the asterisks will be replaced by the matching portions of `target` if
`replaceSubpathAsterisks` is `true`. Otherwise, the literal subpath pattern
will be returned with asterisk included.

Note that, if `target` contains an asterisk, the literal subpath pattern
will always be returned regardless of the value of this option.

#### Default

```ts
true
```

## Defined in

[lib/@-xun/project-utils/src/resolvers.ts:78](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/resolvers.ts#L78)
