[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_release.config.cjs](../README.md) / ReleaseConfig

# Interface: ReleaseConfig

semantic-release options.

Can be used to set any core option or plugin options.
Each option will take precedence over options configured in the
configuration file and shareable configurations.

## Indexable

 \[`name`: `string`\]: `any`

## Properties

### branches?

> `optional` **branches**: `BranchSpec` \| readonly `BranchSpec`[]

The branches on which releases should happen. By default
**semantic-release** will release:

 * regular releases to the default distribution channel from the
   branch `master`/`main
 * regular releases to a distribution channel matching the branch
   name from any existing branch with a name matching a maintenance
   release range (`N.N.x` or `N.x.x` or `N.x` with `N` being a
   number)
 * regular releases to the `next` distribution channel from the
   branch `next` if it exists
 * regular releases to the `next-major` distribution channel from
   the branch `next-major` if it exists.
 * prereleases to the `beta` distribution channel from the branch
   `beta` if it exists
 * prereleases to the `alpha` distribution channel from the branch
   `alpha` if it exists

**Note**: If your repository does not have a release branch, then
**semantic-release** will fail with an `ERELEASEBRANCHES` error
message. If you are using the default configuration, you can fix
this error by pushing a `master`/`main` branch.

**Note**: Once **semantic-release** is configured, any user with the
permission to push commits on one of those branches will be able to
publish a release. It is recommended to protect those branches, for
example with [GitHub protected branches](https://help.github.com/articles/about-protected-branches).

See [Workflow configuration](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#workflow-configuration)
for more details.

#### Defined in

node\_modules/semantic-release/index.d.ts:624

***

### ci?

> `optional` **ci**: `boolean`

Set to false to skip Continuous Integration environment verifications.
This allows for making releases from a local machine.

#### Defined in

node\_modules/semantic-release/index.d.ts:676

***

### dryRun?

> `optional` **dryRun**: `boolean`

Dry-run mode, skip publishing, print next version and release notes.

#### Defined in

node\_modules/semantic-release/index.d.ts:670

***

### extends?

> `optional` **extends**: `string` \| readonly `string`[]

List of modules or file paths containing a
[shareable configuration](https://semantic-release.gitbook.io/semantic-release/usage/shareable-configurations).
If multiple shareable configurations are set, they will be imported
in the order defined with each configuration option taking
precedence over the options defined in a previous shareable
configuration.

**Note**: Options defined via CLI arguments or in the configuration
file will take precedence over the ones defined in any shareable
configuration.

#### Defined in

node\_modules/semantic-release/index.d.ts:590

***

### plugins?

> `optional` **plugins**: readonly `PluginSpec`\<`any`\>[]

Define the list of plugins to use. Plugins will run in series, in
the order defined, for each [step](https://semantic-release.gitbook.io/semantic-release/#release-steps)
if they implement it.

Plugins configuration can be defined by wrapping the name and an
options object in an array.

See [Plugins configuration](https://semantic-release.gitbook.io/semantic-release/usage/plugins#plugins)
for more details.

Default: `[
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    "@semantic-release/github"
]`

#### Defined in

node\_modules/semantic-release/index.d.ts:665

***

### repositoryUrl?

> `optional` **repositoryUrl**: `string`

The git repository URL.

Any valid git url format is supported (see
[git protocols](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols))

Default: `repository` property in `package.json`, or git origin url.

#### Defined in

node\_modules/semantic-release/index.d.ts:634

***

### tagFormat?

> `optional` **tagFormat**: `string`

The git tag format used by **semantic-release** to identify
releases. The tag name is generated with [Lodash template](https://lodash.com/docs#template)
and will be compiled with the `version` variable.

**Note**: The `tagFormat` must contain the `version` variable
exactly once and compile to a
[valid git reference](https://git-scm.com/docs/git-check-ref-format#_description).

#### Defined in

node\_modules/semantic-release/index.d.ts:645
