[**@-xun/scripts**](../../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../../README.md) / [lib/@-xun/project-utils/src/project-utils](../README.md) / getWorkspacePackages

# Function: getWorkspacePackages()

> **getWorkspacePackages**(`options`): `object`

Analyzes a monorepo context (at `cwd`), returning a mapping of package names
to workspace information.

## Parameters

• **options**

• **options.cwd?**: `string`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

• **options.globOptions?**: `GlobOptions`

Options passed through to node-glob and minimatch.

**Default**

```ts
{}
```

• **options.projectRoot**: `string`

The absolute path to the root directory of a project.

## Returns

`object`

### cwdPackage

> **cwdPackage**: `any`

### packages

> **packages**: `Map`\<`string`, [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)\> & `object`

#### Type declaration

##### all

> **all**: [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)[]

An array of *all* non-broken sub-root packages both named and
unnamed. Sugar for the following:

```TypeScript
Array.from(packages.values())
     .concat(Array.from(packages.unnamed.values()))
```

##### broken

> **broken**: `string`[]

An array of "broken" pseudo-sub-root pseudo-package directories that
are matching workspace paths but are missing a package.json file.

##### unnamed

> **unnamed**: `Map`\<`string`, [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)\>

A mapping of sub-root packages missing the `"name"` field in their
respective package.json files to WorkspacePackage objects.

## Defined in

[lib/@-xun/project-utils/src/project-utils.ts:341](https://github.com/Xunnamius/xscripts/blob/154567d6fca3f6cf244137e710b029af872e1d9e/lib/@-xun/project-utils/src/project-utils.ts#L341)
