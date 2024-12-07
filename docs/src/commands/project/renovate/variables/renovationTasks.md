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

#### deprecate.emoji

> `readonly` **emoji**: `"☢️"` = `'☢️'`

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

`Promise`\<`void`\>

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

`Promise`\<`void`\>

### github-clone-remote-wiki

> `readonly` **github-clone-remote-wiki**: `object`

#### github-clone-remote-wiki.actionDescription

> `readonly` **actionDescription**: `"Cloning origin repository wiki into project root"` = `'Cloning origin repository wiki into project root'`

#### github-clone-remote-wiki.emoji

> `readonly` **emoji**: `"📡"` = `'📡'`

#### github-clone-remote-wiki.longHelpDescription

> `readonly` **longHelpDescription**: `"This renovation will clone the repository's wiki into the (gitignored) .wiki/ directory at the project root. If a wiki does not exist, this command will throw an error; in such a case, use --github-reconfigure-repo first to enable wikis before running this renovation."`

#### github-clone-remote-wiki.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-clone-remote-wiki.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Clone the origin repository's wikis into a (gitignored) directory"` = `"Clone the origin repository's wikis into a (gitignored) directory"`

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

`Promise`\<`void`\>

### github-delete-all-releases

> `readonly` **github-delete-all-releases**: `object`

#### github-delete-all-releases.actionDescription

> `readonly` **actionDescription**: `"Permanently deleting all origin repository releases"` = `'Permanently deleting all origin repository releases'`

#### github-delete-all-releases.emoji

> `readonly` **emoji**: `"☣️"` = `'☣️'`

#### github-delete-all-releases.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will delete from the origin repository all releases associated with the current package (if \`--scope=this-package\`) or every possible release in existence (if \`--scope=unlimited\`).\n\n⚠️🚧 This is an INCREDIBLY DANGEROUS command that should ONLY be used to clear out unrelated releases after forking a repository."

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

`Promise`\<`void`\>

### github-kill-master

> `readonly` **github-kill-master**: `object`

#### github-kill-master.actionDescription

> `readonly` **actionDescription**: "Renaming default branch to \"main\" and cleaning up any remnants of \"master\"" = `'Renaming default branch to "main" and cleaning up any remnants of "master"'`

#### github-kill-master.emoji

> `readonly` **emoji**: `"🚷"` = `'🚷'`

#### github-kill-master.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will kill any and all references to any \"master\" ref throughout the repository. This includes renaming the \"master\" branch to \"main,\" deleting the \"master\" branch on the remote origin repository, and setting the default branch to \"main\" both locally and remotely if it is not the case already."

#### github-kill-master.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-kill-master.shortHelpDescription

> `readonly` **shortHelpDescription**: "Rename and remove all references to any legacy \"master\" branch(es)" = `'Rename and remove all references to any legacy "master" branch(es)'`

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

`Promise`\<`void`\>

### github-pause-rulesets

> `readonly` **github-pause-rulesets**: `object`

#### github-pause-rulesets.actionDescription

> `readonly` **actionDescription**: `"Pausing ruleset protections for 5 minutes"`

#### github-pause-rulesets.emoji

> `readonly` **emoji**: `"🛸"` = `'🛸'`

#### github-pause-rulesets.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will temporarily disable all rulesets in the repository for 5 minutes, after which this command will re-enable them.\n\nUpon executing this renovation, you will be presented with a countdown after which protections will be re-enabled. You may press any key to immediately re-enable protections and exit the program.\n\nIf this renovation does not exit cleanly, re-running it (or --github-reconfigure-repo) will restore and re-enable any disabled rulesets."

#### github-pause-rulesets.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### github-pause-rulesets.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Temporarily pause origin repository ruleset protections"`

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

`Promise`\<`void`\>

### github-reconfigure-repo

> `readonly` **github-reconfigure-repo**: `object`

#### github-reconfigure-repo.actionDescription

> `readonly` **actionDescription**: `"Reconfiguring origin repository settings"` = `'Reconfiguring origin repository settings'`

#### github-reconfigure-repo.emoji

> `readonly` **emoji**: `"🎚️"` = `'🎚️'`

#### github-reconfigure-repo.longHelpDescription

