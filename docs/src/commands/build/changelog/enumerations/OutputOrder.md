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

[src/commands/build/changelog.ts:80](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/src/commands/build/changelog.ts#L80)

***

### Storybook

> **Storybook**: `"storybook"`

Sections (heading level 2) are comprised of major and minor releases with
patch changes becoming subsections (heading level 3) of their nearest
major/minor release section.

Such changelogs read as a "storybook".

#### Defined in

[src/commands/build/changelog.ts:75](https://github.com/Xunnamius/xscripts/blob/b9218ee5f94be5da6a48d961950ed32307ad7f96/src/commands/build/changelog.ts#L75)
