[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/commands/project/renovate](../README.md) / renovationTasks

# Variable: renovationTasks

> `const` **renovationTasks**: `object`

## Type declaration

### deprecate

> `readonly` **deprecate**: `object`

#### deprecate.actionDescription

> `readonly` **actionDescription**: `"Deprecating package"` = `'Deprecating package'`

#### deprecate.conflicts

> `readonly` **conflicts**: `object`

#### deprecate.conflicts.undeprecate

> `readonly` **undeprecate**: `true` = `true`

#### deprecate.emoji

> `readonly` **emoji**: `"🪦"` = `'🪦'`

#### deprecate.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will execute the standard deprecation procedure on the current package. See the xscripts wiki for details on the standard deprecation procedure.\n\n    Regardless of --scope, if this renovation is used on a polyrepo, the entire repository will also be deprecated; if this renovation is used on a monorepo, it will apply only to the current package unless deprecating the current package would result in all packages in the monorepo having been deprecated, in which case the entire repository will also be deprecated."

#### deprecate.requiresForce

> `readonly` **requiresForce**: `true` = `true`

#### deprecate.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Deprecate the current package and possibly the entire repository"` = `'Deprecate the current package and possibly the entire repository'`

#### deprecate.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### deprecate.supportedScopes

> `readonly` **supportedScopes**: [[`ThisPackage`](../../../../configure/enumerations/DefaultGlobalScope.md#thispackage)]

#### deprecate.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### deprecate.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### generate-scoped-tags

> `readonly` **generate-scoped-tags**: `object`

#### generate-scoped-tags.actionDescription

> `readonly` **actionDescription**: `"Generating scoped aliases for each non-scoped version tag"` = `'Generating scoped aliases for each non-scoped version tag'`

#### generate-scoped-tags.emoji

> `readonly` **emoji**: `"⚓"` = `'⚓'`

#### generate-scoped-tags.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation creates an alias of each old-style version tag in the repository going all the way back to the initial commit.\n\nNote that this renovation will respect the \"\[INIT\]\" xpipeline command when it appears in commit messages. See the xscripts wiki and xchangelog/xrelease documentation for details on xpipeline command semantics."

#### generate-scoped-tags.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### generate-scoped-tags.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Generate a scoped version tag for each non-scoped version tag"` = `'Generate a scoped version tag for each non-scoped version tag'`

#### generate-scoped-tags.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### generate-scoped-tags.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### generate-scoped-tags.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### generate-scoped-tags.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-clone-remote-wiki

> `readonly` **github-clone-remote-wiki**: `object`

#### github-clone-remote-wiki.actionDescription

> `readonly` **actionDescription**: `"Cloning origin repository wiki into project root"` = `'Cloning origin repository wiki into project root'`

#### github-clone-remote-wiki.emoji

> `readonly` **emoji**: `"📡"` = `'📡'`

#### github-clone-remote-wiki.longHelpDescription

> `readonly` **longHelpDescription**: `"This renovation will enable the wiki for the origin repository (if it is not enabled already) and then clone that wiki into the (gitignored) .wiki/ directory at the project root."`

#### github-clone-remote-wiki.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-clone-remote-wiki.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Clone the origin repository's wiki into a (gitignored) directory"` = `"Clone the origin repository's wiki into a (gitignored) directory"`

#### github-clone-remote-wiki.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### github-clone-remote-wiki.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### github-clone-remote-wiki.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-clone-remote-wiki.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-delete-all-releases

> `readonly` **github-delete-all-releases**: `object`

#### github-delete-all-releases.actionDescription

> `readonly` **actionDescription**: `"Permanently deleting all origin repository releases"` = `'Permanently deleting all origin repository releases'`

#### github-delete-all-releases.emoji

> `readonly` **emoji**: `"☢️"` = `'☢️'`

#### github-delete-all-releases.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will delete from the origin repository all releases associated with the current package (if --scope=this-package) or every possible release in existence (if --scope=unlimited).\n\n⚠️🚧 This is an INCREDIBLY DANGEROUS command that should ONLY be used to clear out unrelated releases after forking a repository."

#### github-delete-all-releases.requiresForce

> `readonly` **requiresForce**: `true` = `true`

#### github-delete-all-releases.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Delete all releases associated with the origin repository"` = `'Delete all releases associated with the origin repository'`

#### github-delete-all-releases.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### github-delete-all-releases.supportedScopes

> `readonly` **supportedScopes**: [`DefaultGlobalScope`](../../../../configure/enumerations/DefaultGlobalScope.md)[] = `projectRenovateScopes`

#### github-delete-all-releases.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-delete-all-releases.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-kill-master

> `readonly` **github-kill-master**: `object`

#### github-kill-master.actionDescription

> `readonly` **actionDescription**: "Renaming default branch to \"main\" and finishing off \"master\"" = `'Renaming default branch to "main" and finishing off "master"'`

#### github-kill-master.emoji

> `readonly` **emoji**: `"🚷"` = `'🚷'`

#### github-kill-master.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will kill any and all references to any \"master\" ref throughout the repository. This includes renaming the \"master\" branch to \"main,\" deleting the \"master\" branch on the origin repository, and setting the default branch to \"main\" both locally and remotely if it is not the case already."

#### github-kill-master.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-kill-master.shortHelpDescription

> `readonly` **shortHelpDescription**: "Rename and remove all references to any legacy \"master\" ref(s)" = `'Rename and remove all references to any legacy "master" ref(s)'`

#### github-kill-master.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### github-kill-master.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### github-kill-master.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-kill-master.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-pause-rulesets

> `readonly` **github-pause-rulesets**: `object`

#### github-pause-rulesets.actionDescription

> `readonly` **actionDescription**: `"Pausing ruleset protections for 5 minutes"`

#### github-pause-rulesets.emoji

> `readonly` **emoji**: `"🛸"` = `'🛸'`

#### github-pause-rulesets.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will temporarily deactivate all rulesets in the repository for 5 minutes, after which this command will reactivate them.\n\nUpon executing this renovation, you will be presented with a countdown until protections will be reactivated. You may press any key to immediately reactivate protections and exit the program.\n\nIf this renovation does not exit cleanly, re-running it (or --github-reconfigure-repo) will reactivate any erroneously disabled rulesets."

#### github-pause-rulesets.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-pause-rulesets.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Temporarily deactivate origin repository ruleset protections"`

#### github-pause-rulesets.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### github-pause-rulesets.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### github-pause-rulesets.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-pause-rulesets.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-reconfigure-repo

> `readonly` **github-reconfigure-repo**: `object`

#### github-reconfigure-repo.actionDescription

> `readonly` **actionDescription**: `"Reconfiguring origin repository settings"` = `'Reconfiguring origin repository settings'`

#### github-reconfigure-repo.conflicts

> `readonly` **conflicts**: [`"deprecate"`, `"undeprecate"`, `"github-rename-repo"`, `"github-pause-rulesets"`, `"github-kill-master"`, `"generate-scoped-tags"`]

#### github-reconfigure-repo.emoji

> `readonly` **emoji**: `"🎚️"` = `'🎚️'`

#### github-reconfigure-repo.longHelpDescription

> `readonly` **longHelpDescription**: \`This renovation will apply a standard configuration preset to the origin repository. Specifically, this renovation will:

- Update the repository's metadata
$\{string\} - Set description to package.json::description only if not already set
$\{string\}$\{string\} - With default emoji prefix: ⚡
$\{string\} - Set homepage to "https://npm.im/pkg-name" only if not already set
$\{string\} - Enable ambient repository-wide secret scanning
$\{string\} - Enable scanning pushes for secrets
$\{string\} - Enable issues
$\{string\} - Enable projects
$\{string\} - Enable squash merging for pull requests
$\{string\} - Disable normal merging for pull requests
$\{string\} - Enable rebase merging for pull requests
$\{string\} - Disable branch deletion on successful pull request merge
$\{string\} - Enable suggesting forced-synchronization of pull request branches
$\{string\} - Set topics to lowercased package.json::keywords
- Set the repository to "starred" by the current user
- Set the repository to "watched" (via "all activity") by the current user
- Create/enable the "standard-protect" and "canary-protect" rulesets
$\{string\} - If the rulesets already exist and --force was given, they're deleted, recreated, then enabled
$\{string\} - If the rulesets already exist and --force wasn't given, they're enabled
$\{string\} - A warning is issued if any other ruleset is encountered
$\{string\} - A warning is issued if a legacy "classic branch protection" setting is encountered for well-known branches
- Upload missing GitHub Actions environment secrets (encrypted)
$\{string\} - Only secrets that do not already exist will be uploaded
$\{string\} - If --force was given, all existing secrets will be deleted before the upload
$\{string\} - Secrets will be sourced from the package and project .env files
$\{string\}$\{string\} - Empty/unset variables in .env files will be ignored

Due to the current limitations of GitHub's REST API, the following renovations are not able to be automated and should be configured manually:

\* Include "Releases" and remove "Packages" and "Deployments" sidebar sections
\* Enable sponsorships
\* Enable repository preservation (arctic code vault)
\* Enable discussions
- Enable "private vulnerability reporting"
- Enable "dependency graph"
- Enable "dependabot" (i.e. "dependabot alerts" and "dependabot security updates")

By default, this command will preserve the origin repository's pre-existing configuration. Run this command with --force to overwrite any pre-existing configuration EXCEPT the origin repository's description and homepage, which can never be overwritten by this renovation.\`

#### github-reconfigure-repo.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-reconfigure-repo.shortHelpDescription

> `readonly` **shortHelpDescription**: `"(Re-)configure the origin GitHub repository settings"` = `'(Re-)configure the origin GitHub repository settings'`

#### github-reconfigure-repo.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### github-reconfigure-repo.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### github-reconfigure-repo.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-reconfigure-repo.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### github-rename-repo

> `readonly` **github-rename-repo**: `object`

#### github-rename-repo.actionDescription

> `readonly` **actionDescription**: `"Updating origin repository name and synchronizing local configuration"` = `'Updating origin repository name and synchronizing local configuration'`

#### github-rename-repo.emoji

> `readonly` **emoji**: `"🧬"` = `'🧬'`

#### github-rename-repo.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will rename the origin repository, rename (move) the repository directory on the local filesystem, and update the remotes in .git/config accordingly.\n\nIf the origin repository cannot be renamed, the rename attempt will be aborted and no local changes will occur."

#### github-rename-repo.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-rename-repo.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Rename the origin repository and update git remotes accordingly"` = `'Rename the origin repository and update git remotes accordingly'`

#### github-rename-repo.subOptions

> `readonly` **subOptions**: `object`

#### github-rename-repo.subOptions.new-name

> `readonly` **new-name**: `object`

#### github-rename-repo.subOptions.new-name.description

> `readonly` **description**: `"The repository's new name"` = `"The repository's new name"`

#### github-rename-repo.subOptions.new-name.string

> `readonly` **string**: `true` = `true`

#### github-rename-repo.subOptions.new-name.subOptionOf

> `readonly` **subOptionOf**: `object`

#### github-rename-repo.subOptions.new-name.subOptionOf.github-rename-repo

> `readonly` **github-rename-repo**: `object`

#### github-rename-repo.subOptions.new-name.subOptionOf.github-rename-repo.when()

> `readonly` **when**: (`superOptionValue`) => `any`

##### Parameters

###### superOptionValue

`any`

##### Returns

`any`

#### github-rename-repo.subOptions.new-name.subOptionOf.github-rename-repo.update()

##### Parameters

###### oldOptionConfig

`BfeBuilderObjectValueWithoutSubOptionOfExtension`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\>

##### Returns

`object`

###### alias?

> `optional` **alias**: `string` \| readonly `string`[]

string or array of strings, alias(es) for the canonical option key, see `alias()`

###### array?

> `optional` **array**: `boolean`

boolean, interpret option as an array, see `array()`

###### boolean?

> `optional` **boolean**: `boolean`

boolean, interpret option as a boolean flag, see `boolean()`

###### check?

> `optional` **check**: `BfeCheckFunction`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\> \| `BfeCheckFunction`\<`Record`\<..., ...\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\>[]

`check` is the declarative option-specific version of vanilla yargs's
`yargs::check()`. Also supports async and promise-returning functions.

This function receives the `currentArgumentValue`, which you are free to
type as you please, and the fully parsed `argv`. If this function throws,
the exception will bubble. If this function returns an instance of `Error`,
a string, or any non-truthy value (including `undefined` or not returning
anything), Black Flag will throw a `CliError` on your behalf.

You may also pass an array of check functions, each being executed after
the other. Note that providing an array of one or more async check
functions will result in them being awaited concurrently.

See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check)
for details.

###### choices?

> `optional` **choices**: `Choices`

value or array of values, limit valid option arguments to a predefined set, see `choices()`

###### coerce()?

> `optional` **coerce**: (`arg`) => `any`

`coerce` transforms an original `argv` value into another one. This is
equivalent to `coerce` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, the `coerce` function will
_always_ receive an array if the option was configured with `{ array: true
}`.

Note that **a defaulted argument will not result in this function being
called.** Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

###### Parameters

###### arg

`any`

###### Returns

`any`

###### config?

> `optional` **config**: `boolean`

boolean, interpret option as a path to a JSON config file, see `config()`

###### configParser()?

> `optional` **configParser**: (`configPath`) => `object`

function, provide a custom config parsing function, see `config()`

###### Parameters

###### configPath

`string`

###### Returns

`object`

###### conflicts?

> `optional` **conflicts**: `BfeBuilderObjectValueExtensionValue`

`conflicts` enables checks to ensure the specified arguments, or
argument-value pairs, are _never_ given conditioned on the existence of
another argument. For example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### count?

> `optional` **count**: `boolean`

boolean, interpret option as a count of boolean flags, see `count()`

###### default?

> `optional` **default**: `unknown`

`default` will set a default value for an argument. This is equivalent to
`default` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, this default value is applied
towards the end of BFE's execution, enabling its use alongside keys like
`conflicts`. See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#support-for-default-with-conflictsrequiresetc)
for details.

Note also that a defaulted argument will not be coerced by the `coerce`
setting. Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

###### defaultDescription?

> `optional` **defaultDescription**: `string`

string, use this description for the default value in help content, see `default()`

###### demandThisOption

> **demandThisOption**: `true` = `true`

###### demandThisOptionIf?

> `optional` **demandThisOptionIf**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionIf` enables checks to ensure an argument is given when at
least one of the specified groups of arguments, or argument-value pairs, is
also given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### demandThisOptionOr?

> `optional` **demandThisOptionOr**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or"
relation within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] },
  "z": { "demandThisOptionOr": ["x", "y"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### demandThisOptionXor?

> `optional` **demandThisOptionXor**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "x": { "demandThisOptionXor": ["y"] },
  "y": { "demandThisOptionXor": ["x"] },
  // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "z": { "demandThisOptionXor": ["w"] },
  "w": { "demandThisOptionXor": ["z"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### deprecate?

> `optional` **deprecate**: `string` \| `boolean`

boolean or string, mark the argument as deprecated, see `deprecateOption()`

###### deprecated?

> `optional` **deprecated**: `string` \| `boolean`

boolean or string, mark the argument as deprecated, see `deprecateOption()`

###### desc?

> `optional` **desc**: `string`

string, the option description for help content, see `describe()`

###### describe?

> `optional` **describe**: `string`

string, the option description for help content, see `describe()`

###### description?

> `optional` **description**: `string`

string, the option description for help content, see `describe()`

###### global?

> `optional` **global**: `boolean`

boolean, indicate that this key should not be reset when a command is invoked, see `global()`

###### group?

> `optional` **group**: `string`

string, when displaying usage instructions place the option under an alternative group heading, see `group()`

###### hidden?

> `optional` **hidden**: `boolean`

don't display option in help output.

###### implies?

> `optional` **implies**: `BfeBuilderObjectValueExtensionObject` \| `BfeBuilderObjectValueExtensionObject`[]

`implies` will set default values for the specified arguments conditioned
on the existence of another argument. These implied defaults will override
any `default` configurations of the specified arguments.

If any of the specified arguments are explicitly given on the command line,
their values must match the specified argument-value pairs respectively
(which is the behavior of `requires`/`conflicts`). Use `looseImplications`
to modify this behavior.

Hence, `implies` only accepts one or more argument-value pairs and not raw
strings. For example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
  "y": {}
}
```

###### See

 - BfeBuilderObjectValueExtensions.looseImplications
 - BfeBuilderObjectValueExtensions.vacuousImplications

###### looseImplications?

> `optional` **looseImplications**: `boolean`

When `looseImplications` is set to `true`, any implied arguments, when
explicitly given on the command line, will _override_ their configured
implications instead of causing an error.

###### Default

```ts
false
```

###### See

BfeBuilderObjectValueExtensions.implies

###### nargs?

> `optional` **nargs**: `number`

number, specify how many arguments should be consumed for the option, see `nargs()`

###### normalize?

> `optional` **normalize**: `boolean`

boolean, apply path.normalize() to the option, see `normalize()`

###### number?

> `optional` **number**: `boolean`

boolean, interpret option as a number, `number()`

###### requires?

> `optional` **requires**: `BfeBuilderObjectValueExtensionValue`

`requires` enables checks to ensure the specified arguments, or
argument-value pairs, are given conditioned on the existence of another
argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### requiresArg?

> `optional` **requiresArg**: `boolean`

boolean, require the option be specified with a value, see `requiresArg()`

###### skipValidation?

> `optional` **skipValidation**: `boolean`

boolean, skips validation if the option is present, see `skipValidation()`

###### string?

> `optional` **string**: `boolean`

boolean, interpret option as a string, see `string()`

###### type?

> `optional` **type**: `"array"` \| `"count"` \| `PositionalOptionsType`

###### vacuousImplications?

> `optional` **vacuousImplications**: `boolean`

When `vacuousImplications` is set to `true` and the option is also
configured as a "boolean" type, the implications configured via `implies`
will still be applied to `argv` even if said option has a `false` value in
`argv`. In the same scenario except with `vacuousImplications` set to
`false`, the implications configured via `implies` are instead ignored.

###### Default

```ts
false
```

###### See

BfeBuilderObjectValueExtensions.implies

#### github-rename-repo.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### github-rename-repo.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### github-rename-repo.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### regenerate-assets

> `readonly` **regenerate-assets**: `object`

#### regenerate-assets.actionDescription

> `readonly` **actionDescription**: `"Regenerating targeted configuration and template assets"` = `'Regenerating targeted configuration and template assets'`

#### regenerate-assets.conflicts

> `readonly` **conflicts**: [`"synchronize-interdependencies"`, `"update-dependencies"`]

#### regenerate-assets.emoji

> `readonly` **emoji**: `"♻️"` = `'♻️'`

#### regenerate-assets.longHelpDescription

> `readonly` **longHelpDescription**: \`
This renovation will regenerate one or more files in the project, each represented by an "asset". An asset is a collection mapping output paths to generated content. When writing out content to an output path, existing files are overwritten, missing files are created, and obsolete files are deleted.

Provide --assets-preset (required) to specify which assets to regenerate. The parameter accepts one of the following presets: $\{string\}. The paths of assets included in the preset will be targeted for renovation except those paths matched by --skip-asset-paths.

Use --skip-asset-paths to further narrow which files are regenerated. The parameter accepts regular expressions that are matched against the paths to be written out. Any paths matching one of the aforesaid regular expressions will have their contents discarded instead of written out.

This renovation attempts to import the "import-aliases.mjs" file if it exists at the root of the project. Use this file to provide additional \`RawAliasMapping\[\]\`s to include when regenerating files defining the project's import aliases. See the xscripts wiki documentation for further details.

When renovating Markdown files with templates divided into replacer regions via the magic comments "$\{string\}" and "\<!-- xscripts-template-region-end --\>", this command will perform so-called "regional replacements" where only the content between the "start" and "end" comments will be modified. Regions without matching ids are ignored.

When regional replacements are performed, matching non-numeric reference definitions will be overwritten respectively, and new definitions will be appended. However, when attempting to renovate a Markdown file and either (1) it does not have replacer regions when its corresponding template contains replacer regions or (2) --force is used, the entire file will be overwritten instead.

Note that only certain Markdown files support regional replacements. See the xscripts wiki documentation for more details.

After invoking this renovation, you should use your IDE's diff tools to compare and contrast the latest best practices with the project's current configuration setup.

This renovation should be re-run each time a package is added to, or removed from, a xscripts-compliant monorepo but should NEVER be run in a CI environment or anywhere logs can be viewed publicly.

See the xscripts wiki documentation for more details on this command and all available assets.
\`

#### regenerate-assets.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### regenerate-assets.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Regenerate targeted configuration and template asset files"` = `'Regenerate targeted configuration and template asset files'`

#### regenerate-assets.subOptions

> `readonly` **subOptions**: `object`

#### regenerate-assets.subOptions.assets-preset

> `readonly` **assets-preset**: `object`

#### regenerate-assets.subOptions.assets-preset.alias

> `readonly` **alias**: `"preset"` = `'preset'`

#### regenerate-assets.subOptions.assets-preset.choices

> `readonly` **choices**: [`AssetPreset`](../../../../assets/enumerations/AssetPreset.md)[] = `assetPresets`

#### regenerate-assets.subOptions.assets-preset.description

> `readonly` **description**: `"Select a set of assets to target for regeneration"` = `'Select a set of assets to target for regeneration'`

#### regenerate-assets.subOptions.assets-preset.subOptionOf

> `readonly` **subOptionOf**: `object`

#### regenerate-assets.subOptions.assets-preset.subOptionOf.regenerate-assets

> `readonly` **regenerate-assets**: `object`

#### regenerate-assets.subOptions.assets-preset.subOptionOf.regenerate-assets.when()

> `readonly` **when**: (`superOptionValue`) => `any`

##### Parameters

###### superOptionValue

`any`

##### Returns

`any`

#### regenerate-assets.subOptions.assets-preset.subOptionOf.regenerate-assets.update()

##### Parameters

###### oldOptionConfig

`BfeBuilderObjectValueWithoutSubOptionOfExtension`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\>

##### Returns

`object`

###### alias?

> `optional` **alias**: `string` \| readonly `string`[]

string or array of strings, alias(es) for the canonical option key, see `alias()`

###### array?

> `optional` **array**: `boolean`

boolean, interpret option as an array, see `array()`

###### boolean?

> `optional` **boolean**: `boolean`

boolean, interpret option as a boolean flag, see `boolean()`

###### check?

> `optional` **check**: `BfeCheckFunction`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\> \| `BfeCheckFunction`\<`Record`\<..., ...\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\>[]

`check` is the declarative option-specific version of vanilla yargs's
`yargs::check()`. Also supports async and promise-returning functions.

This function receives the `currentArgumentValue`, which you are free to
type as you please, and the fully parsed `argv`. If this function throws,
the exception will bubble. If this function returns an instance of `Error`,
a string, or any non-truthy value (including `undefined` or not returning
anything), Black Flag will throw a `CliError` on your behalf.

You may also pass an array of check functions, each being executed after
the other. Note that providing an array of one or more async check
functions will result in them being awaited concurrently.

See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check)
for details.

