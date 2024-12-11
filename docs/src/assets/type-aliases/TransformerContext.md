[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / TransformerContext

# Type Alias: TransformerContext

> **TransformerContext**: `object`

A union of well-known context keys passed directly to each transformer
[Transformer](Transformer.md).

## Type declaration

### asset

> **asset**: `string`

The value of the `asset` parameter passed to
[gatherAssetsFromTransformer](../functions/gatherAssetsFromTransformer.md) and related functions.

For transformers returning a single asset, this can be used to construct
the asset path.

### badges

> **badges**: `string`

The markdown badge references that are standard for every xscripts-powered
project.

GFM and GitHub-supported HTML is allowed.

### debug

> **debug**: `ExtendedDebugger`

Global debugging function.

### forceOverwritePotentiallyDestructive

> **forceOverwritePotentiallyDestructive**: `boolean`

Whether or not to overwrite certain files (such as .env) in a potentially
destructive way.

### log

> **log**: `ExtendedLogger`

Global logging function.

### packageBuildDetailsLong

> **packageBuildDetailsLong**: `string` \| `string`[]

A technical description of distributables.

**This context variable can be defined as a string array which will offer
the user several choices that they must narrow down manually.** To avoid
noisy diffs during renovation, the user's choice should correspond with
their choice in [TransformerContext.packageBuildDetailsShort](TransformerContext.md#packagebuilddetailsshort).

### packageBuildDetailsShort

> **packageBuildDetailsShort**: `string` \| `string`[]

A short description of distributables.

**This context variable can be defined as a string array which will offer
the user several choices that they must narrow down manually.** To avoid
noisy diffs during renovation, the user's choice should correspond with
their choice in [TransformerContext.packageBuildDetailsLong](TransformerContext.md#packagebuilddetailslong).

### packageDescription

> **packageDescription**: `string`

`package.json::description`.

### packageName

> **packageName**: `string`

`package.json::name`.

### packageVersion

> **packageVersion**: `string`

`package.json::version`.

### projectMetadata

> **projectMetadata**: `ProjectMetadata`

#### See

ProjectMetadata

### repoName

> **repoName**: `string`

The name of the repository on GitHub or other service.

This string is always a URL-safe and valid GitHub repository name.

### repoReferenceAllContributors

> **repoReferenceAllContributors**: `string`

The url of the all-contributors repository

### repoReferenceAllContributorsEmojis

> **repoReferenceAllContributorsEmojis**: `string`

The url of the all-contributors emoji key

### repoReferenceContributing

> **repoReferenceContributing**: `string`

The url of the repository's `CONTRIBUTING.md` file.

### repoReferenceDefinitionsBadge

> **repoReferenceDefinitionsBadge**: `string`

The well-known badge-specific reference definitions used in `{{badges}}`.

### repoReferenceDefinitionsPackage

> **repoReferenceDefinitionsPackage**: `string`

The well-known package-specific reference definitions used throughout this
context object.

**During renovation, the string value of this context key depends on the
version of
[TransformerContext.packageBuildDetailsLong](TransformerContext.md#packagebuilddetailslong)/[TransformerContext.packageBuildDetailsShort](TransformerContext.md#packagebuilddetailsshort)
found in the existing document.**

### repoReferenceDefinitionsRepo

> **repoReferenceDefinitionsRepo**: `string`

The well-known repo-specific reference definitions throughout this context
object.

### repoReferenceDocs

> **repoReferenceDocs**: `string`

The entry point (url) of the repository's documentation.

### repoReferenceLicense

> **repoReferenceLicense**: `string`

The url of the repository's license.

### repoReferenceNewIssue

> **repoReferenceNewIssue**: `string`

The url to create a new issue against the repository.

### repoReferencePrCompare

> **repoReferencePrCompare**: `string`

The url to create a new PR against the repository.

### repoReferenceSelf

> **repoReferenceSelf**: `string`

The url of the repository's `README.md` file.

### repoReferenceSponsor

> **repoReferenceSponsor**: `string`

The url of a donation/sponsorship service associated with the repository.

### repoReferenceSupport

> **repoReferenceSupport**: `string`

The url of the repository's `SUPPORT.md` file.

### repoSnykUrl

> **repoSnykUrl**: `string`

The url of the repository on Snyk.

### repoType

> **repoType**: `ProjectAttribute.Polyrepo` \| `ProjectAttribute.Monorepo` \| `ProjectAttribute.Hybridrepo`

The repository type.

#### See

ProjectAttribute

### repoUrl

> **repoUrl**: `string`

The url of the repository on GitHub or other service.

### scope

> **scope**: [`DefaultGlobalScope`](../../configure/enumerations/DefaultGlobalScope.md)

The scope to consider when determining which assets to return.

### shouldDeriveAliases

> **shouldDeriveAliases**: `boolean`

Whether or not to derive aliases and inject them into the configuration.

### targetAssetsPreset

> **targetAssetsPreset**: [`RenovationPreset`](../../commands/project/renovate/enumerations/RenovationPreset.md) \| `undefined`

A relevant [RenovationPreset](../../commands/project/renovate/enumerations/RenovationPreset.md) or `undefined` when generic versions of
assets should be generated.

### titleName

> **titleName**: `string`

The value of the singular H1 heading at the top of a package's `README.md`
file.

Do not rely on this string being a valid package name as it may contain any
manner of symbol or punctuation.

### toPackageAbsolutePath()

> **toPackageAbsolutePath**: (`pathLike`) => `AbsolutePath`

Takes a RelativePath-like object and joins it to `cwdPackage.root`
from ProjectMetadata.

#### Parameters

##### pathLike

`RelativePath` | `string`

#### Returns

`AbsolutePath`

### toProjectAbsolutePath()

> **toProjectAbsolutePath**: (`pathLike`) => `AbsolutePath`

Takes a RelativePath-like object and joins it to `rootPackage.root`
from ProjectMetadata.

#### Parameters

##### pathLike

`RelativePath` | `string`

#### Returns

`AbsolutePath`

## Defined in

[src/assets.ts:92](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets.ts#L92)
