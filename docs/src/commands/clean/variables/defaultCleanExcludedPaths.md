[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [src/commands/clean](../README.md) / defaultCleanExcludedPaths

# Variable: defaultCleanExcludedPaths

> `const` **defaultCleanExcludedPaths**: `string`[]

These are the default regular expressions matching paths that are excluded
from deletion when running the "clean" command.

Paths that should only match directories must include a trailing slash. Paths
that should match at any depth (including project root) should be prefixed
with `(^|/)`. Note that periods must be escaped (i.e. `'\\.'`).

## Defined in

[src/commands/clean.ts:35](https://github.com/Xunnamius/xscripts/blob/59530a02df766279a72886cbc0ab5e0790db98cc/src/commands/clean.ts#L35)
