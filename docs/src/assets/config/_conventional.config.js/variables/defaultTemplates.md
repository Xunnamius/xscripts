[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_conventional.config.js](../README.md) / defaultTemplates

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

### partials.host

> **host**: `string` = `'{{~@root.host}}'`

### partials.owner

> **owner**: `string` = `'{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'`

### partials.repository

> **repository**: `string` = `'{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'`

### template

> **template**: `string`

## Defined in

[src/assets/config/\_conventional.config.js.ts:219](https://github.com/Xunnamius/xscripts/blob/0bf89cad7426062a1d0f1ed6b9e69c1e60c734aa/src/assets/config/_conventional.config.js.ts#L219)