###### choices?

> `optional` **choices**: `Choices`

value or array of values, limit valid option arguments to a predefined set, see `choices()`

###### coerce()?

> `optional` **coerce**: (`arg`) => `any`

`coerce` transforms an original `argv` value into another one. This is
equivalent to `coerce` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, the `coerce` function will
_always_ receive an array if the option was configured with `{ array: true
}`.

Note that **a defaulted argument will not result in this function being
called.** Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

###### Parameters

###### arg

`any`

###### Returns

`any`

###### config?

> `optional` **config**: `boolean`

boolean, interpret option as a path to a JSON config file, see `config()`

###### configParser()?

> `optional` **configParser**: (`configPath`) => `object`

function, provide a custom config parsing function, see `config()`

###### Parameters

###### configPath

`string`

###### Returns

`object`

###### conflicts?

> `optional` **conflicts**: `BfeBuilderObjectValueExtensionValue`

`conflicts` enables checks to ensure the specified arguments, or
argument-value pairs, are _never_ given conditioned on the existence of
another argument. For example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### count?

> `optional` **count**: `boolean`

boolean, interpret option as a count of boolean flags, see `count()`

###### default?

> `optional` **default**: `unknown`

`default` will set a default value for an argument. This is equivalent to
`default` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, this default value is applied
towards the end of BFE's execution, enabling its use alongside keys like
`conflicts`. See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#support-for-default-with-conflictsrequiresetc)
for details.

