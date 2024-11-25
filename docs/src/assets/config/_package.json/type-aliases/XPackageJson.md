[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_package.json](../README.md) / XPackageJson

# Type Alias: XPackageJson

> **XPackageJson**: `PackageJson` & `object`

## Type declaration

### scripts?

> `optional` **scripts**: `object`

### scripts.build?

> `optional` **build**: `string`

Run by users, xscripts, and related tooling when building the current
package's production-ready distributables.

This script is usually a reference to `npm run build:dist`.

#### Example

```ts
`npm run build:dist --`
```

### scripts.build:changelog?

> `optional` **build:changelog**: `string`

Run by users, xscripts, and related tooling when building the current
package's `CHANGELOG.md` file.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts build changelog`
```

### scripts.build:dist?

> `optional` **build:dist**: `string`

Run by users, xscripts, and related tooling when building the current
package's production-ready distributables.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts build distributables`
```

### scripts.build:docs?

> `optional` **build:docs**: `string`

Run by users, xscripts, and related tooling when building the current
package's documentation (typically found under `docs/`).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts build docs`
```

### scripts.clean?

> `optional` **clean**: `string`

Run by users, xscripts, and related tooling when removing files from the
project or package that are ignored by git (with exceptions).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts clean`
```

### scripts.dev?

> `optional` **dev**: `string`

Run by users, xscripts, and related tooling when spinning up a project's
local development environment.

### scripts.format?

> `optional` **format**: `string`

Run by users, xscripts, and related tooling when formatting the project
or package.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts format --hush`
```

### scripts.info?

> `optional` **info**: `string`

Run by users, xscripts, and related tooling when printing information
about the current project or package.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts project info`
```

### scripts.lint?

> `optional` **lint**: `string`

Run by users, xscripts, and related tooling when linting the current
package's files.

This script is usually a reference to `npm run lint:package`.

#### Example

```ts
`npm run lint:package --`
```

### scripts.lint:package?

> `optional` **lint:package**: `string`

Run by users, xscripts, and related tooling when linting all of the
lintable files under the current package's root along with any other
source files that comprise this package's build targets (see
gatherPackageBuildTargets).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts lint --scope this-package`
```

### scripts.lint:packages?

> `optional` **lint:packages**: `string`

Run by users, xscripts, and related tooling when linting all lintable
files in the entire project.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts lint --scope unlimited`
```

### scripts.lint:project?

> `optional` **lint:project**: `string`

Run by users, xscripts, and related tooling when linting a project's
metadata, such as its file structure and configuration settings.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts project lint`
```

### scripts.list-tasks?

> `optional` **list-tasks**: `string`

Run by users, xscripts, and related tooling when printing information
about available scripts in `package.json`.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts list-tasks`
```

### scripts.prepare?

> `optional` **prepare**: `string`

Run by users, xscripts, and related tooling when preparing a fresh
development environment.

See [the
docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
for more information.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts project prepare`
```

### scripts.release?

> `optional` **release**: `string`

Run by users, xscripts, and related tooling when potentially releasing
the next version of a package.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts release`
```

### scripts.renovate?

> `optional` **renovate**: `string`

Run by users, xscripts, and related tooling when manipulating a project's
_metadata_, such as its file structure and configuration settings, with
the goal of bringing the project up to date on latest best practices.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts project renovate`
```

### scripts.start?

> `optional` **start**: `string`

Run by users, xscripts, and related tooling when attempting to execute a
project's distributables locally.

See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
for more information.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts start --`
```

### scripts.test?

> `optional` **test**: `string`

Run by users, xscripts, and related tooling  when executing unit tests
against the current package.

This script is usually a reference to `npm run test:package:unit`. See
[the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for
more information.

#### Example

```ts
`npm run test:package:unit --`
```

### scripts.test:package:all?

> `optional` **test:package:all**: `string`

Run by users, xscripts, and related tooling when executing all possible
tests against the current package. In a monorepo context, this script
will also run the tests of any package that this package depends on
(including transitive dependencies).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts test --scope this-package --coverage`
```

### scripts.test:package:e2e?

> `optional` **test:package:e2e**: `string`

Run by users, xscripts, and related tooling when executing end-to-end
tests against the current package. In a monorepo context, this script
will also run the tests of any package that this package depends on
(including transitive dependencies).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests end-to-end`
```

### scripts.test:package:integration?

> `optional` **test:package:integration**: `string`

Run by users, xscripts, and related tooling when executing integration
tests against the current package. In a monorepo context, this script
will also run the tests of any package that this package depends on
(including transitive dependencies).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests integration`
```

### scripts.test:package:unit?

> `optional` **test:package:unit**: `string`

Run by users, xscripts, and related tooling when executing unit tests
against the current package. In a monorepo context, this script
will also run the tests of any package that this package depends on
(including transitive dependencies).

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests unit`
```

### scripts.test:packages:all?

> `optional` **test:packages:all**: `string`

Run by users, xscripts, and related tooling when executing all possible
tests across the entire project.

#### Example

```ts
`NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage`
```

## Defined in

[src/assets/config/\_package.json.ts:15](https://github.com/Xunnamius/xscripts/blob/89eebe76ad675b35907b3379b29bfde27fd5a5b8/src/assets/config/_package.json.ts#L15)
