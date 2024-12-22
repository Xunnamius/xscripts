[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_package.json](../README.md) / generateBaseMonorepoPackageRootXPackageJson

# Function: generateBaseMonorepoPackageRootXPackageJson()

> **generateBaseMonorepoPackageRootXPackageJson**(...`__namedParameters`): `object`

## Parameters

### \_\_namedParameters

...[`GeneratorParameters`](../type-aliases/GeneratorParameters.md)

## Returns

`object`

### author

> `readonly` **author**: `Person`

### bin?

> `readonly` `optional` **bin**: `string` \| `Record`\<`string`, `string`\>

### browser?

> `readonly` `optional` **browser**: `string` \| `Partial`\<`Record`\<`string`, `string` \| `false`\>\>

A hint to JavaScript bundlers or component tools when packaging modules for client side use.

### bugs

> `readonly` **bugs**: `object`

#### bugs.url

> `readonly` **url**: \`$\{string\}/issues\`

### bundledDependencies?

> `readonly` `optional` **bundledDependencies**: `string`[]

Package names that are bundled when the package is published.

### bundleDependencies?

> `readonly` `optional` **bundleDependencies**: `string`[]

Alias of `bundledDependencies`.

### config?

> `readonly` `optional` **config**: `JsonObject`

Is used to set configuration parameters used in package scripts that persist across upgrades.

### contributors?

> `readonly` `optional` **contributors**: `Person`[]

A list of people who contributed to the package.

### cpu?

> `readonly` `optional` **cpu**: `LiteralUnion`\<`"arm"` \| `"arm64"` \| `"ia32"` \| `"mips"` \| `"mipsel"` \| `"ppc"` \| `"ppc64"` \| `"s390"` \| `"s390x"` \| `"x32"` \| `"x64"` \| `"!arm"` \| `"!arm64"` \| `"!ia32"` \| `"!mips"` \| `"!mipsel"` \| `"!ppc"` \| `"!ppc64"` \| `"!s390"` \| `"!s390x"` \| `"!x32"` \| `"!x64"`, `string`\>[]

CPU architectures the module runs on.

### dependencies?

> `readonly` `optional` **dependencies**: `Partial`\<`Record`\<`string`, `string`\>\>

The dependencies of the package.

### description

> `readonly` **description**: `string` = `incomingPackageJson.description`

### devDependencies?

> `readonly` `optional` **devDependencies**: `Partial`\<`Record`\<`string`, `string`\>\>

Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.

### directories?

> `readonly` `optional` **directories**: `DirectoryLocations`

Indicates the structure of the package.

### engines

> `readonly` **engines**: `object`

#### Index Signature

 \[`key`: `string`\]: `undefined` \| `string`

### ~~engineStrict?~~

> `readonly` `optional` **engineStrict**: `boolean`

#### Deprecated

### esnext?

> `readonly` `optional` **esnext**: `string` \| \{ `[moduleName: string]`: `undefined` \| `string`;  `browser`: `string`; `main`: `string`; \}

A module ID with untranspiled code that is the primary entry point to the program.

### exports

> `readonly` **exports**: `string` \| (`string` \| `ExportConditions`)[] \| `ExportConditions` \| \{ `.`: \{ `default`: `string`; `types`: `string`; \}; `./package`: `string`; `./package.json`: `string`; \}

### files

> `readonly` **files**: `string`[]

### flat?

> `readonly` `optional` **flat**: `boolean`

If your package only allows one version of a given dependency, and you’d like to enforce the same behavior as `yarn install --flat` on the command-line, set this to `true`.

Note that if your `package.json` contains `"flat": true` and other packages depend on yours (e.g. you are building a library rather than an app), those other packages will also need `"flat": true` in their `package.json` or be installed with `yarn install --flat` on the command-line.

### funding?

> `readonly` `optional` **funding**: `string` \| \{ `type`: `LiteralUnion`\<`"github"` \| `"opencollective"` \| `"patreon"` \| `"individual"` \| `"foundation"` \| `"corporation"`, `string`\>; `url`: `string`; \}

Describes and notifies consumers of a package's monetary support information.

[Read more.](https://github.com/npm/rfcs/blob/latest/accepted/0017-add-funding-support.md)

#### Type declaration

`string`

\{ `type`: `LiteralUnion`\<`"github"` \| `"opencollective"` \| `"patreon"` \| `"individual"` \| `"foundation"` \| `"corporation"`, `string`\>; `url`: `string`; \}

### homepage

> `readonly` **homepage**: \`$\{string\}#readme\`

### imports?

> `readonly` `optional` **imports**: `Imports`

Subpath imports to define internal package import maps that only apply to import specifiers from within the package itself.

[Read more.](https://nodejs.org/api/packages.html#subpath-imports)

### jspm?

> `readonly` `optional` **jspm**: `PackageJson`

JSPM configuration.

### keywords

> `readonly` **keywords**: `string`[]

### license

> `readonly` **license**: `string`

### licenses?

> `readonly` `optional` **licenses**: `object`[]

The licenses for the package.

### main?

> `readonly` `optional` **main**: `string`

The module ID that is the primary entry point to the program.

### maintainers?

> `readonly` `optional` **maintainers**: `Person`[]

A list of people who maintain the package.

### man?

> `readonly` `optional` **man**: `string` \| `string`[]

Filenames to put in place for the `man` program to find.

### module?

> `readonly` `optional` **module**: `string`

An ECMAScript module ID that is the primary entry point to the program.

### name

> `readonly` **name**: `string` = `incomingPackageJson.name`

### optionalDependencies?

> `readonly` `optional` **optionalDependencies**: `Partial`\<`Record`\<`string`, `string`\>\>

Dependencies that are skipped if they fail to install.

### os?

> `readonly` `optional` **os**: `LiteralUnion`\<`"aix"` \| `"darwin"` \| `"freebsd"` \| `"linux"` \| `"openbsd"` \| `"sunos"` \| `"win32"` \| `"!aix"` \| `"!darwin"` \| `"!freebsd"` \| `"!linux"` \| `"!openbsd"` \| `"!sunos"` \| `"!win32"`, `string`\>[]

Operating systems the module runs on.

### packageManager?

> `readonly` `optional` **packageManager**: `string`

Defines which package manager is expected to be used when working on the current project. It can set to any of the [supported package managers](https://nodejs.org/api/corepack.html#supported-package-managers), and will ensure that your teams use the exact same package manager versions without having to install anything else than Node.js.

__This field is currently experimental and needs to be opted-in; check the [Corepack](https://nodejs.org/api/corepack.html) page for details about the procedure.__

#### Example

```json
{
	"packageManager": "<package manager name>@<version>"
}
```

### peerDependencies?

> `readonly` `optional` **peerDependencies**: `Partial`\<`Record`\<`string`, `string`\>\>

Dependencies that will usually be required by the package user directly or via another dependency.

### peerDependenciesMeta?

> `readonly` `optional` **peerDependenciesMeta**: `Partial`\<`Record`\<`string`, \{ `optional`: `true`; \}\>\>

Indicate peer dependencies that are optional.

### ~~preferGlobal?~~

> `readonly` `optional` **preferGlobal**: `boolean`

If set to `true`, a warning will be shown if package is installed locally. Useful if the package is primarily a command-line application that should be installed globally.

#### Deprecated

### private?

> `readonly` `optional` **private**: `boolean`

If set to `true`, then npm will refuse to publish it.

### publishConfig

> `readonly` **publishConfig**: `object`

#### publishConfig.access

> **access**: `"public"` \| `"restricted"` = `'public'`

When publishing scoped packages, the access level defaults to restricted. If you want your scoped package to be publicly viewable (and installable) set `--access=public`. The only valid values for access are public and restricted. Unscoped packages always have an access level of public.

#### publishConfig.registry

> **registry**: `string` = `'https://registry.npmjs.org'`

The base URL of the npm registry.

Default: `'https://registry.npmjs.org/'`

#### publishConfig.tag?

> `readonly` `optional` **tag**: `string`

The tag to publish the package under.

Default: `'latest'`

### repository

> `readonly` **repository**: `object`

#### repository.type

> `readonly` **type**: `"git"` = `'git'`

#### repository.url

> `readonly` **url**: \`git+$\{string\}.git\`

### resolutions?

> `readonly` `optional` **resolutions**: `Partial`\<`Record`\<`string`, `string`\>\>

Selective version resolutions. Allows the definition of custom package versions inside dependencies without manual edits in the `yarn.lock` file.

### scripts

> `readonly` **scripts**: `object`

#### scripts.build

> `readonly` **build**: `"npm run build:dist --"` = `'npm run build:dist --'`

#### scripts.build:changelog

> `readonly` **build:changelog**: `"NODE_NO_WARNINGS=1 xscripts build changelog"` = `'NODE_NO_WARNINGS=1 xscripts build changelog'`

#### scripts.build:dist

> `readonly` **build:dist**: `"NODE_NO_WARNINGS=1 xscripts build distributables"` = `'NODE_NO_WARNINGS=1 xscripts build distributables'`

#### scripts.build:docs

> `readonly` **build:docs**: `"NODE_NO_WARNINGS=1 xscripts build docs"` = `'NODE_NO_WARNINGS=1 xscripts build docs'`

#### scripts.clean

> `readonly` **clean**: `"NODE_NO_WARNINGS=1 xscripts clean"` = `'NODE_NO_WARNINGS=1 xscripts clean'`

#### scripts.deploy?

> `readonly` `optional` **deploy**: `string`

Run by users, xscripts, and related tooling when deploying built
distributables to the appropriate remote system(s).

##### Example

```ts
`NODE_NO_WARNINGS=1 xscripts deploy --target ssh --host prod.x.y.com --to-path /prod/some/path`
```

#### scripts.dev?

> `readonly` `optional` **dev**: `string`

Run by users, xscripts, and related tooling when spinning up a project's
local development environment.

#### scripts.format

> `readonly` **format**: `"NODE_NO_WARNINGS=1 xscripts format --hush"` = `'NODE_NO_WARNINGS=1 xscripts format --hush'`

#### scripts.info

> `readonly` **info**: `"NODE_NO_WARNINGS=1 xscripts project info"` = `'NODE_NO_WARNINGS=1 xscripts project info'`

#### scripts.install?

> `readonly` `optional` **install**: `string`

Run **after** the package is installed.

#### scripts.lint

> `readonly` **lint**: `"npm run lint:package --"` = `'npm run lint:package --'`

#### scripts.lint:package

> `readonly` **lint:package**: `"NODE_NO_WARNINGS=1 xscripts lint"` = `'NODE_NO_WARNINGS=1 xscripts lint'`

#### scripts.lint:packages

> `readonly` **lint:packages**: `"NODE_NO_WARNINGS=1 xscripts lint --scope unlimited"` = `'NODE_NO_WARNINGS=1 xscripts lint --scope unlimited'`

#### scripts.lint:project

> `readonly` **lint:project**: `"NODE_NO_WARNINGS=1 xscripts project lint"` = `'NODE_NO_WARNINGS=1 xscripts project lint'`

#### scripts.list-tasks

> `readonly` **list-tasks**: `"NODE_NO_WARNINGS=1 xscripts list-tasks"` = `'NODE_NO_WARNINGS=1 xscripts list-tasks'`

#### scripts.postinstall?

> `readonly` `optional` **postinstall**: `string`

Run **after** the package is installed and after `install`.

#### scripts.postpack?

> `readonly` `optional` **postpack**: `string`

Run **after** the tarball has been generated and moved to its final destination.

#### scripts.postpublish?

> `readonly` `optional` **postpublish**: `string`

Run **after** the package is published.

#### scripts.postrestart?

> `readonly` `optional` **postrestart**: `string`

Run with the `npm restart` command, after `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.

