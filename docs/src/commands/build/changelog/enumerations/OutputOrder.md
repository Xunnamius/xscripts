[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/commands/build/changelog](../README.md) / OutputOrder

# Enumeration: OutputOrder

Determines the output format of the changelog file.

## Enumeration Members

### Descending

> **Descending**: `"descending"`

The default changelog formatting where sections are listed in chronological
release order.

#### Defined in

[src/commands/build/changelog.ts:80](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/src/commands/build/changelog.ts#L80)

***

### Storybook

> **Storybook**: `"storybook"`

Sections (heading level 2) are comprised of major and minor releases with
patch changes becoming subsections (heading level 3) of their nearest
major/minor release section.

Such changelogs read as a "storybook".

#### Defined in

[src/commands/build/changelog.ts:75](https://github.com/Xunnamius/xscripts/blob/ca4900adafe61fe400aec55151e46f5130a666a6/src/commands/build/changelog.ts#L75)
