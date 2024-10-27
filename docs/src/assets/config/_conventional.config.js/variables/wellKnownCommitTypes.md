[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / wellKnownCommitTypes

# Variable: wellKnownCommitTypes

> `const` **wellKnownCommitTypes**: `ConventionalChangelogConfigSpecOptions.Type`[]

These are the only conventional commit types supported by xscripts-based
pipelines and are therefore considered "well known".

Commit types corresponding to entries with `{ hidden: false }` will appear in
the generated the changelog file. Commit types with `{ hidden: true }` will
not appear in the changelog file _unless the commit is marked "BREAKING" in
some way_.

Multiple commit types can have the same `section`, which means commits of
that type will be combined together under said section.

Note that the order of values in this array is significant. Commits, having
been grouped (sectioned) by type, will appear in the changelog in the order
they appear in this array. Unknown types, i.e. types that are not listed in
`wellKnownCommitTypes`, will appear _after_ any well-known sections if they
are set to appear at all (e.g. if they are marked as breaking changes).

Also note that conventional-changelog-* have internal lists of "well-known
commit types" (conventional, angular, etc) that this type will be merged on
top of; the implication being: not overwriting an internal type's
configuration can lead to that type (feat, fix, ci) being included even if it
is not present in the below array.

Valid commit types are alphanumeric and may contain an underscore (_) or dash
(-). Using characters other than these will lead to undefined behavior.

## Defined in

[src/assets/config/\_conventional.config.js.ts:206](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/src/assets/config/_conventional.config.js.ts#L206)
