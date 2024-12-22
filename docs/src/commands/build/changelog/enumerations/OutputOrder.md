[**@-xun/scripts**](../../../../../README.md)

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

[src/commands/build/changelog.ts:126](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/build/changelog.ts#L126)

***

### Storybook

> **Storybook**: `"storybook"`

Sections (heading level 2) are comprised of major and minor releases with
patch changes becoming subsections (heading level 3) of their nearest
major/minor release section.

Such changelogs read as a "storybook".

#### Defined in

[src/commands/build/changelog.ts:121](https://github.com/Xunnamius/xscripts/blob/08b8dd169c5f24bef791b640ada35bc11e6e6e8e/src/commands/build/changelog.ts#L121)
