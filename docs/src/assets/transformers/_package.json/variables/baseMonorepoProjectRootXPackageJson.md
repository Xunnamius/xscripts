[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_package.json](../README.md) / baseMonorepoProjectRootXPackageJson

# Variable: baseMonorepoProjectRootXPackageJson

> `const` **baseMonorepoProjectRootXPackageJson**: `object`

## Type declaration

### author

> `readonly` **author**: `"Xunnamius"` = `'Xunnamius'`

### bugs

> `readonly` **bugs**: `object`

#### bugs.url

> `readonly` **url**: `"{{repoUrl}}/issues"` = `'{{repoUrl}}/issues'`

### description

> `readonly` **description**: `"Monorepo for the {{repoName}} project"` = `'Monorepo for the {{repoName}} project'`

### devDependencies

> `readonly` **devDependencies**: `object` = `basePolyrepoXPackageJson.devDependencies`

#### devDependencies.@-xun/scripts

> `readonly` **@-xun/scripts**: \`^$\{string\}\`

### engines

> `readonly` **engines**: `object`

#### engines.node

> `readonly` **node**: `string`

### exports

> `readonly` **exports**: `object`

#### exports..

> `readonly` ****: `object`

#### exports...default

> `readonly` **default**: `"./dist/src/index.js"` = `'./dist/src/index.js'`

#### exports...types

> `readonly` **types**: `"./dist/src/index.d.ts"` = `'./dist/src/index.d.ts'`

#### exports../package

> `readonly` **/package**: `"./package.json"` = `'./package.json'`

#### exports../package.json

> `readonly` **json**: `"./package.json"` = `'./package.json'`

### files

> `readonly` **files**: [`"/dist"`, `"/LICENSE"`, `"/package.json"`, `"/README.md"`]

### homepage

> `readonly` **homepage**: `"{{repoUrl}}#readme"` = `'{{repoUrl}}#readme'`

### keywords

> `readonly` **keywords**: [] = `[]`

### license

> `readonly` **license**: `"MIT"` = `'MIT'`

### name

> `readonly` **name**: `"{{repoName}}-monorepo"` = `'{{repoName}}-monorepo'`

### private

> `readonly` **private**: `true` = `true`

### publishConfig

> `readonly` **publishConfig**: `object`

#### publishConfig.access

> `readonly` **access**: `"public"` = `'public'`

#### publishConfig.registry

> `readonly` **registry**: `"https://registry.npmjs.org"` = `'https://registry.npmjs.org'`

### repository

> `readonly` **repository**: `object`

#### repository.type

> `readonly` **type**: `"git"` = `'git'`

#### repository.url

> `readonly` **url**: `"git+{{repoUrl}}.git"` = `'git+{{repoUrl}}.git'`

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

#### scripts.format

> `readonly` **format**: `"NODE_NO_WARNINGS=1 xscripts format --hush"` = `'NODE_NO_WARNINGS=1 xscripts format --hush'`

#### scripts.info

> `readonly` **info**: `"NODE_NO_WARNINGS=1 xscripts project info"` = `'NODE_NO_WARNINGS=1 xscripts project info'`

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

#### scripts.prepare

> `readonly` **prepare**: `"NODE_NO_WARNINGS=1 xscripts project prepare"` = `'NODE_NO_WARNINGS=1 xscripts project prepare'`

#### scripts.release

> `readonly` **release**: `"NODE_NO_WARNINGS=1 xscripts release"` = `'NODE_NO_WARNINGS=1 xscripts release'`

#### scripts.renovate

> `readonly` **renovate**: `"NODE_NO_WARNINGS=1 xscripts project renovate --sync-deps --github-reconfigure-repo --regenerate-assets --assets-preset basic"` = `'NODE_NO_WARNINGS=1 xscripts project renovate --sync-deps --github-reconfigure-repo --regenerate-assets --assets-preset basic'`

#### scripts.start

> `readonly` **start**: `"NODE_NO_WARNINGS=1 xscripts start --"` = `'NODE_NO_WARNINGS=1 xscripts start --'`

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

### sideEffects

> `readonly` **sideEffects**: `false` = `false`

### type

> `readonly` **type**: `"commonjs"` = `'commonjs'`

### typesVersions

> `readonly` **typesVersions**: `object`

#### typesVersions.\*

> `readonly` **\***: `object`

#### typesVersions.\*.index

> `readonly` **index**: [`"dist/src/index.d.ts"`]

#### typesVersions.\*.package

> `readonly` **package**: [`"package.json"`]

### version

> `readonly` **version**: `"0.0.0-monorepo"` = `'0.0.0-monorepo'`

### workspaces

> `readonly` **workspaces**: [`"packages/*"`, `"!packages/*.ignore*"`]

## Defined in

[src/assets/transformers/\_package.json.ts:91](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets/transformers/_package.json.ts#L91)
