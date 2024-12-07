[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_prettier.config.mjs](../README.md) / PrettierConfig

# Interface: PrettierConfig

For use in `.prettierrc.js`, `.prettierrc.cjs`, `prettierrc.mjs`, `prettier.config.js`, `prettier.config.cjs`, `prettier.config.mjs`

## Extends

- `Options`

## Indexable

 \[`key`: `string`\]: `unknown`

## Properties

### \_\_embeddedInHtml?

> `optional` **\_\_embeddedInHtml**: `boolean`

#### Inherited from

`Options.__embeddedInHtml`

#### Defined in

node\_modules/prettier/doc.d.ts:226

***

### arrowParens?

> `optional` **arrowParens**: `"always"` \| `"avoid"`

Include parentheses around a sole arrow function parameter.

#### Default

```ts
"always"
```

#### Inherited from

`Options.arrowParens`

#### Defined in

node\_modules/prettier/index.d.ts:392

***

### bracketSameLine?

> `optional` **bracketSameLine**: `boolean`

Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
alone on the next line (does not apply to self closing elements).

#### Default

```ts
false
```

#### Inherited from

`Options.bracketSameLine`

#### Defined in

node\_modules/prettier/index.d.ts:349

***

### bracketSpacing?

> `optional` **bracketSpacing**: `boolean`

Print spaces between brackets in object literals.

#### Default

```ts
true
```

#### Inherited from

`Options.bracketSpacing`

#### Defined in

node\_modules/prettier/index.d.ts:343

***

### embeddedLanguageFormatting?

> `optional` **embeddedLanguageFormatting**: `"off"` \| `"auto"`

Control whether Prettier formats quoted code embedded in the file.

#### Default

```ts
"auto"
```

#### Inherited from

`Options.embeddedLanguageFormatting`

#### Defined in

node\_modules/prettier/index.d.ts:421

***

### endOfLine?

> `optional` **endOfLine**: `"lf"` \| `"auto"` \| `"crlf"` \| `"cr"`

Which end of line characters to apply.

#### Default

```ts
"lf"
```

#### Inherited from

`Options.endOfLine`

#### Defined in

node\_modules/prettier/index.d.ts:406

***

### experimentalTernaries?

> `optional` **experimentalTernaries**: `boolean`

Use curious ternaries, with the question mark after the condition, instead
of on the same line as the consequent.

#### Default

```ts
false
```

#### Inherited from

`Options.experimentalTernaries`

#### Defined in

node\_modules/prettier/index.d.ts:432

***

### filepath?

> `optional` **filepath**: `string`

Specify the input filepath. This will be used to do parser inference.

#### Inherited from

`Options.filepath`

#### Defined in

node\_modules/prettier/index.d.ts:367

***

### htmlWhitespaceSensitivity?

> `optional` **htmlWhitespaceSensitivity**: `"ignore"` \| `"strict"` \| `"css"`

How to handle whitespaces in HTML.

#### Default

```ts
"css"
```

#### Inherited from

`Options.htmlWhitespaceSensitivity`

#### Defined in

node\_modules/prettier/index.d.ts:401

***

### insertPragma?

> `optional` **insertPragma**: `boolean`

Prettier can insert a special

#### Format

marker at the top of files specifying that
the file has been formatted with prettier. This works well when used in tandem with
the --require-pragma option. If there is already a docblock at the top of
the file then this option will add a newline to it with the

#### Format

marker.

#### Default

```ts
false
```

#### Inherited from

`Options.insertPragma`

#### Defined in

node\_modules/prettier/index.d.ts:381

***

### ~~jsxBracketSameLine?~~

> `optional` **jsxBracketSameLine**: `boolean`

Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.

#### Default

```ts
false
```

#### Deprecated

use bracketSameLine instead

#### Inherited from

`Options.jsxBracketSameLine`

#### Defined in

node\_modules/prettier/index.d.ts:438

***

### jsxSingleQuote?

> `optional` **jsxSingleQuote**: `boolean`

Use single quotes in JSX.

#### Default

```ts
false
```

#### Inherited from

`Options.jsxSingleQuote`

#### Defined in

node\_modules/prettier/index.d.ts:333

***

### overrides?

> `optional` **overrides**: `object`[]

#### excludeFiles?

> `optional` **excludeFiles**: `string` \| `string`[]

#### files

> **files**: `string` \| `string`[]

#### options?

> `optional` **options**: `Options`

