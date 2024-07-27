[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / wellKnownCommitTypes

# Variable: wellKnownCommitTypes

> `const` **wellKnownCommitTypes**: `ConventionalChangelogConfigSpecOptions.Type`[]

These are the only conventional commit types supported by xscripts-based
pipelines and are therefore considered "well known".

Commit types corresponding to entries with `{ hidden: false }` will appear in
the generated `CHANGELOG.md` file. Commit types with `{ hidden: true }` will
not appear in `CHANGELOG.md` _unless the commit is marked "BREAKING" in some
way_.

Multiple commit types can have the same `section`, which means commits of
that type will be combined together under said section.

Note that the order of values in this array is significant. Commits, having
been grouped (sectioned) by type, will appear in the changelog in the order
they appear in this array. Unknown types, i.e. types that are not listed in
`wellKnownCommitTypes`, will appear _after_ any well-known sections if they
are set to appear at all (e.g. if they are marked as breaking changes).

Also note that conventional-changelog-* have internal lists of "well-known
commit types" that this type will be merged on top of; the implication being:
not overwriting an internal type's configuration can lead to that type (feat,
fix, ci) being included even if it is not present in the below array.

## Defined in

[src/assets/config/\_conventional.config.js.ts:139](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/src/assets/config/_conventional.config.js.ts#L139)
