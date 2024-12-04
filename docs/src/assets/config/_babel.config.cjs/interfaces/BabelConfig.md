[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_babel.config.cjs](../README.md) / BabelConfig

# Interface: BabelConfig

## Properties

### assumptions?

> `optional` **assumptions**: `null` \| \{\}

Specify which assumptions it can make about your code, to better optimize the compilation result. **NOTE**: This replaces the various `loose` options in plugins in favor of
top-level options that can apply to multiple plugins

#### See

https://babeljs.io/docs/en/assumptions

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:36

***

### ast?

> `optional` **ast**: `null` \| `boolean`

Include the AST in the returned object

Default: `false`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:43

***

### auxiliaryCommentAfter?

> `optional` **auxiliaryCommentAfter**: `null` \| `string`

Attach a comment after all non-user injected code

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:50

***

### auxiliaryCommentBefore?

> `optional` **auxiliaryCommentBefore**: `null` \| `string`

Attach a comment before all non-user injected code

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:57

***

### babelrc?

> `optional` **babelrc**: `null` \| `boolean`

Specify whether or not to use .babelrc and
.babelignore files.

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:88

***

### babelrcRoots?

> `optional` **babelrcRoots**: `null` \| `boolean` \| `MatchPattern` \| `MatchPattern`[]

Specify which packages should be search for .babelrc files when they are being compiled. `true` to always search, or a path string or an array of paths to packages to search
inside of. Defaults to only searching the "root" package.

Default: `(root)`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:96

***

### browserslistConfigFile?

> `optional` **browserslistConfigFile**: `null` \| `boolean`

Toggles whether or not browserslist config sources are used, which includes searching for any browserslist files or referencing the browserslist key inside package.json.
This is useful for projects that use a browserslist config for files that won't be compiled with Babel.

If a string is specified, it must represent the path of a browserslist configuration file. Relative paths are resolved relative to the configuration file which specifies
this option, or to `cwd` when it's passed as part of the programmatic options.

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:107

***

### browserslistEnv?

> `optional` **browserslistEnv**: `null` \| `string`

The Browserslist environment to use.

Default: `undefined`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:114

***

### caller?

> `optional` **caller**: `TransformCaller`

Utilities may pass a caller object to identify themselves to Babel and
pass capability-related flags for use by configs, presets and plugins.

#### See

https://babeljs.io/docs/en/next/options#caller

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:170

***

### cloneInputAst?

> `optional` **cloneInputAst**: `null` \| `boolean`

By default `babel.transformFromAst` will clone the input AST to avoid mutations.
Specifying `cloneInputAst: false` can improve parsing performance if the input AST is not used elsewhere.

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:122

***

### code?

> `optional` **code**: `null` \| `boolean`

Enable code generation

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:141

***

### comments?

> `optional` **comments**: `null` \| `boolean`

Output comments in generated output

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:148

***

### compact?

> `optional` **compact**: `null` \| `boolean` \| `"auto"`

Do not include superfluous whitespace characters and line terminators. When set to `"auto"` compact is set to `true` on input sizes of >500KB

Default: `"auto"`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:155

***

### configFile?

> `optional` **configFile**: `null` \| `string` \| `boolean`

The config file to load Babel's config from. Defaults to searching for "babel.config.js" inside the "root" folder. `false` will disable searching for config files.

Default: `undefined`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:80

***

### cwd?

> `optional` **cwd**: `null` \| `string`

The working directory that Babel's programmatic options are loaded relative to.

Default: `"."`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:162

***

### env?

> `optional` **env**: `null` \| \{\}

This is an object of keys that represent different environments. For example, you may have: `{ env: { production: { /* specific options */ } } }`
which will use those options when the `envName` is `production`

Default: `{}`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:178

***

### envName?

> `optional` **envName**: `string`

Defaults to environment variable `BABEL_ENV` if set, or else `NODE_ENV` if set, or else it defaults to `"development"`

Default: env vars

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:129

***

### exclude?

> `optional` **exclude**: `MatchPattern` \| `MatchPattern`[]

If any of patterns match, the current configuration object is considered inactive and is ignored during config processing.

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:134

***

### extends?

> `optional` **extends**: `null` \| `string`

A path to a `.babelrc` file to extend

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:185

***

### filename?

> `optional` **filename**: `null` \| `string`

Filename for use in errors etc

Default: `"unknown"`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:192

***

### filenameRelative?

> `optional` **filenameRelative**: `null` \| `string`

Filename relative to `sourceRoot`

Default: `(filename)`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:199

***

### generatorOpts?

> `optional` **generatorOpts**: `null` \| `GeneratorOptions`

An object containing the options to be passed down to the babel code generator, @babel/generator

Default: `{}`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:206

***

### getModuleId?

> `optional` **getModuleId**: `null` \| (`moduleName`) => `undefined` \| `null` \| `string`

Specify a custom callback to generate a module id with. Called as `getModuleId(moduleName)`. If falsy value is returned then the generated module id is used

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:213

***

### highlightCode?

> `optional` **highlightCode**: `null` \| `boolean`

ANSI highlight syntax error code frames

Default: `true`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:220

***

### ignore?

> `optional` **ignore**: `null` \| `MatchPattern`[]

Opposite to the `only` option. `ignore` is disregarded if `only` is specified

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:227

***

### include?

> `optional` **include**: `MatchPattern` \| `MatchPattern`[]

This option is a synonym for "test"

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:232

***

### inputSourceMap?

> `optional` **inputSourceMap**: `null` \| `InputSourceMap`