#### Defined in

node\_modules/prettier/index.d.ts:309

***

### parentParser?

> `optional` **parentParser**: `string`

#### Inherited from

`Options.parentParser`

#### Defined in

node\_modules/prettier/doc.d.ts:225

***

### parser?

> `optional` **parser**: `LiteralUnion`\<`BuiltInParserName`, `string`\>

Specify which parser to use.

#### Inherited from

`Options.parser`

#### Defined in

node\_modules/prettier/index.d.ts:363

***

### plugins?

> `optional` **plugins**: (`string` \| `Plugin`\<`any`\>)[]

Provide ability to support new languages to prettier.

#### Inherited from

`Options.plugins`

#### Defined in

node\_modules/prettier/index.d.ts:396

***

### printWidth?

> `optional` **printWidth**: `number`

Specify the line length that the printer will wrap on.

#### Default

```ts
80
```

#### Inherited from

`Options.printWidth`

#### Defined in

node\_modules/prettier/doc.d.ts:214

***

### proseWrap?

> `optional` **proseWrap**: `"always"` \| `"never"` \| `"preserve"`

By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.

#### Default

```ts
"preserve"
```

#### Inherited from

`Options.proseWrap`

#### Defined in

node\_modules/prettier/index.d.ts:387

***

### quoteProps?

> `optional` **quoteProps**: `"preserve"` \| `"as-needed"` \| `"consistent"`

Change when properties in objects are quoted.

#### Default

```ts
"as-needed"
```

#### Inherited from

`Options.quoteProps`

#### Defined in

node\_modules/prettier/index.d.ts:411

***

### rangeEnd?

> `optional` **rangeEnd**: `number`

Format only a segment of a file.

#### Default

```ts
Number.POSITIVE_INFINITY
```

#### Inherited from

`Options.rangeEnd`

#### Defined in

node\_modules/prettier/index.d.ts:359

***

### rangeStart?

> `optional` **rangeStart**: `number`

Format only a segment of a file.

#### Default

```ts
0
```

#### Inherited from

`Options.rangeStart`

#### Defined in

node\_modules/prettier/index.d.ts:354

***

### requirePragma?

> `optional` **requirePragma**: `boolean`

Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file.
This is very useful when gradually transitioning large, unformatted codebases to prettier.

#### Default

```ts
false
```

#### Inherited from

`Options.requirePragma`

#### Defined in

node\_modules/prettier/index.d.ts:373

***

### semi?

> `optional` **semi**: `boolean`

Print semicolons at the ends of statements.

#### Default

```ts
true
```

#### Inherited from

`Options.semi`

#### Defined in

node\_modules/prettier/index.d.ts:323

***

### singleAttributePerLine?

> `optional` **singleAttributePerLine**: `boolean`

Enforce single attribute per line in HTML, Vue and JSX.

#### Default

```ts
false
```

#### Inherited from

`Options.singleAttributePerLine`

#### Defined in

node\_modules/prettier/index.d.ts:426

***

### singleQuote?

> `optional` **singleQuote**: `boolean`

Use single quotes instead of double quotes.

#### Default

```ts
false
```

#### Inherited from

`Options.singleQuote`

#### Defined in

node\_modules/prettier/index.d.ts:328

***

### tabWidth?

> `optional` **tabWidth**: `number`

Specify the number of spaces per indentation-level.

#### Default

```ts
2
```

#### Inherited from

`Options.tabWidth`

#### Defined in

node\_modules/prettier/doc.d.ts:219

***

### trailingComma?

> `optional` **trailingComma**: `"all"` \| `"none"` \| `"es5"`

Print trailing commas wherever possible.

#### Default

```ts
"all"
```

#### Inherited from

`Options.trailingComma`

#### Defined in

node\_modules/prettier/index.d.ts:338

***

### useTabs?

> `optional` **useTabs**: `boolean`

Indent lines with tabs instead of spaces

#### Default

```ts
false
```

#### Inherited from

`Options.useTabs`

#### Defined in

node\_modules/prettier/doc.d.ts:224

***

### vueIndentScriptAndStyle?

> `optional` **vueIndentScriptAndStyle**: `boolean`

Whether or not to indent the code inside <script> and <style> tags in Vue files.

#### Default

```ts
false
```

#### Inherited from

`Options.vueIndentScriptAndStyle`

#### Defined in

node\_modules/prettier/index.d.ts:416