Note also that a defaulted argument will not be coerced by the `coerce`
setting. Only arguments given via `argv` trigger `coerce`. This is vanilla
yargs behavior.

###### defaultDescription?

> `optional` **defaultDescription**: `string`

string, use this description for the default value in help content, see `default()`

###### demandThisOption

> **demandThisOption**: `true` = `true`

###### demandThisOptionIf?

> `optional` **demandThisOptionIf**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionIf` enables checks to ensure an argument is given when at
least one of the specified groups of arguments, or argument-value pairs, is
also given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### demandThisOptionOr?

> `optional` **demandThisOptionOr**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or"
relation within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] },
  "z": { "demandThisOptionOr": ["x", "y"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### demandThisOptionXor?

> `optional` **demandThisOptionXor**: `BfeBuilderObjectValueExtensionValue`

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "x": { "demandThisOptionXor": ["y"] },
  "y": { "demandThisOptionXor": ["x"] },
  // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "z": { "demandThisOptionXor": ["w"] },
  "w": { "demandThisOptionXor": ["z"] }
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### deprecate?

> `optional` **deprecate**: `string` \| `boolean`

boolean or string, mark the argument as deprecated, see `deprecateOption()`

###### deprecated?

> `optional` **deprecated**: `string` \| `boolean`

boolean or string, mark the argument as deprecated, see `deprecateOption()`

###### desc?

> `optional` **desc**: `string`

string, the option description for help content, see `describe()`

###### describe?

> `optional` **describe**: `string`

string, the option description for help content, see `describe()`

###### description?

> `optional` **description**: `string`

string, the option description for help content, see `describe()`

###### global?

> `optional` **global**: `boolean`

boolean, indicate that this key should not be reset when a command is invoked, see `global()`

###### group?

> `optional` **group**: `string`

string, when displaying usage instructions place the option under an alternative group heading, see `group()`

###### hidden?

> `optional` **hidden**: `boolean`

don't display option in help output.

###### implies?

> `optional` **implies**: `BfeBuilderObjectValueExtensionObject` \| `BfeBuilderObjectValueExtensionObject`[]

`implies` will set default values for the specified arguments conditioned
on the existence of another argument. These implied defaults will override
any `default` configurations of the specified arguments.

If any of the specified arguments are explicitly given on the command line,
their values must match the specified argument-value pairs respectively
(which is the behavior of `requires`/`conflicts`). Use `looseImplications`
to modify this behavior.

Hence, `implies` only accepts one or more argument-value pairs and not raw
strings. For example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
  "y": {}
}
```