> `readonly` **longHelpDescription**: \`This renovation will apply a standard configuration preset to the remote origin repository. Specifically, this renovation will:

- Update the "repository details"
$\{string\} - Set description (with default emoji) to package.json::description if not already set
$\{string\} - Set website to npm.im URL if not already set
$\{string\} - Set topics to package.json::keywords if not already set
$\{string\} - Include "Releases" and remove "Packages" and "Deployments" sidebar sections
- Set the user to star the repository
- Set the user to watch "all activity" in the repository
- Enable wikis with editing restricted to collaborators only
- Enable issues
- Enable sponsorships
- Enable repository preservation
- Enable discussions
- Enable projects
- Disable "allow merge commits"
- Enable "allow squash merging"
- Enable "allow rebase merging"
- Enable "always suggest updating pull request branches"
- Enable "allow auto-merge"
- (Re)create and enable the "standard-protect" and "canary-protect" rulesets; issue warnings about the existence of any other rulesets
$\{string\} - "standard-protect" restricts deletions of, requires signed commits for, and blocks force pushes to the repository's main branch and any maintenance branches
$\{string\} - "canary-protect" restricts deletions of and requires signed commits for the repository's canary branch(es), but does NOT block force pushes to these branches
- Clear out any classic branch protection settings
- Enable "private vulnerability reporting"
- Enable "dependency graph"
- Enable "dependabot" (i.e. "dependabot alerts" and "dependabot security updates")
- Enable "secret scanning" (i.e. "alerts" and "push protection")
- Overwrite the repository's "environment secrets" for GitHub Actions using the closest .env file
$\{string\} - The filesystem will be walked starting from the current directory upward until a suitable .env file is found or the filesystem root is reached
$\{string\} - .env.default is used if .env is not available
$\{string\} - Secrets are never deleted by this command, only added/overwritten
\`

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

`Promise`\<`void`\>

### github-rename-repo

> `readonly` **github-rename-repo**: `object`

#### github-rename-repo.actionDescription

> `readonly` **actionDescription**: `"Updating origin repository name and synchronizing local git configuration"` = `'Updating origin repository name and synchronizing local git configuration'`

#### github-rename-repo.emoji

> `readonly` **emoji**: `"🧬"` = `'🧬'`

#### github-rename-repo.longHelpDescription

> `readonly` **longHelpDescription**: `"This renovation will rename the remote origin repository, rename (move) the repository directory on the local filesystem, and update the remotes in .git/config accordingly."`

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

#### github-rename-repo.subOptions.new-name.subOptionOf.github-rename-repo.when()

##### Parameters

###### superOptionValue

`any`

##### Returns

`any`

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

`Promise`\<`void`\>

### regenerate-aliases

> `readonly` **regenerate-aliases**: `object`

#### regenerate-aliases.actionDescription

> `readonly` **actionDescription**: `"Regenerating project aliases"` = `'Regenerating project aliases'`

#### regenerate-aliases.emoji

> `readonly` **emoji**: `"🧭"` = `'🧭'`

#### regenerate-aliases.longHelpDescription

> `readonly` **longHelpDescription**: `string`

#### regenerate-aliases.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### regenerate-aliases.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Regenerate the assets files that define project-wide import aliases"` = `'Regenerate the assets files that define project-wide import aliases'`

#### regenerate-aliases.subOptions

> `readonly` **subOptions**: `object`

#### regenerate-aliases.subOptions.with-aliases-loaded-from

> `readonly` **with-aliases-loaded-from**: `object`

#### regenerate-aliases.subOptions.with-aliases-loaded-from.description

> `readonly` **description**: `"Include additional alias definitions imported from a JavaScript file"` = `'Include additional alias definitions imported from a JavaScript file'`

#### regenerate-aliases.subOptions.with-aliases-loaded-from.string

> `readonly` **string**: `true` = `true`

#### regenerate-aliases.supportedScopes

