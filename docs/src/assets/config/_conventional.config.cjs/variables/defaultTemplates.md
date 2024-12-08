[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.cjs](../README.md) / defaultTemplates

# Variable: defaultTemplates

> `const` **defaultTemplates**: `object`

Handlebars template data (not processed by our custom configuration).

## Type declaration

### commit

> **commit**: `string`

### footer

> **footer**: `string`

### header

> **header**: `string`

### partials

> **partials**: `object`

#### partials.host

> **host**: `string` = `'{{~@root.host}}'`

#### partials.owner

> **owner**: `string` = `'{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'`

#### partials.repository

> **repository**: `string` = `'{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'`

### template

> **template**: `string`

## Defined in

[src/assets/config/\_conventional.config.cjs.ts:282](https://github.com/Xunnamius/xscripts/blob/2521de366121a50ffeca631b4ec62db9c60657e5/src/assets/config/_conventional.config.cjs.ts#L282)
