[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/helpers](../README.md) / getMaintainedNodeVersions

# Function: getMaintainedNodeVersions()

## getMaintainedNodeVersions(options)

> **getMaintainedNodeVersions**(`options`?): `string`

Returns the expected value for `package.json` `node.engines` field

### Parameters

• **options?**

• **options.format?**: `"engines"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines` key in a `package.json` file. `array` returns an array of the
currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`

### Defined in

[lib/@-xun/project-utils/src/helpers.ts:19](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/helpers.ts#L19)

## getMaintainedNodeVersions(options)

> **getMaintainedNodeVersions**(`options`?): `string`[]

Returns the expected value for `package.json` `node.engines` field

### Parameters

• **options?**

• **options.format?**: `"array"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines` key in a `package.json` file. `array` returns an array of the
currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`[]

### Defined in

[lib/@-xun/project-utils/src/helpers.ts:33](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/helpers.ts#L33)