###### See

 - BfeBuilderObjectValueExtensions.looseImplications
 - BfeBuilderObjectValueExtensions.vacuousImplications

###### looseImplications?

> `optional` **looseImplications**: `boolean`

When `looseImplications` is set to `true`, any implied arguments, when
explicitly given on the command line, will _override_ their configured
implications instead of causing an error.

###### Default

```ts
false
```

###### See

BfeBuilderObjectValueExtensions.implies

###### nargs?

> `optional` **nargs**: `number`

number, specify how many arguments should be consumed for the option, see `nargs()`

###### normalize?

> `optional` **normalize**: `boolean`

boolean, apply path.normalize() to the option, see `normalize()`

###### number?

> `optional` **number**: `boolean`

boolean, interpret option as a number, `number()`

###### requires?

> `optional` **requires**: `BfeBuilderObjectValueExtensionValue`

`requires` enables checks to ensure the specified arguments, or
argument-value pairs, are given conditioned on the existence of another
argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

Note: if an argument-value pair is specified and said argument is
configured as an array (`{ array: true }`), it will be searched for the
specified value. Otherwise, a strict deep equality check is performed.

###### requiresArg?

> `optional` **requiresArg**: `boolean`

boolean, require the option be specified with a value, see `requiresArg()`

###### skipValidation?