#### scripts.poststart?

> `readonly` `optional` **poststart**: `string`

Run with the `npm start` command, after `start`.

#### scripts.poststop?

> `readonly` `optional` **poststop**: `string`

Run with the `npm stop` command, after `stop`.

#### scripts.posttest?

> `readonly` `optional` **posttest**: `string`

Run with the `npm test` command, after `test`.

#### scripts.postuninstall?

> `readonly` `optional` **postuninstall**: `string`

Run **after** the package is uninstalled.

#### scripts.postversion?

> `readonly` `optional` **postversion**: `string`

Run **after** bump the package version.

#### scripts.preinstall?

> `readonly` `optional` **preinstall**: `string`

Run **before** the package is installed.

#### scripts.prepack?

> `readonly` `optional` **prepack**: `string`

Run **before** a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).

#### scripts.prepare

> `readonly` **prepare**: `"NODE_NO_WARNINGS=1 xscripts project prepare"` = `'NODE_NO_WARNINGS=1 xscripts project prepare'`

#### scripts.prepublish?

> `readonly` `optional` **prepublish**: `string`

Run **before** the package is published (Also run on local `npm install` without any arguments).

#### scripts.prepublishOnly?

> `readonly` `optional` **prepublishOnly**: `string`

Run **before** the package is prepared and packed, **only** on `npm publish`.