> `readonly` **supportedScopes**: [[`Unlimited`](../../../../configure/enumerations/DefaultGlobalScope.md#unlimited)]

#### regenerate-aliases.taskAliases

> `readonly` **taskAliases**: [] = `[]`

#### regenerate-aliases.run()

##### Parameters

###### argv\_

`unknown`

###### \_\_namedParameters

[`RenovationTaskContext`](../type-aliases/RenovationTaskContext.md)

##### Returns

`Promise`\<`void`\>

### regenerate-assets

> `readonly` **regenerate-assets**: `object`

#### regenerate-assets.actionDescription

> `readonly` **actionDescription**: `"Regenerating configuration and template assets"` = `'Regenerating configuration and template assets'`

#### regenerate-assets.emoji

> `readonly` **emoji**: `"♻️"` = `'♻️'`

#### regenerate-assets.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will regenerate all configuration assets in the project. Existing conflicting configurations are overwritten. Missing configurations are created. Old configurations are deleted.\n\nAfter running this renovation, you should use your IDE's diff tools to compare and contrast the latest best practices with the project's current configuration setup.\n\nNote that this renovation is a superset of --regenerate-aliases; invoking both renovations is pointlessly redundant."

#### regenerate-assets.requiresForce

> `readonly` **requiresForce**: `false` = `false`

#### regenerate-assets.shortHelpDescription

> `readonly` **shortHelpDescription**: `"Regenerate all configuration and template asset files"` = `'Regenerate all configuration and template asset files'`

#### regenerate-assets.subOptions

> `readonly` **subOptions**: `object`

#### regenerate-assets.subOptions.only-assets

> `readonly` **only-assets**: `object`

#### regenerate-assets.subOptions.only-assets.alias

> `readonly` **alias**: `"only-asset"` = `'only-asset'`

#### regenerate-assets.subOptions.only-assets.array

> `readonly` **array**: `true` = `true`

#### regenerate-assets.subOptions.only-assets.conflicts

> `readonly` **conflicts**: `"skip-assets"` = `'skip-assets'`

#### regenerate-assets.subOptions.only-assets.default

> `readonly` **default**: readonly [] = `[]`

#### regenerate-assets.subOptions.only-assets.description

> `readonly` **description**: `"One or more regular expressions used to include matching project-root-relative file paths (all others will be ignored)"` = `'One or more regular expressions used to include matching project-root-relative file paths (all others will be ignored)'`

#### regenerate-assets.subOptions.only-assets.string

> `readonly` **string**: `true` = `true`

#### regenerate-assets.subOptions.skip-assets

> `readonly` **skip-assets**: `object`

#### regenerate-assets.subOptions.skip-assets.alias

> `readonly` **alias**: `"skip-asset"` = `'skip-asset'`

#### regenerate-assets.subOptions.skip-assets.array

> `readonly` **array**: `true` = `true`

#### regenerate-assets.subOptions.skip-assets.conflicts

> `readonly` **conflicts**: `"only-assets"` = `'only-assets'`

#### regenerate-assets.subOptions.skip-assets.default

> `readonly` **default**: readonly [] = `[]`

#### regenerate-assets.subOptions.skip-assets.description

> `readonly` **description**: `"One or more regular expressions used to ignore matching project-root-relative file paths (all others will be included)"` = `'One or more regular expressions used to ignore matching project-root-relative file paths (all others will be included)'`

#### regenerate-assets.subOptions.skip-assets.string

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

`Promise`\<`void`\>

### synchronize-interdependencies

> `readonly` **synchronize-interdependencies**: `object`

#### synchronize-interdependencies.actionDescription

> `readonly` **actionDescription**: `"Synchronizing package interdependencies"` = `'Synchronizing package interdependencies'`

#### synchronize-interdependencies.emoji

> `readonly` **emoji**: `"🔗"` = `'🔗'`

#### synchronize-interdependencies.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will analyze dependencies in one or more package.json files (depending on --scope), select only those dependencies that match a package name in the origin repository, and update their package.json dependency ranges to match their respective package versions as they are in the monorepo.\n\nIf this repository is a polyrepo, this renovation is essentially a no-op." = `'This renovation will analyze dependencies in one or more package.json files (depending on --scope), select only those dependencies that match a package name in the origin repository, and update their package.json dependency ranges to match their respective package versions as they are in the monorepo.\n\nIf this repository is a polyrepo, this renovation is essentially a no-op.'`

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

`Promise`\<`void`\>

### undeprecate

> `readonly` **undeprecate**: `object`

#### undeprecate.actionDescription

> `readonly` **actionDescription**: `"Un-deprecating package"` = `'Un-deprecating package'`

#### undeprecate.emoji

> `readonly` **emoji**: `"🪦"` = `'🪦'`

#### undeprecate.longHelpDescription

> `readonly` **longHelpDescription**: "This renovation will undo the standard deprecation procedure on the current package and its containing repository, effectively \"un-deprecating\" them both. See the xscripts wiki for details on the standard deprecation procedure and what the ramifications of an \"un-deprecation\" are."

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

`Promise`\<`void`\>

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

`Promise`\<`void`\>

## See

[RenovationTask](../type-aliases/RenovationTask.md)

## Defined in

[src/commands/project/renovate.ts:400](https://github.com/Xunnamius/xscripts/blob/12020afea79f1ec674174f8cb4103ac0b46875c5/src/commands/project/renovate.ts#L400)