> `optional` **skipValidation**: `boolean`

boolean, skips validation if the option is present, see `skipValidation()`

###### string?

> `optional` **string**: `boolean`

boolean, interpret option as a string, see `string()`

###### type?

> `optional` **type**: `"array"` \| `"count"` \| `PositionalOptionsType`

###### vacuousImplications?

> `optional` **vacuousImplications**: `boolean`

When `vacuousImplications` is set to `true` and the option is also
configured as a "boolean" type, the implications configured via `implies`
will still be applied to `argv` even if said option has a `false` value in
`argv`. In the same scenario except with `vacuousImplications` set to
`false`, the implications configured via `implies` are instead ignored.

###### Default

```ts
false
```

###### See

BfeBuilderObjectValueExtensions.implies

#### regenerate-assets.subOptions.skip-asset-paths

> `readonly` **skip-asset-paths**: `object`

#### regenerate-assets.subOptions.skip-asset-paths.alias

> `readonly` **alias**: `"skip-asset-path"` = `'skip-asset-path'`

#### regenerate-assets.subOptions.skip-asset-paths.array

> `readonly` **array**: `true` = `true`

#### regenerate-assets.subOptions.skip-asset-paths.default

> `readonly` **default**: readonly [] = `[]`

#### regenerate-assets.subOptions.skip-asset-paths.description

