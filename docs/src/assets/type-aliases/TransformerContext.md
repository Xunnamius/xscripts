[**@-xun/scripts**](../../../README.md)

***

[@-xun/scripts](../../../README.md) / [src/assets](../README.md) / TransformerContext

# Type Alias: TransformerContext

> **TransformerContext**: `object`

A union of well-known context keys passed directly to each transformer (which
are returned by [makeTransformer](../functions/makeTransformer.md)).

## Type declaration

### asset

> **asset**: `string`

The value of the `asset` parameter passed to [retrieveConfigAsset](../functions/retrieveConfigAsset.md).

### packageBuildDetailsLong

> **packageBuildDetailsLong**: `string`

### packageBuildDetailsShort

> **packageBuildDetailsShort**: `string`

### packageDescription

> **packageDescription**: `string`

From `package.json`

### packageName

> **packageName**: `string`

From `package.json`

### packageVersion

> **packageVersion**: `string`

From `package.json`

### prettyName

> **prettyName**: `string`

The contents of a potential top-level heading

### projectMetadata

> **projectMetadata**: `ProjectMetadata`

### repoName

> **repoName**: `string`

### repoReferenceAllContributors

> **repoReferenceAllContributors**: `string`

### repoReferenceAllContributorsEmojis

> **repoReferenceAllContributorsEmojis**: `string`

### repoReferenceContributing

> **repoReferenceContributing**: `string`

### repoReferenceDefinitionsBadge

> **repoReferenceDefinitionsBadge**: `string`

### repoReferenceDefinitionsPackage

> **repoReferenceDefinitionsPackage**: `string`

### repoReferenceDefinitionsRepo

> **repoReferenceDefinitionsRepo**: `string`

### repoReferenceDocs

> **repoReferenceDocs**: `string`

### repoReferenceLicense

> **repoReferenceLicense**: `string`

### repoReferenceNewIssue

> **repoReferenceNewIssue**: `string`

### repoReferencePrCompare

> **repoReferencePrCompare**: `string`

### repoReferenceSelf

> **repoReferenceSelf**: `string`

### repoReferenceSponsor

> **repoReferenceSponsor**: `string`

### repoReferenceSupport

> **repoReferenceSupport**: `string`

### repoSnykUrl

> **repoSnykUrl**: `string`

### repoType

> **repoType**: `ProjectAttribute.Polyrepo` \| `ProjectAttribute.Monorepo` \| `ProjectAttribute.Hybridrepo`

### repoUrl

> **repoUrl**: `string`

### shouldDeriveAliases

> **shouldDeriveAliases**: `boolean`

Whether or not to derive aliases and inject them into the configuration.

## Defined in

[src/assets.ts:42](https://github.com/Xunnamius/xscripts/blob/395ccb9751d5eb5067af3fe099bacae7d9b7a116/src/assets.ts#L42)
