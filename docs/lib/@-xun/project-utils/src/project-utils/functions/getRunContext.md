[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/project-utils](../README.md) / getRunContext

# Function: getRunContext()

> **getRunContext**(`options`): [`MonorepoRunContext`](../type-aliases/MonorepoRunContext.md) \| [`PolyrepoRunContext`](../type-aliases/PolyrepoRunContext.md)

Returns information about the project structure at the current working
directory.

## Parameters

• **options** = `{}`

• **options.cwd?**: `string`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

## Returns

[`MonorepoRunContext`](../type-aliases/MonorepoRunContext.md) \| [`PolyrepoRunContext`](../type-aliases/PolyrepoRunContext.md)

## Defined in

[lib/@-xun/project-utils/src/project-utils.ts:499](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/project-utils.ts#L499)