> `readonly` **description**: `"skip regenerating assets matching a regular expression"` = `'skip regenerating assets matching a regular expression'`

#### regenerate-assets.subOptions.skip-asset-paths.string

> `readonly` **string**: `true` = `true`

#### regenerate-assets.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### regenerate-assets.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### regenerate-assets.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### synchronize-interdependencies

> `readonly` **synchronize-interdependencies**: `object`

#### synchronize-interdependencies.actionDescription

> `readonly` **actionDescription**: `"Synchronizing package interdependencies"` = `'Synchronizing package interdependencies'`

#### synchronize-interdependencies.emoji

> `readonly` **emoji**: `"🔗"` = `'🔗'`

#### synchronize-interdependencies.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will analyze dependencies in one or more package.json files (depending on --scope), select dependencies in those files that match a package name in this project, and update those dependencies' ranges to match their respective package versions as they are in the project. This is useful in monorepos with published packages that rely on other published packages in the same repo. This renovation ensures a package released from this project will always install the latest version of the other packages released from this project.\n\nIf this repository is a polyrepo, this renovation is essentially a no-op." = `"This renovation will analyze dependencies in one or more package.json files (depending on --scope), select dependencies in those files that match a package name in this project, and update those dependencies' ranges to match their respective package versions as they are in the project. This is useful in monorepos with published packages that rely on other published packages in the same repo. This renovation ensures a package released from this project will always install the latest version of the other packages released from this project.\n\nIf this repository is a polyrepo, this renovation is essentially a no-op."`