#### scripts.prerestart?

> `readonly` `optional` **prerestart**: `string`

Run with the `npm restart` command, before `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.

#### scripts.prestart?

> `readonly` `optional` **prestart**: `string`

Run with the `npm start` command, before `start`.

#### scripts.prestop?

> `readonly` `optional` **prestop**: `string`

Run with the `npm stop` command, before `stop`.

#### scripts.pretest?

> `readonly` `optional` **pretest**: `string`

Run with the `npm test` command, before `test`.

#### scripts.preuninstall?

> `readonly` `optional` **preuninstall**: `string`

Run **before** the package is uninstalled and before `uninstall`.

#### scripts.preversion?

> `readonly` `optional` **preversion**: `string`

Run **before** bump the package version and before `version`.

#### scripts.publish?

> `readonly` `optional` **publish**: `string`

Run **after** the package is published.

#### scripts.release

> `readonly` **release**: `"NODE_NO_WARNINGS=1 xscripts release"` = `'NODE_NO_WARNINGS=1 xscripts release'`

#### scripts.renovate

> `readonly` **renovate**: `"NODE_NO_WARNINGS=1 xscripts project renovate --github-reconfigure-repo --regenerate-assets --assets-preset basic"` = `'NODE_NO_WARNINGS=1 xscripts project renovate --github-reconfigure-repo --regenerate-assets --assets-preset basic'`

#### scripts.restart?

> `readonly` `optional` **restart**: `string`

Run with the `npm restart` command. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.

#### scripts.start

> `readonly` **start**: `"NODE_NO_WARNINGS=1 xscripts start --"` = `'NODE_NO_WARNINGS=1 xscripts start --'`

#### scripts.stop?

> `readonly` `optional` **stop**: `string`

Run with the `npm stop` command.

#### scripts.test

> `readonly` **test**: `"npm run test:package:unit --"` = `'npm run test:package:unit --'`

#### scripts.test:package:all

> `readonly` **test:package:all**: `"NODE_NO_WARNINGS=1 xscripts test --coverage"` = `'NODE_NO_WARNINGS=1 xscripts test --coverage'`

#### scripts.test:package:e2e

> `readonly` **test:package:e2e**: `"NODE_NO_WARNINGS=1 xscripts test --tests end-to-end"` = `'NODE_NO_WARNINGS=1 xscripts test --tests end-to-end'`

#### scripts.test:package:integration

> `readonly` **test:package:integration**: `"NODE_NO_WARNINGS=1 xscripts test --tests integration"` = `'NODE_NO_WARNINGS=1 xscripts test --tests integration'`

#### scripts.test:package:unit

> `readonly` **test:package:unit**: `"NODE_NO_WARNINGS=1 xscripts test --tests unit"` = `'NODE_NO_WARNINGS=1 xscripts test --tests unit'`

#### scripts.test:packages:all

> `readonly` **test:packages:all**: `"NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage"` = `'NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage'`

#### scripts.uninstall?

> `readonly` `optional` **uninstall**: `string`

Run **before** the package is uninstalled.

#### scripts.version?

> `readonly` `optional` **version**: `string`

Run **before** bump the package version.

### sideEffects

> `readonly` **sideEffects**: `boolean` \| `string`[]

### type

> `readonly` **type**: `"module"` \| `"commonjs"`

### types?

> `readonly` `optional` **types**: `string`

Location of the bundled TypeScript declaration file.

### typesVersions

> `readonly` **typesVersions**: `Partial`\<`Record`\<`string`, `Partial`\<`Record`\<`string`, `string`[]\>\>\>\>

### typings?

> `readonly` `optional` **typings**: `string`

Location of the bundled TypeScript declaration file. Alias of `types`.

### version

> `readonly` **version**: `string` = `incomingPackageJson.version`

### workspaces?

> `readonly` `optional` **workspaces**: `string`[] \| `WorkspaceConfig`

Used to configure [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) / [Yarn workspaces](https://classic.yarnpkg.com/docs/workspaces/).

Workspaces allow you to manage multiple packages within the same repository in such a way that you only need to run your install command once in order to install all of them in a single pass.

Please note that the top-level `private` property of `package.json` **must** be set to `true` in order to use workspaces.

## Defined in

[src/assets/transformers/\_package.json.ts:156](https://github.com/Xunnamius/xscripts/blob/28c221bb8a859e69003ba2447e3f5763dc92a0ec/src/assets/transformers/_package.json.ts#L156)
