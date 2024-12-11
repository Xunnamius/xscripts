[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/commands/project/renovate](../README.md) / RenovationPreset

# Enumeration: RenovationPreset

These presets determine which assets will be returned by which transformers
during renovation. By specifying a preset, only the assets it represents will
be renovated. All others will be ignored.

See the xscripts wiki for details.

## Enumeration Members

### Basic

> **Basic**: `"basic"`

Represents the most basic assets necessary for xscripts to be fully
functional.

This preset is the basis for all others (except `RenovationPreset.Minimal`)
and can be used on any xscripts-compliant project when only a subset of
renovations are desired, such as when regenerating aliases.

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:259](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L259)

***

### Cli

> **Cli**: `"cli"`

Represents the standard assets for an xscripts-compliant command-line
interface project (such as `@black-flag/core`-powered tools like `xscripts`
itself).

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:267](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L267)

***

### Lib

> **Lib**: `"lib"`

Represents the standard assets for an xscripts-compliant library project
built for both CJS and ESM consumers (such as the case with
`@black-flag/core`) and potentially also browser and other consumers as
well.

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:276](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L276)

***

### LibEsm

> **LibEsm**: `"lib-esm"`

Represents the standard assets for an xscripts-compliant library project
built exclusively for ESM and ESM-compatible consumers (such as the case
with the `unified-utils` monorepo).

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:284](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L284)

***

### LibWeb

> **LibWeb**: `"lib-web"`

Represents the standard assets for an xscripts-compliant library project
built exclusively for ESM consumers operating in a browser-like runtime
(such as the case with the `next-utils` monorepo).

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:292](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L292)

***

### Minimal

> **Minimal**: `"minimal"`

Represents the minimum possible configuration necessary for xscripts to be
at least semi-functional.

This preset is only useful when working on a project that does not use
xscripts, or for which xscripts has been bolted-on after the fact (such as
the case with `xchangelog` and `xrelease`).

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:248](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L248)

***

### Nextjs

> **Nextjs**: `"nextjs"`

Represents the standard assets for an xscripts-compliant Next.js + React
project.

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:305](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L305)

***

### React

> **React**: `"react"`

Represents the standard assets for an xscripts-compliant React project.

See the xscripts wiki for details.

#### Defined in

[src/commands/project/renovate.ts:298](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/commands/project/renovate.ts#L298)