#### synchronize-interdependencies.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### synchronize-interdependencies.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Update package.json dependencies to match their monorepo versions"` = `'Update package.json dependencies to match their monorepo versions'`

#### synchronize-interdependencies.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### synchronize-interdependencies.supportedScopes

> `readonly` **supportedScopes**: [`DefaultGlobalScope`](../../../../configure/enumerations/DefaultGlobalScope.md)[] = `projectRenovateScopes`

#### synchronize-interdependencies.taskAliases

> `readonly` **taskAliases**: [`"sync-deps"`]

#### synchronize-interdependencies.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### undeprecate

> `readonly` **undeprecate**: `object`

#### undeprecate.actionDescription

> `readonly` **actionDescription**: `"Un-deprecating package"` = `'Un-deprecating package'`

#### undeprecate.conflicts

> `readonly` **conflicts**: `object`

#### undeprecate.conflicts.deprecate

> `readonly` **deprecate**: `true` = `true`

#### undeprecate.emoji

> `readonly` **emoji**: `"🧟"` = `'🧟'`

#### undeprecate.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will make a best effort at undoing the standard deprecation procedure on the current package and its containing repository, effectively \"un-deprecating\" them both. See the xscripts wiki for details on the standard deprecation procedure and what the ramifications of an \"un-deprecation\" are."