A source map object that the output source map will be based on

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:239

***

### minified?

> `optional` **minified**: `null` \| `boolean`

Should the output be minified (not printing last semicolons in blocks, printing literal string values instead of escaped ones, stripping `()` from `new` when safe)

Default: `false`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:246

***

### moduleId?

> `optional` **moduleId**: `null` \| `string`

Specify a custom name for module ids

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:253

***

### moduleIds?

> `optional` **moduleIds**: `null` \| `boolean`

If truthy, insert an explicit id for modules. By default, all modules are anonymous. (Not available for `common` modules)

Default: `false`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:260

***

### moduleRoot?

> `optional` **moduleRoot**: `null` \| `string`

Optional prefix for the AMD module formatter that will be prepend to the filename on module definitions

Default: `(sourceRoot)`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:267

***

### only?

> `optional` **only**: `null` \| `MatchPattern`[]

A glob, regex, or mixed array of both, matching paths to **only** compile. Can also be an array of arrays containing paths to explicitly match. When attempting to compile
a non-matching file it's returned verbatim

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:275

***

### overrides?

> `optional` **overrides**: [`BabelConfig`](BabelConfig.md)[]

Allows users to provide an array of options that will be merged into the current configuration one at a time.
This feature is best used alongside the "test"/"include"/"exclude" options to provide conditions for which an override should apply

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:281

***

### parserOpts?

> `optional` **parserOpts**: `null` \| `ParserOptions`

An object containing the options to be passed down to the babel parser, @babel/parser

Default: `{}`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:288

***

### plugins?

> `optional` **plugins**: `null` \| `PluginItem`[]

List of plugins to load and use

Default: `[]`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:295

***

### presets?

> `optional` **presets**: `null` \| `PluginItem`[]

List of presets (a set of plugins) to load and use

Default: `[]`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:302

***

### retainLines?

> `optional` **retainLines**: `null` \| `boolean`

Retain line numbers. This will lead to wacky code but is handy for scenarios where you can't use source maps. (**NOTE**: This will not retain the columns)

Default: `false`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:309

***

### root?

> `optional` **root**: `null` \| `string`

Specify the "root" folder that defines the location to search for "babel.config.js", and the default folder to allow `.babelrc` files inside of.

Default: `"."`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:64

***

### rootMode?

> `optional` **rootMode**: `"root"` \| `"upward"` \| `"upward-optional"`

This option, combined with the "root" value, defines how Babel chooses its project root.
The different modes define different ways that Babel can process the "root" value to get
the final project root.

#### See

https://babeljs.io/docs/en/next/options#rootmode

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:73

***

### shouldPrintComment?

> `optional` **shouldPrintComment**: `null` \| (`commentContents`) => `boolean`

An optional callback that controls whether a comment should be output or not. Called as `shouldPrintComment(commentContents)`. **NOTE**: This overrides the `comment` option when used

Default: `null`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:316

***

### sourceFileName?

> `optional` **sourceFileName**: `null` \| `string`

Set `sources[0]` on returned source map

Default: `(filenameRelative)`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:323

***

### sourceMaps?

> `optional` **sourceMaps**: `null` \| `boolean` \| `"both"` \| `"inline"`

If truthy, adds a `map` property to returned output. If set to `"inline"`, a comment with a sourceMappingURL directive is added to the bottom of the returned code. If set to `"both"`
then a `map` property is returned as well as a source map comment appended. **This does not emit sourcemap files by itself!**

Default: `false`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:331

***

### sourceRoot?

> `optional` **sourceRoot**: `null` \| `string`

The root from which all sources are relative

Default: `(moduleRoot)`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:338

***

### sourceType?

> `optional` **sourceType**: `null` \| `"module"` \| `"script"` \| `"unambiguous"`

Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". `"unambiguous"` will make Babel attempt to guess, based on the presence of ES6
`import` or `export` statements. Files with ES6 `import`s and `export`s are considered `"module"` and are otherwise `"script"`.

Default: `("module")`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:346

***

### targets?

> `optional` **targets**: `string` \| `string`[] \| \{`android`: `string`;`browsers`: `string` \| `string`[];`chrome`: `string`;`deno`: `string`;`edge`: `string`;`electron`: `string`;`esmodules`: `boolean`;`firefox`: `string`;`ie`: `string`;`ios`: `string`;`node`: `true` \| `"current"` \| `Omit`\<`string`, `"current"`\>;`opera`: `string`;`rhino`: `string`;`safari`: `"tp"` \| `Omit`\<`string`, `"tp"`\>;`samsung`: `string`; \}

Describes the environments you support/target for your project.
This can either be a [browserslist-compatible](https://github.com/ai/browserslist) query (with [caveats](https://babeljs.io/docs/en/babel-preset-env#ineffective-browserslist-queries))

Default: `{}`

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:359

***

### test?

> `optional` **test**: `MatchPattern` \| `MatchPattern`[]

If all patterns fail to match, the current configuration object is considered inactive and is ignored during config processing.

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:351

***

### wrapPluginVisitorMethod?

> `optional` **wrapPluginVisitorMethod**: `null` \| (`pluginAlias`, `visitorType`, `callback`) => (`path`, `state`) => `void`

An optional callback that can be used to wrap visitor methods. **NOTE**: This is useful for things like introspection, and not really needed for implementing anything. Called as
`wrapPluginVisitorMethod(pluginAlias, visitorType, callback)`.

#### Defined in

node\_modules/@types/babel\_\_core/index.d.ts:384