#### undeprecate.requiresForce

> `readonly` **requiresForce**: `true` = `true`

#### undeprecate.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Un-deprecate the current package and repository"` = `'Un-deprecate the current package and repository'`

#### undeprecate.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### undeprecate.supportedScopes

> `readonly` **supportedScopes**: [[`ThisPackage`](../../../../configure/enumerations/DefaultGlobalScope.md#thispackage)]

#### undeprecate.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### undeprecate.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

### update-dependencies

> `readonly` **update-dependencies**: `object`

#### update-dependencies.actionDescription

> `readonly` **actionDescription**: `"Launching interactive dependency check for latest versions"` = `'Launching interactive dependency check for latest versions'`

#### update-dependencies.emoji

> `readonly` **emoji**: `"⚕️"` = `'⚕️'`

#### update-dependencies.longHelpDescription

> `readonly` **longHelpDescription**: `"This renovation allows the user to interactively select and update dependencies in package.json files belong to packages across the entire project (depending on --scope). Each updated dependency will generate either a chore-type commit (for package.json::devDependency updates) or a build-type commit (for any other kind of dependency in package.json) with a short simple commit message tailored to the dependency being updated."` = `'This renovation allows the user to interactively select and update dependencies in package.json files belong to packages across the entire project (depending on --scope). Each updated dependency will generate either a chore-type commit (for package.json::devDependency updates) or a build-type commit (for any other kind of dependency in package.json) with a short simple commit message tailored to the dependency being updated.'`

#### update-dependencies.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### update-dependencies.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Interactively update dependencies in package.json"` = `'Interactively update dependencies in package.json'`

#### update-dependencies.subOptions

> `readonly` **subOptions**: `object` = `{}`

#### update-dependencies.supportedScopes

> `readonly` **supportedScopes**: [`DefaultGlobalScope`](../../../../configure/enumerations/DefaultGlobalScope.md)[] = `projectRenovateScopes`

#### update-dependencies.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### update-dependencies.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`undefined`\>

## See

RenovationTask

## Defined in

[src/commands/project/renovate.ts:684](https://github.com/Xunnamius/xscripts/blob/3a8e3952522a9aa3e84a1990f6fcb2207da32534/src/commands/project/renovate.ts#L684)
